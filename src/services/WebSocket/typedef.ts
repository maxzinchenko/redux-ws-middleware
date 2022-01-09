import { SocketDispatch } from '../../middleware/Socket/typedef';
import { Deserializer, Serializer } from '../Serializer/typedef';

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

export enum WebSocketClosingCode {
  FORCE_CLOSE = 1001
}

export type ShouldReconnect = (event: CloseEvent) => boolean;
type OnMessageCallback<Res> = (res: Res, dispatch: SocketDispatch) => void;

type Short = 'shouldReconnect' | 'reconnectionInterval' | 'deserialize' | 'serialize' | 'debug';

export type OptionsShort<
  Req,
  Res,
  SReq = Req,
  DRes = Res
  > = Omit<Options<Req, Res, SReq, DRes>, Short>

export type Options<Req, Res, SReq = Req, DRes = Res> = {
  url: string,
  onMessage: OnMessageCallback<DRes>,
  autoConnect?: boolean,
  shouldReconnect?: ShouldReconnect | boolean,
  reconnectionInterval?: number | number[],
  debug?: boolean,
  protocols?: string | string[],
  serialize?: Serializer<Req, SReq>,
  deserialize?: Deserializer<Res, DRes>
}
