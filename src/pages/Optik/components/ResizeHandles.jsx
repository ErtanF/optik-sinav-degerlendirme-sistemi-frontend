import React, { memo } from 'react';
import { useFormEditor } from '../context/FormEditorContext';
import styles from './ResizeHandles.module.css';

const ResizeHandles = memo(function ResizeHandles({ elementId }) {
  const { startResize } = useFormEditor();

  const corners = [
    { name: 'topLeft', className: styles.topLeft, corner: 'topLeft' },
    { name: 'topRight', className: styles.topRight, corner: 'topRight' },
    { name: 'bottomLeft', className: styles.bottomLeft, corner: 'bottomLeft' },
    { name: 'bottomRight', className: styles.bottomRight, corner: 'bottomRight' }
  ];

  return (
    <>
      {corners.map(({name, className, corner}) => (
        <div 
          key={name}
          className={`resize-handle ${styles.handle} ${className}`}
          onMouseDown={(e) => {
            console.log('Resize handle mousedown:', corner);
            startResize(e, elementId, corner);
          }}
        />
      ))}
    </>
  );
});

export default ResizeHandles;