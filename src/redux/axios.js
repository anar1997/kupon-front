import axios from 'axios';

// Central axios instance. We rely on HttpOnly cookies for auth, so
// tokens are NOT stored in localStorage and no Authorization header
// is set on the frontend side.

const instance = axios.create({
    baseURL: 'http://localhost:8005/api/',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default instance;