import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import sellerReducer from './slices/sellerSlice';
import authReducer from './slices/authSlice';
import couponReducer from './slices/couponSlice';
import regionReducer from './slices/regionSlice';
import shopsReducer from './slices/shopsSlice';
import categoryReducer from './slices/categorySlice';
import premiumCouponReducer from './slices/premiumCouponSlice';
import bannerCouponReducer from './slices/bannerSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    auth: authReducer,
    coupon: couponReducer,
    region: regionReducer,
    shops: shopsReducer,
    category: categoryReducer,
    premiumCoupon: premiumCouponReducer,
    bannerCoupon: bannerCouponReducer,
  }
});