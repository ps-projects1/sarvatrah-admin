import { configureStore } from "@reduxjs/toolkit";
import hotelReducer from "./slices/hotelSlice";

export const store = configureStore({
  reducer: {
    hotel: hotelReducer,
    // Add other reducers here when needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable if you have non-serializable values
    }),
});
