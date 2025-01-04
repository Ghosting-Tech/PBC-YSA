"use client";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/redux/slice/userSlice";
import locationReducer from "@/redux/slice/locationSlice";
import topBookedServicesReducer from "@/redux/slice/topBookedServicesSlice";
import notificationReducer from "@/redux/slice/notificationSlice";
import latestBookedServicesReducer from "@/redux/slice/LatestBookedServicesSlice";
import recommendedBookedServicesReducer from "@/redux/slice/RecommendedBookedServicesSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    location: locationReducer,
    topServices: topBookedServicesReducer,
    latestServices: latestBookedServicesReducer,
    recommendedServices: recommendedBookedServicesReducer,
    notifications: notificationReducer,
  },
});

export default store;
