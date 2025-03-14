import React from 'react';
import ResizeHandles from './ResizeHandles';
import TextEditor from './TextEditor';

const PageElement = ({
  element,
  isActive,
  isResizing,
  isEditing,
  editingContent,
  onDragStart,
  onDragEnd,
  onActivate,
  onStartResize,
  onRemove,
  onStartEditing,
  onContentChange,
  onKeyDown,
  textInputRef
}) => {
  // CSS stillerini içeri entegre ettim
  const styles = {
    element: {
      position: 'absolute',
      left: `${element.position?.x || 0}px`,
      top: `${element.position?.y || 0}px`,
      width: element.size?.width ? `${element.size.width}px` : 'auto',
      height: element.size?.height ? `${element.size.height}px` : 'auto',
      cursor: isResizing ? 'nwse-resize' : 'grab',
      userSelect: 'none',
      backgroundColor: 'white',
      border: isActive 
        ? '1px solid var(--primary-color)' 
        : (isResizing ? '1px dashed var(--primary-color)' : '1px solid transparent'),
      borderRadius: '4px',
      transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      boxSizing: 'border-box',
      boxShadow: isActive 
        ? '0 0 0 2px rgba(var(--primary-color-rgb), 0.2)' 
        : 'none',
      opacity: isResizing ? 0.8 : 1
    },
    textElement: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isEditing ? 0 : '0.5rem'
    },
    image: {
      maxWidth: '100%',
      maxHeight: '100%',
      display: 'block',
      pointerEvents: 'none'
    },
    textContent: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontSize: '1rem',
      color: 'var(--text-color-dark)',
      overflow: 'hidden',
      cursor: 'text',
      outline: '1px dashed transparent',
      transition: 'outline-color 0.2s'
    },
    removeButton: {
      position: 'absolute',
      top: '-10px',
      right: '-10px',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      backgroundColor: 'var(--error-color)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      opacity: 0,
      transition: 'opacity 0.2s ease',
      zIndex: 10
    }
  };

  const elementClassName = `page-element 
    ${isActive ? 'active' : ''} 
    ${isResizing ? 'resizing' : ''} 
    ${element.type === 'text' ? 'text-element' : ''} 
    ${isEditing ? 'editing' : ''}`;

    const renderContent = () => {
        if (element.type === 'text' || element.type === 'field') {
          if (isEditing) {
            return (
              <TextEditor
                content={editingContent}
                onChange={onContentChange}
                onKeyDown={onKeyDown}
                inputRef={textInputRef}
              />
            );
          }
          return (
            <div 
              className="text-content"
              style={styles.textContent}
              onDoubleClick={() => onStartEditing(element)}
              onMouseOver={(e) => {
                e.currentTarget.style.outline = '1px dashed var(--primary-color-light)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.outline = '1px dashed transparent';
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
        return <img src={element.image} alt={element.title} style={styles.image} />;
      };

  return (
    <div
      id={element.uniqueId}
      className={elementClassName}
      style={{
        ...styles.element,
        ...(element.type === 'text' ? styles.textElement : {})
      }}
      draggable={!isResizing && !isEditing}
      onDragStart={(e) => onDragStart(e, element.uniqueId)}
      onDragEnd={onDragEnd}
      onClick={(e) => {
        e.stopPropagation();
        onActivate();
      }}
      onMouseOver={(e) => {
        if (!isActive && !isResizing) {
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          e.currentTarget.style.borderColor = 'var(--primary-color-light)';
        }
        
        // Remove butonunu göster
        const removeButton = e.currentTarget.querySelector('.remove-element');
        if (removeButton) removeButton.style.opacity = 1;
        
        // Resize handle'ları göster
        const resizeHandles = e.currentTarget.querySelectorAll('.resize-handle');
        resizeHandles.forEach(handle => handle.style.opacity = 1);
      }}
      onMouseOut={(e) => {
        if (!isActive && !isResizing) {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'transparent';
        }
        
        // Remove butonunu gizle
        const removeButton = e.currentTarget.querySelector('.remove-element');
        if (removeButton) removeButton.style.opacity = 0;
        
        // Resize handle'ları gizle
        const resizeHandles = e.currentTarget.querySelectorAll('.resize-handle');
        resizeHandles.forEach(handle => handle.style.opacity = 0);
      }}
    >
      {renderContent()}
      
      <button 
        className="remove-element"
        style={styles.removeButton}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        &times;
      </button>
      
      {isActive && <ResizeHandles onStartResize={(e, corner) => onStartResize(e, element.uniqueId, corner)} />}
    </div>
  );
};

export default PageElement;
