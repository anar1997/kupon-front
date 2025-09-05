import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

export const postLoginAsync = createAsyncThunk('postLoginAsync', async (data) => {
  try {
    const response = await axios.post('/users/login/', data, {
      headers: {
        'Authorization': ''
      }
    });
    return response.data;
  } catch (error) {
    throw { 'message': error.response.data.detail };
  }
})

export const getMeAsync = createAsyncThunk('getMeAsync', async () => {
  try {
    const response = await axios.get('/users/me/');
    return response.data;
  } catch (error) {
    throw { 'message': error.response.data.detail };
  }
});

export const putMeAsync = createAsyncThunk('putMeAsync', async (data) => {
  try {
    const response = await axios.put(`/users/${data.id}/`, data);
    return response.data;
  } catch (error) {
    throw { 'message': error.response.data.detail };
  }
});

const initialState = {
  refresh: "",
  access: "",
  isLoading: false,
  isLoggedIn: false,
  me: ""
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postLoginAsync.fulfilled, (state, action) => {
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        localStorage.setItem('access', action.payload.access);
        localStorage.setItem('refresh', action.payload.refresh);
        localStorage.setItem('isLoggedIn', true);
        state.isLoggedIn = true;
        console.log(action);
      })
      .addCase(postLoginAsync.rejected, (state, action) => {
        state.error = action.payload.message;
        state.isLoggedIn = false;
        console.log(action);
      })
      .addCase(postLoginAsync.pending, (state) => {
        state.isLoading = true;
        state.isLoggedIn = false;
      });
    builder
      .addCase(getMeAsync.fulfilled, (state, action) => {
        state.me = action.payload;
        console.log(action);
      })
      .addCase(getMeAsync.rejected, (state, action) => {
        state.error = action.payload.message;
        console.log(action);
      })
      .addCase(getMeAsync.pending, (state) => {
        state.isLoading = true;
      });
    builder
      .addCase(putMeAsync.fulfilled, (state, action) => {
        console.log(action);
      })
      .addCase(putMeAsync.rejected, (state, action) => {
        state.error = action.payload.message;
        console.log(action);
      })
      .addCase(putMeAsync.pending, (state) => {
        state.isLoading = true;
      });
  }
});

// export const {  } = authSlice.actions;

export default authSlice.reducer;