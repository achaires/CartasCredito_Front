import { IUser } from "@/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: IUser | null;
  accessToken: string;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: "",
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedIn: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isLoggedIn = true;
    },
    loggedOut: () => initialState,
  },
});

export const { loggedIn, loggedOut } = authSlice.actions;

export default authSlice.reducer;
