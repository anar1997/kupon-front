import axios from 'axios';

// Central axios instance. We rely on HttpOnly cookies for auth, so
// tokens are NOT stored in localStorage and no Authorization header
// is set on the frontend side.

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    withCredentials: true,
});

// Let the browser set correct multipart boundaries for FormData.
instance.interceptors.request.use((config) => {
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
        if (config.headers) {
            delete config.headers['Content-Type'];
            delete config.headers['content-type'];
        }
    }
    return config;
});

export default instance;