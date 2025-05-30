import styles from '../auth.module.css';

const LoginIllustration = () => {
  return (
    <svg 
      className={styles.illustrationSvg} 
      viewBox="0 0 500 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Modern Çizim/İllüstrasyon SVG */}
      <defs>
        <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8f9fa" />
        </linearGradient>
        <linearGradient id="scannerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#90E0EF" />
          <stop offset="100%" stopColor="#48CAE4" />
        </linearGradient>
        <linearGradient id="academicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#F7931E" />
        </linearGradient>
        <linearGradient id="correctGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
      </defs>
      
      {/* Optik Tarayıcı Makinesi */}
      <rect x="300" y="120" width="120" height="80" rx="8" fill="url(#scannerGrad)" />
      <rect x="310" y="130" width="100" height="60" rx="4" fill="#ffffff" />
      <rect x="315" y="135" width="90" height="50" rx="2" fill="#e8f4f8" />
      
      {/* Tarayıcı ışığı */}
      <rect x="315" y="155" width="90" height="3" fill="#FF6B35" opacity="0.8" />
      <rect x="315" y="165" width="90" height="1" fill="#FF6B35" opacity="0.6" />
      
      {/* Optik Form Kağıtları */}
      <g transform="translate(80, 100)">
        {/* Ana Optik Form */}
        <rect x="0" y="0" width="120" height="160" rx="6" fill="url(#paperGrad)" stroke="#e0e0e0" strokeWidth="2" />
        
        {/* Form başlığı */}
        <rect x="10" y="10" width="100" height="8" fill="#023E8A" opacity="0.8" />
        <rect x="10" y="22" width="80" height="4" fill="#666" opacity="0.6" />
        
        {/* Öğrenci bilgi alanı */}
        <rect x="10" y="35" width="100" height="20" fill="#f0f8ff" stroke="#ADE8F4" strokeWidth="1" />
        <text x="15" y="47" fontSize="6" fill="#023E8A" fontWeight="600">ÖĞRENCİ BİLGİLERİ</text>
        
        {/* Optik balonlar - Soru 1 */}
        <g transform="translate(15, 65)">
          <text x="0" y="8" fontSize="7" fill="#333" fontWeight="600">1.</text>
          <circle cx="15" cy="5" r="4" fill="none" stroke="#666" strokeWidth="1" />
          <circle cx="25" cy="5" r="4" fill="url(#correctGrad)" stroke="#4CAF50" strokeWidth="1" />
          <circle cx="35" cy="5" r="4" fill="none" stroke="#666" strokeWidth="1" />
          <circle cx="45" cy="5" r="4" fill="none" stroke="#666" strokeWidth="1" />
          <circle cx="55" cy="5" r="4" fill="none" stroke="#666" strokeWidth="1" />
          <text x="12" y="2" fontSize="5" fill="#333">A</text>
          <text x="22" y="2" fontSize="5" fill="white" fontWeight="600">B</text>
          <text x="32" y="2" fontSize="5" fill="#333">C</text>
          <text x="42" y="2" fontSize="5" fill="#333">D</text>
          <text x="52" y="2" fontSize="5" fill="#333">E</text>
        </g>
        
        {/* Optik balonlar - Soru 2 */}
        <g transform="translate(15, 80)">
          <text x="0" y="8" fontSize="7" fill="#333" fontWeight="600">2.</text>
          <circle cx="15" cy="5" r="4" fill="url(#correctGrad)" stroke="#4CAF50" strokeWidth="1" />
          <circle cx="25" cy="5" r="4" fill="none" stroke="#666" strokeWidth="1" />
          <circle cx="35" cy="5" r="4" fill="none" stroke="#666" strokeWidth="1" />
          <circle cx="45" cy="5" r="4" fill="none" stroke="#666" strokeWidth="1" />
          <circle cx="55" cy="5" r="4" fill="none" stroke="#666" strokeWidth="1" />
          <text x="12" y="2" fontSize="5" fill="white" fontWeight="600">A</text>
          <text x="22" y="2" fontSize="5" fill="#333">B</text>
          <text x="32" y="2" fontSize="5" fill="#333">C</text>
          <text x="42" y="2" fontSize="5" fill="#333">D</text>
          <text x="52" y="2" fontSize="5" fill="#333">E</text>
        </g>
        
        {/* Optik balonlar - Soru 3 */}
        <g transform="translate(15, 95)">
          <text x="0" y="8" fontSize="7" fill="#333" fontWeight="600">3.</text>
          <circle cx="15" cy="5" r="4" fill="none" stroke="#666" strokeWidth="1" />
          <circle cx="25" cy="5" r="4" fill="none" stroke="#666" strokeWidth="1" />
          <circle cx="35" cy="5" r="4" fill="none" stroke="#666" strokeWidth="1" />
          <circle cx="45" cy="5" r="4" fill="url(#correctGrad)" stroke="#4CAF50" strokeWidth="1" />
          <circle cx="55" cy="5" r="4" fill="none" stroke="#666" strokeWidth="1" />
          <text x="12" y="2" fontSize="5" fill="#333">A</text>
          <text x="22" y="2" fontSize="5" fill="#333">B</text>
          <text x="32" y="2" fontSize="5" fill="#333">C</text>
          <text x="42" y="2" fontSize="5" fill="white" fontWeight="600">D</text>
          <text x="52" y="2" fontSize="5" fill="#333">E</text>
        </g>
        
        {/* Daha fazla soru çizgileri */}
        <line x1="15" y1="115" x2="105" y2="115" stroke="#e0e0e0" strokeWidth="1" />
        <line x1="15" y1="125" x2="105" y2="125" stroke="#e0e0e0" strokeWidth="1" />
        <line x1="15" y1="135" x2="105" y2="135" stroke="#e0e0e0" strokeWidth="1" />
        <line x1="15" y1="145" x2="105" y2="145" stroke="#e0e0e0" strokeWidth="1" />
      </g>
      
      {/* İkinci optik form (arkada) */}
      <g transform="translate(90, 110)">
        <rect x="0" y="0" width="120" height="160" rx="6" fill="url(#paperGrad)" stroke="#e0e0e0" strokeWidth="1" opacity="0.7" />
        <rect x="10" y="10" width="100" height="8" fill="#023E8A" opacity="0.6" />
      </g>
      
      {/* Öğrenci Figürü */}
      <g transform="translate(50, 180)">
        {/* Kafa */}
        <circle cx="25" cy="25" r="18" fill="#FFB74D" />
        {/* Saç */}
        <path d="M10,15 Q25,5 40,15 Q35,10 25,8 Q15,10 10,15" fill="#8D6E63" />
        {/* Gözler */}
        <circle cx="20" cy="22" r="2" fill="#333" />
        <circle cx="30" cy="22" r="2" fill="#333" />
        {/* Gülümseme */}
        <path d="M18,30 Q25,35 32,30" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        {/* Vücut */}
        <rect x="12" y="43" width="26" height="35" rx="13" fill="#2196F3" />
        {/* Kollar */}
        <rect x="3" y="50" width="8" height="20" rx="4" fill="#FFB74D" />
        <rect x="39" y="50" width="8" height="20" rx="4" fill="#FFB74D" />
        {/* Bacaklar */}
        <rect x="18" y="78" width="6" height="25" rx="3" fill="#1976D2" />
        <rect x="26" y="78" width="6" height="25" rx="3" fill="#1976D2" />
        {/* Kalem */}
        <rect x="42" y="45" width="2" height="15" fill="#FF9800" />
        <rect x="41" y="43" width="4" height="3" fill="#FFB74D" />
      </g>
      
      {/* İkinci öğrenci (küçük) */}
      <g transform="translate(450, 250)">
        <circle cx="15" cy="15" r="12" fill="#FFB74D" />
        <path d="M6,8 Q15,3 24,8 Q21,5 15,4 Q9,5 6,8" fill="#6D4C41" />
        <circle cx="12" cy="13" r="1.5" fill="#333" />
        <circle cx="18" cy="13" r="1.5" fill="#333" />
        <rect x="8" y="27" width="14" height="20" rx="7" fill="#E91E63" />
        <rect x="10" y="47" width="4" height="15" rx="2" fill="#AD1457" />
        <rect x="16" y="47" width="4" height="15" rx="2" fill="#AD1457" />
      </g>
      
      {/* Başarı İkonu */}
      <g transform="translate(350, 220)">
        <circle cx="30" cy="30" r="25" fill="url(#correctGrad)" opacity="0.9" />
        <path d="M20,30 L27,37 L40,23" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="30" y="55" fontSize="8" fill="#4CAF50" fontWeight="600" textAnchor="middle">%95</text>
      </g>
      
      {/* Diploma/Sertifika */}
      <g transform="translate(120, 300)">
        <rect x="0" y="0" width="80" height="60" fill="url(#academicGrad)" rx="4" />
        <rect x="5" y="5" width="70" height="50" fill="white" rx="2" />
        <rect x="10" y="12" width="60" height="4" fill="#FF6B35" />
        <rect x="15" y="20" width="50" height="2" fill="#666" />
        <rect x="15" y="26" width="50" height="2" fill="#666" />
        <rect x="15" y="32" width="35" height="2" fill="#666" />
        <circle cx="60" cy="45" r="8" fill="#FFD700" />
        <text x="60" y="48" fontSize="6" fill="#333" textAnchor="middle">★</text>
      </g>
      
      {/* Grafik/İstatistik */}
      <g transform="translate(380, 80)">
        <rect x="0" y="30" width="8" height="20" fill="#2196F3" />
        <rect x="12" y="25" width="8" height="25" fill="#4CAF50" />
        <rect x="24" y="15" width="8" height="35" fill="#FF9800" />
        <rect x="36" y="20" width="8" height="30" fill="#9C27B0" />
        <text x="22" y="65" fontSize="6" fill="#666" textAnchor="middle">Başarı</text>
      </g>
      
      {/* Kitap Yığını */}
      <g transform="translate(30, 320)">
        <rect x="0" y="10" width="40" height="6" fill="#2196F3" rx="1" />
        <rect x="2" y="5" width="40" height="6" fill="#4CAF50" rx="1" />
        <rect x="1" y="0" width="40" height="6" fill="#FF9800" rx="1" />
        <text x="20" y="25" fontSize="6" fill="#666" textAnchor="middle">Eğitim</text>
      </g>
      
      {/* Dekoratif Eğitim İkonları */}
      <g opacity="0.3">
        <circle cx="60" cy="50" r="8" fill="#ADE8F4" />
        <text x="60" y="53" fontSize="8" fill="#023E8A" textAnchor="middle">A+</text>
        
        <circle cx="450" cy="120" r="6" fill="#90E0EF" />
        <text x="450" y="123" fontSize="6" fill="#023E8A" textAnchor="middle">✓</text>
        
        <circle cx="400" cy="350" r="5" fill="#48CAE4" />
        <text x="400" y="353" fontSize="5" fill="#023E8A" textAnchor="middle">%</text>
      </g>
      
      {/* Veri akışı çizgileri */}
      <g opacity="0.4">
        <path d="M200,160 Q250,140 300,160" fill="none" stroke="#ADE8F4" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M360,200 Q380,220 400,200" fill="none" stroke="#ADE8F4" strokeWidth="2" strokeDasharray="5,5" />
        <circle cx="210" cy="155" r="2" fill="#FF6B35" />
        <circle cx="290" cy="165" r="2" fill="#FF6B35" />
        <circle cx="370" cy="205" r="2" fill="#FF6B35" />
      </g>
    </svg>
  );
};

export default LoginIllustration; 