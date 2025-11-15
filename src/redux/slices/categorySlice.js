import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

export const getCategoriesAsync = createAsyncThunk('getCategoriesAsync', async (data) => {
    try {
        const response = await axios.get('/coupons/categories/?parent__isnull=true');
        return response.data;
    } catch (error) {
        throw { 'message': error.response.data.detail };
    }   
});

export const getChildCategoriesAsync = createAsyncThunk('getChildCategoriesAsync', async (parentId) => {
    try {
        const response = await axios.get(`/coupons/categories/?parent=${parentId}`);
        return response.data;
    } catch (error) {
        throw { 'message': error.response.data.detail };
    }
});

const initialState = {
    categories: [],
    childCategories: [],
    isLoading: false,
    error: null,
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCategoriesAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCategoriesAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
                console.log(action);
            })
            .addCase(getCategoriesAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
        builder
            .addCase(getChildCategoriesAsync.pending, (state) => {
                state.isLoading = true;   
                state.error = null;
            })
            .addCase(getChildCategoriesAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.childCategories = action.payload;
                console.log(action);
            })
            .addCase(getChildCategoriesAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            }); 
    },
});

export default categorySlice.reducer;
