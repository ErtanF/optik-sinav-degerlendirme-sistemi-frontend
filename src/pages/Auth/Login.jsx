// src/pages/Auth/Login.jsx - Güncelleme
import './Login.css';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import authApi from '../../api/auth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Location state'inden mesajı al (kayıt başarılı mesajı gibi)
  const message = location.state?.message;
  
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
        // Gerçek API çağrısı
        const response = await authApi.login({
          email: formData.email,
          password: formData.password
        });
        
        // Başarılı login
        login(response.user, response.token);
        navigate('/dashboard');
      } catch (error) {
        setErrors({
          ...errors,
          general: error.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="login-page">
      <h2 className="auth-title">Giriş Yap</h2>
      
      {message && (
        <div className="success-alert">{message}</div>
      )}
      
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