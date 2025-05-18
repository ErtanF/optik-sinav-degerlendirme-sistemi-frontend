import apiClient from '../client';

const classApi = {
  // Get all classes for current user
  getClasses: () => {
    return apiClient.get('/class');
  },
  
  // Get classes by school
  getClassesBySchool: () => {
    return apiClient.get(`/class/school`);
  },
  
  // Get a specific class by ID
  getClassById: (id) => {
    return apiClient.get(`/class/${id}`);
  },
  
  // Add a new class
  addClass: (classData) => {
    return apiClient.post('/class', classData);
  },
  
  // Update a class
  updateClass: (id, classData) => {
    return apiClient.put(`/class/${id}`, classData);
  },
  
  // Delete a class
  deleteClass: (id) => {
    return apiClient.delete(`/class/${id}`);
  }
};

export default classApi; 