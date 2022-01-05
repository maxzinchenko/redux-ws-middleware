import { Dispatch } from '../../typedef';

export enum SocketState {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED
}

export enum SocketActionType {
  CONNECTED,
  DISCONNECTED
}

export enum SocketListenerType {
  OPEN = 'open',
  ERROR = 'error',
  CLOSE = 'close',
  MESSAGE = 'message'
}

export enum SocketCode {
  FORCE_CLOSE = 1001
}

export type Serializer<Req = Object, SReq = Object> = (req: Req) => SReq;
export type Deserializer<Res = Object, DRes = Object> = (res: Res) => DRes;

export type OnMessageCallback<Res> = (res: Res, dispatch: Dispatch) => void;


export type Options<Req = any, Res = any, SReq = Req, DRes = Res> = {
  url: string;
  onMessage: OnMessageCallback<DRes>;
  autoConnect?: boolean;
  debug?: boolean;
  protocols?: string | string[];
  reconnectionInterval?: number | number[];
  serialize?: Serializer<Req, SReq>;
  deserialize?: Deserializer<Res, DRes>;
}

type Handler =  (event: any) => void;
export type Listeners = [SocketListenerType, Handler][];
