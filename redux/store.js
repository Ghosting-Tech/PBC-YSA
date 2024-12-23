"use client";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/redux/slice/userSlice";
import locationReducer from "@/redux/slice/locationSlice";
import topBookedServicesReducer from "@/redux/slice/topBookedServicesSlice";
import notificationReducer from "@/redux/slice/notificationSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    location: locationReducer,
    topServices: topBookedServicesReducer,
    notifications: notificationReducer,
  },
});

export default store;
