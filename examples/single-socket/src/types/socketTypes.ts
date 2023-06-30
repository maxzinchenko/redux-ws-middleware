import { RawTrade } from './tradeTypes';

export enum SocketMethod {
  SUBSCRIBE,
  UNSUBSCRIBE,
  LIST_SUBSCRIPTIONS,

  // Custom method
  UPDATE_STREAM
}

export type SocketMetaData<M = SocketMethod> = {
  method: keyof SocketMethod;
  id: M;
};

export type SocketRequest<M extends SocketMetaData = SocketMetaData, P = unknown> = {
  method: keyof SocketMethod;
  params?: P;
  id: M['id'];
};

export type SocketResponse<M extends SocketMetaData = SocketMetaData, R = unknown> = {
  result?: R;
  msg?: null | string;
  code?: number;
  id: M['id'];
  e?: RawTrade['e'];
};
