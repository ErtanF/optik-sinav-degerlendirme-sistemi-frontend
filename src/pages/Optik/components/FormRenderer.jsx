import React, { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import BubbleGrid from './elements/BubbleGrid';

const FormRenderer = ({ 
  pageElements, 
  onRender, 
  visible = false, 
  showGrid = false,
  customBubbleValues = {}
}) => {
  const containerRef = useRef(null);
  
  // Form görüntüsünü oluştur
  useEffect(() => {
    if (containerRef.current && onRender) {
      const timer = setTimeout(() => {
        const scrollPos = { x: window.scrollX, y: window.scrollY };
        
        html2canvas(containerRef.current, {
          backgroundColor: 'white',
          scale: 2,
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
                    element.classList.contains('removeButton') ||
                    element.classList.contains('dotColumn')); // Nokta sütunu gizleme - yazdırmada görünmesin
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
  }, [pageElements, onRender, customBubbleValues]);

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
      backgroundColor: 'rgba(128, 0, 128, 0.1)', /* Şeffaf mor renk */
      padding: '4px', textAlign: 'center',
      borderBottom: '1px solid #ddd', fontWeight: 'bold', fontSize: '14px',
      height: '20px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', minHeight: '20px', maxHeight: '20px',
      flexShrink: 0, color: '#333' /* Başlık yazı rengi */
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
          border: '1px solid rgba(0, 0, 0, 0.1)',
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
      {/* Sol kenarda dikdörtgen noktalar - grid genişliğinde */}
<div 
  className="dotColumn"
  style={{
    position: 'absolute',
    left: '20px',  
    top: '0',
    width: '20px',
    height: '100%',
    pointerEvents: 'none'
  }}
>
  {/* İlk 3 satırı atlayarak 4. satırdan başla */}
  {Array.from({ length: Math.floor((297 * 3.78 - 20) / 20) }).map((_, index) => {
    // İlk 3 satırı atla
    if (index < 3) return null;
    
    return (
      <div 
        key={index} 
        style={{
          position: 'absolute',
          top: `${(index * 20) + 10}px`, 
          left: '0',                     
          width: '20px',                  
          height: '5px',                  
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
      top: '45px',   // 2. satır pozisyonu (10px + 20px*2)
      left: '25px',  // Sağdaki sütun (20px + 20px)
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
      top: '45px',   // 2. satır pozisyonu (10px + 20px*2)
      left: '45px',  // Sağdaki sütun (20px + 20px)
      width: '12px', 
      height: '12px',
      backgroundColor: '#000',
      borderRadius: '50%', // Yuvarlak nokta
      zIndex: '10'
    }}
  ></div>
</div>

      
      {showGrid && (
        <div 
          className="gridLines"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundSize: '20px 20px',
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