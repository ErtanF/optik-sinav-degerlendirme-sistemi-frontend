import React, { memo, useState, useRef, useEffect } from 'react';
import styles from './BubbleGrid.module.css';

const BubbleGrid = memo(function BubbleGrid({ 
  rows, 
  cols, 
  type, 
  startNumber = 1,
  isEditable = true,
  customValues = {},
  onContentUpdate = null
}) {
  // Dikey düzen kontrolü
  const isVertical = type === 'nameSurname' || type === 'number' || type === 'tcNumber' || type === 'phoneNumber'|| 
  type === 'classNumber' || type === 'classBranch';
  
  // Düzenleme state'leri
  const [editingBubble, setEditingBubble] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [localValues, setLocalValues] = useState({});
  const inputRef = useRef(null);
  
  // Props'tan gelen customValues değerini localValues'a aktar
  useEffect(() => {
    setLocalValues(customValues);
  }, [customValues]);

  // Bubble içeriğini al
  const getBubbleContent = (row, col, defaultValue) => {
    const key = `${row}-${col}`;
    
    // Yerel değerleri kontrol et, sonra dışarıdan gelen değerleri
    if (key in localValues) return localValues[key];
    if (key in customValues) return customValues[key];
    
    // Varsayılan değeri döndür
    return defaultValue;
  };

  // Düzenlemeyi başlat
  const startEditing = (row, col, defaultValue) => {
    if (!isEditable) return;
    
    const currentValue = getBubbleContent(row, col, defaultValue);
    setEditingBubble({ row, col });
    setEditValue(currentValue);
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  // Düzenlemeyi tamamla
  const finishEditing = () => {
    if (!editingBubble) return;
    
    const { row, col } = editingBubble;
    const key = `${row}-${col}`;
    
    // Değişikliği yerel state'e uygula
    setLocalValues(prev => ({
      ...prev,
      [key]: editValue.trim()
    }));
    
    // Değişikliği dışarı bildir
    if (onContentUpdate) {
      onContentUpdate(key, editValue.trim());
    }
    
    // Düzenleme modundan çık
    setEditingBubble(null);
    setEditValue('');
  };

  // Klavye olayları
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      finishEditing();
      
      // Tab ile sonraki bubble'a geç
      if (e.key === 'Tab' && editingBubble) {
        navigateToNextBubble();
      }
    } else if (e.key === 'Escape') {
      // Değişiklikleri iptal et
      setEditingBubble(null);
      setEditValue('');
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      // Silme tuşuna basıldığında içeriği temizle
      setEditValue('');
    }
  };

  // Sonraki bubble'a geçiş
  const navigateToNextBubble = () => {
    if (!editingBubble) return;
    
    const { row, col } = editingBubble;
    let nextRow = row;
    let nextCol = col + 1;
    
    if (type === 'multipleChoice') {
      // Çoktan seçmeli için yatay navigasyon
      if (nextCol >= cols) {
        nextCol = 0;
        nextRow = (row + 1) % rows;
      }
      
      const availableChoices = ['A', 'B', 'C', 'D', 'E'];
      const defaultValue = availableChoices[nextCol];
      
      setTimeout(() => {
        startEditing(nextRow, nextCol, defaultValue);
      }, 10);
    } else {
      // Dikey elemanlar için navigasyon
      const allCharacters = type === 'nameSurname' 
        ? Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
        : ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      
      if (nextCol >= cols) {
        nextCol = 0;
        nextRow = (row + 1) % allCharacters.length;
      }
      
      const defaultValue = allCharacters[nextRow];
      
      setTimeout(() => {
        startEditing(nextRow, nextCol, defaultValue);
      }, 10);
    }
  };

  // Input değeri değiştiğinde
  const handleInputChange = (e) => {
    setEditValue(e.target.value.substring(0, 1));
  };

  // Tıklama dışında düzenlemeyi bitirme
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editingBubble && inputRef.current && !inputRef.current.contains(e.target)) {
        finishEditing();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingBubble]);

  // Bubble öğesini render et
  const renderBubble = (row, col, defaultContent) => {
    const content = getBubbleContent(row, col, defaultContent);
    const isEditing = editingBubble && 
                     editingBubble.row === row && 
                     editingBubble.col === col;
    const isEmpty = content === '';
    
    return (
      <div 
        className={`${styles.bubble} ${isEditing ? styles.editing : ''} ${isEmpty ? styles.empty : ''}`}
        title={`${isEmpty ? 'Boş' : content}`}
        onClick={() => startEditing(row, col, isEmpty ? '' : defaultContent)}
        data-empty={isEmpty ? 'true' : 'false'}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            className={styles.bubbleInput}
            value={editValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={finishEditing}
            maxLength={1}
          />
        ) : (
          <span className={styles.bubbleLabel}>{content}</span>
        )}
      </div>
    );
  };

  // Çoktan seçmeli sorular için yatay layout
  const renderHorizontalGrid = () => {
    const availableChoices = ['A', 'B', 'C', 'D', 'E'];
    const displayedCols = Math.min(5, cols);

    // Kitapçık kodu elemanı için özel düzen
    if (type === 'bookletCode') {
      return (
        <div className={styles.horizontalGrid}>
          <div className={styles.questionRow}>
            {/* Soru numarası kısmını boş bırak */}
            <div className={styles.emptyCell}></div>
            <div className={styles.choices}>
              {availableChoices.slice(0, displayedCols).map((char, colIndex) => (
                <div key={`choice-0-${colIndex}`} className={styles.choiceContainer}>
                  {renderBubble(0, colIndex, char)}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Normal çoktan seçmeli için mevcut düzen
    return (
      <div className={styles.horizontalGrid}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`question-${rowIndex}`} className={styles.questionRow}>
            <div className={styles.questionNumber}>{startNumber + rowIndex}</div>
            <div className={styles.choices}>
              {availableChoices.slice(0, displayedCols).map((char, colIndex) => (
                <div key={`choice-${rowIndex}-${colIndex}`} className={styles.choiceContainer}>
                  {renderBubble(rowIndex, colIndex, char)}
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
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const columnCount = type === 'tcNumber' ? 11 : (type === 'phoneNumber' ? 10 : cols);
    
    return (
      <div className={styles.idPhoneGrid}>
        {/* El ile yazı alanı - sadece stillendirme için kullanılacak boş bir alan */}
        <div className={styles.manualWriteArea}>
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <div key={`write-${colIndex}`} className={styles.writeCell} />
          ))}
        </div>
        
        {/* Dikey sütunlar */}
        <div className={styles.columnsContainer}>
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <div key={`col-${colIndex}`} className={styles.digitColumn}>
              {digits.map((digit, digitIndex) => (
                <div key={`digit-${colIndex}-${digitIndex}`} className={styles.digitCell}>
                  {renderBubble(digitIndex, colIndex, digit)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Ad Soyad ve Numara alanları için dikey layout
  const renderVerticalGrid = () => {
    const columnCount = cols;
    let allCharacters = [];
    
    // Eleman tipine göre karakterleri belirle
    if (type === 'nameSurname' || type === 'classBranch') {
      allCharacters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // A-Z
    } else if (type === 'classNumber') {
      allCharacters = Array.from({ length: 12 }, (_, i) => String(i + 1)); // 1-12
    } else {
      allCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']; // 0-9
    }
    
    return (
      <div className={styles.verticalGridNew}>
        {/* El ile yazı alanı - sadece CSS ile stillendirilmiş boş bir alan */}
        <div className={styles.manualWriteArea}>
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <div key={`write-${colIndex}`} className={styles.writeCell} />
          ))}
        </div>
        
        {/* Sütunlar */}
        <div className={styles.columnContainer}>
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <div key={`col-${colIndex}`} className={styles.bubbleColumn}>
              {allCharacters.map((char, charIndex) => (
                <div key={`bubble-${colIndex}-${charIndex}`} className={styles.bubbleCell}>
                  {renderBubble(charIndex, colIndex, char)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Eleman türüne göre uygun grid'i render et
  if (type === 'tcNumber' || type === 'phoneNumber') {
    return renderIdPhoneGrid();
  } else if (isVertical) {
    return renderVerticalGrid();
  } else {
    return renderHorizontalGrid();
  }
});

export default BubbleGrid;