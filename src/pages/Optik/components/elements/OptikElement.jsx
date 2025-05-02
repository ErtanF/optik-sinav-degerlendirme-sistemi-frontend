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
  startNumber = 1,
  customBubbleValues = {},
  onBubbleContentUpdate,
  onTitleChange
}) {
  // Manuel başlık için state
  const [manualTitle, setManualTitle] = useState('');
  
  // Eleman türüne göre varsayılan başlık belirle
  useEffect(() => {
    const defaultTitles = {
      'nameSurname': 'AD SOYAD',
      'number': 'NUMARA',
      'tcNumber': 'TC KİMLİK NO',
      'phoneNumber': 'TELEFON NO',
      'multipleChoice': 'TEST',
      'bookletCode': 'KİTAPÇIK TÜRÜ',
      'classNumber': 'SINIF',
      'classBranch': 'ŞUBE',
      'image': 'RESİM'
    };
    
    setManualTitle(defaultTitles[type] || 'BAŞLIK');
    
    // Başlık değerini element özelliklerine ekle, bu sayede FormRenderer bu değeri kullanabilir
    if (onTitleChange) {
      onTitleChange(defaultTitles[type] || 'BAŞLIK');
    }
  }, [type, onTitleChange]);
  
  // Elemanın gerçek yüksekliğini ayarlamak için
  const [adjustedSize, setAdjustedSize] = useState({
    width: size.width,
    height: size.height
  });
  
  // İlk yükleme ve boyut değişiminde hesaplanmış boyutu güncelle
  useEffect(() => {
    const gridSize = 20;
    const adjustedWidth = Math.ceil(size.width / gridSize) * gridSize;
    let calculatedHeight;
    
    if (type === 'multipleChoice') {
      // Her soru satırı 20px + başlık yüksekliği (30px)
      const visibleRows = Math.min(rows, 20);
      calculatedHeight = (visibleRows * 20) + 30;
    } else if (type === 'nameSurname' || type === 'classBranch' || type === 'classNumber') {
      // Tüm dikey elemanlara aynı yükseklik hesaplama mantığı
      const rowCount = type === 'nameSurname' || type === 'classBranch' ? 26 :
                    type === 'classNumber' ? 12 : 10;
      calculatedHeight = 30 + 30 + (rowCount * 20); // başlık + yazı alanı + satırlar
    } else if (type === 'number' || type === 'tcNumber' || type === 'phoneNumber') {
      // 30px başlık + 30px el yazı alanı + 10 * 20px karakter alanı (0-9)
      calculatedHeight = 30 + 30 + (10 * 20);
    }
     else if (type === 'image') {
      calculatedHeight = Math.ceil(size.height / gridSize) * gridSize;
    } else {
      calculatedHeight = Math.ceil(size.height / gridSize) * gridSize;
    }
    
    // Sabit boyutlu elemanlar vs kullanıcı seçimi
    const finalHeight = ['nameSurname', 'number', 'tcNumber', 'phoneNumber', 'classNumber', 'classBranch'].includes(type)
      ? calculatedHeight 
      : Math.max(calculatedHeight, size.height);
    
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

  // Bubble içeriği güncellendiğinde
  const handleBubbleContentUpdate = (rowCol, value) => {
    if (onBubbleContentUpdate) {
      onBubbleContentUpdate(rowCol, value);
    }
  };

  // Manuel girilen başlığı güncelle
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setManualTitle(newTitle);
    // Başlık değiştiğinde parent bileşene bildir
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
  };

  // Pozisyon ve boyutu grid'e göre ayarla
  const gridSize = 20;
  const adjustedPosition = {
    x: Math.floor(position.x / gridSize) * gridSize,
    y: Math.floor(position.y / gridSize) * gridSize
  };

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
            type={type}
            startNumber={startNumber}
            isEditable={isActive}
            customValues={customBubbleValues}
            onContentUpdate={handleBubbleContentUpdate}
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