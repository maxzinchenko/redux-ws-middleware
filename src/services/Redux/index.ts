import { SocketDispatch } from '../../middleware/Socket/typedef';
import { SocketActionType } from './typedef';


export class ReduxService {
  readonly #actionTypes: [string, string];
  readonly #dispatch: SocketDispatch;

  constructor(actionTypes: [string, string], dispatch: SocketDispatch) {
    this.#actionTypes = actionTypes;
    this.#dispatch = dispatch;
  }

  getDispatch = () => {
    return this.#dispatch;
  }

  dispatch = (type: SocketActionType, payload?: unknown) => {
    this.#dispatch({ type: this.#actionTypes[type], ...(payload ? { payload } : {}) });
  }
}
