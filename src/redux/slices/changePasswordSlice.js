import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

export const changePasswordAsync = createAsyncThunk('changePasswordAsync', async (data) => {
    try {
        const response = await axios.post('/users/change-password/', data);
        return response.data;
    } catch (error) {
         return rejectWithValue({
            message: error.response?.data?.detail || 
                     error.response?.data?.old_password?.[0] ||
                     error.response?.data?.new_password?.[0] ||
                     'Şifrə dəyişdirilərkən xəta baş verdi!'
        });
    }
});

const initialState = {
    isLoading: false,
    error: null,
    successMessage: null,   
}

const changePasswordSlice = createSlice({
    name: 'changePassword',
    initialState,
    reducers: {
        clearPasswordMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(changePasswordAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(changePasswordAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload.message || 'Şifrə uğurla dəyişdirildi!';
                state.error = null;
            })
            .addCase(changePasswordAsync.rejected, (state, action) => {
                state.isLoading = false;
                  state.error = action.payload?.message || 'Şifrə dəyişdirilərkən xəta baş verdi!';
            });
    }
});

export const { clearPasswordMessages } = changePasswordSlice.actions;
export default changePasswordSlice.reducer;