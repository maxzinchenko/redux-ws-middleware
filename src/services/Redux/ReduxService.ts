import { SocketActionType, SocketDispatch } from './ReduxService.types';

export class ReduxService {
  private readonly actionTypes: [string, string];
  private readonly dispatch: SocketDispatch;

  constructor(actionTypes: [string, string], dispatch: SocketDispatch) {
    this.actionTypes = actionTypes;
    this.dispatch = dispatch;
  }

  getDispatch = () => {
    return this.dispatch;
  };

  dispatchConnected = () => {
    this.dispatch({ type: this.actionTypes[SocketActionType.CONNECTED] });
  };

  dispatchDisconnected = <P>(payload?: P) => {
    this.dispatch({ type: this.actionTypes[SocketActionType.DISCONNECTED], ...(payload ? { payload } : {}) });
  };
}
