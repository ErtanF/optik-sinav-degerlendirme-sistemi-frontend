// src/pages/Auth/Register.jsx - Güncelleme
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import AuthLayout from '../../components/auth/AuthLayout';
import PasswordInput from '../../components/auth/PasswordInput';
import RegisterIllustration from '../../components/auth/illustrations/RegisterIllustration';
import useAuthForm from '../../hooks/useAuthForm';
import authApi from '../../api/auth';
import schoolApi from '../../api/schools';
import styles from '../../components/auth/auth.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form validation rules
  const validationRules = {
    name: true,
    email: true,
    password: { minLength: 6 },
    confirmPassword: true,
    schoolId: true
  };

  // Initialize form data
  const initialData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolId: ''
  };

  const { formData, errors, handleChange, setError, validateForm } = useAuthForm(initialData, validationRules);
  
  // Load schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const schoolsData = await schoolApi.getAllSchools();
        
        if (schoolsData && schoolsData.data && Array.isArray(schoolsData.data)) {
          setSchools(schoolsData.data);
        } else {
          console.error('Schools data is not in expected format:', schoolsData);
          setSchools([]);
        }
      } catch (error) {
        setError('general', 'Okullar yüklenirken bir hata oluştu.');
        console.error('Okullar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchools();
  }, []); // Empty dependency array - only run once on mount
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        await authApi.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          schoolId: formData.schoolId
        });
        
        // Successful registration, redirect to login
        navigate('/login', { 
          state: { message: 'Kayıt başarılı. Lütfen giriş yapın. Öğretmen hesabınız okul yöneticisi tarafından onaylandıktan sonra giriş yapabilirsiniz.' } 
        });
      } catch (error) {
        setError('general', error.response?.data?.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <AuthLayout 
      illustration={<RegisterIllustration />}
      illustrationText="Eğitim ailemize katılın! Öğretmen hesabınızı oluşturun ve optik sınav değerlendirme sisteminin avantajlarından yararlanın."
    >
      <div className={styles.authHeader}>
        <h2 className={styles.authTitle}>Yeni hesap oluşturun</h2>
        <p className={styles.authSubtitle}>Öğretmen hesabınızı oluşturarak sisteme dahil olun</p>
      </div>

      {errors.general && <div className={styles.errorAlert}>{errors.general}</div>}
      
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.inputLabel}>
            Ad Soyad<span className={styles.requiredMark}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Adınızı ve soyadınızı girin"
            className={`${styles.inputField} ${errors.name ? styles.inputError : ''}`}
            required
          />
          {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
        </div>
        
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
            placeholder="E-posta adresinizi girin"
            className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
            required
          />
          {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="schoolId" className={styles.inputLabel}>
            Okul<span className={styles.requiredMark}>*</span>
          </label>
          <select
            id="schoolId"
            name="schoolId"
            value={formData.schoolId}
            onChange={handleChange}
            className={`${styles.inputField} ${errors.schoolId ? styles.inputError : ''}`}
            disabled={loading || schools.length === 0}
            required
          >
            <option value="">Okul Seçin</option>
            {Array.isArray(schools) && schools.map((school, index) => (
              <option key={school._id || school.id || index} value={school._id || school.id}>
                {school.name}
              </option>
            ))}
          </select>
          {errors.schoolId && <div className={styles.errorMessage}>{errors.schoolId}</div>}
          {loading && <div className={styles.infoMessage}>Okullar yükleniyor...</div>}
          {!loading && schools.length === 0 && (
            <div className={styles.infoMessage}>Henüz kayıtlı okul bulunmuyor.</div>
          )}
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
            placeholder="Şifrenizi girin (en az 6 karakter)"
            error={errors.password}
            required
          />
          {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword" className={styles.inputLabel}>
            Şifre Tekrarı<span className={styles.requiredMark}>*</span>
          </label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Şifrenizi tekrar girin"
            error={errors.confirmPassword}
            required
          />
          {errors.confirmPassword && <div className={styles.errorMessage}>{errors.confirmPassword}</div>}
        </div>
        
        <div className={styles.formActions}>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
          </Button>
        </div>
        
        <div className={styles.authLinks}>
          <span style={{ color: 'var(--text-color-light)' }}>Zaten hesabınız var mı? </span>
          <Link to="/login" className={styles.authLink}>
            Giriş Yapın
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;