import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import classApi from '../../api/classes';
import studentApi from '../../api/students';
import './AddStudentsToClass.css';

const AddStudentsToClass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [classData, setClassData] = useState(null);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchClassAndStudents();
  }, [id]);
  
  const fetchClassAndStudents = async () => {
    try {
      setLoading(true);
      
      // Fetch class details
      const classResponse = await classApi.getClassById(id);
      setClassData(classResponse.data);
      
      // Fetch all students from the same school but not in this class
      const schoolId = classResponse.data.school._id;
      const schoolStudentsResponse = await studentApi.getStudentsBySchool(schoolId);
      const classStudentsResponse = await studentApi.getStudentsByClass(id);
      
      // Filter out students already in this class
      const classStudentIds = classStudentsResponse.data.map(student => student._id);
      const filteredStudents = schoolStudentsResponse.data.filter(
        student => !classStudentIds.includes(student._id)
      );
      
      setAvailableStudents(filteredStudents || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Veri yüklenirken bir hata oluştu');
      navigate('/classes');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student._id));
    }
  };
  
  const handleSelect = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };
  
  const handleSubmit = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Lütfen en az bir öğrenci seçin');
      return;
    }
    
    try {
      setSubmitting(true);
      await studentApi.addStudentsToClass(id, selectedStudents);
      toast.success(`${selectedStudents.length} öğrenci sınıfa eklendi`);
      navigate(`/classes/detail/${id}`);
    } catch (error) {
      console.error('Error adding students to class:', error);
      toast.error('Öğrenciler sınıfa eklenirken bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Filter students based on search term
  const filteredStudents = availableStudents.filter(student => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           (student.studentNumber && student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()));
  });
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Veri yükleniyor...</p>
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
    <div className="add-students-page">
      <div className="add-students-header">
        <div className="add-students-breadcrumb">
          <Link to="/classes">Sınıflar</Link> {'>'} 
          <Link to={`/classes/detail/${id}`}>{classData.name}</Link> {'>'} 
          Öğrenci Ekle
        </div>
        <h1>Sınıfa Öğrenci Ekle: {classData.name}</h1>
        <div className="add-students-info">
          <span>Okul: {classData.school.name}</span>
          <span>Seviye: {classData.grade}. Sınıf</span>
        </div>
      </div>
      
      <div className="add-students-content">
        <div className="add-students-tools">
          <div className="search-box">
            <input
              type="text"
              placeholder="Öğrenci ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="select-all">
            <button 
              className="button small" 
              onClick={handleSelectAll}
            >
              {selectedStudents.length === filteredStudents.length && filteredStudents.length > 0 
                ? 'Tüm Seçimleri Kaldır' 
                : 'Tümünü Seç'}
            </button>
          </div>
        </div>
        
        {availableStudents.length === 0 ? (
          <div className="empty-state">
            <p>Bu okuldaki tüm öğrenciler zaten bu sınıfa atanmış.</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            <p>Arama kriterine uygun öğrenci bulunamadı.</p>
          </div>
        ) : (
          <div className="students-list">
            {filteredStudents.map(student => (
              <div 
                key={student._id} 
                className={`student-card ${selectedStudents.includes(student._id) ? 'selected' : ''}`}
                onClick={() => handleSelect(student._id)}
              >
                <div className="student-checkbox">
                  <input 
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => {}} // onChange required for controlled component
                  />
                </div>
                <div className="student-info">
                  <div className="student-name">
                    {student.firstName} {student.lastName}
                  </div>
                  <div className="student-details">
                    <span>{student.studentNumber || 'No numara'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="add-students-actions">
          <button
            type="button"
            className="button secondary"
            onClick={() => navigate(`/classes/detail/${id}`)}
            disabled={submitting}
          >
            İptal
          </button>
          <button
            type="button"
            className="button primary"
            onClick={handleSubmit}
            disabled={selectedStudents.length === 0 || submitting}
          >
            {submitting ? 'Ekleniyor...' : `${selectedStudents.length} Öğrenciyi Ekle`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudentsToClass; 