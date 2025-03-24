import React, { useRef, useEffect, memo } from 'react';
import styles from './A4Container.module.css';
import PageElement from './PageElement';
import { useFormEditor } from '../context/FormEditorContext';
import { snapToGrid } from '../utils/helpers';

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
    setResizing,
    setResizeCorner,
    addElement,
    handleResize, // Resize işlemi için gerekli
    stopResize    // Resize işlemini durdurmak için gerekli
  } = useFormEditor();
  
  const containerRef = useRef(null);
  const textInputRef = useRef(null);
  
  // Boyutlandırma için olay dinleyicileri
  useEffect(() => {
    if (resizing && activeElementId) {
      console.log('Setting up resize event listeners');
      
      // MouseMove olayı ile boyutu değiştirme
      window.addEventListener('mousemove', handleResize);
      
      // MouseUp olayı ile boyutlandırmayı sonlandırma
      window.addEventListener('mouseup', stopResize);
      
      return () => {
        console.log('Cleaning up resize event listeners');
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', stopResize);
      };
    }
  }, [resizing, activeElementId, handleResize, stopResize]);
  
  // Drag & Drop olayları
  const handleElementDragStart = (e, uniqueId) => {
    if (e.target.closest('.resize-handle') || e.target.closest('.editing')) {
      e.preventDefault();
      return;
    }
    
    setActiveElement(uniqueId);
    e.dataTransfer.setData('application/json', JSON.stringify({ uniqueId }));
    
    // Görünmez sürükleme resmi
    const emptyImg = new Image();
    emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(emptyImg, 0, 0);
  };
  
  const handleElementDragEnd = () => {
    if (activeElementId) {
      const activeElement = document.getElementById(activeElementId);
      if (activeElement) {
        updateElement(activeElementId, {
          position: {
            x: parseInt(activeElement.style.left, 10),
            y: parseInt(activeElement.style.top, 10)
          }
        });
      }
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    
    if (activeElementId) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      const x = snapToGrid(e.clientX - rect.left);
      const y = snapToGrid(e.clientY - rect.top);
      
      const activeElement = document.getElementById(activeElementId);
      if (activeElement) {
        activeElement.style.left = `${x}px`;
        activeElement.style.top = `${y}px`;
      }
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    
    const elementDataStr = e.dataTransfer.getData('application/json');
    if (!elementDataStr) return;
    
    const elementData = JSON.parse(elementDataStr);
    
    // Yeni eleman ekle (mevcut bir elemanın sürüklenmesi değilse)
    if (!elementData.uniqueId) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      const x = snapToGrid(e.clientX - rect.left);
      const y = snapToGrid(e.clientY - rect.top);
      
      console.log('Adding new element:', elementData, 'at position:', { x, y });
      addElement(elementData, { x, y });
    }
  };
  
  const handleContainerClick = (e) => {
    if (e.target === containerRef.current || e.target.className.includes('grid-lines')) {
      setActiveElement(null);
      saveTextContent();
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