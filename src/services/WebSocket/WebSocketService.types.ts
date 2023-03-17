import { Deserializer, Serializer } from '../Serializer/SerializerService.types';
import { SocketDispatch } from '../Redux/ReduxService.types';

export enum WebSocketEvent {
  OPEN = 'open',
  ERROR = 'error',
  CLOSE = 'close',
  MESSAGE = 'message'
}

export enum WebSocketClosingCode {
  FORCE_CLOSE = 1005
}

export type ShouldReconnect = (event: CloseEvent) => boolean;
export type ShouldClose<DRes> = (res: DRes) => boolean;
export type ShouldOpen<Req> = (req: Req) => boolean;
type OnMessageCallback<Res> = (res: Res, dispatch: SocketDispatch) => void;

export type Options<Req, Res, SReq = Req, DRes = Res> = {
  url: string;
  onMessage: OnMessageCallback<DRes>;
  autoConnect?: boolean;
  shouldReconnect?: ShouldReconnect | boolean;
  shouldClose?: ShouldClose<DRes>;
  shouldOpen?: ShouldOpen<Req> | boolean;
  reconnectionInterval?: number | number[];
  debug?: boolean;
  protocols?: string | string[];
  serialize?: Serializer<Req, SReq>;
  deserialize?: Deserializer<Res, DRes>;
};

type Short = 'shouldReconnect' | 'reconnectionInterval' | 'deserialize' | 'serialize' | 'debug';
export type OptionsShort<Req, Res, SReq = Req, DRes = Res> = Omit<Options<Req, Res, SReq, DRes>, Short>;
