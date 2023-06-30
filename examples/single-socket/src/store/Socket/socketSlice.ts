import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { DisconnectRes, SocketState } from './socketStoreTypes';

const initialState: SocketState = {
  connected: false,

  loading: {
    connect: false,
    disconnect: false
  },

  error: null
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    connect: (state) => {
      state.loading.connect = true;
    },

    connectFulfilled: (state) => {
      state.loading.connect = false;
      state.connected = true;
    },

    disconnect: (state) => {
      state.loading.disconnect = true;
      state.connected = false;
    },

    disconnectFulfilled: (state, _: PayloadAction<DisconnectRes>) => {
      state.loading.disconnect = false;
      state.connected = false;
    },

    setError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
    }
  }
});

export const { reducer: socketReducer, actions: socketActions } = socketSlice;
