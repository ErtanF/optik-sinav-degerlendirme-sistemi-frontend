import React, { useRef, useEffect, memo } from 'react';
import styles from './A4Container.module.css';
import OptikElement from './elements/OptikElement';
import { useFormEditor } from '../context/FormEditorContext';

const A4Container = memo(function A4Container() {
  const {
    pageElements,
    activeElementId,
    selectedTool,
    isCreating,
    gridSize,
    setActiveElement,
    removeElement,
    handleCanvasClick
  } = useFormEditor();
  
  const containerRef = useRef(null);
  
  // A4 sayfasına tıklandığında
  const handleContainerClick = (e) => {
    // Bir eleman üzerine tıklandıysa işlem yapma
    if (e.target !== containerRef.current && !e.target.classList.contains(styles.gridLines)) {
      return;
    }
    
    // Seçili bir araç varsa, elemanı ekle
    if (selectedTool) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Tıklanan pozisyonda eleman oluştur
      handleCanvasClick({ x, y });
      e.preventDefault();
    } else {
      // Boş alana tıklandığında aktif elemanı temizle
      setActiveElement(null);
    }
  };
  
  return (
    <div className={styles.wrapper}>
      <div 
        ref={containerRef}
        id="a4-container"
        className={`${styles.container} ${selectedTool ? styles.toolSelected : ''}`}
        onClick={handleContainerClick}
      >
        <div className={styles.gridLines}></div>
        
        {/* Mevcut Optik Elemanlar */}
        {pageElements.map(element => (
          <OptikElement
            key={element.uniqueId}
            type={element.type}
            rows={element.rows}
            cols={element.cols}
            position={element.position}
            size={element.size}
            isActive={activeElementId === element.uniqueId}
            onActivate={() => setActiveElement(element.uniqueId)}
            onRemove={() => removeElement(element.uniqueId)}
            startNumber={element.startNumber || 1}
          />
        ))}
        
        {/* Pointer-cursor gösterge alanı - sadece seçim modu aktifken */}
        {selectedTool && !isCreating && (
          <div className={styles.cursorGuide} />
        )}
      </div>
    </div>
  );
});

export default A4Container;