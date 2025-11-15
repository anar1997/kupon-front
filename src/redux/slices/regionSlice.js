import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

// Async thunk for fetching regions
export const getRegionsAsync = createAsyncThunk('getRegionsAsync', async () => {
    try {
        const response = await axios.get('/regions/');
        // API'den dönen veri: { count, next, previous, results: [...] }
        return response.data;
    } catch (error) {
        throw { message: error.response?.data?.detail || "Region fetch error" };
    }
});

const initialState = {
    regions: [],
    count: 0,
    next: null,
    previous: null,
    isLoading: false,
    error: null,
};

const regionSlice = createSlice({
    name: 'region',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRegionsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getRegionsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.regions = action.payload.results;
                state.count = action.payload.count;
                state.next = action.payload.next;
                state.previous = action.payload.previous;
            })
            .addCase(getRegionsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export default regionSlice.reducer;