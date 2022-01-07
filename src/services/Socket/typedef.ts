import { Dispatch } from '../../middleware/Socket/typedef';

export enum WebSocketEvent {
  OPEN = 'open',
  ERROR = 'error',
  CLOSE = 'close',
  MESSAGE = 'message'
}

export enum WebSocketState {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED
}

export enum SocketActionType {
  CONNECTED,
  DISCONNECTED
}

export enum WebSocketClosingCode {
  FORCE_CLOSE = 1001
}

export type ShouldReconnect = (event: CloseEvent) => boolean;
type Serialize<Req, SReq = Req> = (req: Req) => SReq;
type Deserialize<Res, DRes = Res> = (res: Res) => DRes;
type OnMessageCallback<Res> = (res: Res, dispatch: Dispatch) => void;

export enum LogType {
  LOG = 'log',
  ERROR = 'error',
  WARNING = 'warn'
}

export type Options<Req, Res, SReq = Req, DRes = Res> = {
  url: string,
  onMessage: OnMessageCallback<DRes>,
  autoConnect?: boolean,
  shouldReconnect?: ShouldReconnect | boolean,
  reconnectionInterval?: number | number[],
  debug?: boolean,
  protocols?: string | string[],
  serialize?: Serialize<Req, SReq>,
  deserialize?: Deserialize<Res, DRes>
}

type Handler =  (event: any) => void;
export type Listeners = [WebSocketEvent, Handler][];
