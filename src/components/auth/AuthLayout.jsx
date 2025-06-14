import { Link } from 'react-router-dom';
import AuthBrand from './AuthBrand';
import styles from './auth.module.css';

const AuthLayout = ({ children, illustration, illustrationText, showBackButton = false }) => {
  return (
    <div className={styles.authPage}>
      {/* Sol taraf - Logo ve İllüstrasyon */}
      <div className={styles.leftSection}>
        <AuthBrand />
        
        {illustration && (
          <div className={styles.illustrationArea}>
            {illustration}
            {illustrationText && (
              <p className={styles.illustrationText}>
                {illustrationText}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Sağ taraf - Form İçeriği */}
      <div className={styles.rightSection}>
        <div className={styles.authContainer}>
          {children}
          
          {showBackButton && (
            <div className={styles.backToHome}>
              <Link to="/" className={styles.backToHomeLink}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.backIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Ana Sayfaya Dön
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 