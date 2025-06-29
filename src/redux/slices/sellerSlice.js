import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('sellerToken') || null,
  isAuthenticated: !!localStorage.getItem('sellerToken'),
};

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('sellerToken', action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('sellerToken');
    },
  },
});

export const { loginSuccess, logout } = sellerSlice.actions;

export default sellerSlice.reducer;
