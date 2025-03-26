import React, { useRef, useEffect, memo } from 'react';
import styles from './A4Container.module.css';
import PageElement from './PageElement';
import { useFormEditor } from '../context/FormEditorContext';
import { GRID_SIZE } from '../utils/helpers';
import pageElementStyles from './PageElement.module.css';

const A4Container = memo(function A4Container() {
  const {
    pageElements,
    activeElementId,
    editingTextId,
    editingContent,
    resizing,
    setActiveElement,
    updateElement,
    saveTextContent,
    addElement,
    handleResize,
    stopResize
  } = useFormEditor();
  
  const containerRef = useRef(null);
  const textInputRef = useRef(null);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const elementStartPosRef = useRef({ x: 0, y: 0 });
  
  // Boyutlandırma için olay dinleyicileri
  useEffect(() => {
    if (resizing && activeElementId) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', stopResize);
      
      return () => {
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', stopResize);
      };
    }
  }, [resizing, activeElementId, handleResize, stopResize]);
  
  // İki elementin çarpışıp çarpışmadığını kontrol et
  const checkCollision = (rect1, rect2) => {
    // Sadece tam üst üste gelme durumunu kontrol et, arada çok az bir boşluk olsa bile sorun yok
    return !(
      rect1.right <= rect2.left ||
      rect1.left >= rect2.right ||
      rect1.bottom <= rect2.top ||
      rect1.top >= rect2.bottom
    );
  };
  
  // Yeni pozisyonda çarpışma olup olmadığını kontrol et
  const isPositionValid = (elementId, newX, newY, width, height) => {
    // Eğer çarpışma kontrolünü tamamen devre dışı bırakmak istersek:
    //return true;
    
    // Sadece tam üst üste gelme durumunu kontrol edelim
    const newRect = {
      left: newX,
      top: newY,
      right: newX + width,
      bottom: newY + height
    };
    
    // Diğer elementlerle çarpışma kontrolü
    const hasCollision = pageElements.some(el => {
      if (el.uniqueId === elementId) return false; // Kendisiyle çarpışma kontrolü yapma
      
      const elDom = document.getElementById(el.uniqueId);
      if (!elDom) return false;
      
      const otherRect = {
        left: el.position.x,
        top: el.position.y,
        right: el.position.x + (el.size?.width || 220),
        bottom: el.position.y + (el.size?.height || 220)
      };
      
      return checkCollision(newRect, otherRect);
    });
    
    return !hasCollision;
  };
  
  const handleElementDragStart = (e, uniqueId) => {
    if (e.target.closest('.resize-handle') || e.target.closest('.editing')) {
      e.preventDefault();
      return;
    }
    
    // Yeni başlayan bir sürükleme için elemana tıklama yap
    setActiveElement(uniqueId);
    e.dataTransfer.setData('application/json', JSON.stringify({ uniqueId }));
    
    // Sürükleme başlangıç pozisyonlarını kaydet
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    
    const element = document.getElementById(uniqueId);
    if (element) {
      elementStartPosRef.current = {
        x: parseInt(element.style.left, 10) || 0,
        y: parseInt(element.style.top, 10) || 0
      };
      
      // Sürükleme sırasında opaklığı azalt ve önplanda göster
      element.classList.add(pageElementStyles.dragging);
      element.style.zIndex = "1000";
      
      // Element aktif olduğunu belirten bir veri özelliği ekle
      element.dataset.active = "true";
    }
    
    // Sürükleme sırasında gölge efektini kaldır
    e.dataTransfer.effectAllowed = 'move';
    const emptyImg = new Image();
    emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(emptyImg, 0, 0);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (activeElementId) {
      const deltaX = e.clientX - dragStartPosRef.current.x;
      const deltaY = e.clientY - dragStartPosRef.current.y;
      
      const newX = elementStartPosRef.current.x + deltaX;
      const newY = elementStartPosRef.current.y + deltaY;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      const activeElement = document.getElementById(activeElementId);
      if (activeElement) {
        const width = activeElement.offsetWidth;
        const height = activeElement.offsetHeight;
        
        // Grid'e snap et ve sınırlar içinde tut
        // Tam grid'e hizalama
        const x = Math.round(Math.max(0, Math.min(rect.width - width, newX)) / GRID_SIZE) * GRID_SIZE;
        const y = Math.round(Math.max(0, Math.min(rect.height - height, newY)) / GRID_SIZE) * GRID_SIZE;
        
        // Her zaman pozisyonu güncelle, çarpışma olsa bile taşınabilir olsun
        activeElement.style.left = `${x}px`;
        activeElement.style.top = `${y}px`;
        
        // İçerik görünürlüğünü artır
        const contentElements = activeElement.querySelectorAll('img, .' + pageElementStyles.textContent);
        contentElements.forEach(el => {
          el.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
          el.style.boxShadow = '0 0 8px rgba(255, 165, 100, 0.3)';
          el.style.border = '1px dashed rgba(255, 155, 100, 0.6)';
        });
        
        // Çarpışma durumunu görsel olarak belirt
        if (!isPositionValid(activeElementId, x, y, width, height)) {
          activeElement.style.borderColor = 'red';
          activeElement.style.borderWidth = '2px';
          activeElement.style.boxShadow = '0 0 6px rgba(255, 0, 0, 0.5)';
          activeElement.style.opacity = '0.8';
          activeElement.dataset.validPosition = "false";
        } else {
          activeElement.style.borderColor = '';
          activeElement.style.borderWidth = '';
          activeElement.style.boxShadow = '';
          activeElement.style.opacity = '';
          activeElement.dataset.validPosition = "true";
        }
      }
    }
  };
  
  const handleElementDragEnd = () => {
    if (activeElementId) {
      const activeElement = document.getElementById(activeElementId);
      if (activeElement) {
        // Sürükleme bittiğinde opaklığı normale döndür
        activeElement.classList.remove(pageElementStyles.dragging);
        
        // Z-index'i aktif element seviyesine döndür
        activeElement.style.zIndex = "2";
        
        // İçerik görünürlüğünü normale döndür
        const contentElements = activeElement.querySelectorAll('img, .' + pageElementStyles.textContent);
        contentElements.forEach(el => {
          el.style.backgroundColor = '';
          el.style.boxShadow = '';
          el.style.border = '';
        });
        
        // Element pozisyonu ve özellikleri
        const x = parseInt(activeElement.style.left, 10);
        const y = parseInt(activeElement.style.top, 10);
        const width = activeElement.offsetWidth;
        const height = activeElement.offsetHeight;
        
        // Kenarlık rengini normale döndür
        activeElement.style.borderColor = "";
        activeElement.style.borderWidth = "";
        activeElement.style.boxShadow = "";
        activeElement.style.opacity = "";
        
        // Çarpışma kontrolü
        if (isPositionValid(activeElementId, x, y, width, height)) {
          // Çarpışma yoksa yeni pozisyonu kaydet
          updateElement(activeElementId, {
            position: { x, y }
          });
        } else {
          // Çarpışma varsa orijinal pozisyona geri dön
          activeElement.style.left = `${elementStartPosRef.current.x}px`;
          activeElement.style.top = `${elementStartPosRef.current.y}px`;
        }
        
        // Elementi her zaman aktif tut ve draggable yap
        activeElement.draggable = true;
        setActiveElement(activeElementId);
        activeElement.classList.add(pageElementStyles.draggableActive);
      }
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    
    const elementDataStr = e.dataTransfer.getData('application/json');
    if (!elementDataStr) return;
    
    const elementData = JSON.parse(elementDataStr);
    
    if (!elementData.uniqueId) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      // Tıklanan noktayı grid'e hizala
      const gridX = Math.round((e.clientX - rect.left) / GRID_SIZE) * GRID_SIZE;
      const gridY = Math.round((e.clientY - rect.top) / GRID_SIZE) * GRID_SIZE;
      
      // Varsayılan boyutlar (22 mazgal)
      const mazgalSayisi = 22;
      const width = GRID_SIZE * mazgalSayisi;
      const height = GRID_SIZE * mazgalSayisi;
      
      // Pozisyon uygunsa (tam üst üste gelme yoksa) ekle, değilse boş alana yerleştir
      if (pageElements.length === 0 || isPositionValid(null, gridX, gridY, width, height)) {
        addElement(elementData, { x: gridX, y: gridY });
      } else {
        // Alternatif konumlar ara
        const altPositions = [];
        
        // 8 farklı yönde alternatif pozisyonlar
        for (let i = 1; i <= 10; i++) {
          const step = i * GRID_SIZE;
          const positions = [
            { x: gridX + step, y: gridY }, // sağa
            { x: gridX - step, y: gridY }, // sola
            { x: gridX, y: gridY + step }, // aşağı
            { x: gridX, y: gridY - step }, // yukarı
            { x: gridX + step, y: gridY + step }, // sağ aşağı
            { x: gridX - step, y: gridY - step }, // sol yukarı
            { x: gridX + step, y: gridY - step }, // sağ yukarı
            { x: gridX - step, y: gridY + step }  // sol aşağı
          ];
          
          for (const pos of positions) {
            // Sınırlar içinde olan ve çakışmayan ilk pozisyonu kullan
            if (pos.x >= 0 && pos.x <= rect.width - width &&
                pos.y >= 0 && pos.y <= rect.height - height &&
                isPositionValid(null, pos.x, pos.y, width, height)) {
              altPositions.push(pos);
            }
          }
          
          // Eğer alternatif pozisyonlar bulunduysa, ilkini kullan
          if (altPositions.length > 0) {
            addElement(elementData, altPositions[0]);
            return;
          }
        }
        
        // Eğer hiç uygun pozisyon bulunamadıysa, varsayılan olarak sol üst köşe
        addElement(elementData, { x: 0, y: 0 });
      }
    }
  };
  
  const handleContainerClick = (e) => {
    // Eğer doğrudan container veya gridlines'a tıklandıysa
    if (e.target === containerRef.current || e.target.className.includes('grid-lines')) {
      // Düzenleme yapılıyorsa, metin içeriğini kaydet
      saveTextContent();
      
      // Ve aktif elementi temizle
      setActiveElement(null);
    }
  };
  
  return (
    <div className={styles.wrapper}>
      <div 
        ref={containerRef}
        id="a4-container"
        className={styles.container}
        onDragOver={handleDragOver}
        onDragEnter={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={handleContainerClick}
      >
        <div className={styles.gridLines}></div>
        
        {pageElements.map(element => (
          <PageElement
            key={element.uniqueId}
            element={element}
            isActive={activeElementId === element.uniqueId}
            isResizing={resizing && activeElementId === element.uniqueId}
            isEditing={editingTextId === element.uniqueId}
            editingContent={editingTextId === element.uniqueId ? editingContent : ''}
            onDragStart={handleElementDragStart}
            onDragEnd={handleElementDragEnd}
            textInputRef={textInputRef}
          />
        ))}
      </div>
    </div>
  );
});

export default A4Container;