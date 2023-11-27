import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import postReducer from "./slices/post";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
