import { Dispatch, Options } from './services/Socket/typedef';


type ActionType = string | RegExp;
export type MiddlewareOptions<Req, Res, SReq extends unknown = Req, DRes extends unknown = Res> = Options<Req, Res, SReq, DRes> & {
  actionTypes: [ActionType, ActionType, ActionType];
  completedActionTypes: [string, string];
}


export type SocketAction<T = string> = {
  type: T;
  payload?: unknown;
  data?: unknown;
}


export type MiddlewareApi = {
  dispatch: Dispatch<any>;
}
