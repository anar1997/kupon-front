import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import sellerReducer from './slices/sellerSlice';
import authReducer from './slices/authSlice';
import couponReducer from './slices/couponSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    auth: authReducer,
    coupon: couponReducer,
  }
});