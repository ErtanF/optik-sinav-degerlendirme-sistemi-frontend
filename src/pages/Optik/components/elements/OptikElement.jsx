// OptikElement.jsx - Başlık stillemesi için güncellenmiş versiyon
import React, { memo, useState, useEffect, useRef } from 'react';
import BubbleGrid from './BubbleGrid';
import TextArea from './TextArea';
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
  onTitleChange,
  onContentUpdate
}) {
  // Manuel başlık için state
  const [manualTitle, setManualTitle] = useState('');
  // İlk render kontrolü için ref
  const isFirstRender = useRef(true);
  
  // Eleman türüne göre varsayılan başlık belirle
  useEffect(() => {
    // Sadece ilk render'da veya type değiştiğinde çalışsın
    if (isFirstRender.current || isFirstRender.current === undefined) {
      const defaultTitles = {
        'nameSurname': 'AD SOYAD',
        'number': 'NUMARA',
        'tcNumber': 'TC KİMLİK NO',
        'phoneNumber': 'TELEFON NO',
        'multipleChoice': 'TEST',
        'bookletCode': 'KİTAPÇIK',
        'classNumber': 'SINIF',
        'classBranch': 'ŞUBE',
        'textArea': '', // Yazı alanı için boş başlık
        'image': 'RESİM'
      };
      
      const newTitle = defaultTitles[type] || 'BAŞLIK';
      setManualTitle(newTitle);
      
      // Başlık değerini element özelliklerine ekle, bu sayede FormRenderer bu değeri kullanabilir
      if (onTitleChange) {
        onTitleChange(newTitle);
      }
      
      isFirstRender.current = false;
    }
  }, [type]); // Sadece type değiştiğinde çalışsın
  
  // Elemanın gerçek yüksekliğini ayarlamak için
  const [adjustedSize, setAdjustedSize] = useState({
    width: size.width,
    height: size.height
  });
  
  // İlk yükleme ve boyut değişiminde hesaplanmış boyutu güncelle
  useEffect(() => {
    // Önceki boyut ile şimdiki boyut aynıysa update etme
    if (adjustedSize.width === size.width && adjustedSize.height === size.height) {
      return;
    }
    
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
    } else if (type === 'textArea' || type === 'image') {
      // Yazı alanı ve resim için boyut korunur
      calculatedHeight = Math.ceil(size.height / gridSize) * gridSize;
    } else {
      calculatedHeight = Math.ceil(size.height / gridSize) * gridSize;
    }
    
    // Sabit boyutlu elemanlar vs kullanıcı seçimi
    const finalHeight = ['nameSurname', 'number', 'tcNumber', 'phoneNumber', 'classNumber', 'classBranch'].includes(type)
      ? calculatedHeight 
      : Math.max(calculatedHeight, size.height);
    
    // Sadece boyut değiştiyse update et
    const newAdjustedSize = {
      width: adjustedWidth,
      height: finalHeight
    };
    
    if (newAdjustedSize.width !== adjustedSize.width || newAdjustedSize.height !== adjustedSize.height) {
      setAdjustedSize(newAdjustedSize);
    }
  }, [size, rows, cols, type, adjustedSize]);
  
  // Bubble içeriği güncellendiğinde
  const handleBubbleContentUpdate = (rowCol, value) => {
    if (onBubbleContentUpdate) {
      onBubbleContentUpdate(rowCol, value);
    }
  };

  // Metin içeriği güncellendiğinde
  const handleTextContentUpdate = (newContent) => {
    if (onContentUpdate) {
      onContentUpdate(newContent);
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

  // Yazı alanı elemanı için başlık input'unu gösterme
  const showHeaderInput = type !== 'textArea';

  return (
    <div 
      className={`${styles.optikElement} ${isActive ? styles.active : ''}`}
      onClick={onActivate}
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
        width: `${adjustedSize.width}px`,
        height: `${adjustedSize.height}px`
      }}
      data-element-type={type}
    >
      {/* Manuel başlık giriş alanı - textArea için gösterme */}
      {showHeaderInput && (
        <input
          type="text"
          className={styles.manualHeaderInput}
          value={manualTitle}
          onChange={handleTitleChange}
          placeholder="Form Başlığı"
        />
      )}
      
      {/* Eleman içeriği */}
      <div 
        className={styles.optikContent}
        style={!showHeaderInput ? { height: '100%' } : {}}
      >
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
        ) : type === 'textArea' ? (
          // Yazı alanı elemanı için
          <TextArea 
            content={content}
            isEditable={isActive}
            onContentUpdate={handleTextContentUpdate}
          />
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