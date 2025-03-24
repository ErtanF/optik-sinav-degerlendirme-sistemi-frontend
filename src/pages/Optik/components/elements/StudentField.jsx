import React, { memo } from 'react';
import styles from './Elements.module.css';

const StudentField = memo(function StudentField({ type, content, editable, onEdit }) {
  const getPlaceholder = () => {
    switch (type) {
      case 'nameSurname': return 'Ad Soyad Bilgisi';
      case 'schoolNumber': return 'Okul Numarası Bilgisi';
      case 'classInfo': return 'Sınıf Bilgisi';
      default: return 'Çift tıklayarak düzenle';
    }
  };

  return (
    <div 
      className={styles.studentField}
      onDoubleClick={editable ? onEdit : undefined}
    >
      {content || getPlaceholder()}
    </div>
  );
});

export default StudentField;