import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2, FiUpload, FiPlus } from 'react-icons/fi';
import studentApi from '../../api/students';
import schoolApi from '../../api/schools';
import classApi from '../../api/classes';
import { useAuth } from '../../hooks/useAuth';
import './StudentsList.css';

const StudentsList = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [uniqueClassesFromStudents, setUniqueClassesFromStudents] = useState([]);
  
  // Kullanıcının rolünü ve okul ID'sini kontrol et
  const isSuperAdmin = currentUser?.role === 'superadmin';
  const userSchoolId = currentUser?.school?._id || currentUser?.schoolId;
  
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
    
    // Kullanıcı süperadmin değilse ve okul ID'si varsa, filtreyi otomatik ayarla
    if (!isSuperAdmin && userSchoolId) {
      setFilters(prev => ({ ...prev, schoolId: userSchoolId }));
    }
    
    fetchStudents();
    fetchSchools();
  }, [isAuthenticated, navigate, isSuperAdmin, userSchoolId]);

  useEffect(() => {
    if (filters.schoolId) {
      fetchClassesBySchool();
    } else {
      setClasses([]);
      setFilters(prev => ({ ...prev, classId: '' }));
    }
  }, [filters.schoolId]);

  // Öğrencilerden gelen verileri kullanarak benzersiz sınıf listesi oluştur
  useEffect(() => {
    if (students.length > 0) {
      // Öğrenci verilerinden benzersiz sınıfları çıkar
      const uniqueClasses = [];
      const classMap = new Map();
      
      students.forEach(student => {
        if (student.class && student.class._id && !classMap.has(student.class._id)) {
          classMap.set(student.class._id, true);
          uniqueClasses.push({
            _id: student.class._id,
            name: student.class.name,
            grade: parseInt(student.class.name) || 0
          });
        }
      });
      
      // Sınıfları sayısal olarak sırala
      const sortedClasses = [...uniqueClasses].sort((a, b) => {
        // Sınıf adından sayısal kısmı çıkarıyoruz (örn: "10-A" -> 10)
        const getClassNumber = (className) => {
          const match = className.name.match(/^(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        };
        
        return getClassNumber(a) - getClassNumber(b);
      });
      
      setUniqueClassesFromStudents(sortedClasses);
    }
  }, [students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getStudents();
      setStudents(response.data || []);
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
      // schoolId parametresini kaldırdık çünkü backend API'si kullanıcının okul bilgisini token'dan alıyor
      const response = await classApi.getClassesBySchool();
      
      // Sınıfları doğru sıralamak için (sayısal olarak, ör: 1-A, 5-A, 10-A şeklinde)
      const sortedClasses = [...(response.data || [])].sort((a, b) => {
        // Sınıf adından sayısal kısmı çıkarıyoruz (örn: "10-A" -> 10)
        const getClassNumber = (className) => {
          const match = className.name.match(/^(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        };
        
        return getClassNumber(a) - getClassNumber(b);
      });
      
      setClasses(sortedClasses);
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
    if (!Array.isArray(students)) {
      console.log('Students is not an array:', students);
      return [];
    }

    return students.filter(student => {
      const hasSchool = student.school && student.school._id;
      const hasClass = student.class && student.class._id;
      
      if (!hasSchool || !hasClass) {
        console.log('Student with missing data:', student);
        return false;
      }
      
      // Süperadmin olmayan kullanıcılar için kendi okullarındaki öğrencileri göster
      if (!isSuperAdmin && userSchoolId && student.school._id !== userSchoolId) {
        return false;
      }
      
      const matchesSchool = !filters.schoolId || student.school._id === filters.schoolId;
      const matchesClass = !filters.classId || student.class._id === filters.classId;
      
      const studentNumber = student.studentNumber ? student.studentNumber.toString().toLowerCase() : '';
      
      const matchesSearch = !filters.searchTerm || 
        student.firstName.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
        student.lastName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        studentNumber.includes(filters.searchTerm.toLowerCase());
      
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

  // API'den gelen sınıflar ve öğrenci verilerinden çıkarılan sınıfları birleştir
  const allClasses = [...classes];
  
  // Öğrenci verilerinden gelen sınıfları ekle (eğer API'de yoksa)
  uniqueClassesFromStudents.forEach(cls => {
    if (!allClasses.some(apiCls => apiCls._id === cls._id)) {
      allClasses.push(cls);
    }
  });
  
  // Birleştirilen sınıfları sayısal olarak sırala
  const sortedAllClasses = [...allClasses].sort((a, b) => {
    const getClassNumber = (className) => {
      const match = className.name.match(/^(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };
    
    return getClassNumber(a) - getClassNumber(b);
  });

  return (
    <div className="students-page">
      <div className="students-header">
        <h1>Öğrenci Yönetimi</h1>
        <div className="students-actions">
          <Link to="/students/import" className="button primary">
            <FiUpload className="button-icon" /> Excel ile Toplu Ekle
          </Link>
          <Link to="/students/new" className="button secondary">
            <FiPlus className="button-icon" /> Yeni Öğrenci
          </Link>
        </div>
      </div>

      <div className="students-filters">
        {/* Okul seçimi sadece süperadmin için görünür olsun */}
        {isSuperAdmin && (
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
        )}

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
            {sortedAllClasses.map(classItem => (
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

      {/* Okul yöneticisi/öğretmen için seçili okul bilgisini göster */}
      {!isSuperAdmin && userSchoolId && (
        <div className="selected-school-info">
          <p>
            <strong>Okul:</strong> {schools.find(s => s._id === userSchoolId)?.name || 'Yükleniyor...'}
          </p>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Öğrenciler yükleniyor...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="empty-state">
          <p>Öğrenci bulunamadı.</p>
          {students.length > 0 && (
            <p className="info-text">Filtreleri değiştirerek öğrencileri görüntüleyebilirsiniz.</p>
          )}
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
                      <FiEdit size={16} />
                    </Link>
                    <button 
                      className="delete-button" 
                      title="Sil"
                      onClick={() => handleDeleteStudent(student._id)}
                    >
                      <FiTrash2 size={16} color="white" />
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