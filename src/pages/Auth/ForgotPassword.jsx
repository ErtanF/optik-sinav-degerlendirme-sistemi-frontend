import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import AuthLayout from '../../components/auth/AuthLayout';
import ForgotPasswordIllustration from '../../components/auth/illustrations/ForgotPasswordIllustration';
import useAuthForm from '../../hooks/useAuthForm';
import authApi from '../../api/auth';
import styles from '../../components/auth/auth.module.css';

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form validation rules
  const validationRules = {
    email: true
  };

  // Initialize form data
  const initialData = {
    email: ''
  };

  const { formData, errors, handleChange, setError, validateForm } = useAuthForm(initialData, validationRules);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        await authApi.forgotPassword({ email: formData.email });
        setIsSubmitted(true);
      } catch (error) {
        setError('general', error.response?.data?.message || 'Şifre sıfırlama isteği başarısız. Lütfen e-posta adresinizi kontrol edin.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout 
        illustration={<ForgotPasswordIllustration />}
        illustrationText="Güvenliğiniz bizim için önemli. E-postanızı kontrol edin ve şifre sıfırlama bağlantısına tıklayın."
      >
        <div className={styles.authHeader}>
          <h2 className={styles.authTitle}>E-posta gönderildi!</h2>
          <p className={styles.authSubtitle}>Şifre sıfırlama bağlantısını e-posta adresinize gönderdik</p>
        </div>

        <div className={styles.successAlert}>
          E-posta adresinize şifre sıfırlama bağlantısı gönderilmiştir. 
          Lütfen e-posta kutunuzu (spam klasörünü de) kontrol edin.
        </div>

        <div className={styles.formDescription}>
          <strong>Sonraki adımlar:</strong><br />
          1. E-posta kutunuzu kontrol edin<br />
          2. Şifre sıfırlama bağlantısına tıklayın<br />
          3. Yeni şifrenizi belirleyin<br />
          4. Sisteme giriş yapın
        </div>

        <div className={styles.authLinks}>
          <Link to="/login" className={styles.authLink}>
            Giriş sayfasına dön
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      illustration={<ForgotPasswordIllustration />}
      illustrationText="Güvenliğiniz bizim için önemli. E-postanızı kontrol edin ve şifre sıfırlama bağlantısına tıklayın."
    >
      <div className={styles.authHeader}>
        <h2 className={styles.authTitle}>Şifrenizi mi unuttunuz?</h2>
        <p className={styles.authSubtitle}>E-posta adresinizi girin, şifre sıfırlama bağlantısını göndereceğiz</p>
      </div>

      {errors.general && <div className={styles.errorAlert}>{errors.general}</div>}

      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.inputLabel}>
            E-posta Adresi<span className={styles.requiredMark}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Kayıtlı e-posta adresinizi girin"
            className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
            required
          />
          {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
        </div>

        <div className={styles.formActions}>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
          </Button>
        </div>
      </form>

      <div className={styles.authLinks}>
        <span style={{ color: 'var(--text-color-light)' }}>Şifrenizi hatırladınız mı? </span>
        <Link to="/login" className={styles.authLink}>
          Giriş yapın
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword; 