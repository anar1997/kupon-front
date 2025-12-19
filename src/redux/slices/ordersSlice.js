import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';
import { notifySuccess, notifyError, extractErrorMessage } from '../../utils/notify';

export const createOrderFromCartAsync = createAsyncThunk(
  'orders/createFromCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post('/orders/create-from-cart/', {
        use_balance: true,
      });
      const detail = response.data?.detail || 'Sifariş balansdan uğurla yaradıldı.';
      notifySuccess('Sifariş tamamlandı', detail);
      return response.data.order;
    } catch (error) {
      const message = extractErrorMessage(error, 'Sifariş yaradılarkən xəta baş verdi!');
      notifyError('Sifariş xətası', message);
      return rejectWithValue({ message });
    }
  }
);

export const buyNowAsync = createAsyncThunk(
  'orders/buyNow',
  async ({ couponId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/orders/buy-now/', {
        coupon: couponId,
        quantity,
      });

      const statusKey = response.data?.status;
      const balanceUsed = response.data?.balance_used;
      const cardAmount = response.data?.card_amount;

      if (statusKey === 'paid_full') {
        const detail = response.data?.detail || 'Sifariş balansdan uğurla tamamlandı.';
        notifySuccess('İndi al', detail);
      } else if (statusKey === 'mixed') {
        notifySuccess(
          'İndi al',
          `Balansdan ${balanceUsed} ₼ çıxıldı, qalan ${cardAmount} ₼ kartla ödənəcək.`,
        );
      } else if (statusKey === 'card_only') {
        notifySuccess(
          'İndi al',
          `Balans kifayət etmir, ${cardAmount} ₼ kart ilə ödənməlidir.`,
        );
      }

      return response.data;
    } catch (error) {
      const message = extractErrorMessage(error, 'İndi al əməliyyatı zamanı xəta baş verdi!');
      notifyError('İndi al xətası', message);
      return rejectWithValue({ message });
    }
  },
);

const initialState = {
  isCreating: false,
  lastOrder: null,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrderFromCartAsync.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createOrderFromCartAsync.fulfilled, (state, action) => {
        state.isCreating = false;
        state.lastOrder = action.payload;
        state.error = null;
      })
      .addCase(createOrderFromCartAsync.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload?.message || 'Sifariş yaradılarkən xəta baş verdi!';
      })
      .addCase(buyNowAsync.fulfilled, (state, action) => {
        state.lastOrder = action.payload?.order || state.lastOrder;
      })
      .addCase(buyNowAsync.rejected, (state, action) => {
        state.error = action.payload?.message || 'İndi al əməliyyatı zamanı xəta baş verdi!';
      });
  },
});

export default ordersSlice.reducer;
