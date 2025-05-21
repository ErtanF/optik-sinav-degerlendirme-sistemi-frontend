// src/api/auth/index.jsx - Güncelleme
import apiClient from '../client';

// Auth ile ilgili API istekleri
const authApi = {
  // Kullanıcı girişi
  login: async (credentials) => {
    const response = await apiClient.post('/auth/signin', credentials);
    return response;
  },
  
  // Kullanıcı kaydı
  register: async (userData) => {
    const response = await apiClient.post('/auth/signup', userData);
    return response;
  },
  
  // Kullanıcı bilgilerini getirme
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response;
  },
  
  // Şifre sıfırlama
  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response;
  },
  
  // Şifre değiştirme
  resetPassword: async (token, password) => {
    const response = await apiClient.post('/auth/reset-password', { token, password });
    return response;
  }
};

export default authApi;