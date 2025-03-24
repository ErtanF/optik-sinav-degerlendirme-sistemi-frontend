// src/api/schools/index.jsx - Yeni dosya
import apiClient from '../client';

const schoolApi = {
  // Tüm okulları getir
  getAllSchools: async () => {
    try {
      const response = await apiClient.get('/school/list');
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Belirli bir okulu getir
  getSchoolById: async (id) => {
    try {
      const response = await apiClient.get(`/school/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default schoolApi;