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
      // Backend expects `product` field (marketplace/products model).
      const response = await axios.post('/cart/items/', { product: couponId, quantity });
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
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      await axios.patch(`/cart/items/${id}/`, { quantity });
      // Backend uğurludur, frontend state-i lokalda yeniləyirik (yenidən GET etmirik)
      return { id, quantity };
    } catch (error) {
      const message = extractErrorMessage(error, 'Səbət yenilənərkən xəta baş verdi!');
      notifyError('Səbət yeniləmə xətası', message);
      return rejectWithValue({ message });
    }
  }
);

export const removeCartItemAsync = createAsyncThunk(
  'cart/removeItem',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/cart/items/${id}/`);
      // Uğurlu olduqda, state-dən bu item-i lokalda siləcəyik
      return { id };
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
      notifySuccess('Səbət', 'Səbət uğurla boşaldıldı.');
      // Backend səbəti təmizlədi, state-i lokalda sıfırlayacağıq
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

        // Normalize backend shape:
        // - Backend returns `items[].product`
        // - Frontend historically uses `items[].coupon`
        state.items = (data.items || []).map((it) => ({
          ...it,
          coupon: it.coupon ?? it.product,
        }));
        state.itemsCount = data.items_count || 0;
        state.totalAmount = data.total_amount || 0;
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Səbət yüklənərkən xəta baş verdi!';
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        const { id, quantity } = action.payload || {};
        const item = state.items.find((i) => i.id === id);
        if (item) {
          item.quantity = quantity;
        }
        // Total və count-u lokalda yenilə
        state.itemsCount = state.items.reduce((sum, it) => sum + it.quantity, 0);
        state.totalAmount = state.items.reduce((sum, it) => {
          const discounted = Number(it.coupon?.discount || 0);
          return sum + discounted * it.quantity;
        }, 0);
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.error = action.payload?.message || state.error;
      })
      .addCase(removeCartItemAsync.fulfilled, (state, action) => {
        const { id } = action.payload || {};
        state.items = state.items.filter((it) => it.id !== id);
        state.itemsCount = state.items.reduce((sum, it) => sum + it.quantity, 0);
        state.totalAmount = state.items.reduce((sum, it) => {
          const discounted = Number(it.coupon?.discount || 0);
          return sum + discounted * it.quantity;
        }, 0);
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.error = action.payload?.message || state.error;
      })
      .addCase(removeCartItemAsync.rejected, (state, action) => {
        state.error = action.payload?.message || state.error;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.error = action.payload?.message || state.error;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.itemsCount = 0;
        state.totalAmount = 0;
      });
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
