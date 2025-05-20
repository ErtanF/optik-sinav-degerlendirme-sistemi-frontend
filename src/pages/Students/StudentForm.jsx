import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import studentApi from '../../api/students';
import schoolApi from '../../api/schools';
import classApi from '../../api/classes';
import { useAuth } from '../../hooks/useAuth';
import './StudentForm.css';

const StudentForm = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Kullanıcının rolünü ve okul ID'sini kontrol et
  const isSuperAdmin = currentUser?.role === 'superadmin';
  const userSchoolId = currentUser?.school?._id || currentUser?.schoolId;
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalId: '',
    studentNumber: '',
    schoolId: '',
    classId: ''
  });
  
  // Kimlik doğrulama kontrolü
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Bu sayfaya erişmek için giriş yapmanız gerekmektedir');
      navigate('/login');
      return;
    }
    
    // Süperadmin değilse ve okulId varsa, formData'yı otomatik ayarla
    if (!isSuperAdmin && userSchoolId && !isEditMode) {
      setFormData(prev => ({ ...prev, schoolId: userSchoolId }));
    }
  }, [isAuthenticated, navigate, isSuperAdmin, userSchoolId, isEditMode]);
  
  const fetchStudentData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await studentApi.getStudentById(id);
      const student = response.data;
      
      // Eğer süperadmin değilse ve öğrencinin okulu kullanıcının okulundan farklıysa
      if (!isSuperAdmin && student.school._id !== userSchoolId) {
        toast.error('Bu öğrenciyi düzenleme yetkiniz bulunmamaktadır');
        navigate('/students');
        return;
      }
      
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        nationalId: student.nationalId || '',
        studentNumber: student.studentNumber || '',
        schoolId: student.school._id,
        classId: student.class._id
      });
    } catch (error) {
      console.error('Error fetching student:', error);
      toast.error('Öğrenci bilgileri yüklenirken bir hata oluştu');
      navigate('/students');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, isSuperAdmin, userSchoolId]);
  
  // Fetch student data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchStudentData();
    }
    fetchSchools();
  }, [isEditMode, fetchStudentData]);
  
  // Fetch classes when school is selected
  useEffect(() => {
    if (formData.schoolId) {
      fetchClassesBySchool();
    } else {
      setClasses([]);
      setFormData(prev => ({ ...prev, classId: '' }));
    }
  }, [formData.schoolId]);
  
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
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('Ad ve soyad alanları zorunludur');
      return;
    }
    
    if (!formData.schoolId) {
      toast.error('Lütfen bir okul seçin');
      return;
    }
    
    if (!formData.classId) {
      toast.error('Lütfen bir sınıf seçin');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Süperadmin değilse, okul değiştirmeye izin verme
      const finalSchoolId = !isSuperAdmin ? userSchoolId : formData.schoolId;
      
      const studentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        nationalId: formData.nationalId,
        studentNumber: formData.studentNumber,
        schoolId: finalSchoolId,
        classId: formData.classId
      };
      
      if (isEditMode) {
        await studentApi.updateStudent(id, studentData);
        toast.success('Öğrenci başarıyla güncellendi');
      } else {
        await studentApi.addStudent(studentData);
        toast.success('Öğrenci başarıyla eklendi');
      }
      
      navigate('/students');
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error(isEditMode ? 'Öğrenci güncellenirken bir hata oluştu' : 'Öğrenci eklenirken bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Öğrenci bilgileri yükleniyor...</p>
      </div>
    );
  }
  
  return (
    <div className="student-form-page">
      <div className="student-form-header">
        <h1>{isEditMode ? 'Öğrenciyi Düzenle' : 'Yeni Öğrenci Ekle'}</h1>
      </div>
      
      <div className="student-form-container">
        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Ad *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Soyad *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nationalId">TC Kimlik No</label>
              <input
                type="text"
                id="nationalId"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                maxLength={11}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="studentNumber">Öğrenci Numarası</label>
              <input
                type="text"
                id="studentNumber"
                name="studentNumber"
                value={formData.studentNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            {/* Okul seçimi sadece süperadmin için, diğerleri için sadece görüntülenir */}
            <div className="form-group">
              <label htmlFor="schoolId">Okul *</label>
              {isSuperAdmin ? (
                <select
                  id="schoolId"
                  name="schoolId"
                  value={formData.schoolId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Okul Seçin</option>
                  {schools.map(school => (
                    <option key={school._id} value={school._id}>{school.name}</option>
                  ))}
                </select>
              ) : (
                <div className="form-display-value">
                  {schools.find(s => s._id === userSchoolId)?.name || 'Yükleniyor...'}
                  <input 
                    type="hidden" 
                    name="schoolId" 
                    value={userSchoolId || ''} 
                  />
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="classId">Sınıf *</label>
              <select
                id="classId"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                required
                disabled={!formData.schoolId}
              >
                <option value="">Sınıf Seçin</option>
                {classes.map(classItem => (
                  <option key={classItem._id} value={classItem._id}>{classItem.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="button secondary"
              onClick={() => navigate('/students')}
              disabled={submitting}
            >
              İptal
            </button>
            <button
              type="submit"
              className="button primary"
              disabled={submitting}
            >
              {submitting ? 'Kaydediliyor...' : (isEditMode ? 'Güncelle' : 'Kaydet')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm; 