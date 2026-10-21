import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../data/testUser";

type AuthUser = Omit<User, "password">;

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  registeredUsers: AuthUser[];
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  registeredUsers: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerUser: (state, action: PayloadAction<AuthUser>) => {
      const emailExists = state.registeredUsers.some(
        (user) =>
          user.email.toLowerCase() === action.payload.email.toLowerCase(),
      );

      if (!emailExists) {
        state.registeredUsers.push(action.payload);
      }
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },

    loginSuccess: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { registerUser, loginSuccess, logout, setAccessToken } =
  authSlice.actions;

export default authSlice.reducer;
