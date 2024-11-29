import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";

const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;