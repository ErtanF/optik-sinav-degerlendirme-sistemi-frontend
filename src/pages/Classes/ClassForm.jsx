import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import classApi from '../../api/classes';
import schoolApi from '../../api/schools';
import './ClassForm.css';

const ClassForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [schools, setSchools] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    grade: 1,
    school: ''
  });
  
  // Sınıf seviyesi için seçenekler (1-12)
  const gradeOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  
  const fetchClassData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await classApi.getClassById(id);
      const classData = response.data;
      
      setFormData({
        name: classData.name,
        grade: classData.grade,
        school: classData.school._id
      });
    } catch (error) {
      console.error('Error fetching class:', error);
      toast.error('Sınıf bilgileri yüklenirken bir hata oluştu');
      navigate('/classes');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);
  
  // Fetch class data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchClassData();
    }
    fetchSchools();
  }, [isEditMode, fetchClassData]);
  
  const fetchSchools = async () => {
    try {
      const response = await schoolApi.getAllSchools();
      setSchools(response.data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast.error('Okullar yüklenirken bir hata oluştu');
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'grade' ? parseInt(value, 10) : value 
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Sınıf adı zorunludur');
      return;
    }
    
    if (!formData.school) {
      toast.error('Lütfen bir okul seçin');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const classData = {
        name: formData.name,
        grade: formData.grade,
        school: formData.school
      };
      
      if (isEditMode) {
        await classApi.updateClass(id, classData);
        toast.success('Sınıf başarıyla güncellendi');
      } else {
        await classApi.addClass(classData);
        toast.success('Sınıf başarıyla eklendi');
      }
      
      navigate('/classes');
    } catch (error) {
      console.error('Error saving class:', error);
      
      // Check if it's a duplicate class name error
      if (error.response && error.response.data && error.response.data.message.includes('already exists')) {
        toast.error('Bu isimde bir sınıf zaten var');
      } else {
        toast.error(isEditMode ? 'Sınıf güncellenirken bir hata oluştu' : 'Sınıf eklenirken bir hata oluştu');
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Sınıf bilgileri yükleniyor...</p>
      </div>
    );
  }
  
  return (
    <div className="class-form-page">
      <div className="class-form-header">
        <h1>{isEditMode ? 'Sınıfı Düzenle' : 'Yeni Sınıf Ekle'}</h1>
      </div>
      
      <div className="class-form-container">
        <form onSubmit={handleSubmit} className="class-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Sınıf Adı *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Örn: 9-A, 5-C"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="grade">Sınıf Seviyesi *</label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
              >
                {gradeOptions.map(grade => (
                  <option key={grade} value={grade}>{grade}. Sınıf</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="school">Okul *</label>
              <select
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                required
              >
                <option value="">Okul Seçin</option>
                {schools.map(school => (
                  <option key={school._id} value={school._id}>{school.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="button secondary"
              onClick={() => navigate('/classes')}
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

export default ClassForm; 