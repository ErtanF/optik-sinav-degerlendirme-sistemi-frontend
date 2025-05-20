// src/api/schools/index.jsx - Yeni dosya
import apiClient from '../client';

const schoolApi = {
  // Tüm okulları getir
  getAllSchools: async () => {
    return await apiClient.get('/school/list');
  },
  
  // Belirli bir okulu getir
  getSchoolById: async (id) => {
    return await apiClient.get(`/school/${id}`);
  },

  // Yeni okul ekle
  addSchool: async (schoolData) => {
    return await apiClient.post('/school/addschool', schoolData);
  },

  // Okul güncelle
  updateSchool: async (id, schoolData) => {
    return await apiClient.put(`/school/${id}`, schoolData);
  },

  // Okul sil
  deleteSchool: async (id) => {
    return await apiClient.delete(`/school/${id}`);
  },

  // Okula admin ekle
  addAdmin: async (adminData) => {
    return await apiClient.post('/user/addadmin', adminData);
  }
};

export default schoolApi;