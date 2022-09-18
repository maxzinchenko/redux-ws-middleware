export enum SocketActionType {
  CONNECTED,
  DISCONNECTED
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Action<T = any> = {
  type: T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyAction<T = any> = Action<T> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [extraProps: string]: any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SocketDispatch<A extends Action = AnyAction> = {
  <T extends A>(action: T): T;
};
