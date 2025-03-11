import apiClient from '../client';

// Auth ile ilgili API istekleri
const authApi = {
  // Kullanıcı girişi
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Kullanıcı kaydı
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Kullanıcı bilgilerini getirme
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Şifre sıfırlama
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Şifre değiştirme
  resetPassword: async (token, password) => {
    try {
      const response = await apiClient.post('/auth/reset-password', { token, password });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default authApi;