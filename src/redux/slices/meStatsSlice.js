import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

export const getMeStatsAsync = createAsyncThunk('getMeStatsAsync', async () => {
    try {
        const response = await axios.get('/users/me-stats/');
        return response.data;
    } catch (error) {
        throw { 'message': error.response.data.detail };
    }
});

const meStatsSlice = createSlice({
    name: 'meStats',
    initialState: {
        meStats: {},
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMeStatsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMeStatsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.meStats = action.payload;
            })
            .addCase(getMeStatsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default meStatsSlice.reducer;