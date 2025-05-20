import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import schoolApi from '../../api/schools';
import { useAuth } from '../../hooks/useAuth';
import './AdminForm.css';

const AdminForm = () => {
  const { id } = useParams(); // School ID
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolId: id
  });
  
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingSchool, setFetchingSchool] = useState(true);

  // Süperadmin kontrolü
  useEffect(() => {
    if (currentUser?.role !== 'superadmin') {
      navigate('/');
      toast.error('Bu sayfaya erişim izniniz yok');
    }
  }, [currentUser, navigate]);

  // Okul bilgilerini getir
  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setFetchingSchool(true);
        const response = await schoolApi.getSchoolById(id);
        const schoolData = response.data;
        
        // Okul zaten bir admine sahipse, listeye geri dön
        if (schoolData.admin) {
          toast.error('Bu okul zaten bir admine sahip');
          navigate('/schools');
          return;
        }
        
        setSchool(schoolData);
      } catch (error) {
        console.error('Okul bilgileri getirilirken hata oluştu:', error);
        toast.error('Okul bilgileri yüklenirken bir hata oluştu');
        navigate('/schools');
      } finally {
        setFetchingSchool(false);
      }
    };

    fetchSchool();
  }, [id, navigate]);

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
      toast.error('Admin adı gereklidir');
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error('Email adresi gereklidir');
      return;
    }
    
    if (!formData.password) {
      toast.error('Şifre gereklidir');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır');
      return;
    }
    
    try {
      setLoading(true);
      
      // Admin ekle
      await schoolApi.addAdmin({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        schoolId: formData.schoolId
      });
      
      toast.success('Admin başarıyla eklendi');
      navigate('/schools');
    } catch (error) {
      console.error('Admin eklenirken hata oluştu:', error);
      toast.error('Admin eklenirken bir hata oluştu');
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
    <div className="admin-form-container">
      <div className="admin-form-header">
        <h1>Okula Admin Ekle</h1>
        <p className="school-name">{school?.name}</p>
      </div>
      
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Admin Adı</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Admin adını girin"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Adresi</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email adresini girin"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Şifre</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Şifre girin"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Şifre Tekrar</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Şifreyi tekrar girin"
            required
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
              'Admin Ekle'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminForm; 