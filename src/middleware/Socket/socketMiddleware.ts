import { AnyAction } from '../../services/Redux/ReduxServiceTypes';
import { WebSocketService } from '../../services/WebSocket/WebSocketService';

import { MiddlewareOptions, MiddlewareAPI, ActionType } from './socketMiddlewareTypes';

const getTypeCheck = (actionType: ActionType) => {
  const isRegExp = actionType instanceof RegExp;

  return (type: AnyAction['type']) => (isRegExp ? actionType.test(type) : type === actionType);
};

export const createSocketMiddleware = <Req, Res, SReq = Req, DRes = Res>({
  actionTypes,
  completedActionTypes,
  ...socketOptions
}: MiddlewareOptions<Req, Res, SReq, DRes>) => {
  const [sendType, connectType, disconnectType] = actionTypes;

  const isSend = getTypeCheck(sendType);
  const isConnect = connectType ? getTypeCheck(connectType) : null;
  const isDisconnect = disconnectType ? getTypeCheck(disconnectType) : null;

  return ({ dispatch }: MiddlewareAPI) => {
    const socket = new WebSocketService(socketOptions, dispatch, completedActionTypes);

    return (next: (action: AnyAction) => void) => (action: AnyAction) => {
      if (isConnect?.(action.type)) {
        socket.open();
      }

      if (isDisconnect?.(action.type)) {
        socket.close(action.data?.code || action.payload?.code || action.code);
      }

      if (isSend(action.type)) {
        socket.send((action.data || action.payload)!);
      }

      return next(action);
    };
  };
};
