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

// ── Automatic token refresh on 401 ──────────────────────────────────────────
// When a request gets 401 (access token expired), we silently call the refresh
// endpoint once and retry the original request.
//
// Rules:
// - Login/refresh calls are never retried (avoids infinite loops).
// - If the user has no valid refresh token (truly not logged in) we just let
//   the 401 propagate — callers decide what to do (e.g. show "Daxil ol" button).
//   We do NOT force-redirect here so that public pages remain accessible to
//   anonymous visitors.

let isRefreshing = false;
let failedQueue = [];

function processQueue(error) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
    });
    failedQueue = [];
}

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        const is401 = error.response?.status === 401;
        const alreadyRetried = original._retry;
        const isRefreshCall = original.url?.includes('/login/refresh/');
        const isLoginCall = original.url?.includes('/login/');

        // Don't intercept login/refresh calls or already-retried requests.
        if (!is401 || alreadyRetried || isRefreshCall || isLoginCall) {
            return Promise.reject(error);
        }

        // Another request is already refreshing — queue this one.
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(() => instance(original))
                .catch((err) => Promise.reject(err));
        }

        original._retry = true;
        isRefreshing = true;

        try {
            // Refresh cookie is sent automatically by the browser (HttpOnly).
            await instance.post('/users/login/refresh/');
            processQueue(null);
            return instance(original);
        } catch (_refreshError) {
            // Refresh token is expired or absent — user is not logged in.
            // Dispatch a logout action so Redux state is cleared, but do NOT
            // force-redirect: public pages must stay accessible anonymously.
            processQueue(_refreshError);
            try {
                const { store } = await import('./store');
                const { logout } = await import('./slices/authSlice');
                store.dispatch(logout());
            } catch (_) {
                // store import failed — not critical
            }
            return Promise.reject(_refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default instance;
