import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

export const getCouponsAsync = createAsyncThunk('getCouponsAsync', async () => {
    try {
        const response = await axios.get('/coupons/');
        return response.data;
    } catch (error) {
        throw { 'message': error.response.data.detail };
    }
});

const initialState = {
    coupons: [],
    count: 0,
    next: null,
    previous: null,
    isLoading: false,
    error: null,
};

const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCouponsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCouponsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.coupons = action.payload.results;
                state.count = action.payload.count;
                state.next = action.payload.next;
                state.previous = action.payload.previous;
            })
            .addCase(getCouponsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export default couponSlice.reducer;
