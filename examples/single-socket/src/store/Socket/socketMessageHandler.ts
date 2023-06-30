import { Dispatch } from '@reduxjs/toolkit';

import { SocketMethod, SocketResponse } from '../../types/socketTypes';
import { marketActions } from '../Market/marketSlice';

import { Handlers } from './socketStoreTypes';

const socketHandlers: Handlers = {
  [SocketMethod.SUBSCRIBE]: [marketActions.subscribeFulfilled, marketActions.subscribeRejected],
  [SocketMethod.UNSUBSCRIBE]: [marketActions.unsubscribeFulfilled, marketActions.unsubscribeRejected],
  [SocketMethod.LIST_SUBSCRIPTIONS]: [
    marketActions.fetchSubscriptionsFulfilled,
    marketActions.fetchSubscriptionsRejected
  ],
  [SocketMethod.UPDATE_STREAM]: [marketActions.updateStream, null]
};

export const socketMessageHandler = (res: SocketResponse, dispatch: Dispatch) => {
  const { id, result, msg, code } = res;
  if (!socketHandlers[id]) return;

  const [fulfilled, failure] = socketHandlers[id];

  if (msg && typeof code !== 'undefined' && failure) {
    dispatch(failure(msg));
  } else if (!msg && fulfilled) {
    dispatch(fulfilled(result));
  }
};
