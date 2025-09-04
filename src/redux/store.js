import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./slices/userSlice";
import storeReducer from "./slices/storeSlice";
import myStoreReducer from "./slices/myStoreSlice";
import viewStoreReducer from "./slices/viewStoreSlice";
import productReducer from "./slices/productSlice";
//rtk query용
import { productApi } from "./api/productApi";
import { hotdealApi } from "./api/hotdealApi";

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
  [hotdealApi.reducerPath]: hotdealApi.reducer,
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
    }).concat(productApi.middleware, hotdealApi.middleware),
});

export const persistor = persistStore(store);
