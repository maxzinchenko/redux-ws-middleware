import { configureStore } from '@reduxjs/toolkit';
import { createSocketMiddleware } from 'redux-ws-middleware';

import { socketOptions } from './Socket/socketOptions';
import { appReducer } from './appReducer';

export const appStore = configureStore({
  reducer: appReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({ serializableCheck: false });

    return [...middleware, createSocketMiddleware(socketOptions)];
  }
});
