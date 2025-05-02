import React, { memo } from 'react';
import styles from './FormElementsSidebar.module.css';
import { useFormEditor } from '../context/FormEditorContext';

const FormElementsSidebar = memo(function FormElementsSidebar() {
  const { selectedTool, selectTool } = useFormEditor();
  
  // Optik form elemanları
  const optikElements = [
    {
      id: 'nameSurname',
      title: 'Ad Soyad Alanı',
      description: 'Harfler (A-Z) ile ad soyad kodlama alanı',
      icon: '🔠'
    },
    {
      id: 'number',
      title: 'Numara Alanı',
      description: 'Rakamlar (0-9) ile öğrenci numarası alanı',
      icon: '🔢'
    },
    {
      id: 'tcNumber',
      title: 'TC Kimlik No',
      description: '11 rakamlı TC kimlik numarası için alan',
      icon: '🆔'
    },
    {
      id: 'phoneNumber',
      title: 'Telefon No',
      description: '10 rakamlı telefon numarası için alan',
      icon: '📱'
    },
    {
      id: 'multipleChoice',
      title: 'Çoktan Seçmeli',
      description: 'Soru numarası ve A,B,C,D,E şıkları',
      icon: '📝'
    },
    {
      id: 'bookletCode',
      title: 'Kitapçık Kodu',
      description: 'Tek satır kitapçık kodlama alanı (A,B,C,...)',
      icon: '📚'
    },
    {
      id: 'classNumber',
      title: 'Sınıf',
      description: 'Rakamlar (1-12) ile sınıf kodlama alanı',
      icon: '🏫'
    },
    {
      id: 'classBranch',
      title: 'Şube',
      description: 'Harfler (A-Z) ile şube kodlama alanı',
      icon: '🔤'
    },
    // Yazı alanı elemanı eklendi
    {
      id: 'textArea',
      title: 'Yazı Alanı',
      description: 'Düzenlenebilir metin alanı',
      icon: '✏️'
    },
    {
      id: 'image',
      title: 'Resim Ekle',
      description: 'Cihazınızdan resim yükleyin',
      icon: '🖼️'
    }
  ];
  
  // Tool seçme işlevi
  const handleToolSelect = (toolId) => {
    // Zaten seçili ise kaldır, değilse seç
    selectTool(selectedTool === toolId ? null : toolId);
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.title}>Optik Form Elemanları</div>
      
      <div className={styles.elementsList}>
        {optikElements.map(element => (
          <div
            key={element.id}
            className={`${styles.elementItem} ${selectedTool === element.id ? styles.selected : ''}`}
            onClick={() => handleToolSelect(element.id)}
          >
            <div className={styles.elementIcon}>{element.icon}</div>
            <div className={styles.elementInfo}>
              <span className={styles.elementTitle}>{element.title}</span>
              <span className={styles.elementDesc}>{element.description}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.instructions}>
        {!selectedTool && (
          <p>Bir eleman türü seçin ve A4 sayfasında yerleştirmek istediğiniz yere tıklayın.</p>
        )}
        {selectedTool && (
          <div>
            <p className={styles.activeToolInfo}>
              <strong>{optikElements.find(e => e.id === selectedTool)?.title}</strong> seçildi.
            </p>
            <p>A4 sayfasında elemanı yerleştirmek istediğiniz yere tıklayın.</p>
            <button 
              className={styles.cancelButton}
              onClick={() => selectTool(null)}
            >
              İptal Et
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default FormElementsSidebar;