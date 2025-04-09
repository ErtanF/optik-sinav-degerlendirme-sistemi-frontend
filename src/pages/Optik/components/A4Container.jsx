import React, { useRef, useEffect, memo } from 'react';
import styles from './A4Container.module.css';
import OptikElement from './elements/OptikElement';
import { useFormEditor } from '../context/FormEditorContext';

const A4Container = memo(function A4Container() {
  const {
    pageElements,
    activeElementId,
    selectedTool,
    selectionMode,
    selectionArea,
    isCreating,
    gridSize,
    setActiveElement,
    removeElement,
    startAreaSelection,
    updateAreaSelection,
    completeAreaSelection,
    cancelAreaSelection
  } = useFormEditor();
  
  const containerRef = useRef(null);
  
  // Mouse olaylarını izle
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || !selectionMode) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Alan seçimini güncelle
      updateAreaSelection({ x, y });
    };
    
    const handleMouseUp = () => {
      if (selectionMode) {
        completeAreaSelection();
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [selectionMode, updateAreaSelection, completeAreaSelection]);
  
  // ESC tuşu ile alan seçimini iptal etme
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectionMode) {
        cancelAreaSelection();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectionMode, cancelAreaSelection]);
  
  // Mouse down olayı - alan seçimini başlat
  const handleMouseDown = (e) => {
    // Bir eleman üzerine tıklandıysa alan seçimi yapma
    if (e.target !== containerRef.current && !e.target.classList.contains(styles.gridLines)) {
      return;
    }
    
    // Seçili bir araç varsa, alan seçimini başlat
    if (selectedTool) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Grid'e snap yapılmış başlangıç noktası
      const startX = Math.floor(x / gridSize) * gridSize;
      const startY = Math.floor(y / gridSize) * gridSize;
      
      startAreaSelection(selectedTool, { x: startX, y: startY });
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
        className={styles.container}
        onMouseDown={handleMouseDown}
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
        
        {/* Seçim Alanı - Area Selection */}
        {selectionMode && selectionArea && (
          <div 
            className={styles.selectionArea}
            style={{
              left: `${selectionArea.x}px`,
              top: `${selectionArea.y}px`,
              width: `${selectionArea.width}px`,
              height: `${selectionArea.height}px`,
            }}
          />
        )}
        
        {/* Pointer-cursor gösterge alanı - sadece seçim modu aktifken */}
        {selectedTool && !isCreating && (
          <div className={styles.cursorGuide} />
        )}
      </div>
    </div>
  );
});

export default A4Container;