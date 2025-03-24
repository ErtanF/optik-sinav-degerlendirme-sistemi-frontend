import React, { memo } from 'react';
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
  
  const elementStyle = {
    left: `${element.position?.x || 0}px`,
    top: `${element.position?.y || 0}px`,
    width: element.size?.width ? `${element.size.width}px` : 'auto',
    height: element.size?.height ? `${element.size.height}px` : 'auto',
  };

  // Basit sınıf birleştirme
  const elementClassName = `page-element ${styles.pageElement} ${isActive ? styles.active : ''} ${isResizing ? styles.resizing : ''} ${(element.type === 'text' || element.type === 'field') ? styles.textElement : ''} ${isEditing ? styles.editing : ''}`;

  const handleActivate = (e) => {
    e.stopPropagation();
    setActiveElement(element.uniqueId);
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
          className={styles.textContent}
          onDoubleClick={() => startEditing(element)}
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
      // Resim türü için özel işleme
      return (
        <img 
          src={element.content || element.image} 
          alt="Form Image" 
          className={styles.formImage}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      );
    }
  

    return <img src={element.image} alt={element.title} className={styles.image} />;
  };

  return (
    <div
      id={element.uniqueId}
      className={elementClassName}
      style={elementStyle}
      draggable={!isResizing && !isEditing}
      onDragStart={(e) => onDragStart(e, element.uniqueId)}
      onDragEnd={onDragEnd}
      onClick={handleActivate}
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