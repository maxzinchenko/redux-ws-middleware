import { SocketDispatch } from '../../middleware/Socket/typedef';
import { SocketActionType } from '../Redux/typedef';
import { Options, WebSocketClosingCode, WebSocketEvent, ShouldReconnect, OptionsShort } from './typedef';
import { LoggerService } from '../Logger';
import { ReconnectorService } from '../Reconnector';
import { ReduxService } from '../Redux';
import { SerializerService } from '../Serializer';


export class WebSocketService<Req, Res, SReq = Req, DRes = Res> {
  readonly #options: OptionsShort<Req, Res, SReq, DRes>;
  readonly #shouldReconnect: ShouldReconnect | boolean;

  readonly #loggerService?: LoggerService;
  readonly #reconnectorService: ReconnectorService;
  readonly #reduxService: ReduxService;
  readonly #serializerService: SerializerService<Req, Res, SReq, DRes>;

  #ws: null | WebSocket = null;

  constructor(options: Options<Req, Res, SReq, DRes>, dispatch: SocketDispatch, actionTypes: [string, string]) {
    const { shouldReconnect, reconnectionInterval, serialize, deserialize, debug, ...restOptions } = options;

    this.#options = restOptions;
    this.#shouldReconnect = shouldReconnect ?? true;

    this.#reconnectorService = new ReconnectorService(this.open, reconnectionInterval, debug);
    this.#reduxService = new ReduxService(actionTypes, dispatch);
    this.#serializerService = new SerializerService(serialize, deserialize);

    // This "false" check is required since the value might be "undefined".
    if (options.autoConnect !== false) {
      this.open();
    }

    if (debug) {
      this.#loggerService = new LoggerService();
      this.#loggerService.log('Debug mode is ON', this.#options);
    }

  }

  /*
   * WS Instance State Managers
   */

  open = () => {
    const { url, protocols } = this.#options;

    if (typeof window === 'undefined' || this.#ws) return;

    this.#ws = new WebSocket(url, protocols);
    this.#setListeners();
  }

  send = (data: Req) => {
    this.#checkOpenStateAndThrowError();

    const message = this.#serializerService.serialize(data);
    this.#ws!.send(message);

    this.#loggerService?.log('Sent', message);
  }

  close = (code?: number) => {
    this.#checkOpenStateAndThrowError();

    this.#ws!.close(code);
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
   * Signal Listeners Managers
   */

  #handleOpen = (_: Event) => {
    this.#loggerService?.log('Connected');

    this.#reduxService.dispatch(SocketActionType.CONNECTED);

    this.#reconnectorService.removeJob();
  }

  #handleMessage = (event: MessageEvent) => {
    const data = this.#serializerService.deserialize(event.data);

    this.#loggerService?.log('Received', data);

    this.#options.onMessage(data, this.#reduxService.getDispatch());
  }

  #handleError = (event: Event) => {
    this.#loggerService?.error('Error', event);
  }

  #handleClose = (event: CloseEvent) => {
    const { code, reason } = event;
    const forceDisconnection = code === WebSocketClosingCode.FORCE_CLOSE;

    this.#loggerService?.log('Disconnected', { code, reason, forceDisconnection });
    this.#reduxService.dispatch(SocketActionType.DISCONNECTED, { reason, forceDisconnection, code });

    this.#removeListeners();
    this.#ws = null;

    if (forceDisconnection && typeof this.#shouldReconnect === 'boolean') return;

    if (typeof this.#shouldReconnect === 'boolean') {
      this.#reconnectorService.startJob();
      return;
    }

    if (this.#shouldReconnect(event)) {
      this.#reconnectorService.startJob();
    }
  }

  /*
   * Throwing Error Checkers
   */

  #checkOpenStateAndThrowError = () => {
    if (this.#ws?.readyState === WebSocket.OPEN) return;

    throw new Error('WebSocket is not connected. Make sure it is connected before triggering an action.');
  }
}
