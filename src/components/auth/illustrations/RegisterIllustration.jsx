import styles from '../auth.module.css';

const RegisterIllustration = () => {
  return (
    <svg 
      className={styles.illustrationSvg} 
      viewBox="0 0 500 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Kayıt İllüstrasyonu - Education Theme */}
      <defs>
        <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8f9fa" />
        </linearGradient>
        <linearGradient id="academicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#F7931E" />
        </linearGradient>
        <linearGradient id="userGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
        <linearGradient id="schoolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2196F3" />
          <stop offset="100%" stopColor="#1976D2" />
        </linearGradient>
      </defs>
      
      {/* Kayıt Formu */}
      <g transform="translate(50, 80)">
        <rect x="0" y="0" width="140" height="180" rx="8" fill="url(#paperGrad)" stroke="#e0e0e0" strokeWidth="2" />
        <rect x="10" y="10" width="120" height="10" fill="#3949ab" opacity="0.8" />
        <text x="70" y="18" fontSize="7" fill="white" fontWeight="600" textAnchor="middle">KAYIT FORMU</text>
        
        {/* Form alanları */}
        <rect x="15" y="30" width="110" height="12" fill="#f0f8ff" stroke="#ADE8F4" strokeWidth="1" />
        <text x="20" y="38" fontSize="5" fill="#666">Ad Soyad</text>
        
        <rect x="15" y="50" width="110" height="12" fill="#f0f8ff" stroke="#ADE8F4" strokeWidth="1" />
        <text x="20" y="58" fontSize="5" fill="#666">E-posta</text>
        
        <rect x="15" y="70" width="110" height="12" fill="#f0f8ff" stroke="#ADE8F4" strokeWidth="1" />
        <text x="20" y="78" fontSize="5" fill="#666">Okul Seçimi</text>
        
        <rect x="15" y="90" width="110" height="12" fill="#f0f8ff" stroke="#ADE8F4" strokeWidth="1" />
        <text x="20" y="98" fontSize="5" fill="#666">Şifre</text>
        
        <rect x="15" y="110" width="110" height="12" fill="#f0f8ff" stroke="#ADE8F4" strokeWidth="1" />
        <text x="20" y="118" fontSize="5" fill="#666">Şifre Tekrarı</text>
        
        {/* Kayıt butonu */}
        <rect x="30" y="140" width="80" height="20" rx="10" fill="url(#userGrad)" />
        <text x="70" y="152" fontSize="7" fill="white" fontWeight="600" textAnchor="middle">KAYIT OL</text>
      </g>
      
      {/* Okul Binası */}
      <g transform="translate(280, 120)">
        <rect x="0" y="50" width="120" height="80" fill="url(#schoolGrad)" />
        <rect x="10" y="40" width="100" height="15" fill="#1565C0" />
        <polygon points="5,40 60,15 115,40" fill="#0D47A1" />
        
        {/* Pencereler */}
        <rect x="15" y="60" width="12" height="15" fill="#ffffff" />
        <rect x="35" y="60" width="12" height="15" fill="#ffffff" />
        <rect x="55" y="60" width="12" height="15" fill="#ffffff" />
        <rect x="75" y="60" width="12" height="15" fill="#ffffff" />
        <rect x="95" y="60" width="12" height="15" fill="#ffffff" />
        
        <rect x="15" y="85" width="12" height="15" fill="#ffffff" />
        <rect x="35" y="85" width="12" height="15" fill="#ffffff" />
        <rect x="55" y="85" width="12" height="15" fill="#ffffff" />
        <rect x="75" y="85" width="12" height="15" fill="#ffffff" />
        <rect x="95" y="85" width="12" height="15" fill="#ffffff" />
        
        {/* Kapı */}
        <rect x="50" y="105" width="20" height="25" fill="#8D6E63" />
        <circle cx="52" cy="117" r="1" fill="#FFD700" />
        
        {/* Bayrak */}
        <rect x="90" y="20" width="2" height="25" fill="#8D6E63" />
        <rect x="92" y="20" width="15" height="10" fill="#f44336" />
      </g>
      
      {/* Öğrenci Figürleri */}
      <g transform="translate(40, 280)">
        {/* Öğrenci 1 */}
        <circle cx="25" cy="20" r="12" fill="#FFB74D" />
        <path d="M15,12 Q25,7 35,12 Q32,9 25,8 Q18,9 15,12" fill="#8D6E63" />
        <circle cx="22" cy="18" r="1.5" fill="#333" />
        <circle cx="28" cy="18" r="1.5" fill="#333" />
        <rect x="18" y="32" width="14" height="18" rx="7" fill="#E91E63" />
        <rect x="20" y="50" width="4" height="12" rx="2" fill="#AD1457" />
        <rect x="26" y="50" width="4" height="12" rx="2" fill="#AD1457" />
        
        {/* Öğrenci 2 */}
        <g transform="translate(40, 0)">
          <circle cx="25" cy="20" r="12" fill="#FFB74D" />
          <path d="M15,12 Q25,7 35,12 Q32,9 25,8 Q18,9 15,12" fill="#6D4C41" />
          <circle cx="22" cy="18" r="1.5" fill="#333" />
          <circle cx="28" cy="18" r="1.5" fill="#333" />
          <rect x="18" y="32" width="14" height="18" rx="7" fill="#2196F3" />
          <rect x="20" y="50" width="4" height="12" rx="2" fill="#1976D2" />
          <rect x="26" y="50" width="4" height="12" rx="2" fill="#1976D2" />
        </g>
        
        {/* Öğrenci 3 */}
        <g transform="translate(80, 0)">
          <circle cx="25" cy="20" r="12" fill="#FFB74D" />
          <path d="M15,12 Q25,7 35,12 Q32,9 25,8 Q18,9 15,12" fill="#4E342E" />
          <circle cx="22" cy="18" r="1.5" fill="#333" />
          <circle cx="28" cy="18" r="1.5" fill="#333" />
          <rect x="18" y="32" width="14" height="18" rx="7" fill="#4CAF50" />
          <rect x="20" y="50" width="4" height="12" rx="2" fill="#388E3C" />
          <rect x="26" y="50" width="4" height="12" rx="2" fill="#388E3C" />
        </g>
      </g>
      
      {/* Öğretmen */}
      <g transform="translate(350, 260)">
        <circle cx="30" cy="25" r="15" fill="#FFB74D" />
        <path d="M18,15 Q30,8 42,15 Q38,11 30,10 Q22,11 18,15" fill="#795548" />
        <circle cx="26" cy="22" r="2" fill="#333" />
        <circle cx="34" cy="22" r="2" fill="#333" />
        <path d="M24,32 Q30,36 36,32" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="20" y="40" width="20" height="25" rx="10" fill="#607D8B" />
        <rect x="12" y="50" width="8" height="18" rx="4" fill="#FFB74D" />
        <rect x="40" y="50" width="8" height="18" rx="4" fill="#FFB74D" />
        <rect x="26" y="65" width="4" height="18" rx="2" fill="#455A64" />
        <rect x="30" y="65" width="4" height="18" rx="2" fill="#455A64" />
        
        {/* Gözlük */}
        <circle cx="26" cy="22" r="4" fill="none" stroke="#333" strokeWidth="1" />
        <circle cx="34" cy="22" r="4" fill="none" stroke="#333" strokeWidth="1" />
        <line x1="30" y1="22" x2="30" y2="22" stroke="#333" strokeWidth="1" />
      </g>
      
      {/* Kitap Yığını */}
      <g transform="translate(200, 320)">
        <rect x="0" y="15" width="30" height="4" fill="#2196F3" rx="1" />
        <rect x="2" y="10" width="30" height="4" fill="#4CAF50" rx="1" />
        <rect x="1" y="5" width="30" height="4" fill="#FF9800" rx="1" />
        <rect x="3" y="0" width="30" height="4" fill="#9C27B0" rx="1" />
      </g>
      
      {/* Başarı yıldızları */}
      <g opacity="0.6">
        <g transform="translate(150, 50)">
          <polygon points="0,8 2,2 8,2 3,6 5,12 0,8 -5,12 -3,6 -8,2 -2,2" fill="#FFD700" />
        </g>
        <g transform="translate(400, 80)">
          <polygon points="0,6 1.5,1.5 6,1.5 2.25,4.5 3.75,9 0,6 -3.75,9 -2.25,4.5 -6,1.5 -1.5,1.5" fill="#FFD700" />
        </g>
        <g transform="translate(100, 200)">
          <polygon points="0,5 1,1 5,1 2,3 3,7 0,5 -3,7 -2,3 -5,1 -1,1" fill="#FFD700" />
        </g>
      </g>
      
      {/* Bağlantı çizgileri */}
      <g opacity="0.3">
        <path d="M190,160 Q220,140 250,160" fill="none" stroke="#ADE8F4" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M250,200 Q300,180 350,200" fill="none" stroke="#ADE8F4" strokeWidth="2" strokeDasharray="5,5" />
        <circle cx="200" cy="155" r="2" fill="#FF6B35" />
        <circle cx="240" cy="165" r="2" fill="#FF6B35" />
        <circle cx="340" cy="205" r="2" fill="#FF6B35" />
      </g>
    </svg>
  );
};

export default RegisterIllustration; 