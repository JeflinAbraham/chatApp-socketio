import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice.js';

// Define a transform to handle circular references
const omitCircularReferences = createTransform(
  (inboundState, key) => {
    if (key === 'user') {
      const { socketConnection, ...rest } = inboundState; // Exclude socketConnection
      return rest;
    }
    return inboundState;
  },
  (outboundState, key) => outboundState, // No modifications on rehydrate
  { whitelist: ['user'] } // Apply this transform only to the user slice
);
// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  transforms: [omitCircularReferences],
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Persistor
export const persistor = persistStore(store);
