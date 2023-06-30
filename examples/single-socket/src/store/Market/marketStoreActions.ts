import { createAction } from '@reduxjs/toolkit';

import { SocketMethod } from '../../types/socketTypes';
import { buildSocketRequest } from '../../services/socketService';

import type { AppThunkAction } from '../appStoreTypes';
import type { SubscribeApiReq, UnsubscribeApiReq, CommonReq } from './marketStoreTypes';
import { FetchSubscriptionsApiReq } from './marketStoreTypes';

export const subscribeRequest = createAction<SubscribeApiReq>('market/subscribeRequest');
export const subscribe = (payload: CommonReq): AppThunkAction => {
  const reqPayload = buildSocketRequest(SocketMethod.SUBSCRIBE, payload);

  return (dispatch) => {
    dispatch(subscribeRequest(reqPayload));
  };
};

export const unsubscribeRequest = createAction<UnsubscribeApiReq>('market/unsubscribeRequest');
export const unsubscribe = (payload: CommonReq): AppThunkAction => {
  const reqPayload = buildSocketRequest(SocketMethod.UNSUBSCRIBE, payload);

  return (dispatch) => {
    dispatch(unsubscribeRequest(reqPayload));
  };
};

export const fetchSubscriptionsRequest = createAction<FetchSubscriptionsApiReq>('market/fetchSubscriptionsRequest');
export const fetchSubscriptions = (): AppThunkAction => {
  const reqPayload = buildSocketRequest(SocketMethod.LIST_SUBSCRIPTIONS);

  return (dispatch) => {
    dispatch(fetchSubscriptionsRequest(reqPayload));
  };
};
