import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./slices/userSlice";
import storeReducer from "./slices/storeSlice";
import myStoreReducer from "./slices/myStoreSlice";
import viewStoreReducer from "./slices/viewStoreSlice";
import productReducer from "./slices/productSlice";

import { productApi } from "./api/productApi";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user", "store", "myStore", "viewStore"],
};

const rootReducer = combineReducers({
  user: userReducer,
  store: storeReducer,
  myStore: myStoreReducer,
  viewStore: viewStoreReducer,
  product: productReducer,
  [productApi.reducerPath]: productApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
          "persist/FLUSH",
        ],
      },
    }).concat(productApi.middleware),
});

export const persistor = persistStore(store);
