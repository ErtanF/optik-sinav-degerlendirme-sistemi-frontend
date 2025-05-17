import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit, FiPlus, FiMinusCircle } from 'react-icons/fi';
import classApi from '../../api/classes';
import studentApi from '../../api/students';
import './ClassDetail.css';

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const fetchClassData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch class details
      const classResponse = await classApi.getClassById(id);
      setClassData(classResponse.data);
      
      // Fetch students in this class
      const studentsResponse = await studentApi.getStudentsByClass(id);
      setStudents(studentsResponse.data || []);
    } catch (error) {
      console.error('Error fetching class details:', error);
      toast.error('Sınıf bilgileri yüklenirken bir hata oluştu');
      navigate('/classes');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);
  
  useEffect(() => {
    fetchClassData();
  }, [fetchClassData]);

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm('Bu öğrenciyi sınıftan çıkarmak istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      // API call to remove student from class
      await studentApi.removeFromClass(studentId);
      
      // Update the local state
      setStudents(students.filter(student => student._id !== studentId));
      toast.success('Öğrenci sınıftan çıkarıldı');
    } catch (error) {
      console.error('Error removing student from class:', error);
      toast.error('Öğrenci sınıftan çıkarılırken bir hata oluştu');
    }
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           (student.studentNumber && student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Sınıf bilgileri yükleniyor...</p>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="error-container">
        <p>Sınıf bulunamadı</p>
        <Link to="/classes" className="button secondary">Sınıf Listesine Dön</Link>
      </div>
    );
  }

  return (
    <div className="class-detail-page">
      <div className="class-detail-header">
        <div className="class-detail-breadcrumb">
          <Link to="/classes">Sınıflar</Link> {'>'} {classData.name}
        </div>
        <h1>{classData.name}</h1>
        <div className="class-detail-meta">
          <div className="class-detail-info">
            <span>Okul: {classData.school.name}</span>
            <span>Seviye: {classData.grade}. Sınıf</span>
            <span>Öğrenci Sayısı: {students.length}</span>
          </div>
          <div className="class-detail-actions">
            <Link to={`/classes/edit/${id}`} className="button secondary">
              <FiEdit className="button-icon" /> Sınıfı Düzenle
            </Link>
            <Link to={`/classes/add-students/${id}`} className="button primary">
              <FiPlus className="button-icon" /> Öğrenci Ekle
            </Link>
          </div>
        </div>
      </div>
      
      <div className="class-students-section">
        <div className="class-students-header">
          <h2>Sınıf Öğrencileri</h2>
          <div className="class-students-search">
            <input
              type="text"
              placeholder="Öğrenci ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {students.length === 0 ? (
          <div className="empty-state">
            <p>Bu sınıfta henüz öğrenci bulunmuyor.</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            <p>Arama kriterine uygun öğrenci bulunamadı.</p>
          </div>
        ) : (
          <div className="students-table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>Soyad</th>
                  <th>Öğrenci No</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student._id}>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.studentNumber || '-'}</td>
                    <td className="action-buttons">
                      <Link 
                        to={`/students/edit/${student._id}`} 
                        className="edit-button" 
                        title="Düzenle"
                      >
                        <FiEdit size={16} />
                      </Link>
                      <button 
                        className="remove-button" 
                        title="Sınıftan Çıkar"
                        onClick={() => handleRemoveStudent(student._id)}
                      >
                        <FiMinusCircle size={16} color="white" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetail; 