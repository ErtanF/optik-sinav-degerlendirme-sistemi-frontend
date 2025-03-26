import React from 'react';
import StudentSelector from './StudentSelector';
import FormElementsSidebar from './FormElementsSidebar';
import { formElementsData } from '../utils/formElements';
import styles from './LeftSidebar.module.css';

const LeftSidebar = () => {
  

  
  return (
    <div className={styles.container}>
      <FormElementsSidebar formElements={formElementsData} />
    </div>
  );
};

export default LeftSidebar;