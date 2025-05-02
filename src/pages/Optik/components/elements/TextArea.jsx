import React, { useState, useRef, useEffect } from 'react';
import styles from './TextArea.module.css';

const TextArea = ({ 
  content = '',
  isEditable = false,
  onContentUpdate = null
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content || '');
  const textareaRef = useRef(null);

  // Content prop değiştiğinde state'i güncelle
  useEffect(() => {
    setText(content || '');
  }, [content]);

  // Tek tıklama ile düzenlemeyi başlat (çift tıklama yerine)
  const handleClick = () => {
    if (!isEditable) return;
    setIsEditing(true);
  };

  // Düzenleme modunu kapat ve değişiklikleri kaydet
  const finishEditing = () => {
    setIsEditing(false);
    if (onContentUpdate) {
      onContentUpdate(text);
    }
  };

  // Input değişikliği
  const handleChange = (e) => {
    setText(e.target.value);
  };

  // Klavye olayları
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      // Değişiklikleri iptal et ve orijinal içeriği geri yükle
      setText(content);
      setIsEditing(false);
    } else if (e.ctrlKey && e.key === 'Enter') {
      // CTRL+Enter ile kaydet
      finishEditing();
    }
  };

  // Düzenleme başladığında textarea'ya odaklan
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  // Dışarı tıklandığında düzenlemeyi tamamla
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isEditing && textareaRef.current && !textareaRef.current.contains(e.target)) {
        finishEditing();
      }
    };
    
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  return (
    <div className={styles.textAreaContainer}>
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className={styles.textAreaInput}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Metin yazınız..."
        />
      ) : (
        <div 
          className={styles.textAreaDisplay}
          onClick={handleClick}
        >
          {text || (isEditable ? 'Tıklayarak metin ekleyiniz' : '')}
        </div>
      )}
    </div>
  );
};

export default TextArea;