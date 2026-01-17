import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import notificationReducer from "./notificationSlice"
import blogReducer from "./blogSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    blog: blogReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

