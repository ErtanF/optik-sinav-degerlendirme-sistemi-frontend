import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    
    setErrors(formErrors);
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Burada gerçek API yerine geçici olarak kullanıyoruz
        // API entegrasyonu yapıldığında bu kısım değişecek
        setTimeout(() => {
          // Başarılı kayıt simülasyonu
          navigate('/login', { state: { message: 'Kayıt başarılı. Lütfen giriş yapın.' } });
        }, 1000);
      } catch (error) {
        setErrors({
          ...errors,
          general: 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="register-page">
      <h2 className="auth-title">Kayıt Ol</h2>
      
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