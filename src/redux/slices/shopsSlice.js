import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

export const getShopsAsync = createAsyncThunk('getShopsAsync', async() => {
    try {
        const response = await axios.get('/shops/')
        return response.data
    } catch (error) {
        throw {message: error.response.daat.detail}        
    }
})

const initialState = {
    shops: [],
    count: 0,
    next: null,
    previous: null,
    isLoading: false,
    error: null
};

const shopsSlice = createSlice({
    name: 'shops',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getShopsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getShopsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.shops = action.payload.results;
                state.count = action.payload.count;
                state.next = action.payload.next;
                state.previous = action.payload.previous;
            })
            .addCase(getShopsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
});

export default shopsSlice.reducer;