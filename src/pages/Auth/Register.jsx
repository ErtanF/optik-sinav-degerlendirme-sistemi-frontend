// src/pages/Auth/Register.jsx - Güncelleme
import './Register.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import authApi from '../../api/auth';
import schoolApi from '../../api/schools';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolId: ''
  });
  
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Okulları yükle
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const schoolsData = await schoolApi.getAllSchools();
        console.log('Schools data from API:', schoolsData); // Debug logging
        
        // Ensuring we have the correct data structure
        if (schoolsData && schoolsData.data && Array.isArray(schoolsData.data)) {
          setSchools(schoolsData.data);
        } else {
          console.error('Schools data is not in expected format:', schoolsData);
          setSchools([]);
        }
      } catch (error) {
        setErrors({
          ...errors,
          general: 'Okullar yüklenirken bir hata oluştu.'
        });
        console.error('Okullar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchools();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;
    
    if (!formData.name) {
      formErrors.name = 'Ad Soyad gereklidir';
      isValid = false;
    }
    
    if (!formData.email) {
      formErrors.email = 'E-posta adresi gereklidir';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = 'Geçerli bir e-posta adresi giriniz';
      isValid = false;
    }
    
    if (!formData.password) {
      formErrors.password = 'Şifre gereklidir';
      isValid = false;
    } else if (formData.password.length < 6) {
      formErrors.password = 'Şifre en az 6 karakter olmalıdır';
      isValid = false;
    }
    
    if (!formData.confirmPassword) {
      formErrors.confirmPassword = 'Şifre tekrarı gereklidir';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Şifreler eşleşmiyor';
      isValid = false;
    }
    
    if (!formData.schoolId) {
      formErrors.schoolId = 'Lütfen bir okul seçin';
      isValid = false;
    }
    
    setErrors(formErrors);
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Gerçek API çağrısı
        await authApi.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          schoolId: formData.schoolId
        });
        
        // Başarılı kayıt, login sayfasına yönlendir
        navigate('/login', { 
          state: { message: 'Kayıt başarılı. Lütfen giriş yapın. Öğretmen hesabınız okul yöneticisi tarafından onaylandıktan sonra giriş yapabilirsiniz.' } 
        });
      } catch (error) {
        setErrors({
          ...errors,
          general: error.response?.data?.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="register-page">

      {errors.general && (
        <div className="error-alert">{errors.general}</div>
      )}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <Input
          type="text"
          label="Ad Soyad"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Adınızı ve soyadınızı girin"
          error={errors.name}
          required
        />
        
        <Input
          type="email"
          label="E-posta"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="E-posta adresinizi girin"
          error={errors.email}
          required
        />
        
        <div className="form-group">
          <label htmlFor="schoolId" className="input-label">
            Okul
            <span className="required-mark">*</span>
          </label>
          <select
            id="schoolId"
            name="schoolId"
            value={formData.schoolId}
            onChange={handleChange}
            className={`input-field ${errors.schoolId ? 'input-error' : ''}`}
            disabled={loading || schools.length === 0}
            required
          >            <option value="">Okul Seçin</option>            {Array.isArray(schools) && schools.map((school, index) => (
              <option key={school._id || school.id || index} value={school._id || school.id}>
                {school.name}
              </option>
            ))}
          </select>
          {errors.schoolId && <div className="error-message">{errors.schoolId}</div>}
          {loading && <div className="info-message">Okullar yükleniyor...</div>}
          {!loading && schools.length === 0 && (
            <div className="info-message">Henüz kayıtlı okul bulunmuyor.</div>
          )}
        </div>
        
        <Input
          type="password"
          label="Şifre"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Şifrenizi girin"
          error={errors.password}
          required
        />
        
        <Input
          type="password"
          label="Şifre Tekrarı"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Şifrenizi tekrar girin"
          error={errors.confirmPassword}
          required
        />
        
        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
          </Button>
        </div>
        
        <div className="auth-links">
          <Link to="/login" className="auth-link">
            Zaten hesabınız var mı? Giriş Yapın
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;