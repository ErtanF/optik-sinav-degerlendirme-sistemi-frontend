import React from 'react';
import StudentSelector from './StudentSelector';
import FormElementsSidebar from './FormElementsSidebar';
import { formElementsData } from '../utils/formElements';
import { useFormEditor } from '../context/FormEditorContext';
import styles from './LeftSidebar.module.css';

const LeftSidebar = () => {
  const { updateStudentFields } = useFormEditor();
  
  // Öğrenci seçildiğinde
  const handleStudentSelect = (student) => {
    updateStudentFields(student);
  };
  
  return (
    <div className={styles.container}>
      <StudentSelector onStudentSelect={handleStudentSelect} />
      <FormElementsSidebar formElements={formElementsData} />
    </div>
  );
};

export default LeftSidebar;