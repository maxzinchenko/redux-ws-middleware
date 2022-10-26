import { SocketDispatch } from '../../services/Redux/ReduxServiceTypes';
import { Options } from '../../services/WebSocket/WebSocketServiceTypes';

export type ActionType = string | RegExp;
export type MiddlewareOptions<Req, Res, SReq = Req, DRes = Res> = Options<Req, Res, SReq, DRes> & {
  actionTypes: [ActionType, ActionType, ActionType] | [ActionType, ActionType] | [ActionType];
  completedActionTypes: [string, string];
};

export type CloseAction<T extends string = string> = {
  type: T;
  payload?: {
    code?: number;
  };
  data?: {
    code?: number;
  };
  code?: number;
};

export type ClosedAction<T extends string = string> = {
  type: T;
  payload: {
    reason: string;
    forceDisconnection: boolean;
    code: number;
  };
};

export type MiddlewareAPI<D extends SocketDispatch = SocketDispatch, S = unknown> = {
  dispatch: D;
  getState(): S;
};

export type SendAction<T, Req> = {
  type: T;
  payload?: Req;
  data?: Req;
};
