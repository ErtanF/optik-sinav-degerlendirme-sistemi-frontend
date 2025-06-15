// src/pages/Optik/components/LeftSidebar.jsx
import React from 'react';
import FormElementsSidebar from './FormElementsSidebar';
import ElementPropertiesPanel from './ElementPropertiesPanel';
import styles from './LeftSidebar.module.css';
import { useFormEditor } from '../context/FormEditorContext';

const LeftSidebar = () => {
  const { activeElementId } = useFormEditor();
  
  return (
    <div className={styles.container}>
      {/* Sadece aktif eleman özellikleri paneli */}
      {activeElementId && <ElementPropertiesPanel />}
      
      {/* Form Elemanları Seçici */}
      <FormElementsSidebar />
    </div>
  );
};

export default LeftSidebar;