import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import studentApi from '../../api/students';
import schoolApi from '../../api/schools';
import classApi from '../../api/classes';
import { useAuth } from '../../hooks/useAuth';
import './StudentsList.css';

const StudentsList = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filters, setFilters] = useState({
    schoolId: '',
    classId: '',
    searchTerm: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Bu sayfaya erişmek için giriş yapmanız gerekmektedir');
      navigate('/login');
      return;
    }
    
    fetchStudents();
    fetchSchools();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (filters.schoolId) {
      fetchClassesBySchool(filters.schoolId);
    } else {
      setClasses([]);
      setFilters(prev => ({ ...prev, classId: '' }));
    }
  }, [filters.schoolId]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getStudents();
      setStudents(response || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Öğrenciler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await schoolApi.getAllSchools();
      setSchools(response.data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast.error('Okullar yüklenirken bir hata oluştu');
    }
  };

   const fetchClassesBySchool = async () => {
    try {
      const response = await classApi.getClassesBySchool();
      setClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Sınıflar yüklenirken bir hata oluştu');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filterStudents = () => {
    if (!Array.isArray(students)) return [];

    return students.filter(student => {
      const matchesSchool = !filters.schoolId || student.school._id === filters.schoolId;
      const matchesClass = !filters.classId || student.class._id === filters.classId;
      const matchesSearch = !filters.searchTerm || 
        student.firstName.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
        student.lastName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        student.studentNumber.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      return matchesSchool && matchesClass && matchesSearch;
    });
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await studentApi.deleteStudent(studentId);
      setStudents(students.filter(student => student._id !== studentId));
      toast.success('Öğrenci başarıyla silindi');
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Öğrenci silinirken bir hata oluştu');
    }
  };

  const filteredStudents = filterStudents();

  return (
    <div className="students-page">
      <div className="students-header">
        <h1>Öğrenci Yönetimi</h1>
        <div className="students-actions">
          <Link to="/students/import" className="button primary">
            <i className="icon-upload"></i> Excel ile Toplu Ekle
          </Link>
          <Link to="/students/new" className="button secondary">
            <i className="icon-plus"></i> Yeni Öğrenci
          </Link>
        </div>
      </div>

      <div className="students-filters">
        <div className="filter-group">
          <label htmlFor="schoolId">Okul:</label>
          <select 
            id="schoolId" 
            name="schoolId" 
            value={filters.schoolId} 
            onChange={handleFilterChange}
          >
            <option value="">Tüm Okullar</option>
            {schools.map(school => (
              <option key={school._id} value={school._id}>{school.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="classId">Sınıf:</label>
          <select 
            id="classId" 
            name="classId" 
            value={filters.classId} 
            onChange={handleFilterChange}
            disabled={!filters.schoolId}
          >
            <option value="">Tüm Sınıflar</option>
            {classes.map(classItem => (
              <option key={classItem._id} value={classItem._id}>{classItem.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="searchTerm">Ara:</label>
          <input 
            type="text" 
            id="searchTerm" 
            name="searchTerm" 
            value={filters.searchTerm} 
            onChange={handleFilterChange}
            placeholder="İsim, soyisim veya öğrenci no"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Öğrenciler yükleniyor...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="empty-state">
          <p>Öğrenci bulunamadı.</p>
        </div>
      ) : (
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Ad</th>
                <th>Soyad</th>
                <th>Öğrenci No</th>
                <th>Okul</th>
                <th>Sınıf</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student._id}>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.studentNumber}</td>
                  <td>{student.school.name}</td>
                  <td>{student.class.name}</td>
                  <td className="action-buttons">
                    <Link 
                      to={`/students/edit/${student._id}`} 
                      className="edit-button" 
                      title="Düzenle"
                    >
                      <i className="icon-edit"></i>
                    </Link>
                    <button 
                      className="delete-button" 
                      title="Sil"
                      onClick={() => handleDeleteStudent(student._id)}
                    >
                      <i className="icon-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentsList; 