import { IUser } from "@/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: IUser | null;
  accessToken: string;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: "",
  isLoggedIn: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedIn: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    storeAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    authIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loggedOut: () => initialState,
  },
});

export const { storeAccessToken, loggedIn, loggedOut, authIsLoading } = authSlice.actions;

export default authSlice.reducer;
