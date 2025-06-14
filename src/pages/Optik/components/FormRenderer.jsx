import React, { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import BubbleGrid from './elements/BubbleGrid';

const FormRenderer = ({ 
  pageElements, 
  onRender, 
  visible = false, 
  showGrid = false,
  customBubbleValues = {},
  includeCalibrationMarks = true // Yeni parametre ekledik
}) => {
  const containerRef = useRef(null);
  
  // Form görüntüsünü oluştur
  useEffect(() => {
    if (containerRef.current && onRender) {
      const timer = setTimeout(() => {
        const scrollPos = { x: window.scrollX, y: window.scrollY };
        
        html2canvas(containerRef.current, {
          backgroundColor: 'white',
          scale: 4,
          useCORS: true,
          logging: false, 
          allowTaint: true,
          scrollX: -scrollPos.x,
          scrollY: -scrollPos.y,
          windowWidth: 595, // A4 genişliği (72 dpi'da piksel olarak)
          windowHeight: 842, // A4 yüksekliği (72 dpi'da piksel olarak)
          ignoreElements: (element) => {
            return element.classList && 
                   (element.classList.contains('gridLines') || 
                    element.classList.contains('resize-handle') ||
                    element.classList.contains('removeButton')); 
                    // dotColumn'ı çıkardık - soldaki çizgiler ve noktalar görünecek
          }
        }).then(canvas => {
          window.scrollTo(scrollPos.x, scrollPos.y);
          onRender(canvas.toDataURL('image/png'));
        }).catch(error => {
          console.error("Render hatası:", error);
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [pageElements, onRender, customBubbleValues, includeCalibrationMarks]);

  // Bir elemanın özelleştirilmiş bubble değerlerini al
  const getElementBubbleValues = (elementId) => {
    return customBubbleValues[elementId] || {};
  };

  // Optik eleman başlığını belirle
  const getElementHeader = (type) => {
    switch(type) {
      case 'nameSurname': return 'AD SOYAD';
      case 'number': return 'NUMARA';
      case 'tcNumber': return 'TC KİMLİK NO';
      case 'phoneNumber': return 'TELEFON NO';
      case 'multipleChoice': return 'TEST';
      case 'bookletCode': return 'KİTAPÇIK';
      case 'classNumber': return 'SINIF';
      case 'classBranch': return 'ŞUBE';
      default: return 'FORM ELEMANI';
    }
  };

  // Eleman içeriğini render et
  const renderElementContent = (element) => {
    if (element.type === 'image') {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src={element.content} 
            alt="Form Image" 
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
            crossOrigin="anonymous"
          />
        </div>
      );
    } 
    
    // Yazı alanı elemanı için - başlık olmadan
    if (element.type === 'textArea') {
      return (
        <div style={{ 
          width: '100%', height: '100%', display: 'flex', 
          alignItems: 'flex-start', justifyContent: 'flex-start', 
          overflow: 'hidden', padding: '10px', boxSizing: 'border-box',
          whiteSpace: 'pre-wrap', textAlign: 'left', wordBreak: 'break-word',
          backgroundColor: 'transparent', border: 'none', borderRadius: '4px',
          fontSize: '14px', lineHeight: '1.5'
        }}>
          {element.content || ''}
        </div>
      );
    }
    
    if (element.type === 'text' || element.type === 'field') {
      return (
        <div style={{ 
          width: '100%', height: '100%', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', 
          textAlign: 'center', padding: '8px'
        }}>
          {element.content || 'Metin alanı'}
        </div>
      );
    } 
    
    if (['nameSurname', 'number', 'tcNumber', 'phoneNumber', 'multipleChoice', 'bookletCode', 'classNumber', 'classBranch'].includes(element.type)) {
      const headerTitle = element.title || getElementHeader(element.type);
      const elementBubbleValues = getElementBubbleValues(element.uniqueId);
      
      return (
  <div style={{ 
    width: '100%', height: '100%', position: 'relative', 
    display: 'flex', flexDirection: 'column', overflow: 'hidden'
  }}>
    <div style={{ 
      backgroundColor: 'rgb(255, 255, 255)', /* Şeffaf mor renk */
      padding: '4px', textAlign: 'center',
      borderBottom: '1px solid #ddd', fontWeight: 'bold', fontSize: '14px',
      height: '17px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', minHeight: '17px', maxHeight: '17px',
      flexShrink: 0, color: 'rgba(248, 76, 173, 0.9)' /* Başlık yazı rengi */
    }}>
      {headerTitle}
    </div>
    <div style={{ padding: 0, flex: '1 1 auto', overflow: 'hidden', display: 'flex' }}>
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <BubbleGrid 
          rows={element.rows || 20} 
          cols={element.cols || 5}
          type={element.type}
          startNumber={element.startNumber || 1}
          isEditable={false}
          customValues={elementBubbleValues}
        />
      </div>
    </div>
  </div>
      );
    }
    
    // Bilinmeyen eleman tipleri
    return (
      <div style={{ 
        width: '100%', height: '100%', display: 'flex', 
        alignItems: 'center', justifyContent: 'center', 
        backgroundColor: '#f5f5f5', padding: '10px'
      }}>
        Eleman: {element.title || 'Bilinmeyen eleman'}
      </div>
    );
  };

  // Elemanları render et
  const renderElements = () => {
    return pageElements.map(element => (
      <div 
        key={element.uniqueId} 
        style={{
          position: 'absolute',
          left: `${element.position?.x || 0}px`,
          top: `${element.position?.y || 0}px`,
          width: `${element.size?.width || 100}px`,
          height: `${element.size?.height || 100}px`,
          boxSizing: 'border-box',
          backgroundColor: 'white',
          border: element.type === 'textArea' || element.type === 'image' ? 'none' : '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}
      >
        {renderElementContent(element)}
      </div>
    ));
  };

  // Sayfa yüksekliğine göre nokta sayısını belirle
  const rowCount = 40; // Uygun nokta sayısı

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        width: '210mm',
        height: '297mm',
        backgroundColor: 'white',
        overflow: 'hidden',
        display: visible ? 'block' : 'none',
        margin: '0 auto',
        boxSizing: 'border-box',
        pageBreakAfter: 'always',
        pageBreakInside: 'avoid'
      }}
    >
      {/* Sol kenarda dikdörtgen noktalar - grid genişliğinde - Kalibrasyon işaretleri */}
{includeCalibrationMarks && (
  <div 
    className="dotColumn"
    style={{
      position: 'absolute',
      left: '20px',  
      top: '0',
      width: '20px',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 5
    }}
  >
    {/* İlk 3 satırı atlayarak 4. satırdan başla */}
    {Array.from({ length: Math.floor((297 * 3.78 - 10) / 17) }).map((_, index) => {
  // İlk 2 satırı atla
  if (index < 2) return null;
  
  return (
    <div 
      key={index} 
      style={{
        position: 'absolute',
        top: `${(index * 17) + 8}px`, // Grid boyutu 17px, 10px offset ile
        left: '10px',                   // 2. sütun (ilk sütundan sonraki)
        width: '15px',                  // Grid genişliği
        height: '4px',                  // Çizgi yüksekliği
        backgroundColor: '#000',
        borderRadius: '0'               
      }}
    ></div>
  );
})}
    
    {/* Sağındaki sütunun 2. satırına büyük nokta */}
    <div 
      style={{
        position: 'absolute',
        top: '37px',
        left: '37px',  // Sağdaki sütun (20px + 20px)
        width: '12px', 
        height: '12px',
        backgroundColor: '#000',
        borderRadius: '50%', // Yuvarlak nokta
        zIndex: '10'
      }}
    ></div>
    <div 
      style={{
        position: 'absolute',
        top: '37px',
        left: '717px',  // Sağdaki sütun (20px + 20px)
        width: '12px', 
        height: '12px',
        backgroundColor: '#000',
        borderRadius: '50%', // Yuvarlak nokta
        zIndex: '10'
      }}
    ></div>
    <div 
      style={{
        position: 'absolute',
        top: '37px',
        left: '734px',  // Sağdaki sütun (20px + 20px)
        width: '12px', 
        height: '12px',
        backgroundColor: '#000',
        borderRadius: '50%', // Yuvarlak nokta
        zIndex: '10'
      }}
    ></div>
    <div 
      style={{
        position: 'absolute',
        top: '1090px',
        left: '37px',  // Sağdaki sütun (20px + 20px)
        width: '12px', 
        height: '12px',
        backgroundColor: '#000',
        borderRadius: '50%', // Yuvarlak nokta
        zIndex: '10'
      }}
    ></div>
  </div>
)}
      
      {showGrid && (
        <div 
          className="gridLines"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundSize: '17px 17px',
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.07) 1px, transparent 1px)
            `,
            zIndex: 0,
            pointerEvents: 'none',
            opacity: 0.8
          }}
        />
      )}
      
      {renderElements()}
    </div>
  );
};

export default FormRenderer;