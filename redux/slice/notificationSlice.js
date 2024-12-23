// redux/slice/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    unreadCount: 0,
    notifications: [],
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n._id === action.payload
      );
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
  },
});

export const { setNotifications, markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
