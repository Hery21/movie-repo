import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./slice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
  },
});
