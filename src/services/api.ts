import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('anand_agro_token');
    console.log('🔑 API Request - Token check:', token ? `${token.substring(0, 20)}...` : 'No token found');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set for:', config.url);
    } else {
      console.log('❌ No token available for:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response success for:', response.config.url);
    return response;
  },
  (error) => {
    console.log('❌ API Response error for:', error.config?.url);
    console.log('❌ Error status:', error.response?.status);
    console.log('❌ Error message:', error.response?.data?.message);
    
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
