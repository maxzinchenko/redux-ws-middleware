import type { AppState } from '../appStoreTypes';

export const selectSocketState = (state: AppState) => state.socket;
