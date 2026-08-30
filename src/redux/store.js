import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./slices/cartSlice";

import {
    persistStore,
    persistReducer,
} from "redux-persist";

import storage from "./storage";

const persistConfig = {
    key: "cart",
    storage,
};

const persistedCartReducer = persistReducer(
    persistConfig,
    cartReducer
);

const store = configureStore({
    reducer: {
        cart: persistedCartReducer,
    },

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
        }),
});

export const persistor = persistStore(store);

export default store;