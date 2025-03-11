import axios from 'axios';

// API konfigürasyonu
const apiConfig = {
  baseURL: 'http://localhost:5000/api', // Backend API URL'i (sonra değiştirilecek)
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
    // LocalStorage'dan token alma ve her isteğe ekleme
    const token = localStorage.getItem('token');
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
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;