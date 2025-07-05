import axios from 'axios';

// Get API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL;

console.log('API URL:', API_URL); // Log the API URL to check if it's correctly loaded

const api = axios.create({
  baseURL: API_URL || 'http://localhost:5000/api', // Fallback in case env variable isn't loaded
  headers: {
    'Content-Type': 'application/json',
  },
  // Increase timeout for slower connections
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log(`${config.method.toUpperCase()} ${config.url}`); // Log the request for debugging
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    // Log detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
        url: error.config?.url
      });
      
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        console.warn('Unauthorized access - redirecting to login');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      
      // Check if it might be a CORS or network issue
      console.error('Possible CORS or network issue - check if backend is running and accessible');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Helper to set auth token directly
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Export the axios instance and helper functions
export default {
  ...api,
  setAuthToken,
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete,
  patch: api.patch
};
