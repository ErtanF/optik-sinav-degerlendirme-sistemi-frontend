import React, { useEffect } from 'react';
import Button from '../../../components/ui/Button/Button';
import './PreviewModal.css';

const PreviewModal = ({ isOpen, onClose, pageElements, formTitle }) => {
  if (!isOpen) return null;

  // Geçerli elemanları filtrele
  const validElements = (pageElements || []).filter(element => 
    element && element.uniqueId && element.id !== 'boundary' && 
    element.type && (element.image || element.content)
  );
  
  const hasElements = validElements.length > 0;

  // Scroll pozisyonunu en üste getir
  useEffect(() => {
    if (isOpen) {
      const modalBody = document.querySelector('.preview-modal-body');
      if (modalBody) {
        modalBody.scrollTop = 0;
      }
    }
  }, [isOpen]);

  // Yazdırma fonksiyonu
  const handlePrint = () => {
    if (!hasElements) return alert('Yazdırılacak form elemanı bulunamadı.');
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert('Popup engelleyiciyi devre dışı bırakın.');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${formTitle || 'Optik Form'}</title>
        <style>
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; }
          .container { position: relative; width: 210mm; height: 297mm; background: white; }
        </style>
      </head>
      <body>
        <div class="container">
          ${validElements.map(el => {
            const style = `position:absolute; left:${el.position?.x || 0}px; top:${el.position?.y || 0}px; 
                          width:${el.size?.width || 'auto'}px; height:${el.size?.height || 'auto'}px;`;
            
            let content = '';
            if (el.type === 'text' || el.type === 'field')
              content = `<div style="display:flex; align-items:center; justify-content:center; height:100%;">${el.content || el.title || ''}</div>`;
            else
              content = `<img src="${el.content || el.image || ''}" alt="${el.title || ''}" style="width:100%; height:100%; object-fit:contain;">`;
            
            return `<div style="${style}">${content}</div>`;
          }).join('')}
        </div>
        <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 500); };</script>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
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
            {!hasElements ? (
              <div className="preview-empty-message">
                <p>Henüz form elemanı eklenmemiş.</p>
              </div>
            ) : (
              validElements.map(element => {
                const style = {
                  position: 'absolute',
                  left: `${element.position?.x || 0}px`,
                  top: `${element.position?.y || 0}px`,
                  width: element.size?.width ? `${element.size.width}px` : 'auto',
                  height: element.size?.height ? `${element.size.height}px` : 'auto',
                };
                
                let content;
                if (element.type === 'text' || element.type === 'field')
                  content = <div className="preview-text">{element.content || element.title || ''}</div>;
                else
                  content = <img src={element.image || element.content || ''} alt={element.title || ''} className="preview-image" />;
                
                return (
                  <div key={element.uniqueId} className="preview-element" style={style}>
                    {content}
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="preview-modal-footer">
          <Button variant="outline" onClick={onClose}>Kapat</Button>
          <Button variant="primary" onClick={handlePrint} disabled={!hasElements}>Yazdır</Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;