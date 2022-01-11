import { Options } from './services/Socket/typedef';
declare type ActionType = string | RegExp;
export declare type MiddlewareOptions<Req, Res, SReq extends unknown = Req, DRes extends unknown = Res> = Options<Req, Res, SReq, DRes> & {
    actionTypes: [ActionType, ActionType, ActionType] | [ActionType, ActionType] | [ActionType];
    completedActionTypes: [string, string];
};
export declare type Action<T = any> = {
    type: T;
};
export declare type AnyAction = Action & {
    [extraProps: string]: any;
};
export declare type Dispatch<A extends Action = AnyAction> = {
    <T extends A>(action: T): T;
};
export declare type MiddlewareAPI<D extends Dispatch = Dispatch, S = unknown> = {
    dispatch: D;
    getState(): S;
};
export declare type SocketAction<T = string> = {
    type: T;
    payload?: unknown;
    data?: unknown;
};
export {};
