import { SocketActionType, SocketDispatch } from './ReduxServiceTypes';

export class ReduxService {
  readonly #actionTypes: [string, string];
  readonly #dispatch: SocketDispatch;

  constructor(actionTypes: [string, string], dispatch: SocketDispatch) {
    this.#actionTypes = actionTypes;
    this.#dispatch = dispatch;
  }

  getDispatch = () => {
    return this.#dispatch;
  };

  dispatchConnected = () => {
    this.#dispatch({ type: this.#actionTypes[SocketActionType.CONNECTED] });
  };

  dispatchDisconnected = <P>(payload?: P) => {
    this.#dispatch({ type: this.#actionTypes[SocketActionType.DISCONNECTED], ...(payload ? { payload } : {}) });
  };
}
