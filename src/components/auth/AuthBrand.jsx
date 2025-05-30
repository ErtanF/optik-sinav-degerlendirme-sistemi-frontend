import styles from './auth.module.css';

const AuthBrand = () => {
  return (
    <div className={styles.brandLogo}>
      <div className={styles.logoIcon}>
        <svg width="80" height="80" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3949ab" />
              <stop offset="70%" stopColor="#1a237e" />
              <stop offset="100%" stopColor="#0d1654" />
            </linearGradient>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f44336" />
              <stop offset="100%" stopColor="#b71c1c" />
            </linearGradient>
          </defs>
          
          <circle cx="150" cy="150" r="125" fill="url(#logoGradient)" />
          <circle cx="150" cy="150" r="95" fill="#0d1654" />
          
          <path d="M150,70 L165,115 L125,87 L175,87 L135,115 Z" fill="url(#redGradient)" />
          
          <rect x="100" y="130" width="100" height="70" rx="5" fill="#0a1144" opacity="0.7" />
          <rect x="100" y="150" width="100" height="3" fill="#ffffff" opacity="0.8" />
          
          <g opacity="0.9">
            <circle cx="115" cy="145" r="6" fill="#ffffff" />
            <circle cx="135" cy="145" r="6" fill="#ffffff" />
            <circle cx="155" cy="145" r="6" fill="#ffffff" />
            <circle cx="175" cy="145" r="6" fill="#ffffff" />
            
            <circle cx="115" cy="165" r="6" fill="#ffffff" />
            <circle cx="135" cy="165" r="6" fill="url(#redGradient)" />
            <circle cx="155" cy="165" r="6" fill="#ffffff" />
            <circle cx="175" cy="165" r="6" fill="url(#redGradient)" />
            
            <circle cx="115" cy="185" r="6" fill="url(#redGradient)" />
            <circle cx="135" cy="185" r="6" fill="#ffffff" />
            <circle cx="155" cy="185" r="6" fill="url(#redGradient)" />
            <circle cx="175" cy="185" r="6" fill="#ffffff" />
          </g>
        </svg>
      </div>
      <div className={styles.brandText}>
        <h1 className={styles.brandName}>
          <span style={{ color: '#3949ab' }}>OP</span>
          <span style={{ color: '#e53935' }}>TÜRK</span>
        </h1>
        <p className={styles.brandSlogan}>Akıllı Optik Form Çözümleri</p>
      </div>
    </div>
  );
};

export default AuthBrand; 