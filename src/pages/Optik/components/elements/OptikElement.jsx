import React, { memo, useState, useEffect } from 'react';
import BubbleGrid from './BubbleGrid';
import styles from './OptikElement.module.css';

const OptikElement = memo(function OptikElement({ 
  type, 
  rows, 
  cols, 
  position,
  size,
  content,
  isActive,
  onActivate,
  onRemove,
  startNumber = 1
}) {
  // Manuel başlık için state
  const [manualTitle, setManualTitle] = useState('');
  
  // Eleman türüne göre varsayılan başlık belirle
  useEffect(() => {
    let defaultTitle = '';
    switch(type) {
      case 'nameSurname':
        defaultTitle = 'AD SOYAD';
        break;
      case 'number':
        defaultTitle = 'NUMARA';
        break;
      case 'tcNumber':
        defaultTitle = 'TC KİMLİK NO';
        break;
      case 'phoneNumber':
        defaultTitle = 'TELEFON NO';
        break;
      case 'multipleChoice':
        defaultTitle = 'TEST';
        break;
      case 'image':
        defaultTitle = 'RESİM';
        break;
      default:
        defaultTitle = 'BAŞLIK';
    }
    setManualTitle(defaultTitle);
  }, [type]);
  
  // Elemanın gerçek yüksekliğini ayarlamak için
  const [adjustedSize, setAdjustedSize] = useState({
    width: size.width,
    height: size.height
  });
  
  // İlk yükleme ve boyut değişiminde hesaplanmış boyutu güncelle
  useEffect(() => {
    // Izgara tabanlı ayarlanmış boyut hesaplama
    const gridSize = 20;
    const adjustedWidth = Math.ceil(size.width / gridSize) * gridSize;
    
    // Elemanın içindeki satır sayısına göre hesaplanan minimum yükseklik
    let calculatedHeight;
    
    if (type === 'multipleChoice') {
      // Her soru satırı 20px + başlık yüksekliği (30px)
      const visibleRows = Math.min(rows, 20); // Maksimum 20 satır gösterilecek
      calculatedHeight = (visibleRows * 20) + 30; // Başlık yüksekliği için ek 30px
    } else if (type === 'nameSurname') {
      // 30px başlık + 30px el yazı alanı + 26 * 20px karakter alanı (A-Z)
      calculatedHeight = 30 + 30 + (26 * 20); 
      // Ad soyad için yüksekliği sabit tut
    } else if (type === 'number' || type === 'tcNumber' || type === 'phoneNumber') {
      // 30px başlık + 30px el yazı alanı + 10 * 20px karakter alanı (0-9)
      calculatedHeight = 30 + 30 + (10 * 20); 
      // Numara, TC Kimlik ve Telefon için yüksekliği sabit tut
    } else if (type === 'image') {
      // Resim elemanları için yükseklik
      calculatedHeight = Math.ceil(size.height / gridSize) * gridSize;
    } else {
      // Varsayılan yükseklik hesaplama
      calculatedHeight = Math.ceil(size.height / gridSize) * gridSize;
    }
    
    // Ad Soyad, Numara, TC Kimlik ve Telefon için yüksekliği sabit tut, diğer elemanlar için kullanıcı seçimine göre ayarla
    let finalHeight;
    if (type === 'nameSurname' || type === 'number' || type === 'tcNumber' || type === 'phoneNumber') {
      finalHeight = calculatedHeight; // Sabit yükseklik
    } else {
      finalHeight = Math.max(calculatedHeight, size.height); // Kullanıcı seçimi veya hesaplanan minimum
    }
    
    setAdjustedSize({
      width: adjustedWidth,
      height: finalHeight
    });
  }, [size, rows, cols, type]);
  
  // Alan türüne göre kodlanabilir karakterleri belirle
  const getCharacterSet = () => {
    switch (type) {
      case 'nameSurname':
        return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // A'dan Z'ye harfler
      case 'number':
      case 'tcNumber':
      case 'phoneNumber':
        return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']; // 0'dan 9'a rakamlar
      case 'multipleChoice':
        return ['A', 'B', 'C', 'D', 'E']; // A'dan E'ye şıklar
      default:
        return [];
    }
  };

  // Manuel girilen başlığı güncelle
  const handleTitleChange = (e) => {
    setManualTitle(e.target.value);
  };

  // Tüm grid hücreleri tam 20px olacak
  const gridSize = 20;
  
  // Pozisyon ve boyutu grid'e göre ayarla
  // Kesin grid sınırlarına yerleştirmek için tam grid çizgilerine hizala
  const adjustedPosition = {
    x: Math.floor(position.x / gridSize) * gridSize,
    y: Math.floor(position.y / gridSize) * gridSize
  };
  
  const characters = getCharacterSet();

  return (
    <div 
      className={`${styles.optikElement} ${isActive ? styles.active : ''}`}
      onClick={onActivate}
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        width: `${adjustedSize.width}px`,
        height: `${adjustedSize.height}px`,
      }}
      data-element-type={type}
    >
      {/* Manuel başlık giriş alanı */}
      <input
        type="text"
        className={styles.manualHeaderInput}
        value={manualTitle}
        onChange={handleTitleChange}
        placeholder="Form Başlığı"
      />
      
      {/* Eleman içeriği */}
      <div className={styles.optikContent}>
        {type === 'image' ? (
          // Resim elemanı için
          <div className={styles.imageContent}>
            <img 
              src={content} 
              alt="Resim"
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain',
                display: 'block'
              }} 
              onError={(e) => {
                console.error("Image error in OptikElement:", e);
                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M20.4 14.5L16 10 4 20"/></svg>';
                e.target.style.padding = '20px';
                e.target.style.opacity = '0.5';
              }}
            />
          </div>
        ) : (
          // Diğer optik elemanlar için
          <BubbleGrid 
            rows={rows} 
            cols={cols}
            characters={characters}
            type={type}
            startNumber={startNumber}
          />
        )}
      </div>
      
      {isActive && (
        <button 
          className={styles.removeButton}
          onClick={onRemove}
        >
          &times;
        </button>
      )}
    </div>
  );
});

export default OptikElement;