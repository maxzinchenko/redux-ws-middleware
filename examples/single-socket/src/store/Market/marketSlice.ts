import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { StreamRes, MarketState, FetchSubscriptionsRes } from './marketStoreTypes';
import {
  subscribe,
  unsubscribe,
  subscribeRequest,
  unsubscribeRequest,
  fetchSubscriptions,
  fetchSubscriptionsRequest
} from './marketStoreActions';

const initialState: MarketState = {
  stream: null,
  streams: [],

  loading: {
    subscribe: false,
    unsubscribe: false,
    fetchSubscriptions: false
  },

  error: {
    subscribe: null,
    unsubscribe: null,
    fetchSubscriptions: null
  }
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    subscribeFulfilled: (state) => {
      state.loading.subscribe = false;
    },
    subscribeRejected: (state, { payload }: PayloadAction<string>) => {
      state.loading.subscribe = false;
      state.error.subscribe = payload;
    },

    unsubscribeFulfilled: (state) => {
      state.loading.unsubscribe = false;
      state.streams = [];
      state.stream = null;
    },
    unsubscribeRejected: (state, { payload }: PayloadAction<string>) => {
      state.loading.unsubscribe = false;
      state.error.unsubscribe = payload;
    },

    fetchSubscriptionsFulfilled: (state, { payload }: PayloadAction<FetchSubscriptionsRes>) => {
      state.loading.fetchSubscriptions = false;
      state.streams = payload;
    },
    fetchSubscriptionsRejected: (state, { payload }: PayloadAction<string>) => {
      state.loading.fetchSubscriptions = false;
      state.error.fetchSubscriptions = payload;
    },

    updateStream: (state, { payload }: PayloadAction<StreamRes>) => {
      state.stream = payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(subscribeRequest.type, (state) => {
      state.loading.subscribe = true;
      state.error.subscribe = null;
    });

    builder.addCase(unsubscribeRequest.type, (state) => {
      state.loading.unsubscribe = true;
      state.error.unsubscribe = null;
    });

    builder.addCase(fetchSubscriptionsRequest.type, (state) => {
      state.loading.fetchSubscriptions = true;
      state.error.fetchSubscriptions = null;
    });
  }
});

const { reducer, actions } = marketSlice;
export const marketReducer = reducer;
export const marketActions = {
  ...actions,
  unsubscribe,
  subscribe,
  fetchSubscriptions
};
