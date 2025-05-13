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
    return apiClient.get('/user/profile');
  },

  // Kullanıcı profilini güncelle
  updateUserProfile: async (userData) => {
    return apiClient.put('/user/profile', userData);
  },

  // Şifre değiştir
  changePassword: async (passwordData) => {
    return apiClient.put('/user/change-password', passwordData);
  }
};

export default usersApi;