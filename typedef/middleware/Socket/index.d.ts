import { MiddlewareOptions, SocketAction, MiddlewareAPI } from '../../typedef';
export declare const createSocketMiddleware: <Req, Res, SReq = Req, DRes = Res>({ actionTypes, completedActionTypes, ...socketOptions }: MiddlewareOptions<Req, Res, SReq, DRes>) => ({ dispatch }: MiddlewareAPI) => (next: (action: SocketAction) => void) => (action: SocketAction) => void;
