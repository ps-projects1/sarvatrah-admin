import { configureStore } from "@reduxjs/toolkit";
import hotelReducer from "./slices/hotelSlice";
import cityReducer from "./slices/citySlice";   // ⬅ ADD THIS

export const store = configureStore({
  reducer: {
    hotel: hotelReducer,
    cities: cityReducer,   // ⬅ FIX: Must match slice name
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
