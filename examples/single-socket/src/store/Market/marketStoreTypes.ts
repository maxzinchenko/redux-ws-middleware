import { RawTrade } from '../../types/tradeTypes';
import { SocketMetaData, SocketMethod, SocketRequest } from '../../types/socketTypes';

/*
 * Requests
 */

export type CommonReq = string[];

/*
 * Api Requests
 */

export type SubscribeApiReq = SocketRequest<SocketMetaData<SocketMethod.SUBSCRIBE>, CommonReq>;
export type UnsubscribeApiReq = SocketRequest<SocketMetaData<SocketMethod.UNSUBSCRIBE>, CommonReq>;
export type FetchSubscriptionsApiReq = SocketRequest<SocketMetaData<SocketMethod.LIST_SUBSCRIPTIONS>>;

/*
 * API Responses
 */

export type SubscribeRes = null;
export type UnsubscribeRes = null;

export type FetchSubscriptionsRes = string[];

export type StreamRes = RawTrade;

/*
 * State
 */

type Actions = 'subscribe' | 'unsubscribe' | 'fetchSubscriptions';
export type MarketState = {
  stream: null | RawTrade;
  streams: string[];
  loading: { [K in Actions]: boolean; };
  error: { [K in Actions]: null | string; };
};
