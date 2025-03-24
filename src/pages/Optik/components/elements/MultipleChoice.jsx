import React, { memo } from 'react';
import styles from './Elements.module.css';

const MultipleChoice = memo(function MultipleChoice({ questionCount, image }) {
  return (
    <div className={styles.multipleChoice}>
      <img src={image} alt={`${questionCount} Soruluk Test`} className={styles.image} />
    </div>
  );
});

export default MultipleChoice;
