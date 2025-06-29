import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('customerToken') || null,
  isAuthenticated: !!localStorage.getItem('customerToken'),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('customerToken', action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('customerToken');
    }
  }
});

export const { loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
