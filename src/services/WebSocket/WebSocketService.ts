import { BaseService } from '../BaseService';
import { ReconnectService } from '../Reconnect/ReconnectService';
import { ReduxService } from '../Redux/ReduxService';
import { SocketDispatch } from '../Redux/ReduxServiceTypes';
import { SerializerService } from '../Serializer/SerializerService';
import { QueueService } from '../Queue/QueueService';

import { Options, WebSocketClosingCode, WebSocketEvent, ShouldReconnect, OptionsShort } from './WebSocketServiceTypes';

export class WebSocketService<Req, Res, SReq = Req, DRes = Res> extends BaseService {
  readonly #options: OptionsShort<Req, Res, SReq, DRes>;
  readonly #shouldReconnect: ShouldReconnect | boolean;

  readonly #reconnectService: ReconnectService;
  readonly #reduxService: ReduxService;
  readonly #serializerService: SerializerService<Req, Res, SReq, DRes>;
  readonly #queueService: QueueService<Req>;

  #ws: null | WebSocket = null;

  constructor(options: Options<Req, Res, SReq, DRes>, dispatch: SocketDispatch, actionTypes: [string, string]) {
    super({ debug: options.debug });

    const { shouldReconnect, reconnectionInterval, debug, serialize, deserialize, ...restOptions } = options;

    this.#options = restOptions;
    this.#shouldReconnect = shouldReconnect ?? true;

    this.#reconnectService = new ReconnectService(this.open, reconnectionInterval, debug);
    this.#reduxService = new ReduxService(actionTypes, dispatch);
    this.#serializerService = new SerializerService(serialize, deserialize);
    this.#queueService = new QueueService(debug);

    // This "false" check is required since the value might be "undefined".
    if (options.autoConnect !== false) {
      this.open();
    }

    if (debug) {
      this.log('Debug mode is ENABLED', options);
    }
  }

  open = () => {
    const { url, protocols } = this.#options;

    if (typeof window === 'undefined' || this.#ws) return;

    this.#ws = new WebSocket(url, protocols);
    this.#setListeners();
  };

  send = (req: Req) => {
    const isOpen = this.#checkOpenStateAndOpenConnection(req);
    if (!isOpen) return;

    const message = this.#serializerService.serialize(req);
    this.#ws?.send(message);

    this.log('Sent', message);
  };

  close = (code?: number) => {
    this.#checkOpenStateAndThrowError();

    this.#ws?.close(code);
  };

  /*
   * Private
   */

  #setListeners = () => {
    if (!this.#ws) return;

    this.#ws.addEventListener(WebSocketEvent.OPEN, this.#handleOpen);
    this.#ws.addEventListener(WebSocketEvent.MESSAGE, this.#handleMessage);
    this.#ws.addEventListener(WebSocketEvent.ERROR, this.#handleError);
    this.#ws.addEventListener(WebSocketEvent.CLOSE, this.#handleClose);
  };

  #removeListeners = () => {
    if (!this.#ws) return;

    this.#ws.removeEventListener(WebSocketEvent.OPEN, this.#handleOpen);
    this.#ws.removeEventListener(WebSocketEvent.MESSAGE, this.#handleMessage);
    this.#ws.removeEventListener(WebSocketEvent.ERROR, this.#handleError);
    this.#ws.removeEventListener(WebSocketEvent.CLOSE, this.#handleClose);
  };

  #handleOpen = (_: Event) => {
    this.log('Connected');

    this.#reduxService.dispatchConnected();
    this.#reconnectService.removeJob();

    this.#sendQueuedRequests();
  };

  #handleMessage = (event: MessageEvent) => {
    const data = this.#serializerService.deserialize(event.data);

    this.log('Received', data);

    this.#options.onMessage(data, this.#reduxService.getDispatch());

    if (this.#options.shouldClose?.(data)) {
      this.close(WebSocketClosingCode.FORCE_CLOSE);
    }
  };

  #handleError = (event: Event) => {
    this.error('Error', event);
  };

  #handleClose = (event: CloseEvent) => {
    const { code, reason } = event;
    const forceDisconnection = code === WebSocketClosingCode.FORCE_CLOSE;

    this.log('Disconnected', { code, reason, forceDisconnection });
    this.#reduxService.dispatchDisconnected({ reason, forceDisconnection, code });

    this.#removeListeners();
    this.#ws = null;

    this.#checkReconnectAbilityAndStartJob(event, forceDisconnection);
  };

  #sendQueuedRequests = () => {
    const queue = this.#queueService.getValues();
    if (!queue.length) return;

    for (const req of queue) {
      this.send(req);
      this.#queueService.remove(req);
    }
  };

  #checkReconnectAbilityAndStartJob = (event: CloseEvent, forceDisconnection: boolean) => {
    if (forceDisconnection && typeof this.#shouldReconnect === 'boolean') return;

    if (typeof this.#shouldReconnect === 'boolean') {
      this.#reconnectService.startJob();
      return;
    }

    if (this.#shouldReconnect(event)) {
      this.#reconnectService.startJob();
    }
  };

  #checkOpenStateAndOpenConnection = (req: Req) => {
    if (this.#isReadyStateOpen()) return true;

    if (!this.#options.shouldOpen) {
      throw new Error('WebSocket is not connected. Make sure it is connected before triggering an action.');
    }

    if (typeof this.#options.shouldOpen === 'boolean' || this.#options.shouldOpen(req)) {
      this.#queueService.add(req);
      this.open();

      return false;
    }
  };

  #checkOpenStateAndThrowError = () => {
    if (this.#isReadyStateOpen()) return;

    throw new Error('WebSocket is not connected. Make sure it is connected before triggering an action.');
  };

  #isReadyStateOpen = () => this.#ws?.readyState === WebSocket.OPEN || false;
}
