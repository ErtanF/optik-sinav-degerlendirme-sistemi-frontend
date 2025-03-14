import React from 'react';

const FormElementsSidebar = ({ formElements, onDragStart }) => {
  const styles = {
    container: {
      backgroundColor: 'white',
      border: '1px solid var(--border-color)',
      borderRadius: '4px'
    },
    title: {
      fontSize: '16px',
      padding: '12px',
      borderBottom: '1px solid var(--border-color)',
      color: 'var(--primary-color)',
      fontWeight: '500'
    },
    elementsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '10px',
      maxHeight: '400px', // Sabit yükseklik
      overflowY: 'auto' // Kaydırma çubuğu ekler
    },
    elementItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '10px',
      border: '1px solid var(--border-color)',
      borderRadius: '4px',
      cursor: 'grab',
      backgroundColor: 'white'
    },
    elementImage: {
      maxWidth: '100%',
      marginBottom: '8px'
    },
    elementTitle: {
      fontSize: '14px',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>Form Elemanları</div>
      <div style={styles.elementsList}>
        {formElements.map(element => (
          <div
            key={element.id}
            style={styles.elementItem}
            draggable
            onDragStart={(e) => onDragStart(e, element)}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.borderColor = 'var(--primary-color-light)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <img 
              src={element.image} 
              alt={element.title} 
              style={styles.elementImage} 
            />
            <span style={styles.elementTitle}>{element.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormElementsSidebar;