import React, { useRef, memo } from 'react';
import styles from './A4Container.module.css';
import OptikElement from './elements/OptikElement';
import { useFormEditor } from '../context/FormEditorContext';

const A4Container = memo(function A4Container() {
  const {
    pageElements,
    activeElementId,
    selectedTool,
    isCreating,
    customBubbleValues,
    updateBubbleContent,
    updateElement,
    setActiveElement,
    removeElement,
    handleCanvasClick,
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
  
  // Yazı alanı içeriğini güncelleme
  const handleContentUpdate = (elementId, content) => {
    updateElement(elementId, { content });
  };
  
  // Element başlığını güncelleme
  const handleTitleChange = (elementId, title) => {
    updateElement(elementId, { title });
  };

  // Grid çizgileri her 20px'de bir olduğu için, noktalarda da aynı grid hizalamasını kullanacağız
  // Her bir grid çizgisine denk gelen nokta oluşturacağız
  // Toplam nokta sayısı (A4 kağıdının yüksekliği / grid boyutu)
  const gridSize = 20; // Grid boyutu (piksel)
  const a4Height = 1122; // A4 kağıdının yaklaşık yüksekliği (piksel)
  const dots = [];

  // Elle hesaplayarak her bir noktayı grid hizasında oluştur
  // İlk noktayı 10px aşağıdan başlat, son noktayı dahil etme
  for (let i = 10 + (gridSize * 2); i < a4Height - gridSize; i += gridSize) {
  dots.push(
    <div 
      key={i} 
      className={styles.dot} 
      style={{ 
        position: 'absolute', 
        top: `${i}px`,
        width: `${gridSize}px`,
        height: '5px',
        left: '0',
        borderRadius: '0'
      }}
    />
  );
}

  // Sağındaki sütunun 2. satırına büyük nokta ekle
  dots.push(
    <div 
      key="specialDot"
      style={{ 
        position: 'absolute', 
        top: '45px',
        left: '45px',
        width: '12px',
        height: '12px',
        backgroundColor: '#000',
        borderRadius: '50%',
        zIndex: '10'
      }}
    />
    
  );
  dots.push(
    <div 
      key="specialDot1"
      style={{ 
        position: 'absolute', 
        top: '45px',
        left: '725px',
        width: '12px',
        height: '12px',
        backgroundColor: '#000',
        borderRadius: '50%',
        zIndex: '10'
      }}
    />
    
  );
  dots.push(
    <div 
      key="specialDot4"
      style={{ 
        position: 'absolute', 
        top: '45px',
        left: '705px',
        width: '12px',
        height: '12px',
        backgroundColor: '#000',
        borderRadius: '50%',
        zIndex: '10'
      }}
    />
    
  );
  dots.push(
    <div 
      key="specialDot2"
      style={{ 
        position: 'absolute', 
        top: '1085px',
        left: '45px',
        width: '12px',
        height: '12px',
        backgroundColor: '#000',
        borderRadius: '50%',
        zIndex: '10'
      }}
    />
    
  );
  
  return (
    <div className={styles.wrapper}>
      <div 
        ref={containerRef}
        id="a4-container"
        className={`${styles.container} ${selectedTool ? styles.toolSelected : ''}`}
        onClick={handleContainerClick}
      >
        {/* Sol kenarda noktalar - bu sefer tam grid hizasında konumlandırıyoruz */}
        <div className={styles.dotColumn}>
          {dots}
        </div>
        
        {/* Izgara çizgileri - daha az belirgin */}
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
            onContentUpdate={(content) => 
              handleContentUpdate(element.uniqueId, content)
            }
            onTitleChange={(title) => 
              handleTitleChange(element.uniqueId, title)
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