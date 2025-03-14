import React, { useRef, useEffect } from 'react';
import PageElement from './PageElement';
import { useDragDrop } from '../hooks/useDragDrop';
import { useResizeElement } from '../hooks/useResizeElement';
import { useTextEditing } from '../hooks/useTextEditing';
import { GRID_SIZE } from '../utils/constants';

const A4Container = ({ pageElements, setPageElements }) => {
  // CSS stillerini içeri entegre ettim
  const styles = {
    wrapper: {
      backgroundColor: 'var(--background-color)',
      borderRadius: '8px',
      boxShadow: 'var(--shadow-sm)',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%'
    },
    container: {
      position: 'relative',
      aspectRatio: '210/297', // A4 oranı
      height: '100%',
      maxHeight: '100%',
      width: 'auto',
      backgroundColor: 'white',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    },
    gridLines: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
      backgroundImage: `
        linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
      `,
      pointerEvents: 'none'
    }
  };
  
  const containerRef = useRef(null);
  
  // Resize hook'unu kullan
  const {
    resizing,
    resizeCorner,
    activeElementId,
    setActiveElementId,
    startResize,
    handleResize,
    stopResize
  } = useResizeElement(pageElements, setPageElements);
  
  // Text editing hook'unu kullan
  const {
    editingTextId,
    editingContent,
    textInputRef,
    startEditing,
    handleContentChange,
    handleKeyDown,
    saveTextContent,
    cancelTextEditing
  } = useTextEditing(pageElements, setPageElements);
  
  // Drag & Drop hook'unu kullan
  const {
    handleElementDragStart,
    handleElementDragEnd,
    handleSidebarDragStart,
    handleDragOver,
    handleDrop
  } = useDragDrop(pageElements, setPageElements, activeElementId, setActiveElementId);
  
  // Resize için olay dinleyicileri
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
  
  const handleContainerClick = (e) => {
    if (e.target === containerRef.current || e.target.className.includes('grid-lines')) {
      setActiveElementId(null);
      saveTextContent();
    }
  };

  // Sayfaya eklenen elemanların ölçeklendirilmesi
  const calculateScale = () => {
    if (!containerRef.current) return 1;
    
    // A4 kağıdının gerçek boyutu 210mm x 297mm
    // Burada container'ın gerçek boyutuna göre ölçek faktörünü hesaplıyoruz
    const realA4Height = 297; // mm
    const containerHeight = containerRef.current.offsetHeight;
    
    // 1mm = X piksel olarak ölçek faktörü
    return containerHeight / realA4Height;
  };
  
  return (
    <div style={styles.wrapper} className="a4-container-wrapper">
      <div 
        ref={containerRef}
        id="a4-container"
        style={styles.container}
        className="a4-container"
        onDragOver={(e) => {
          e.preventDefault();
          handleDragOver(e);
        }}
        onDragEnter={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={handleContainerClick}
      >
        <div style={styles.gridLines} className="grid-lines"></div>
        
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
            onActivate={() => {
              if (editingTextId !== element.uniqueId) {
                saveTextContent();
                setActiveElementId(element.uniqueId);
              }
            }}
            onStartResize={startResize}
            onRemove={() => {
              if (editingTextId === element.uniqueId) cancelTextEditing();
              setPageElements(elements => elements.filter(el => el.uniqueId !== element.uniqueId));
            }}
            onStartEditing={() => startEditing(element)}
            onContentChange={handleContentChange}
            onKeyDown={handleKeyDown}
            textInputRef={textInputRef}
            scale={calculateScale()}
          />
        ))}
      </div>
    </div>
  );
};

export default A4Container;