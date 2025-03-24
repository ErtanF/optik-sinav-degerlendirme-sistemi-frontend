import React, { memo } from 'react';
import styles from './Elements.module.css';

const TextField = memo(function TextField({ content, editable, onEdit }) {
  return (
    <div 
      className={styles.textField}
      onDoubleClick={editable ? onEdit : undefined}
    >
      {content || 'Çift tıklayarak düzenle'}
    </div>
  );
});

export default TextField;