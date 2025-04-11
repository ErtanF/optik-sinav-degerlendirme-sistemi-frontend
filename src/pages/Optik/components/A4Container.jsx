import React, { useRef, memo } from 'react';
import styles from './A4Container.module.css';
import OptikElement from './elements/OptikElement';
import CornerMarks from './CornerMarks';
import { useFormEditor } from '../context/FormEditorContext';

const A4Container = memo(function A4Container() {
  const {
    pageElements,
    activeElementId,
    selectedTool,
    isCreating,
    customBubbleValues,
    updateBubbleContent,
    setActiveElement,
    removeElement,
    handleCanvasClick,
    safeZoneMargin,
    safeZonePadding
  } = useFormEditor();
  
  const containerRef = useRef(null);
  
  // A4 sayfasına tıklandığında
  const handleContainerClick = (e) => {
    // Doğrudan container'a veya grid çizgilerine tıklandığında işlem yap
    if (e.target === containerRef.current || e.target.classList.contains(styles.gridLines)) {
      // Seçili bir araç varsa, elemanı ekle
      if (selectedTool) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        handleCanvasClick({ x, y });
        e.preventDefault();
      } else {
        // Boş alana tıklandığında aktif elemanı temizle
        setActiveElement(null);
      }
    }
  };
  
  // Bubble içeriğini güncelleme
  const handleBubbleContentUpdate = (elementId, rowCol, value) => {
    updateBubbleContent(elementId, rowCol, value);
  };
  
  return (
    <div className={styles.wrapper}>
      <div 
        ref={containerRef}
        id="a4-container"
        className={`${styles.container} ${selectedTool ? styles.toolSelected : ''}`}
        onClick={handleContainerClick}
      >
        {/* Köşe kalibrasyon işaretleri */}
        <CornerMarks 
          safeZoneMargin={safeZoneMargin}
          safeZonePadding={safeZonePadding}
          isVisible={true}
        />
        
        {/* Izgara çizgileri */}
        <div className={styles.gridLines}></div>
        
        {/* Optik Elemanlar */}
        {pageElements.map(element => (
          <OptikElement
            key={element.uniqueId}
            type={element.type}
            rows={element.rows}
            cols={element.cols}
            position={element.position}
            size={element.size}
            content={element.content}
            isActive={activeElementId === element.uniqueId}
            onActivate={() => setActiveElement(element.uniqueId)}
            onRemove={() => removeElement(element.uniqueId)}
            startNumber={element.startNumber || 1}
            customBubbleValues={customBubbleValues[element.uniqueId] || {}}
            onBubbleContentUpdate={(rowCol, value) => 
              handleBubbleContentUpdate(element.uniqueId, rowCol, value)
            }
          />
        ))}
        
        {/* İmleç gösterge alanı - sadece seçim modu aktifken */}
        {selectedTool && !isCreating && (
          <div className={styles.cursorGuide} />
        )}
      </div>
    </div>
  );
});

export default A4Container;