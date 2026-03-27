import axios from 'axios';

const TOKEN_KEY = 'hms_token';
const USER_KEY  = 'hms_user';

// ── Base Axios Instance ───────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request Interceptor — attach JWT ──────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor — handle 401/403 ────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }
    if (!error.response) {
      console.error('Network Error — backend may be down');
    }
    return Promise.reject(error);
  }
);

export default api;