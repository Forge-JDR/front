import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/auth.slice';
import messageReducer from './slices/message.slice';
import { wikiReducer } from './slices/Wikis.slice';

export * from './slices/auth.slice';
export * from './slices/message.slice';
export * from './slices/Wikis.slice';

export const store = configureStore({
  reducer: {
    auth : authReducer,
    message : messageReducer,
    wikis : wikiReducer
  }
})