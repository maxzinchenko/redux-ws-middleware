import type { AppState } from '../appStoreTypes';

export const selectMarketState = (state: AppState) => state.market;
export const selectStream = (state: AppState) => state.market.stream;
export const selectSubscribedStreams = (state: AppState) => state.market.streams;
export const selectMarketLoadingState = (state: AppState) => state.market.loading;
export const selectMarketErrorState = (state: AppState) => state.market.error;
