import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import sellerReducer from './slices/sellerSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer
  }
});
