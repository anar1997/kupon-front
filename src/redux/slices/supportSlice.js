import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

export const postSupportAsync = createAsyncThunk('postSupportAsync', async (data, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append("fullname", data.fullname);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("category", data.category);
        formData.append("title", data.title);
        formData.append("description", data.description);
        if (data.image) {
            formData.append("image", data.image);
        }
        console.log(formData);
        const response = await axios.post('/support/', formData, {
            headers: { "Content-Type": "multipart/form-data", "Authorization": "" }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue({
            message: error.response?.data?.detail || 'Müraciət göndərilərkən xəta baş verdi!'
        });
    }
});

const initialState = {
    isLoading: false,
    error: null,
    successMessage: null,
}

const supportSlice = createSlice({
    name: 'support',
    initialState,
    reducers: {
        clearSupportMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(postSupportAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(postSupportAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload.detail || 'Müraciətiniz uğurla göndərildi!';
                console.log(action.payload);
            })
            .addCase(postSupportAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Müraciət göndərilərkən xəta baş verdi!';
            });
    }
});

export const { clearSupportMessages } = supportSlice.actions;
export default supportSlice.reducer;