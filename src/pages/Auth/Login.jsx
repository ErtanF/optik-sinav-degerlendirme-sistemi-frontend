// src/pages/Auth/Login.jsx - Güncelleme
import './Login.css';
import { useState, useEffect } from 'react';
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
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Location state'inden mesajı al (kayıt başarılı mesajı gibi)
  const message = location.state?.message;
  
  // Component mount olduğunda localStorage'dan rememberMe değerini kontrol et
  useEffect(() => {
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    const savedEmail = savedRememberMe ? localStorage.getItem('userEmail') || '' : '';
    
    setFormData(prevState => ({
      ...prevState,
      email: savedEmail,
      rememberMe: savedRememberMe
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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
          password: formData.password,
          rememberMe: formData.rememberMe
        });        
        
        // Beni hatırla seçeneğini localStorage'a kaydet
        localStorage.setItem('rememberMe', formData.rememberMe);
        if (formData.rememberMe) {
          localStorage.setItem('userEmail', formData.email);
        } else {
          localStorage.removeItem('userEmail');
        }
        
        // Başarılı login
        login(response.user, response.token, formData.rememberMe);
        navigate('/');
      } catch (error) {
        setErrors({
          ...errors,
          general: error.response?.data?.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
      <div className="login-page">
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

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Şifre
              <span className="required-mark">*</span>
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Şifrenizi girin"
                className={`input-field ${errors.password ? 'input-error' : ''}`}
                required
              />
              <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Parolayı gizle" : "Parolayı göster"}
              >
                  {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                  )}
              </button>
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="remember-me-container">
            <label className="remember-me-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="remember-me-checkbox"
              />
              <span className="remember-me-text">Beni hatırla</span>
            </label>
            <Link to="/forgotPassword" className="auth-link forgot-password-link">
              Şifremi unuttum
            </Link>
          </div>

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

          <div className="auth-divider">
            <span>veya</span>
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