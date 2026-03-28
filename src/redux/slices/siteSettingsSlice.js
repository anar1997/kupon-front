import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

export const fetchSiteSettingsAsync = createAsyncThunk(
    'siteSettings/fetch',
    async () => {
        const response = await axios.get('/settings/');
        return response.data;
    }
);

const initialState = {
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    working_hours: '',
    instagram_url: '',
    tiktok_url: '',
    facebook_url: '',
    about_text: '',
    rules_content: '',
    terms_content: '',
    cookie_content: '',
    isLoaded: false,
};

const siteSettingsSlice = createSlice({
    name: 'siteSettings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchSiteSettingsAsync.fulfilled, (state, action) => {
            Object.assign(state, action.payload);
            state.isLoaded = true;
        });
    },
});

export default siteSettingsSlice.reducer;
