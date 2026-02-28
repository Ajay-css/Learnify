import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for error handling and data validation
api.interceptors.response.use(
  (response) => {
    // Check if the response is actually JSON
    const contentType = response.headers['content-type'];
    if (contentType && !contentType.includes('application/json')) {
      return Promise.reject(new Error('Invalid response format (not JSON)'));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

