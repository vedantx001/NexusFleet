import axios from 'axios';

export const TOKEN_STORAGE_KEY = 'nexusfleet_token';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getStoredToken() {
  try {
    const token = window?.localStorage?.getItem(TOKEN_STORAGE_KEY);
    return token || null;
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    if (!token) return;
    window?.localStorage?.setItem(TOKEN_STORAGE_KEY, String(token));
  } catch {
    // ignore
  }
}

export function clearStoredToken() {
  try {
    window?.localStorage?.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function setApiAuthToken(token) {
  if (!token) {
    delete api.defaults.headers.common.Authorization;
    return;
  }
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers || {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Request failed';

    const status = error?.response?.status;
    if (status === 401) {
      clearStoredToken();
      setApiAuthToken(null);
      try {
        window?.dispatchEvent?.(new CustomEvent('auth:unauthorized'));
      } catch {
        // ignore
      }

      try {
        const path = window?.location?.pathname || '';
        const isOnAuthRoute = path.startsWith('/login') || path.startsWith('/signup') || path.startsWith('/register');
        if (!isOnAuthRoute) {
          window.location.assign('/login');
        }
      } catch {
        // ignore
      }
    }

    return Promise.reject(Object.assign(error, { friendlyMessage: message }));
  },
);

export default api;
