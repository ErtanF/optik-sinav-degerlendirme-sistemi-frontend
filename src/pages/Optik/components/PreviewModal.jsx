import React from 'react';
import Button from '../../../components/ui/Button/Button';
import FormRenderer from './FormRenderer';
import './PreviewModal.css';

const PreviewModal = ({ 
  isOpen, 
  onClose, 
  pageElements, 
  formTitle, 
  onSave,
  customBubbleValues = {}
}) => {
  if (!isOpen) return null;

  // Kaydetme butonuna tıklandığında
  const handleSaveClick = () => {
    if (onSave && typeof onSave === 'function') {
      onSave();
    }
  };

  return (
    <div className="preview-modal-overlay">
      <div className="preview-modal">
        <div className="preview-modal-header">
          <h2>Önizleme: {formTitle || 'Optik Form'}</h2>
          <button className="preview-close-button" onClick={onClose}>×</button>
        </div>
        <div className="preview-modal-body">
          <div className="preview-paper">
            <FormRenderer 
              pageElements={pageElements}
              formTitle={formTitle}
              visible={true}
              showGrid={false}
              customBubbleValues={customBubbleValues}
            />
          </div>
        </div>
        <div className="preview-modal-footer">
          <Button variant="outline" onClick={onClose}>Kapat</Button>
          <Button variant="primary" onClick={handleSaveClick}>Bu Görünümü Kaydet</Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;