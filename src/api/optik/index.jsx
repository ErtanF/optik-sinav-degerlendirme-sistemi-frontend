// src/api/optik/index.jsx - Yeni dosya
import apiClient from '../client';

const optikApi = {
  // Form oluştur
  createForm: async (formData) => {
    try {
      const response = await apiClient.post('/optik/save', formData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Tüm formları getir
  getAllForms: async () => {
    try {
      const response = await apiClient.get('/optik/list');
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Belirli bir formu getir
  getFormById: async (id) => {
    try {
      const response = await apiClient.get(`/optik/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Formu güncelle
  updateForm: async (id, formData) => {
    try {
      const response = await apiClient.put(`/optik/${id}`, formData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Formu sil
  deleteForm: async (id) => {
    try {
      const response = await apiClient.delete(`/optik/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default optikApi;