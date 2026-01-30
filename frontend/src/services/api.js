import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust if using proxy (e.g. /api)
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Logic to handle token expiration (e.g., redirect to login)
      // For now, we rely on AuthContext or just let it fail
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
