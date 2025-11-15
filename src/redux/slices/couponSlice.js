import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

export const getCouponsAsync = createAsyncThunk(
    'getCouponsAsync',
    async (data = {}, { getState }) => {
        const prev = getState().coupon.lastQuery;              // önceki kullanılan parametreler
        const merged = { ...prev, ...data };                   // yeniler eskilerin üstüne yazılır

        const {
            offset = 0,
            category = '',
            shop_region = '',
            service = ''
        } = merged;

        const url = `/coupons/?limit=10&offset=${offset}&category=${category || ""}&shop_region=${shop_region || ""}&service=${service || ""}`;

        try {
            const response = await axios.get(url);
            return { ...response.data, appliedFilters: merged }; // merged’i geri gönder
        } catch (error) {
            throw { message: error.response?.data?.detail || 'Kuponlar alınamadı' };
        }
    }
);

export const getCouponBySlugAsync = createAsyncThunk(
    'getCouponBySlugAsync',
    async (slug) => {
        try {
            const response = await axios.get(`/coupons/${slug}/`);
            return response.data;
        } catch (error) {
            throw { message: error.response?.data?.detail || "Xəta baş verdi" };
        }
    }
);

const initialState = {
    coupons: [],
    count: 0,
    next: null,
    previous: null,
    isLoading: false,
    error: null,
    selectedCoupon: null,
    lastQuery: {
        offset: 0,
        category: '',
        shop_region: '',
        service: ''
    }
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
                if (action.payload.appliedFilters) {
                    state.lastQuery = action.payload.appliedFilters; // filtreleri güncelle
                }
            })
            .addCase(getCouponsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
        builder
            .addCase(getCouponBySlugAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.selectedCoupon = null;
            })
            .addCase(getCouponBySlugAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedCoupon = action.payload;
                console.log(action);
            })
            .addCase(getCouponBySlugAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export default couponSlice.reducer;
