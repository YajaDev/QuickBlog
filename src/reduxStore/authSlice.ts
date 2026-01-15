import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Session } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  session: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startAuth(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action: PayloadAction<Session>) {
      state.session = action.payload;
      state.loading = false;
      state.error = null
    },
    authError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.session = null
      state.error = action.payload;
    },
    clearsession(state) {
      state.session = null;
    },
  },
});

export const { startAuth, authSuccess, authError, clearsession } = authSlice.actions;
export default authSlice.reducer;
