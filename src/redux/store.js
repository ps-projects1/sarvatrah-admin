import { configureStore } from "@reduxjs/toolkit";
import hotelReducer from "./slices/hotelSlice";
import cityReducer from "./slices/citySlice";   

export const store = configureStore({
  reducer: {
    hotel: hotelReducer,
    cities: cityReducer,   
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
