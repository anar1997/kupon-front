import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

export const getBannerCouponsAsync = createAsyncThunk('getBannerCouponsAsync', async (data) => {
    try {
        const response = await axios.get('coupons/banners/')
        return response.data;
    } catch (error) {
        throw { 'message': error.response.data.detail };
    }
}); 

const initialState = {
    bannerCoupons: [],
    isLoading: false,
    error: null
};

const bannerCouponSlice = createSlice({
    name: 'bannerCoupons',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBannerCouponsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getBannerCouponsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bannerCoupons = action.payload.results;
            })
            .addCase(getBannerCouponsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export default bannerCouponSlice.reducer;