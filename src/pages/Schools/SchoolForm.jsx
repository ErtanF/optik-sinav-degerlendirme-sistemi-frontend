import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import schoolApi from '../../api/schools';
import { useAuth } from '../../hooks/useAuth';
import './SchoolForm.css';

const SchoolForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchingSchool, setFetchingSchool] = useState(isEditMode);

  // Süperadmin kontrolü
  useEffect(() => {
    if (currentUser?.role !== 'superadmin') {
      navigate('/');
      toast.error('Bu sayfaya erişim izniniz yok');
    }
  }, [currentUser, navigate]);

  // Düzenleme modunda okul bilgilerini getir
  useEffect(() => {
    const fetchSchool = async () => {
      if (isEditMode) {
        try {
          setFetchingSchool(true);
          const response = await schoolApi.getSchoolById(id);
          const school = response.data;
          
          setFormData({
            name: school.name || '',
            city: school.city || '',
            address: school.address || ''
          });
        } catch (error) {
          console.error('Okul bilgileri getirilirken hata oluştu:', error);
          toast.error('Okul bilgileri yüklenirken bir hata oluştu');
          navigate('/schools');
        } finally {
          setFetchingSchool(false);
        }
      }
    };

    fetchSchool();
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validasyonu
    if (!formData.name.trim()) {
      toast.error('Okul adı gereklidir');
      return;
    }
    
    if (!formData.city.trim()) {
      toast.error('Şehir bilgisi gereklidir');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isEditMode) {
        // Okul güncelleme
        await schoolApi.updateSchool(id, formData);
        toast.success('Okul bilgileri başarıyla güncellendi');
      } else {
        // Yeni okul ekleme
        await schoolApi.addSchool(formData);
        toast.success('Okul başarıyla eklendi');
      }
      
      navigate('/schools');
    } catch (error) {
      console.error('Okul kaydedilirken hata oluştu:', error);
      toast.error(isEditMode 
        ? 'Okul güncellenirken bir hata oluştu' 
        : 'Okul eklenirken bir hata oluştu'
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchingSchool) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="school-form-container">
      <div className="school-form-header">
        <h1>{isEditMode ? 'Okul Düzenle' : 'Yeni Okul Ekle'}</h1>
      </div>
      
      <form className="school-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Okul Adı</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Okul adını girin"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="city">Şehir</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Şehir adını girin"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Adres</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Okul adresini girin"
            rows={4}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/schools')}
          >
            İptal
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="button-spinner"></span>
            ) : (
              isEditMode ? 'Güncelle' : 'Ekle'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SchoolForm; 