import { Dispatch } from '../../middleware/Socket/typedef';
import { Options, WebSocketClosingCode, WebSocketEvent, SocketActionType, LogType, ShouldReconnect, WebSocketState } from './typedef';


const RECONNECTION_INTERVAL = 1000;


export class WebSocketService<Req, Res, SReq = Req, DRes = Res> {
  readonly #options: Omit<Options<Req, Res, SReq, DRes>, 'shouldReconnect' | 'reconnectionInterval'>;
  readonly #dispatch: Dispatch;
  readonly #shouldReconnect: ShouldReconnect | boolean;
  readonly #reconnectionInterval: number | number[];
  readonly #actionTypes: [string, string];

  #ws: null | WebSocket = null;
  #reconnections = 0;
  #timeout: null | NodeJS.Timeout = null;

  constructor(options: Options<Req, Res, SReq, DRes>, dispatch: Dispatch, actionTypes: [string, string]) {
    const { shouldReconnect, reconnectionInterval, ...restOptions } = options;

    this.#options = restOptions;
    this.#shouldReconnect = shouldReconnect ?? true;
    this.#reconnectionInterval = reconnectionInterval ?? RECONNECTION_INTERVAL;

    this.#dispatch = dispatch;
    this.#actionTypes = actionTypes;

    if (options.debug) {
      this.#log(LogType.LOG, 'Debug mode is ON', this.#options);
    }

    // This "false" check is required since the value might be "undefined".
    if (options.autoConnect === false) return;
    this.open();
  }

  /*
   * WS Instance State Managers
   */

  open = () => {
    if (typeof window === 'undefined') return;

    this.#ws = new WebSocket(this.#options.url, this.#options.protocols);
    this.#setListeners();
  }

  send = (data: Req) => {
    this.#checkOpenStateAndThrowError();

    const message = this.#serializeData(data);
    this.#ws!.send(message);

    this.#log(LogType.LOG, 'Sent', message);
  }

  close = (code?: number) => {
    this.#checkOpenStateAndThrowError();

    this.#ws!.close(code);
    this.#removeListeners();

    this.#ws = null;
  }

  /*
   * Signal Listeners Managers
   */

  #handleOpen = (_: Event) => {
    this.#log(LogType.LOG, 'Connected');

    this.#dispatchAction(SocketActionType.CONNECTED);

    this.#removeReconnectionJob();
  }

  #handleMessage = (event: MessageEvent) => {
    const data = this.#deserializeData(event.data);

    this.#log(LogType.LOG, 'Received', data);

    this.#options.onMessage(data, this.#dispatch);
  }

  #handleError = (event: Event) => {
    this.#log(LogType.ERROR, 'Error', event);
  }

  #handleClose = (event: CloseEvent) => {
    const { code, reason } = event;
    const forceDisconnection = code === WebSocketClosingCode.FORCE_CLOSE;

    this.#dispatchAction(SocketActionType.DISCONNECTED, { reason, forceDisconnection, code });

    if (forceDisconnection && typeof this.#shouldReconnect === 'boolean') {
      this.#log(LogType.LOG, 'Disconnected', { code, reason });
      return;
    } else if (typeof this.#shouldReconnect === 'boolean') {
      this.#startReconnectionJob();
      return;
    }

    if (this.#shouldReconnect(event)) {
      this.#startReconnectionJob();
    }
  }

  /*
   * Event Listeners Managers
   */

  #setListeners = () => {
    if (!this.#ws) return;

    this.#ws.addEventListener(WebSocketEvent.OPEN, this.#handleOpen);
    this.#ws.addEventListener(WebSocketEvent.MESSAGE, this.#handleMessage);
    this.#ws.addEventListener(WebSocketEvent.ERROR, this.#handleError);
    this.#ws.addEventListener(WebSocketEvent.CLOSE, this.#handleClose);
  }

  #removeListeners = () => {
    if (!this.#ws) return;

    this.#ws.removeEventListener(WebSocketEvent.OPEN, this.#handleOpen);
    this.#ws.removeEventListener(WebSocketEvent.MESSAGE, this.#handleMessage);
    this.#ws.removeEventListener(WebSocketEvent.ERROR, this.#handleError);
    this.#ws.removeEventListener(WebSocketEvent.CLOSE, this.#handleClose);
  }

  /*
   * Reconnection Managers
   */

  #getReconnectionInterval = (interval = this.#reconnectionInterval) => {
    if (typeof interval === 'number') return interval;
    if (interval.length) return 0;

    const lastIntervalsIdx = interval.length - 1;

    if (this.#reconnections <= lastIntervalsIdx) {
      return interval[this.#reconnections];
    }

    return interval[lastIntervalsIdx];
  }

  #startReconnectionJob = () => {
    const interval = this.#getReconnectionInterval();

    this.#log(LogType.LOG, `Disconnected. Reconnect in ${interval} milliseconds`);

    this.#timeout = setTimeout(this.open, interval);
    this.#incrementReconnectionCount();
  }

  #removeReconnectionJob = () => {
    clearTimeout(this.#timeout!);
    this.#timeout = null;
    this.#reconnections = 0;
  }

  #incrementReconnectionCount = (start = this.#reconnections) => {
    this.#reconnections = start + 1;
  }

  /*
   * Data Type Managers
   */

  #serializeData = (data: Req) => {
    const serializedData = this.#options.serialize?.(data) || data;

    return typeof serializedData === 'string' ? serializedData : JSON.stringify(data);
  }

  #deserializeData = (data: string) => {
    const deserializedData = this.#options.deserialize?.(JSON.parse(data)) || data;

    return typeof deserializedData === 'string' ? JSON.parse(deserializedData) : deserializedData;
  }

  /*
   * Redux Actions Managers
   */

  #dispatchAction = (type: SocketActionType, payload?: unknown) => {
    this.#dispatch({ type: this.#actionTypes[type], ...(payload ? { payload } : {}) });
  }

  /*
   * Throwing Error Checkers
   */

  #checkOpenStateAndThrowError = () => {
    if (this.#ws && this.#ws.readyState === WebSocketState.OPEN) return;

    throw new Error('WebSocket is not connected. Make sure it is connected before triggering an action.');
  }

  /*
   * Loggers
   */

  #log = (type: LogType, title: string, rawInfo?: string | object | null) => {
    if (!this.#options.debug) return;

    const info = typeof rawInfo === 'string' ? JSON.parse(rawInfo) : rawInfo;

    if (type === LogType.LOG) {
      // eslint-disable-next-line no-console
      console.groupCollapsed('[awesome-socket]', title);
      // eslint-disable-next-line no-console
      console.log(...(info ? [info] : []));
      // eslint-disable-next-line no-console
      console.groupEnd();
    } else {
      // eslint-disable-next-line no-console
      console[type](`[awesome-socket] ${title}`, '\n', ...(info ? [info] : []));
    }
  }
}
