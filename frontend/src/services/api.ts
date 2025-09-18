// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: { Accept: 'application/json' },
});

/**
 * Attach token from localStorage to every request
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * On 401: remove token and emit global event so AuthContext can react.
 * Do NOT redirect here to avoid double navigation side-effects.
 */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      console.warn('[api] 401 received — clearing token and emitting auth:logout');
      localStorage.removeItem('token');
      try {
        window.dispatchEvent(new Event('auth:logout'));
      } catch (e) {
        /* ignore */
      }
    }
    return Promise.reject(err);
  }
);

export default api;
