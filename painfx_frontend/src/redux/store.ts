import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./services/auth/authSlice";
import { apiSlice } from './services/apiSlice';
import infiniteScrollReducer from "./features-slices/infinite-scroll-slice";

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  infiniteScroll: infiniteScrollReducer,
});
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
