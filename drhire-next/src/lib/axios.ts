import axios from 'axios';

const api = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const originalRequestUrl = error.config?.url;
      // Don't redirect if the request was checking auth status or if already on login page
      if (
        typeof window !== 'undefined' && 
        originalRequestUrl !== '/api/auth/me' && 
        window.location.pathname !== '/login'
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
