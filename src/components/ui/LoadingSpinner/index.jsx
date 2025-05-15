import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = "medium", color = "#2563eb" }) => {
  const sizeClass = `spinner-${size}`;
  
  return (
    <div className="spinner-container">
      <div className={`spinner ${sizeClass}`} style={{ borderTopColor: color }} />
    </div>
  );
};

export default LoadingSpinner; 