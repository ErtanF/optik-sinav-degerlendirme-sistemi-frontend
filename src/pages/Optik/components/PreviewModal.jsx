import React, { useEffect, useRef, useState } from 'react';
import Button from '../../../components/ui/Button/Button';
import FormRenderer from './FormRenderer';
import html2canvas from 'html2canvas';
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
  // Yakalanan görüntü
  const [capturedImage, setCapturedImage] = useState(null);
  // Yakalama durumu
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Modal açıldığında A4 boyutunu hesapla
  useEffect(() => {
    if (!isOpen) return;
    
    const calculateScale = () => {
      if (!paperRef.current || !containerRef.current) return;
      
      // Container boyutlarını al
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // Güvenli kenar boşluğu (her taraftan 20px)
      const padding = 40;
      const availableWidth = containerWidth - padding;
      const availableHeight = containerHeight - padding;
      
      // A4 kağıdı boyutları (piksel)
      const a4WidthInPixels = 793; // 210mm yaklaşık piksel değeri
      const a4HeightInPixels = 1122; // 297mm yaklaşık piksel değeri
      
      // En-boy oranını koruyarak en iyi ölçek faktörünü hesapla
      const scaleWidth = availableWidth / a4WidthInPixels;
      const scaleHeight = availableHeight / a4HeightInPixels;
      
      // En sınırlayıcı boyutu seç (daha küçük ölçek faktörü)
      let scale = Math.min(scaleWidth, scaleHeight);
      
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

  // Modal açıldığında ekran görüntüsünü al
  useEffect(() => {
    if (isOpen && paperRef.current) {
      // DOM'un tam olarak render edilmesini bekle
      setTimeout(capturePreview, 500);
    }
  }, [isOpen]);

  // Ekran görüntüsünü al
  const capturePreview = () => {
    if (!paperRef.current) return;
    
    setIsCapturing(true);
    
    // Scrollbar pozisyonunu kaydet
    const scrollPos = { x: window.scrollX, y: window.scrollY };
    
    html2canvas(paperRef.current, {
      backgroundColor: 'white',
      scale: 2, // 2x ölçek faktörü ile daha yüksek kalite
      useCORS: true,
      logging: false,
      allowTaint: true,
      scrollX: -scrollPos.x,
      scrollY: -scrollPos.y,
      // Sadece gereksiz UI elemanlarını filtrele, kalibrasyon çizgilerini ve noktalarını dahil et
      ignoreElements: (element) => {
        return element.classList && 
               (element.classList.contains('gridLines') || 
                element.classList.contains('resize-handle') ||
                element.classList.contains('removeButton'));
                // 'dotColumn' sınıfını filtreden kaldırdık - sol taraftaki çizgileri ve noktaları gösterecek
      }
    }).then(canvas => {
      // Scrollbar pozisyonunu geri yükle
      window.scrollTo(scrollPos.x, scrollPos.y);
      
      // Canvas içeriğini PNG formatında base64 veri URL'sine dönüştür
      const imageData = canvas.toDataURL('image/png', 1.0);
      
      // Yakalanan görüntüyü state'e kaydet
      setCapturedImage(imageData);
      setIsCapturing(false);
      
      console.log("Önizleme görüntüsü yakalandı");
    }).catch(error => {
      console.error("Önizleme görüntüsü yakalanırken hata:", error);
      setIsCapturing(false);
    });
  };

  if (!isOpen) return null;

  // Kaydetme butonuna tıklandığında
  const handleSaveClick = () => {
    if (capturedImage && onSave) {
      // Yakalanan görüntüyü onSave fonksiyonu ile gönder
      onSave(capturedImage);
    } else if (onSave) {
      // Eğer görüntü yoksa, yeniden yakalamayı dene
      capturePreview();
      setTimeout(() => {
        if (capturedImage) {
          onSave(capturedImage);
        } else {
          console.error("Görüntü yakalanamadı!");
        }
      }, 1000);
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
              includeCalibrationMarks={true} // Kalibrasyon işaretlerini dahil et
            />
          </div>
          
          {isCapturing && (
            <div className="capture-overlay">
              <div className="spinner"></div>
              <p>Görüntü yakalanıyor...</p>
            </div>
          )}
        </div>
        <div className="preview-modal-footer">
          <Button variant="outline" onClick={onClose}>Kapat</Button>
          <Button 
            variant="primary" 
            onClick={handleSaveClick}
            disabled={isCapturing}
          >
            {isCapturing ? 'Görüntü Yakalanıyor...' : 'Bu Görünümü Kaydet'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;