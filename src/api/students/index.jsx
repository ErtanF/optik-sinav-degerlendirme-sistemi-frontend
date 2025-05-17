import apiClient from '../client';

const studentApi = {
  // Get all students for current user
  getStudents: () => {
    return apiClient.get('/student');
  },
  
  // Get a specific student by ID
  getStudentById: (id) => {
    return apiClient.get(`/student/${id}`);
  },
  
  // Get students by class
  getStudentsByClass: (classId) => {
    return apiClient.get(`/student/class/${classId}`);
  },
  
  // Get students by school
  getStudentsBySchool: (schoolId) => {
    return apiClient.get(`/student/school/${schoolId}`);
  },
  
  // Add a new student
  addStudent: (studentData) => {
    return apiClient.post('/student', studentData);
  },
  
  // Update a student
  updateStudent: (id, studentData) => {
    return apiClient.put(`/student/${id}`, studentData);
  },
  
  // Delete a student
  deleteStudent: (id) => {
    return apiClient.delete(`/student/${id}`);
  },
  
  // Add multiple students from a list
  addStudentsFromList: (studentsList) => {
    return apiClient.post('/student/list', { students: studentsList });
  },
  
  // Remove a student from a class
  removeFromClass: (studentId) => {
    return apiClient.post(`/student/${studentId}/remove-from-class`);
  },
  
  // Add existing students to a class
  addStudentsToClass: (classId, studentIds) => {
    return apiClient.post(`/student/add-to-class/${classId}`, { studentIds });
  }
};

export default studentApi; 