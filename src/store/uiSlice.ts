import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  toasts: ToastAlert[];
  isLoading: boolean;
}

type ToastAlert = {
  title: string;
  message: string;
  type: "success" | "error";
  time?: string;
};

const initialState: UIState = {
  toasts: [],
  isLoading: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<ToastAlert>) => {
      let newAlerts = [...state.toasts];
      newAlerts.unshift(action.payload);
      state.toasts = newAlerts;
    },
    removeToast: (state, action: PayloadAction<number>) => {
      let newAlerts = [...state.toasts];
      newAlerts.splice(action.payload, 1);
      state.toasts = newAlerts;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { addToast, removeToast, setIsLoading } = uiSlice.actions;

export default uiSlice.reducer;
