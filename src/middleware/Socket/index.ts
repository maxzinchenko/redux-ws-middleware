import { MiddlewareOptions, SocketAction, MiddlewareAPI } from './typedef';
import { WebSocketService } from '../../services/WebSocket';


export const createSocketMiddleware = <Req, Res, SReq = Req, DRes = Res>({
  actionTypes,
  completedActionTypes,
  ...socketOptions
}: MiddlewareOptions<Req, Res, SReq, DRes>) => {
  const [sendType, connectType, disconnectType] = actionTypes;

  return ({ dispatch }: MiddlewareAPI) => {
    const socket = new WebSocketService(socketOptions, dispatch, completedActionTypes);

    return (next: (action: SocketAction<string, Req>) => void) => (action: SocketAction<string, Req>) => {
      if ((connectType instanceof RegExp && connectType.test(action.type)) || action.type === connectType) {
        socket.open();
      }

      if ((disconnectType instanceof RegExp && disconnectType.test(action.type)) || action.type === disconnectType) {
        socket.close();
      }

      if ((sendType instanceof RegExp && sendType.test(action.type)) || action.type === sendType) {
        socket.send((action.data || action.payload)!);
      }

      return next(action);
    };
  };
};
