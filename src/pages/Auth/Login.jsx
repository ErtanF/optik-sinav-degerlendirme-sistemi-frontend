import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
          // Başarılı login simülasyonu
          login({ id: 1, name: 'Test User', email: formData.email }, 'fake-jwt-token');
          navigate('/dashboard');
        }, 1000);
      } catch (error) {
        setErrors({
          ...errors,
          general: 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="login-page">
      <h2 className="auth-title">Giriş Yap</h2>
      
      {errors.general && (
        <div className="error-alert">{errors.general}</div>
      )}
      
      <form onSubmit={handleSubmit} className="auth-form">
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
        
        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>
        </div>
        
        <div className="auth-links">
          <Link to="/register" className="auth-link">
            Hesabınız yok mu? Kayıt Olun
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;