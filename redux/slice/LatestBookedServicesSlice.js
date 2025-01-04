import { createSlice } from "@reduxjs/toolkit";

const latestBookedServicesSlice = createSlice({
  name: "latestServices",
  initialState: {
    services: [],
    loading: true,
  },
  reducers: {
    setLatestBookedServices: (state, action) => {
      state.services = action.payload;
    },
    setLatestBookedServicesLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLatestBookedServices, setLatestBookedServicesLoading } =
  latestBookedServicesSlice.actions;
export default latestBookedServicesSlice.reducer;
