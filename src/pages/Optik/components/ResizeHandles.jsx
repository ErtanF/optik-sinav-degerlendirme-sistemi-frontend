import React from 'react';

const ResizeHandles = ({ onStartResize }) => {
  // CSS stillerini içeri entegre ettim
  const styles = {
    handle: {
      position: 'absolute',
      width: '12px',
      height: '12px',
      backgroundColor: 'white',
      border: '1px solid var(--primary-color)',
      borderRadius: '50%',
      opacity: 0,
      transition: 'opacity 0.2s ease, background-color 0.2s ease'
    },
    topLeft: {
      top: '-6px',
      left: '-6px',
      cursor: 'nwse-resize'
    },
    topRight: {
      top: '-6px',
      right: '-6px',
      cursor: 'nesw-resize'
    },
    bottomLeft: {
      bottom: '-6px',
      left: '-6px',
      cursor: 'nesw-resize'
    },
    bottomRight: {
      bottom: '-6px',
      right: '-6px',
      cursor: 'nwse-resize'
    }
  };

  const corners = [
    { name: 'top-left', style: styles.topLeft, corner: 'topLeft' },
    { name: 'top-right', style: styles.topRight, corner: 'topRight' },
    { name: 'bottom-left', style: styles.bottomLeft, corner: 'bottomLeft' },
    { name: 'bottom-right', style: styles.bottomRight, corner: 'bottomRight' }
  ];

  return (
    <>
      {corners.map(({name, style, corner}) => (
        <div 
          key={name}
          className={`resize-handle ${name}`}
          style={{
            ...styles.handle,
            ...style
          }}
          onMouseDown={(e) => onStartResize(e, corner)}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-color-light)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
          }}
        />
      ))}
    </>
  );
};

export default ResizeHandles;