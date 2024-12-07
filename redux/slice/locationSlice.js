import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
  name: "location",
  initialState: {
    geolocationDenied: false,
    cityState: {
      state: "",
      city: "",
    },
  },
  reducers: {
    setGeolocationDenied: (state, action) => {
      state.geolocationDenied = action.payload;
    },
    setCityState: (state, action) => {
      state.cityState = action.payload;
    },
  },
});

export const { setGeolocationDenied, setCityState } = locationSlice.actions;
export default locationSlice.reducer;
