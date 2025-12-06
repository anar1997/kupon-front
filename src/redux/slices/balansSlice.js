import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

export const getBalansAsync = createAsyncThunk('getBalansAsync', async() => {
    try {
        const response = await axios.get('/wallet/wallets/my-wallet/')
        return response.data
    } catch (error) {
        throw {message: error.response.data.detail}        
    }
})

const initialState = {
    current_balance: 0,
    total_income: 0,
    total_expenses: 0,
    isLoading: false,
    error: null
};

const balansSlice = createSlice({
    name: 'balans',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getBalansAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getBalansAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.current_balance = action.payload.current_balance;
                state.total_income = action.payload.total_income;
                state.total_expenses = action.payload.total_expenses;
            })
            .addCase(getBalansAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
});

export default balansSlice.reducer;