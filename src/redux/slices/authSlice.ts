import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../data/testUser";

interface AuthState {
  user: Omit<User, "password"> | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<Omit<User, "password">>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
