import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

export const getPremiumCouponsAsync = createAsyncThunk('getPremiumCouponsAsync', async (data) => {
    try {
        const response = await axios.get('coupons/premium-offers/')
        return response.data;
    } catch (error) {
        throw { 'message': error.response.data.detail };
    }
});

const initialState = {
    premiumCoupons: [],
    isLoading: false,
    error: null,
};

const premiumCouponSlice = createSlice({
    name: 'premiumCoupon',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPremiumCouponsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPremiumCouponsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.premiumCoupons = action.payload.results;
            })
            .addCase(getPremiumCouponsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});


export default premiumCouponSlice.reducer;