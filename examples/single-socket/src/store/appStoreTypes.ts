import { ThunkAction, Action, ThunkDispatch } from '@reduxjs/toolkit';

import type { SocketState } from './Socket/socketStoreTypes';
import type { MarketState } from './Market/marketStoreTypes';

export type AppState = {
  socket: SocketState;
  market: MarketState;
};

export type AppThunkAction = ThunkAction<void, AppState, unknown, Action>;
// @ts-ignore
export type AppThunkDispatch = ThunkDispatch<AppState, null, AppThunkAction>;

declare module 'react-redux' {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  type DefaultRootState = AppState;
}
