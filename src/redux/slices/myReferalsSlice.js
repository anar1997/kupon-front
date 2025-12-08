import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

export const getMyReferralsAsync = createAsyncThunk('getMyReferralsAsync', async () => {
    try {
        const response = await axios.get('/users/my-referrals/');
        return response.data;
    } catch (error) {
        throw { 'message': error.response.data.detail };
    }
});

const myReferralsSlice = createSlice({
    name: 'myReferrals',
    initialState: {
        myReferrals: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyReferralsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyReferralsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.myReferrals = action.payload;
            })
            .addCase(getMyReferralsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default myReferralsSlice.reducer;