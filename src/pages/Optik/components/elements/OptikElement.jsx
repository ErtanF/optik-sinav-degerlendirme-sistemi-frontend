import React, { memo, useState } from 'react';
import BubbleGrid from './BubbleGrid';
import styles from './OptikElement.module.css';

const OptikElement = memo(function OptikElement({ 
  type, 
  rows, 
  cols, 
  position,
  size,
  isActive,
  onActivate,
  onRemove
}) {
  // Manuel başlık için state
  const [manualTitle, setManualTitle] = useState('');
  
  // Alan türüne göre kodlanabilir karakterleri belirle
  const getCharacterSet = () => {
    switch (type) {
      case 'nameSurname':
        return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // A'dan Z'ye harfler
      case 'number':
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
  
  // Boyutu tam grid sayısına göre ayarla
  // Ad soyad ve numara alanları için yüksekliği otomatik ayarla
  let adjustedHeight = Math.ceil(size.height / gridSize) * gridSize;
  
  // Dikey düzende (Ad soyad, numara) için minimum yükseklik
  if (type === 'nameSurname' || type === 'number') {
    // 1.5 grid başlık + 1.5 grid el yazı alanı + her harf/rakam 1 grid
    const minHeight = type === 'nameSurname' 
      ? 30 + 30 + 26 * gridSize // Başlık + yazı alanı + 26 harf
      : 30 + 30 + 10 * gridSize; // Başlık + yazı alanı + 10 rakam
    
    adjustedHeight = Math.max(adjustedHeight, minHeight);
  }
  
  const adjustedSize = {
    width: Math.ceil(size.width / gridSize) * gridSize,
    height: adjustedHeight
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
    >
      {/* Manuel başlık giriş alanı */}
      <input
        type="text"
        className={styles.manualHeaderInput}
        value={manualTitle}
        onChange={handleTitleChange}
        placeholder={type === 'nameSurname' ? 'AD SOYAD' : 
                    type === 'number' ? 'NUMARA' : 
                    type === 'multipleChoice' ? 'TEST' : 'Başlık'}
      />
      
      {/* Kodlanacak daireler - BubbleGrid bileşeni */}
      <div className={styles.optikContent}>
        <BubbleGrid 
          rows={rows} 
          cols={cols}
          characters={characters}
          type={type}
        />
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