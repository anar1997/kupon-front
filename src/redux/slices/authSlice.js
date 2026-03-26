import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';
import { notifySuccess, notifyError, extractErrorMessage } from '../../utils/notify';

export const postLoginAsync = createAsyncThunk('postLoginAsync', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post('/users/login/', data, {
      headers: {
        'Authorization': ''
      }
    });
    const detail = response.data?.detail || 'Uğurla daxil oldunuz!';
    notifySuccess('Daxil olundu', detail);
    return response.data;
  } catch (error) {
    const message = extractErrorMessage(error, 'Email və ya şifrə yanlışdır!');
    notifyError('Daxil olma xətası', message);
    return rejectWithValue({
      message,
    });
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
    const detail = response.data?.detail || 'Profil məlumatlarınız yeniləndi.';
    notifySuccess('Profil yeniləndi', detail);
    return response.data;
  } catch (error) {
    const message = extractErrorMessage(error, 'Profil yenilənərkən xəta baş verdi!');
    notifyError('Profil xətası', message);
    throw { 'message': message };
  }
});

export const postRegisterAsync = createAsyncThunk('postRegisterAsync', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post('/users/', data, {
      headers: {
        'Authorization': ''
      }
    });
    const detail = response.data?.detail || 'Qeydiyyat uğurla tamamlandı! İndi daxil ola bilərsiniz.';
    notifySuccess('Qeydiyyat', detail);
    return response.data;
  } catch (error) {
    const errorData = error.response?.data;
    let errorMessage = 'Qeydiyyat zamanı xəta baş verdi!';
    
    if (errorData?.phone) {
      errorMessage = 'Bu telefon nömrəsi artıq qeydiyyatdan keçib!';
    }
    else if (errorData?.email) {
      errorMessage = 'Bu email artıq istifadə olunur!';
    }
    else if (errorData?.detail) {
      errorMessage = errorData.detail;
    }
    
    notifyError('Qeydiyyat xətası', errorMessage);
    return rejectWithValue({
      message: errorMessage
    });
  }
});

export const logoutAsync = createAsyncThunk('logoutAsync', async (_, { rejectWithValue }) => {
  try {
    await axios.post('/users/logout/');
    notifySuccess('Çıxış edildi', 'Hesabdan uğurla çıxış etdiniz.');
    return {};
  } catch (error) {
    const message = extractErrorMessage(error, 'Çıxış zamanı xəta baş verdi!');
    notifyError('Çıxış xətası', message);
    return rejectWithValue({
      message,
    });
  }
});

const initialState = {
  isInitializing: true,  // true until the first getMeAsync completes
  isLoading: false,
  isLoggedIn: false,
  me: "",
  error: null,
  successMsg: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthMessages: (state) => {
      state.error = null;
      state.successMsg = null;
    },
    logout: (state) => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.me = "";
      state.error = null;
      state.successMsg = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postLoginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.error = null;
        console.log(action);
      })
      .addCase(postLoginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Email və ya şifrə yanlışdır!';
        state.isLoggedIn = false;
        console.log(action);
      })
      .addCase(postLoginAsync.pending, (state) => {
        state.isLoading = true;
        state.isLoggedIn = false;
        state.error = null;
      });
    builder
      .addCase(getMeAsync.fulfilled, (state, action) => {
        state.me = action.payload;
        state.isLoggedIn = true;
        state.isLoading = false;
        state.isInitializing = false;
        state.error = null;
      })
      .addCase(getMeAsync.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.isLoading = false;
        state.isInitializing = false;
        state.error = action.payload?.message || state.error;
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

    //Register:
    builder
      .addCase(postRegisterAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMsg = "Qeydiyyat uğurla tamamlandı! İndi daxil ola bilərsiniz.";
        state.error = null;
        console.log(action);
      })
      .addCase(postRegisterAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Qeydiyyat zamanı xəta baş verdi!';
        console.log(action);
      })
      .addCase(postRegisterAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });

    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.me = "";
        state.error = null;
        state.successMsg = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Çıxış zamanı xəta baş verdi!';
      });
  }
});

export const { clearAuthMessages, logout } = authSlice.actions;
export default authSlice.reducer;