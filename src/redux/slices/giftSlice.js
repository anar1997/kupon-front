import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';
import { notifySuccess, notifyError, extractErrorMessage } from '../../utils/notify';

export const postGiftCardAsync = createAsyncThunk('postGiftCardAsync', async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post('/wallet/gift-cards/redeem/', data);
        const detail = response.data?.detail || 'Hədiyyə kartı uğurla aktivləşdirildi!';
        notifySuccess('Hədiyyə kartı', detail);
        return response.data;
    } catch (error) {
        const message = extractErrorMessage(error, 'Hədiyyə kartı aktivləşdirilmədi!');
        notifyError('Hədiyyə kartı xətası', message);
        return rejectWithValue(message);
    }
});

const initialState = {
    giftCard: null,
    isLoading: false,
    error: null,
};

const giftSlice = createSlice({
    name: 'gift',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
             .addCase(postGiftCardAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(postGiftCardAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.giftCard = action.payload;
                state.error = null;
            })
            .addCase(postGiftCardAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; // rejectWithValue ile gelen mesaj
            });
    },
});

export const { clearError } = giftSlice.actions;
export default giftSlice.reducer;