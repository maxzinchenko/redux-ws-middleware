import { combineReducers } from '@reduxjs/toolkit';

import type { AppState } from './appStoreTypes';
import { socketReducer } from './Socket/socketSlice';
import { marketReducer } from './Market/marketSlice';

export const appReducer = combineReducers<AppState>({
  socket: socketReducer,
  market: marketReducer
});
