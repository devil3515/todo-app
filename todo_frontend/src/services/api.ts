import axios from 'axios';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api', // Fallback to local URL if env variable is not set
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request. Logging out...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Or use React Router's navigation
    }
    return Promise.reject(error);
  }
);

export default api;
