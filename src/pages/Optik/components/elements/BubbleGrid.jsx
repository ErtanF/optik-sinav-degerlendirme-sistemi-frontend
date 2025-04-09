import React, { memo } from 'react';
import styles from './BubbleGrid.module.css';

const BubbleGrid = memo(function BubbleGrid({ rows, cols, characters, type, startNumber = 1 }) {
  // Dikey düzende display
  const isVertical = type === 'nameSurname' || type === 'number' || type === 'tcNumber' || type === 'phoneNumber';
  
  // Çoktan seçmeli sorular için yatay layout
  const renderHorizontalGrid = () => {
    // Yatay düzende (çoktan seçmeli gibi) her satır bir soru, her sütun bir şık
    return (
      <div className={styles.horizontalGrid}>
        {/* Her soru satırı için: Soru numarası ve şıklar */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`question-${rowIndex}`} className={styles.questionRow}>
            <div className={styles.questionNumber}>{startNumber + rowIndex}</div>
            <div className={styles.choices}>
              {characters.slice(0, Math.min(cols, characters.length)).map((char, colIndex) => (
                <div 
                  key={`choice-${rowIndex}-${colIndex}`}
                  className={styles.choiceContainer}
                >
                  <div className={styles.bubble} title={`Soru ${startNumber + rowIndex}, Şık ${char}`}>
                    <span className={styles.bubbleLabel}>{char}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // TC Kimlik ve Telefon No için özel dikey düzen
  const renderIdPhoneGrid = () => {
    // Rakamlar (0-9)
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    // Hangi tip için kaç sütun (hane) olacak
    const columnCount = type === 'tcNumber' ? 11 : (type === 'phoneNumber' ? 10 : cols);
    
    return (
      <div className={styles.idPhoneGrid}>
        {/* El ile yazı alanı */}
        <div className={styles.manualWriteArea}>
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <div key={`write-${colIndex}`} className={styles.writeCell}>
              {/* Boş alan - el ile yazılacak */}
            </div>
          ))}
        </div>
        
        {/* Dikey sütunlar - Her biri bir basamak için */}
        <div className={styles.columnsContainer}>
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <div key={`col-${colIndex}`} className={styles.digitColumn}>
              {/* Her sütun içinde 0-9 rakamları yukarıdan aşağıya */}
              {digits.map((digit, digitIndex) => (
                <div 
                  key={`digit-${colIndex}-${digitIndex}`}
                  className={styles.digitCell}
                >
                  <div className={styles.bubble} title={`Basamak ${colIndex + 1}, Değer ${digit}`}>
                    <span className={styles.bubbleLabel}>{digit}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Ad Soyad ve Numara alanları için dikey layout (her SÜTUN bir harf/rakam için)
  const renderVerticalGrid = () => {
    // Sütun sayısını belirle
    const columnCount = cols;
    // Sütun başı karakter sayısı (Ad Soyad için 26, Numara için 10)
    const rowsPerColumn = type === 'nameSurname' ? 26 : 10;
    
    // Tüm olası karakterler
    const allCharacters = type === 'nameSurname' 
      ? Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))  // A-Z
      : ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];  // 0-9
    
    return (
      <div className={styles.verticalGridNew}>
        {/* El ile yazı alanı */}
        <div className={styles.manualWriteArea}>
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <div key={`write-${colIndex}`} className={styles.writeCell}>
              {/* Boş alan - el ile yazılacak */}
            </div>
          ))}
        </div>
        
        {/* Sütunlar - Her biri isim/numaranın bir karakteri için */}
        <div className={styles.columnContainer}>
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <div key={`col-${colIndex}`} className={styles.bubbleColumn}>
              {/* Her sütun için A-Z veya 0-9 yukarıdan aşağıya */}
              {allCharacters.map((char, charIndex) => (
                <div 
                  key={`bubble-${colIndex}-${charIndex}`}
                  className={styles.bubbleCell}
                >
                  <div className={styles.bubble} title={`Sütun ${colIndex + 1}, ${char}`}>
                    <span className={styles.bubbleLabel}>{char}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  if (type === 'tcNumber' || type === 'phoneNumber') {
    return renderIdPhoneGrid();
  } else if (isVertical) {
    return renderVerticalGrid();
  } else {
    return renderHorizontalGrid();
  }
});

export default BubbleGrid;