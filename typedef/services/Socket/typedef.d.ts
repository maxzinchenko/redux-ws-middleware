import { Dispatch } from '../../typedef';
export declare enum SocketState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3
}
export declare enum SocketActionType {
    CONNECTED = 0,
    DISCONNECTED = 1
}
export declare enum SocketListenerType {
    OPEN = "open",
    ERROR = "error",
    CLOSE = "close",
    MESSAGE = "message"
}
export declare enum SocketCode {
    FORCE_CLOSE = 1001
}
export declare type Serializer<Req = Object, SReq = Object> = (req: Req) => SReq;
export declare type Deserializer<Res = Object, DRes = Object> = (res: Res) => DRes;
export declare type OnMessageCallback<Res> = (res: Res, dispatch: Dispatch) => void;
export declare type Options<Req = any, Res = any, SReq = Req, DRes = Res> = {
    url: string;
    onMessage: OnMessageCallback<DRes>;
    autoConnect?: boolean;
    debug?: boolean;
    protocols?: string | string[];
    reconnectionInterval?: number | number[];
    serialize?: Serializer<Req, SReq>;
    deserialize?: Deserializer<Res, DRes>;
};
declare type Handler = (event: any) => void;
export declare type Listeners = [SocketListenerType, Handler][];
export {};
