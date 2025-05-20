// src/api/client.jsx - Ortam değişkenlerini kullanmak için güncelleme
import axios from 'axios';

// API konfigürasyonu
const apiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5500/api', // Ortam değişkeni veya varsayılan
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Axios instance oluşturma
const apiClient = axios.create(apiConfig);

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // LocalStorage veya SessionStorage'dan token alma ve her isteğe ekleme
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    return response.data;
  },
  (error) => {
    const { response } = error;
    
    // Token süresi bittiğinde otomatik logout
    if (response && response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;