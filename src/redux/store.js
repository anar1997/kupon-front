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
import supportReducer from './slices/supportSlice';
import balansReducer from './slices/balansSlice';
import giftReducer from './slices/giftSlice';
import changePasswordReducer from './slices/changePasswordSlice';
import myTransactionReducer from './slices/myTransactionSlice';
import meStatsReducer from './slices/meStatsSlice';
import myReferralsReducer from './slices/myReferalsSlice';
import cartReducer from './slices/cartSlice';

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
    support: supportReducer,
    balans: balansReducer,
    gift: giftReducer,
    changePassword: changePasswordReducer,
    myTransaction: myTransactionReducer,
    meStats: meStatsReducer,
    myReferrals: myReferralsReducer,
    cart: cartReducer,
  }
});