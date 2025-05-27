import apiClient from '../client';

const optikApi = {
  // Optik şablon oluştur
  createForm: async (formData) => {
    try {
      if (!formData.createdBy || formData.createdBy === 'undefined') {
        throw new Error('Geçerli bir kullanıcı ID\'si gereklidir.');
      }

      /*if (!formData.school || formData.school === 'undefined') {
        throw new Error('Geçerli bir okul ID\'si gereklidir.');
      }*/

      const response = await apiClient.post('/opticalTemplate', formData);
      return response;
    } catch (error) {
      console.error("Form oluşturma hatası:", error);
      throw error;
    }
  },

  // Giriş yapan kullanıcıya ait optik şablonları getir
  getExamsByCreator: async () => {
    try {
      const response = await apiClient.get('/opticalTemplate/creator');
      return response;
    } catch (error) {
      console.error("Sınav getirme hatası:", error);
      throw error;
    }
  },

  // Public (genel) optik şablonları getir
  getAllForms: async () => {
    try {
      const response = await apiClient.get('/opticalTemplate/creator');
      console.log("Ham API yanıtı:", response);
      return response;
    } catch (error) {
      console.error("Form getirme hatası:", error);
      throw error;
    }
  },

  // Belirli bir şablonu ID ile getir
  getFormById: async (id) => {
    const response = await apiClient.get(`/opticalTemplate/${id}`);
    return response;
  },

  // Belirli bir şablonun bileşenlerini getir
  getFormComponentsById: async (id) => {
    const response = await apiClient.get(`/opticalTemplate/${id}/components`);
    return response;
  },

  // Şablonu güncelle
  updateForm: async (id, formData) => {
    try {
      console.log(`Form güncelleme API çağrısı başlatılıyor - ID: ${id}`);
      console.log('Gönderilen form verisi:', formData);
      console.log('Gönderilen sınıflar:', formData.assignedClasses);

      if (!formData.createdBy || formData.createdBy === 'undefined') {
        throw new Error('Geçerli bir kullanıcı ID\'si gereklidir.');
      }

      /*if (!formData.school || formData.school === 'undefined') {
        throw new Error('Geçerli bir okul ID\'si gereklidir.');
      }*/

      const preparedData = {
        ...formData,
        assignedClasses: Array.isArray(formData.assignedClasses) 
          ? formData.assignedClasses.map(id => id.toString())
          : []
      };

      const response = await apiClient.put(`/opticalTemplate/${id}`, preparedData);
      console.log('Backend yanıtı:', response);
      return response;
    } catch (error) {
      console.error("Form güncelleme hatası:", error);
      console.error("Hata detayları:", error.response?.data);
      throw error;
    }
  },

  // Şablonu sil
  deleteForm: async (id) => {
    const response = await apiClient.delete(`/opticalTemplate/${id}`);
    return response;
  }
};

export default optikApi;
