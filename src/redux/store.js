import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./slices/userSlice";
import storeReducer from "./slices/storeSlice";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  user: userReducer,
  store: storeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

/* export const makeStore = () => {
  return {
    store: configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    }),
  };
}; */

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
