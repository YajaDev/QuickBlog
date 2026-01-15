import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  status: "success" | "error" | null;
  message: string;
}

const initialState: NotificationState = {
  status: null,
  message: "",
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotification(state) {
      state.status = null;
      state.message = "";
    },
    setNotification(state, action: PayloadAction<NotificationState>) {
      state.message = action.payload.message
      state.status = action.payload.status
    }
  },
});

export const { clearNotification, setNotification } = notificationSlice.actions;
export default notificationSlice.reducer;