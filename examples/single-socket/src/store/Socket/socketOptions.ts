import { MiddlewareOptions } from 'redux-ws-middleware';

import { SocketMethod, SocketRequest, SocketResponse } from '../../types/socketTypes';

import { socketActions } from './socketSlice';
import { socketMessageHandler } from './socketMessageHandler';

export const socketOptions: MiddlewareOptions<SocketRequest, SocketResponse> = {
  url: 'wss://stream.binance.com:9443/ws',
  autoConnect: false,
  shouldReconnect: true,
  reconnectionInterval: [0, 1000, 5000],

  debug: true,

  actionTypes: [/Request$/, socketActions.connect.type, socketActions.disconnect.type],
  completedActionTypes: [socketActions.connectFulfilled.type, socketActions.disconnectFulfilled.type],

  onMessage: socketMessageHandler,

  // serialize: (req) => snakeCase(req, { deep: true }) as unknown as SocketMainReq,
  deserialize: (res) => {
    if (!res.result && res.e) return { id: SocketMethod.UPDATE_STREAM, result: res };

    return res;
  }
};
