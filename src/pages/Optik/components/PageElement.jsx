import React, { memo, useEffect, useRef } from 'react';
import styles from './PageElement.module.css';
import ResizeHandles from './ResizeHandles';
import TextEditor from './TextEditor';
import { useFormEditor } from '../context/FormEditorContext';

const PageElement = memo(function PageElement({
  element,
  isActive,
  isResizing,
  isEditing,
  editingContent,
  onDragStart,
  onDragEnd,
  textInputRef
}) {
  const { 
    setActiveElement, 
    removeElement, 
    startEditing, 
    handleContentChange, 
    saveTextContent,
    setEditingTextId,
    setEditingContent
  } = useFormEditor();
  
  const elementRef = useRef(null);
  const dragStartPosRef = useRef(null);
  const elementStartPosRef = useRef(null);
  
  // Sürükleme sonrası elementin draggable özelliğinin tekrar etkinleştirilmesini sağla
  useEffect(() => {
    const elementNode = elementRef.current;
    
    if (elementNode && isActive && !isResizing && !isEditing) {
      // DragEnd olayından sonra draggable özelliğini yeniden ayarla
      const enableDraggable = () => {
        elementNode.draggable = true;
      };
      
      elementNode.addEventListener('dragend', enableDraggable);
      
      return () => {
        elementNode.removeEventListener('dragend', enableDraggable);
      };
    }
  }, [isActive, isResizing, isEditing]);
  
  // Sürüklenen element için daha iyi yönetim
  useEffect(() => {
    if (isActive && !isResizing && !isEditing && elementRef.current) {
      const element = elementRef.current;
      
      // Element aktif olduğunda draggable yap
      element.draggable = true;
      
      // Element draggable olduğunda CSS'i güncelle
      if (element.draggable) {
        element.classList.add(styles.draggableActive);
      }
      
      return () => {
        element.classList.remove(styles.draggableActive);
      };
    }
  }, [isActive, isResizing, isEditing]);
  
  const elementStyle = {
    left: `${element.position?.x || 0}px`,
    top: `${element.position?.y || 0}px`,
    width: element.size?.width ? `${element.size.width}px` : '450px',
    height: element.size?.height ? `${element.size.height}px` : '260px',
  };

  // Basit sınıf birleştirme
  const elementClassName = `page-element ${styles.pageElement} ${isActive ? styles.active : ''} ${isResizing ? styles.resizing : ''} ${(element.type === 'text' || element.type === 'field') ? styles.textElement : ''} ${isEditing ? styles.editing : ''}`;

  const handleActivate = (e) => {
    e.stopPropagation();
    setActiveElement(element.uniqueId);
    
    // Tıklandığında da draggable özelliğini aktifleştir
    if (elementRef.current) {
      elementRef.current.draggable = !isResizing && !isEditing;
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    removeElement(element.uniqueId);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveTextContent();
    } else if (e.key === 'Escape') {
      setEditingTextId(null);
      setEditingContent('');
    }
  };

  // Sürükleme bittiğinde elementi tekrar sürüklenebilir yapma
  const handleCustomDragEnd = (e) => {
    // Normal sürükleme bitirme işlemini yap
    onDragEnd(e);
    
    // Elementi aktif ve sürüklenebilir halde tut
    if (elementRef.current) {
      elementRef.current.draggable = true;
      setActiveElement(element.uniqueId);
      elementRef.current.classList.add(styles.draggableActive);
    }
  };

  const handleElementDragStart = (e) => {
    if (e.target.closest('.resize-handle') || e.target.closest('.editing')) {
      e.preventDefault();
      return;
    }
    
    // Yeni başlayan bir sürükleme için elemana tıklama yap
    setActiveElement(element.uniqueId);
    e.dataTransfer.setData('application/json', JSON.stringify({ uniqueId: element.uniqueId }));
    
    // onDragStart callback'i çağır
    onDragStart(e, element.uniqueId);
    
    // Sürükleme başlangıç pozisyonlarını kaydet
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    
    const elementNode = document.getElementById(element.uniqueId);
    if (elementNode) {
      elementStartPosRef.current = {
        x: parseInt(elementNode.style.left, 10) || 0,
        y: parseInt(elementNode.style.top, 10) || 0
      };
      
      // Sürükleme sırasında opaklığı azalt ve önplanda göster
      elementNode.classList.add(styles.dragging);
      elementNode.style.zIndex = "1000";
      
      // İçerik görünürlüğünü artır
      const contentElements = elementNode.querySelectorAll('img, .' + styles.textContent);
      contentElements.forEach(el => {
        el.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        el.style.boxShadow = '0 0 8px rgba(255, 165, 100, 0.3)';
        el.style.border = '1px dashed rgba(255, 155, 100, 0.6)';
      });
      
      // Element aktif olduğunu belirten bir veri özelliği ekle
      elementNode.dataset.active = "true";
    }
    
    // Sürükleme sırasında gölge efektini kaldır
    e.dataTransfer.effectAllowed = 'move';
    const emptyImg = new Image();
    emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(emptyImg, 0, 0);
  };

  const renderContent = () => {
    if ((element.type === 'text' || element.type === 'field') && isEditing) {
      return (
        <TextEditor
          content={editingContent}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          inputRef={textInputRef}
        />
      );
    }

    if (element.type === 'text' || element.type === 'field') {
      return (
        <div 
          className={`${styles.textContent} ${isActive ? styles.activeContent : ''}`}
          onDoubleClick={() => startEditing(element)}
          style={{ 
            backgroundColor: element.type === 'field' ? 'rgba(252, 228, 215, 0.8)' : 'transparent',
            border: element.type === 'field' ? '1px dashed rgba(255, 155, 100, 0.5)' : 'none'
          }}
        >
          {element.content || (element.type === 'field' ? 
            element.title === 'Ad Soyad Alanı' ? 'Ad Soyad Bilgisi' : 
            element.title === 'Okul Numarası' ? 'Okul Numarası Bilgisi' : 
            element.title === 'Sınıf Bilgisi' ? 'Sınıf Bilgisi' : 
            'Çift tıklayarak düzenle' : 
            'Çift tıklayarak düzenle')}
        </div>
      );
    }

    if (element.type === 'image') {
      // Resmin tipini kontrol et
      console.log("Image element:", element);
      return (
        <div className={styles.imageContainer}>
          <img 
            src={element.content} 
            alt="Form Image" 
            className={`${styles.formImage} ${isActive ? styles.activeContent : ''}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => {
              console.error("Image failed to load:", e);
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M20.4 14.5L16 10 4 20"/></svg>';
              e.target.style.padding = '20px';
              e.target.style.opacity = '0.5';
            }}
          />
        </div>
      );
    }
    
    // Diğer optik elemanlar için (nameSurname, number, tcNumber, phoneNumber, multipleChoice)
    return (
      <div className={styles.optikElementContent}>
        {element.type && (
          <div className={styles.optikElementLabel}>
            {element.type === 'nameSurname' ? 'Ad Soyad Alanı' : 
             element.type === 'number' ? 'Numara Alanı' : 
             element.type === 'tcNumber' ? 'TC Kimlik No' : 
             element.type === 'phoneNumber' ? 'Telefon No' : 
             element.type === 'multipleChoice' ? 'Çoktan Seçmeli Test' : 
             element.title || 'Eleman'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      id={element.uniqueId}
      ref={elementRef}
      className={elementClassName}
      style={elementStyle}
      draggable={!isResizing && !isEditing}
      onDragStart={handleElementDragStart}
      onDragEnd={handleCustomDragEnd}
      onClick={handleActivate}
      data-draggable="true"
      data-element-id={element.uniqueId}
      data-is-active={isActive}
      data-element-type={element.type}
    >
      {renderContent()}
      
      <button 
        className={`remove-element ${styles.removeButton}`}
        onClick={handleRemove}
      >
        &times;
      </button>
      
      {isActive && (
        <ResizeHandles 
          elementId={element.uniqueId}
        />
      )}
    </div>
  );
});

export default PageElement;