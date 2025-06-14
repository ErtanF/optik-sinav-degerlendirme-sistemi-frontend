import styles from '../auth.module.css';

const ForgotPasswordIllustration = () => {
  return (
    <svg 
      className={styles.illustrationSvg} 
      viewBox="0 0 500 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Şifre Sıfırlama İllüstrasyonu - Security Theme */}
      <defs>
        <linearGradient id="lockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#F7931E" />
        </linearGradient>
        <linearGradient id="securityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
        <linearGradient id="emailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2196F3" />
          <stop offset="100%" stopColor="#1976D2" />
        </linearGradient>
        <linearGradient id="keyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA000" />
        </linearGradient>
      </defs>
      
      {/* Ana Kilit Simgesi */}
      <g transform="translate(200, 80)">
        <rect x="20" y="40" width="60" height="80" rx="8" fill="url(#lockGrad)" />
        <rect x="30" y="50" width="40" height="60" rx="4" fill="#ffffff" opacity="0.9" />
        
        {/* Kilit halka */}
        <rect x="35" y="20" width="30" height="40" rx="15" fill="none" stroke="url(#lockGrad)" strokeWidth="6" />
        <rect x="40" y="25" width="20" height="30" rx="10" fill="none" stroke="#ffffff" strokeWidth="3" />
        
        {/* Anahtar deliği */}
        <circle cx="50" cy="75" r="6" fill="url(#lockGrad)" />
        <rect x="47" y="75" width="6" height="12" fill="url(#lockGrad)" />
        
        {/* Güvenlik ışığı */}
        <circle cx="50" cy="30" r="3" fill="#4CAF50" opacity="0.8" />
        <circle cx="50" cy="30" r="6" fill="none" stroke="#4CAF50" strokeWidth="1" opacity="0.5" />
        <circle cx="50" cy="30" r="9" fill="none" stroke="#4CAF50" strokeWidth="1" opacity="0.3" />
      </g>
      
      {/* E-posta Simgesi */}
      <g transform="translate(50, 200)">
        <rect x="0" y="20" width="80" height="50" rx="6" fill="url(#emailGrad)" />
        <rect x="5" y="25" width="70" height="40" rx="3" fill="#ffffff" />
        
        {/* E-posta içeriği */}
        <polygon points="5,25 40,45 75,25" fill="url(#emailGrad)" opacity="0.8" />
        <line x1="10" y1="35" x2="35" y2="35" stroke="#666" strokeWidth="2" />
        <line x1="10" y1="45" x2="30" y2="45" stroke="#666" strokeWidth="2" />
        <line x1="10" y1="55" x2="40" y2="55" stroke="#666" strokeWidth="2" />
        
        {/* @ simgesi */}
        <circle cx="60" cy="50" r="8" fill="none" stroke="url(#emailGrad)" strokeWidth="2" />
        <circle cx="60" cy="50" r="3" fill="url(#emailGrad)" />
        <path d="M68,45 Q72,45 72,50 Q72,55 68,55" fill="none" stroke="url(#emailGrad)" strokeWidth="2" />
      </g>
      
      {/* Anahtar Simgesi */}
      <g transform="translate(350, 220)">
        <ellipse cx="15" cy="15" rx="12" ry="8" fill="url(#keyGrad)" />
        <ellipse cx="15" cy="15" rx="8" ry="5" fill="none" stroke="#ffffff" strokeWidth="2" />
        <circle cx="15" cy="15" r="3" fill="#ffffff" />
        
        {/* Anahtar sapı */}
        <rect x="27" y="12" width="40" height="6" fill="url(#keyGrad)" />
        <rect x="60" y="8" width="4" height="6" fill="url(#keyGrad)" />
        <rect x="55" y="8" width="4" height="6" fill="url(#keyGrad)" />
        <rect x="65" y="14" width="4" height="8" fill="url(#keyGrad)" />
      </g>
      
      {/* Güvenlik Kalkanı */}
      <g transform="translate(120, 100)">
        <path d="M30,0 Q45,5 60,0 L60,30 Q45,45 30,30 Z" fill="url(#securityGrad)" />
        <path d="M35,8 Q45,12 55,8 L55,28 Q45,38 35,28 Z" fill="#ffffff" opacity="0.9" />
        
        {/* Onay işareti */}
        <path d="M40,20 L44,24 L50,16" fill="none" stroke="url(#securityGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      
      {/* Mobil Telefon */}
      <g transform="translate(320, 120)">
        <rect x="0" y="0" width="30" height="50" rx="5" fill="#333" />
        <rect x="3" y="8" width="24" height="34" rx="2" fill="#ffffff" />
        
        {/* Ekran içeriği */}
        <rect x="6" y="12" width="18" height="3" fill="url(#emailGrad)" />
        <rect x="6" y="18" width="15" height="2" fill="#666" />
        <rect x="6" y="22" width="18" height="2" fill="#666" />
        <rect x="6" y="26" width="12" height="2" fill="#666" />
        
        {/* Bildirim simgesi */}
        <circle cx="22" cy="16" r="4" fill="#f44336" />
        <text x="22" y="18" fontSize="4" fill="white" textAnchor="middle">!</text>
        
        {/* Home button */}
        <circle cx="15" cy="46" r="2" fill="#666" />
      </g>
      
      {/* Şifre Sıfırlama Formu */}
      <g transform="translate(80, 300)">
        <rect x="0" y="0" width="100" height="60" rx="8" fill="#ffffff" stroke="#e0e0e0" strokeWidth="2" />
        <rect x="8" y="8" width="84" height="6" fill="#3949ab" />
        <text x="50" y="14" fontSize="5" fill="white" fontWeight="600" textAnchor="middle">ŞİFRE SIFIRLA</text>
        
        {/* E-posta alanı */}
        <rect x="12" y="25" width="76" height="10" fill="#f0f8ff" stroke="#ADE8F4" strokeWidth="1" />
        <text x="16" y="32" fontSize="4" fill="#666">E-posta adresiniz</text>
        
        {/* Gönder butonu */}
        <rect x="30" y="42" width="40" height="12" rx="6" fill="url(#securityGrad)" />
        <text x="50" y="49" fontSize="5" fill="white" fontWeight="600" textAnchor="middle">GÖNDER</text>
      </g>
      
      {/* Güvenlik Noktaları */}
      <g opacity="0.6">
        <circle cx="100" cy="80" r="8" fill="url(#securityGrad)" />
        <text x="100" y="83" fontSize="8" fill="white" textAnchor="middle">✓</text>
        
        <circle cx="380" cy="90" r="6" fill="url(#keyGrad)" />
        <text x="380" y="93" fontSize="6" fill="white" textAnchor="middle">🔐</text>
        
        <circle cx="150" cy="380" r="5" fill="url(#emailGrad)" />
        <text x="150" y="383" fontSize="5" fill="white" textAnchor="middle">@</text>
        
        <circle cx="400" cy="300" r="7" fill="url(#lockGrad)" />
        <text x="400" y="303" fontSize="6" fill="white" textAnchor="middle">🔑</text>
      </g>
      
      {/* Veri Akışı */}
      <g opacity="0.4">
        <path d="M130,240 Q180,220 230,240" fill="none" stroke="#ADE8F4" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M270,180 Q320,160 370,180" fill="none" stroke="#ADE8F4" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M180,330 Q230,310 280,330" fill="none" stroke="#ADE8F4" strokeWidth="2" strokeDasharray="5,5" />
        
        {/* Animasyon noktaları */}
        <circle cx="150" cy="235" r="2" fill="#FF6B35" />
        <circle cx="210" cy="245" r="2" fill="#FF6B35" />
        <circle cx="290" cy="175" r="2" fill="#FF6B35" />
        <circle cx="350" cy="185" r="2" fill="#FF6B35" />
        <circle cx="200" cy="325" r="2" fill="#FF6B35" />
        <circle cx="260" cy="335" r="2" fill="#FF6B35" />
      </g>
      
      {/* Arka Plan Güvenlik Elementleri */}
      <g opacity="0.2">
        <rect x="20" y="20" width="8" height="8" fill="none" stroke="url(#securityGrad)" strokeWidth="1" transform="rotate(45 24 24)" />
        <rect x="450" y="50" width="6" height="6" fill="none" stroke="url(#emailGrad)" strokeWidth="1" transform="rotate(45 453 53)" />
        <rect x="50" y="350" width="10" height="10" fill="none" stroke="url(#lockGrad)" strokeWidth="1" transform="rotate(45 55 355)" />
        <rect x="420" y="350" width="7" height="7" fill="none" stroke="url(#keyGrad)" strokeWidth="1" transform="rotate(45 423.5 353.5)" />
      </g>
    </svg>
  );
};

export default ForgotPasswordIllustration; 