import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

export const fetchMyCouponsAsync = createAsyncThunk(
  'myCoupons/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/orders/my-coupons/');
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.detail || 'Kuponlar yüklənərkən xəta baş verdi!',
      });
    }
  }
);

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const myCouponsSlice = createSlice({
  name: 'myCoupons',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyCouponsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyCouponsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload || [];
        state.error = null;
      })
      .addCase(fetchMyCouponsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Kuponlar yüklənərkən xəta baş verdi!';
      });
  },
});

export default myCouponsSlice.reducer;
