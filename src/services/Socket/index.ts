import { Dispatch } from '../../typedef';
import { Listeners, Options, SocketCode, SocketListenerType, SocketActionType, SocketState } from './typedef';


const RECONNECTION_INTERVAL = 1000;


export class Socket {
  readonly #options: Options;
  readonly #dispatch: Dispatch;
  readonly #actionTypes: [string, string];
  readonly #interval: number | number[];

  #ws: null | WebSocket = null;
  #timeout: null | NodeJS.Timeout = null;
  #reconnectionsCount = 0;

  constructor(options: Options, dispatch: Dispatch, actionTypes: [string, string]) {
    this.#options = options;
    this.#dispatch = dispatch;
    this.#actionTypes = actionTypes;
    this.#interval = options.reconnectionInterval || RECONNECTION_INTERVAL;

    // This "false" check is required cause the value might be "undefined"
    if (options.autoConnect === false) return;
    this.connect();
  }

  connect = () => {
    if (this.#ws?.url === this.#options.url && this.#ws?.readyState === SocketState.OPEN) return;

    this.#ws = new WebSocket(this.#options.url, this.#options.protocols);
    this.#listeners();
  }

  sendMessage = <D = {}>(data: D) => {
    this.#checkConnection();

    const serializedData = this.#options.serialize?.(data) || data;
    this.#ws!.send(JSON.stringify(serializedData));

    this.#log('Sent.', serializedData);
  }

  disconnect = () => {
    this.#checkConnection();

    this.#ws!.close(SocketCode.FORCE_CLOSE);
  }

  #handleOpen = (_: Event) => {
    this.#log('Connected.');

    this.#removeReconnectionJob();

    this.#dispatchAction(SocketActionType.CONNECTED);
  }

  #handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    const deserializedData = this.#options.deserialize?.(data) || data;

    this.#log('Received.', deserializedData);

    this.#options.onMessage(deserializedData, this.#dispatch);
  }

  #handleError = (event: Event) => {
    this.#logError('Error.', event);
  }

  #handleClose = (event: CloseEvent) => {
    this.#listeners(false);

    const { code, reason } = event;
    const forceDisconnection = code === SocketCode.FORCE_CLOSE;

    if (forceDisconnection) {
      this.#removeReconnectionJob();
      this.#logError('Disconnected.', event);
    } else {
      this.#setReconnectionJob();
    }

    this.#dispatchAction(SocketActionType.DISCONNECTED, { reason, forceDisconnection, code });
  }

  #listeners = (add = true) => {
    if (!this.#ws) return;

    const listeners: Listeners = [
      [SocketListenerType.OPEN, this.#handleOpen],
      [SocketListenerType.MESSAGE, this.#handleMessage],
      [SocketListenerType.ERROR, this.#handleError],
      [SocketListenerType.CLOSE, this.#handleClose]
    ];

    const method = add ? 'addEventListener' : 'removeEventListener';

    listeners.forEach(listener => {
      this.#ws![method](...listener);
    });

    if (add) return;
    this.#ws = null;
  }

  #getReconnectionInterval = () => {
    return typeof this.#interval === 'number'
      ? this.#interval
      : this.#interval[this.#reconnectionsCount];
  }

  #countReconnection = () => {
    if (typeof this.#interval === 'number') return;

    const { length } = this.#interval;

    return this.#reconnectionsCount < length - 1 ? this.#reconnectionsCount + 1 : length - 1;
  }

  #setReconnectionJob = () => {
    const interval = this.#getReconnectionInterval();

    this.#log(`Disconnected. Reconnect in ${interval} milliseconds.`);
    this.#timeout = setTimeout(this.connect, interval);

    this.#countReconnection();
  }

  #removeReconnectionJob = () => {
    if (!this.#timeout) return;

    clearInterval(this.#timeout);
    this.#timeout = null;
    this.#reconnectionsCount = 0;
  }

  #checkConnection = () => {
    if (this.#ws?.readyState === SocketState.OPEN) return;

    throw new Error(`[${this.#options.url}] Not connected. You need to wait until the socket is connected and ready.`);
  }

  #dispatchAction = (type: SocketActionType, payload?: unknown) => {
    this.#dispatch({ type: this.#actionTypes[type], ...(payload ? { payload } : {}) });
  }

  #log = (message: string, meta?: unknown) => {
    if (!this.#options.debug) return;

    // eslint-disable-next-line no-console
    console.log(`[${this.#options.url}] ${message}\n`, ...(meta ? [meta] : []));
  }

  #logError = (message: string, meta: unknown) => {
    // eslint-disable-next-line no-console
    console.error(`[${this.#options.url}] ${message}\n`, ...(meta ? [meta] : []));
  }
}
