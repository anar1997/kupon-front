import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';
import { notifySuccess, notifyError, extractErrorMessage } from '../../utils/notify';

export const fetchCartAsync = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/cart/my-cart/');
    return response.data;
  } catch (error) {
    return rejectWithValue({ message: error.response?.data?.detail || 'Səbət yüklənərkən xəta baş verdi!' });
  }
});

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ couponId, quantity = 1 }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post('/cart/items/', { coupon: couponId, quantity });
      const detail = response.data?.detail || 'Məhsul səbətə əlavə olundu.';
      notifySuccess('Səbət', detail);
      await dispatch(fetchCartAsync());
      return {};
    } catch (error) {
      const message = extractErrorMessage(error, 'Səbətə əlavə edilərkən xəta baş verdi!');
      notifyError('Səbət xətası', message);
      return rejectWithValue({ message });
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateItem',
  async ({ id, quantity }, { dispatch, rejectWithValue }) => {
    try {
      await axios.patch(`/cart/items/${id}/`, { quantity });
      await dispatch(fetchCartAsync());
      return {};
    } catch (error) {
      const message = extractErrorMessage(error, 'Səbət yenilənərkən xəta baş verdi!');
      notifyError('Səbət yeniləmə xətası', message);
      return rejectWithValue({ message });
    }
  }
);

export const removeCartItemAsync = createAsyncThunk(
  'cart/removeItem',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`/cart/items/${id}/`);
      await dispatch(fetchCartAsync());
      return {};
    } catch (error) {
      const message = extractErrorMessage(error, 'Səbətdən silinərkən xəta baş verdi!');
      notifyError('Səbətdən silmə xətası', message);
      return rejectWithValue({ message });
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const items = getState().cart.items || [];
      await Promise.all(items.map((item) => axios.delete(`/cart/items/${item.id}/`)));
      await dispatch(fetchCartAsync());
      notifySuccess('Səbət', 'Səbət uğurla boşaldıldı.');
      return {};
    } catch (error) {
      const message = extractErrorMessage(error, 'Səbət boşaldılarkən xəta baş verdi!');
      notifyError('Səbəti boşaltma xətası', message);
      return rejectWithValue({ message });
    }
  }
);

const initialState = {
  id: null,
  items: [],
  itemsCount: 0,
  totalAmount: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCartState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const data = action.payload || {};
        state.id = data.id || null;
        state.items = data.items || [];
        state.itemsCount = data.items_count || 0;
        state.totalAmount = data.total_amount || 0;
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Səbət yüklənərkən xəta baş verdi!';
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.error = action.payload?.message || state.error;
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.error = action.payload?.message || state.error;
      })
      .addCase(removeCartItemAsync.rejected, (state, action) => {
        state.error = action.payload?.message || state.error;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.error = action.payload?.message || state.error;
      });
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
