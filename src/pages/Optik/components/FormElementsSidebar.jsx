import React, { memo } from 'react';
import styles from './FormElementsSidebar.module.css';

const FormElementsSidebar = memo(function FormElementsSidebar({ formElements }) {
  const handleDragStart = (e, element) => {
    console.log('Drag started for element:', element);
    
    // JSON.stringify ile element verisini saklıyoruz
    e.dataTransfer.setData('application/json', JSON.stringify(element));
    
    // Görünmez sürükleme resmi
    const emptyImg = new Image();
    emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(emptyImg, 0, 0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Form Elemanları</div>
      <div className={styles.elementsList}>
        {formElements.map(element => (
          <div
            key={element.id}
            className={styles.elementItem}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, element)}
          >
            <img 
              src={element.image} 
              alt={element.title} 
              className={styles.elementImage} 
            />
            <span className={styles.elementTitle}>{element.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default FormElementsSidebar;