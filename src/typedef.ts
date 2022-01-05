import { Options } from './services/Socket/typedef';


type ActionType = string | RegExp;
export type MiddlewareOptions<Req, Res, SReq extends unknown = Req, DRes extends unknown = Res> = Options<Req, Res, SReq, DRes> & {
  actionTypes: [ActionType, ActionType, ActionType] | [ActionType, ActionType] | [ActionType];
  completedActionTypes: [string, string];
};

export type Action<T = any> = {
  type: T;
};

export type AnyAction = Action & {
  [extraProps: string]: any;
};

export type Dispatch<A extends Action = AnyAction> = {
  <T extends A>(action: T): T;
};

export type MiddlewareAPI<D extends Dispatch = Dispatch, S = unknown> = {
  dispatch: D
  getState(): S
};

export type SocketAction<T = string> = {
  type: T;
  payload?: unknown;
  data?: unknown;
}
