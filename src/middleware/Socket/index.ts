import { MiddlewareOptions, SocketAction, MiddlewareAPI } from '../../typedef';
import { Socket } from '../../services/Socket';


export const createSocketMiddleware = <Req, Res, SReq = Req, DRes = Res>({
  actionTypes,
  completedActionTypes,
  ...socketOptions
}: MiddlewareOptions<Req, Res, SReq, DRes>) => {
  const [sendType, connectType, disconnectType] = actionTypes;

  return ({ dispatch }: MiddlewareAPI) => {
    const socket = new Socket(socketOptions, dispatch, completedActionTypes);

    return (next: (action: SocketAction) => void) => (action: SocketAction) => {
      if ((connectType instanceof RegExp && connectType.test(action.type)) || action.type === connectType) {
        socket.connect();
      }

      if ((disconnectType instanceof RegExp && disconnectType.test(action.type)) || action.type === disconnectType) {
        socket.disconnect();
      }

      if ((sendType instanceof RegExp && sendType.test(action.type)) || action.type === sendType) {
        socket.sendMessage(action.data || action.payload);
      }

      return next(action);
    };
  };
};
