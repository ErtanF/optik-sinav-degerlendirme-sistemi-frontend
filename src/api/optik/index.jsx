// src/api/optik/index.jsx
import apiClient from '../client';

const optikApi = {
  // Form oluştur
  createForm: async (formData) => {
    try {
      // Kritik alanlar için veri doğrulama
      if (!formData.createdBy || formData.createdBy === 'undefined') {
        throw new Error('Geçerli bir kullanıcı ID\'si gereklidir.');
      }
      
      if (!formData.school || formData.school === 'undefined') {
        throw new Error('Geçerli bir okul ID\'si gereklidir.');
      }
      
       const response = await apiClient.post('/exam', formData);
      return response;
    } catch (error) {
      console.error("Form oluşturma hatası:", error);
      throw error;
    }
  },
  getExamsByCreator: async () => {
    try {
      // Backend'de userId req.user.userId'den alınıyor
      const response = await apiClient.get('/exam');
      return response;
    } catch (error) {
      console.error("Sınav getirme hatası:", error);
      throw error;
    }
  },
  
  // Tüm formları getir
  getAllForms: async (creatorId) => {
  try {
    //console.log("Kullanıcı ID:", creatorId); // ID kontrolü için log
    const response = await apiClient.get('/exam');
    //console.log("Ham API yanıtı:", response); // Ham yanıtı görmek için
    return response;
  } catch (error) {
    console.error("Form getirme hatası:", error);
    throw error;
  }
},
  
  // Belirli bir formu getir
  getFormById: async (id) => {
    try {
      const response = await apiClient.get(`/exam/getExams/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Formu güncelle
  updateForm: async (id, formData) => {
    try {
      const response = await apiClient.put(`/exam/${id}`, formData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Formu sil
  deleteForm: async (id) => {
    try {
      const response = await apiClient.delete(`/exam/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default optikApi;