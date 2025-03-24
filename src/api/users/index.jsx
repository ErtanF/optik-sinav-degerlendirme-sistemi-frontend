// src/api/users/index.jsx
import apiClient from '../client';

const usersApi = {
  // Onay bekleyen öğretmenleri getir
  getPendingTeachers: async () => {
    try {
      const response = await apiClient.get('/user/getApproveTeacher');
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Öğretmen onaylama
  approveTeacher: async (teacherId) => {
    try {
      const response = await apiClient.post('/user/approveTeacher', { teacherId });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Öğretmen reddetme (sadece UI'dan kaldırma - backend'de değişiklik yok)
  rejectTeacherLocally: (teacherId) => {
    // Backend'de şimdilik işlem yapmadan, sadece frontend'de listeden kaldırılacak
    return Promise.resolve({ success: true });
  }
};

export default usersApi;