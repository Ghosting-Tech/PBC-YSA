import { createSlice } from "@reduxjs/toolkit";

const recommendedBookedServicesSlice = createSlice({
  name: "recommendedServices",
  initialState: {
    services: [],
    loading: true,
  },
  reducers: {
    setRecommendedBookedServices: (state, action) => {
      state.services = action.payload;
    },
    setRecommendedBookedServicesLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setRecommendedBookedServices,
  setRecommendedBookedServicesLoading,
} = recommendedBookedServicesSlice.actions;
export default recommendedBookedServicesSlice.reducer;
