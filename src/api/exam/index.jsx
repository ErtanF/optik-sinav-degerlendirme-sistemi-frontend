import apiClient from '../client';

const examApi = {
  // Yeni sınav oluştur
  createExam: async (examData) => {
    return apiClient.post('/exam', examData);
  },
  
  // Kullanıcının oluşturduğu sınavları getir
  getExamsByCreator: async () => {
    return apiClient.get('/exam');
  },
  
  // Okula göre sınavları getir
  getExamsBySchool: async () => {
    return apiClient.get('/exam/school');
  },
  
  // Belirli bir sınavı getir
  getExamById: async (id) => {
    return apiClient.get(`/exam/${id}`);
  },
  
  // Sınavı güncelle
  updateExam: async (id, examData) => {
    return apiClient.put(`/exam/${id}`, examData);
  },
  
  // Sınavı sil
  deleteExam: async (id) => {
    return apiClient.delete(`/exam/${id}`);
  },
  
  // Sınıfa göre sınavları getir
  getExamsByClass: async (classId) => {
    return apiClient.get(`/exam/class/${classId}`);
  }
};

export default examApi;