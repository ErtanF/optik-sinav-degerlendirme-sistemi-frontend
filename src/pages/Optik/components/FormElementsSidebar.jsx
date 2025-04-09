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
      description: 'Seçtiğiniz grid genişliği kadar harf gösterilir (A-Z)',
      icon: '🔠'
    },
    {
      id: 'number',
      title: 'Numara Alanı',
      description: 'Seçtiğiniz grid genişliği kadar rakam gösterilir (0-9)',
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
      description: 'İlk sütun soru numarası, diğer sütunlar A,B,C,D,E şıkları',
      icon: '📝'
    }
    /* Diğer elemanlar buraya eklenebilir */
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
          <p>Bir eleman türü seçin ve A4 sayfasında alan oluşturun.</p>
        )}
        {selectedTool && (
          <div>
            <p className={styles.activeToolInfo}>
              <strong>{optikElements.find(e => e.id === selectedTool)?.title}</strong> seçildi.
            </p>
            <p>A4 sayfasında mouse ile sürükleyerek bir alan belirleyin.</p>
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