// src/api/users/index.jsx
import apiClient from '../client';

const usersApi = {
  // Onay bekleyen öğretmenleri getir
  getPendingTeachers: async () => {
    return apiClient.get('/user/getApproveTeacher');
  },
  
  // Öğretmen onaylama
  approveTeacher: async (teacherId) => {
    return apiClient.post('/user/approveTeacher', { teacherId });
  },
  
  // Öğretmen reddetme (sadece UI'dan kaldırma - backend'de değişiklik yok)
  rejectTeacherLocally: () => {
    // Backend'de şimdilik işlem yapmadan, sadece frontend'de listeden kaldırılacak
    return Promise.resolve({ success: true });
  },
  // Kullanıcı profilini getir
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/user/profile');
      return response;
    } catch (error) {
      console.error('API error in getUserProfile:', error);
      throw error;
    }
  },

  // Kullanıcı profilini güncelle
  updateUserProfile: async (userData) => {
    try {
      const response = await apiClient.put('/user/profile', userData);
      return response;
    } catch (error) {
      console.error('API error in updateUserProfile:', error);
      throw error;
    }
  },

  // Şifre değiştir
  changePassword: async (passwordData) => {
    return apiClient.put('/user/change-password', passwordData);
  }
};

export default usersApi;