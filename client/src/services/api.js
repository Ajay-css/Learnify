import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_SERVER;
  if (!envUrl) return '/api';
  
  // Ensure it ends with /api if not already present
  // Normalize the URL by removing trailing slash first
  const cleanUrl = envUrl.replace(/\/$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${ cleanUrl }/api`;
};


const api = axios.create({
  baseURL: getBaseURL(),
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

