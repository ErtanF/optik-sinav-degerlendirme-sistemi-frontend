import React, { useEffect, useRef } from 'react';
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
  // A4 kağıdına referans
  const paperRef = useRef(null);
  // Önizleme container'ına referans
  const containerRef = useRef(null);
  // Sabit ölçek faktörü - %110
  const SCALE_FACTOR = 1.10;

  // Modal açıldığında A4 boyutunu hesapla
  useEffect(() => {
    if (!isOpen) return;
    
    const calculateScale = () => {
      if (!paperRef.current || !containerRef.current) return;
      
      // A4 kağıdı boyutları (mm)
      const a4Width = 210; // mm
      const a4Height = 297; // mm
      
      // Container boyutlarını al
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // Güvenli kenar boşluğu (her taraftan 20px)
      const padding = 40;
      const availableWidth = containerWidth - padding;
      const availableHeight = containerHeight - padding;
      
      // mm'den piksel'e çevirme (yaklaşık olarak)
      const pixelsPerMm = 3.78; // Bu değer değişebilir
      const a4WidthInPixels = a4Width * pixelsPerMm;
      const a4HeightInPixels = a4Height * pixelsPerMm;
      
      // En-boy oranını koruyarak en iyi ölçek faktörünü hesapla
      const scaleWidth = availableWidth / a4WidthInPixels;
      const scaleHeight = availableHeight / a4HeightInPixels;
      
      // En sınırlayıcı boyutu seç (daha küçük ölçek faktörü)
      let scale = Math.min(scaleWidth, scaleHeight);
      
      // Sabit %110 büyütme faktörünü uygula
      scale = scale * SCALE_FACTOR;
      
      // A4 kağıdına ölçeği uygula
      if (paperRef.current) {
        paperRef.current.style.transform = `scale(${scale})`;
      }
    };
    
    // İlk hesaplama
    calculateScale();
    
    // Pencere boyutu değiştiğinde tekrar hesapla
    const handleResize = () => {
      calculateScale();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

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
        <div className="preview-modal-body" ref={containerRef}>
          <div className="preview-paper" ref={paperRef}>
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