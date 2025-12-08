import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

export const getMyTransactionsAsync = createAsyncThunk('getMyTransactionsAsync', async () => {
  try {
    const response = await axios.get('/wallet/transactions/my-transactions/');
    return response.data;
  } catch (error) {
    throw { 'message': error.response.data.detail };
  }
});

const myTransactionSlice = createSlice({
  name: 'myTransaction',
  initialState: {
    myTransactions: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyTransactionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyTransactionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.myTransactions = action.payload.results;
      })
      .addCase(getMyTransactionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default myTransactionSlice.reducer;