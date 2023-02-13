import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";
import authReducer from "./authSlice";
import { rootApi } from "@/apis/rootApi";
import { getDefaultSettings } from "http2";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  },
  devTools: true,
  middleware: (getDefaultSettings) => getDefaultSettings({}).concat([rootApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

setupListeners(store.dispatch);
