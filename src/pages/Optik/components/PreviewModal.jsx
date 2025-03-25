// src/pages/Optik/components/PreviewModal.jsx
import React from 'react';
import Button from '../../../components/ui/Button/Button';
import FormRenderer from './FormRenderer';
import './PreviewModal.css';

const PreviewModal = ({ isOpen, onClose, pageElements, formTitle, onSave }) => {
  if (!isOpen) return null;

  // Kaydetme butonuna tıklandığında
  const handleSaveClick = () => {
    if (onSave && typeof onSave === 'function') {
      onSave();
    }
  };

  // Yazdırma fonksiyonu
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert('Popup engelleyiciyi devre dışı bırakın.');
    
    // Form renderer içeriğini kullanarak yazdırma sayfası oluştur
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${formTitle || 'Optik Form'}</title>
        <style>
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; }
          .container { position: relative; width: 210mm; height: 297mm; background: white; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div id="print-container" class="container">
          ${document.querySelector('.preview-paper').innerHTML}
        </div>
        <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 500); };</script>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
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
            />
          </div>
        </div>
        <div className="preview-modal-footer">
          <Button variant="outline" onClick={onClose}>Kapat</Button>
          <Button variant="secondary" onClick={handlePrint}>Yazdır</Button>
          <Button variant="primary" onClick={handleSaveClick}>Bu Görünümü Kaydet</Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;