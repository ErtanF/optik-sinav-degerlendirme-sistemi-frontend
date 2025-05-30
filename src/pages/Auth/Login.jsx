// src/pages/Auth/Login.jsx - Güncelleme
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import AuthLayout from '../../components/auth/AuthLayout';
import PasswordInput from '../../components/auth/PasswordInput';
import LoginIllustration from '../../components/auth/illustrations/LoginIllustration';
import useAuthForm from '../../hooks/useAuthForm';
import { useAuth } from '../../hooks/useAuth';
import authApi from '../../api/auth';
import styles from '../../components/auth/auth.module.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation rules
  const validationRules = {
    email: true,
    password: true
  };

  // Initialize form with remember me functionality
  const initialData = {
    email: '',
    password: '',
    rememberMe: false
  };

  const { formData, errors, handleChange, setError, validateForm, setFormData } = useAuthForm(initialData, validationRules);

  // Location state message (from successful registration)
  const message = location.state?.message;
  
  // Load remember me data on component mount
  useEffect(() => {
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    const savedEmail = savedRememberMe ? localStorage.getItem('userEmail') || '' : '';
    
    setFormData(prev => ({
      ...prev,
      email: savedEmail,
      rememberMe: savedRememberMe
    }));
  }, [setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const response = await authApi.login({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe
        });        
        
        // Save remember me preference
        localStorage.setItem('rememberMe', formData.rememberMe);
        if (formData.rememberMe) {
          localStorage.setItem('userEmail', formData.email);
        } else {
          localStorage.removeItem('userEmail');
        }
        
        // Successful login
        login(response.user, response.token, formData.rememberMe);
        navigate('/');
      } catch (error) {
        setError('general', error.response?.data?.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <AuthLayout 
      illustration={<LoginIllustration />}
      illustrationText="Optik sınav değerlendirme sistemiyle eğitimde dijital dönüşümü yaşayın. Hızlı, güvenilir ve kolay kullanım."
      showBackButton={true}
    >
      <div className={styles.authHeader}>
        <h2 className={styles.authTitle}>Hesabınıza giriş yapın</h2>
        <p className={styles.authSubtitle}>Hoş geldiniz! Kayıt olurken girdiğiniz bilgilerle giriş yapın</p>
      </div>

      {message && <div className={styles.successAlert}>{message}</div>}
      {errors.general && <div className={styles.errorAlert}>{errors.general}</div>}

      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.inputLabel}>
            E-posta<span className={styles.requiredMark}>*</span>
              </label>
              <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
                placeholder="ornek@example.com"
            className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
              autoComplete="email"
              required
          />
          {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
            </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.inputLabel}>
            Şifre<span className={styles.requiredMark}>*</span>
            </label>
          <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Şifrenizi girin"
            error={errors.password}
                autoComplete="current-password"
                required
              />
          {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
          </div>

        <div className={styles.rememberMeContainer}>
          <label className={styles.rememberMeLabel}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              className={styles.rememberMeCheckbox}
              />
            <span>Beni hatırla</span>
            </label>
          <Link to="/forgotPassword" className={styles.forgotPasswordLink}>
              Şifremi unuttum
            </Link>
          </div>

        <div className={styles.formActions}>
            <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isSubmitting}
            >
              {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Button>
          </div>
          </form>

      <div className={styles.authLinks}>
            <span style={{ color: 'var(--text-color-light)' }}>Hesabınız yok mu? </span>
        <Link to="/register" className={styles.authLink}>
              Kayıt Ol
            </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;