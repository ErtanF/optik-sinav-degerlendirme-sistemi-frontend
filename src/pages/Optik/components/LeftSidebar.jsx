import React from 'react';
import StudentSelector from './StudentSelector';
import FormElementsSidebar from './FormElementsSidebar';

// LeftSidebar bileşeni, StudentSelector ve FormElementsSidebar bileşenlerini birleştirir
const LeftSidebar = ({ formElements, onDragStart, onStudentSelect }) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: '15px'
    }
  };

  return (
    <div style={styles.container}>
      <StudentSelector onStudentSelect={onStudentSelect} />
      <FormElementsSidebar 
        formElements={formElements} 
        onDragStart={onDragStart} 
      />
    </div>
  );
};

export default LeftSidebar;