// src/pages/Optik/components/FormRenderer.jsx
import React, { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

const FormRenderer = ({ pageElements, formTitle, onRender, visible = false }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current && onRender) {
      // Daha uzun bir gecikme ekleyerek tüm elemanların yüklenmesini sağla
      const timer = setTimeout(() => {
        // Sayfanın scroll pozisyonunu kaydet
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        
        html2canvas(containerRef.current, {
          backgroundColor: 'white',
          scale: 2, // Yüksek kalite için
          useCORS: true,
          logging: false, 
          allowTaint: true,
          scrollX: -window.scrollX,
          scrollY: -window.scrollY,
          windowWidth: 595, // A4 genişliği (72 dpi'da piksel olarak)
          windowHeight: 842, // A4 yüksekliği (72 dpi'da piksel olarak)
          ignoreElements: (element) => {
            // Kenar çizgileri gibi render'a dahil edilmemesi gereken elemanları yoksay
            return element.classList && 
                   (element.classList.contains('gridLines') || 
                    element.classList.contains('resize-handle') ||
                    element.classList.contains('removeButton'));
          }
        }).then(canvas => {
          // Scroll pozisyonunu geri yükle
          window.scrollTo(scrollX, scrollY);
          onRender(canvas.toDataURL('image/png'));
        }).catch(error => {
          console.error("Render hatası:", error);
        });
      }, 500); // Daha uzun gecikme süresi
      
      return () => clearTimeout(timer);
    }
  }, [pageElements, onRender]);

  // Mavi çizgileri filtrelemek için öğeleri işle
  const filteredElements = pageElements.filter(element => {
    // Tüm çerçeve tipi elemanları veya mavi renkli öğeleri filtrele
    const isBlueBorder = element.border && 
                         (element.border.includes('blue') || 
                          element.border.includes('#0066cc') ||
                          element.border.includes('rgb(0, 102, 204)'));
    
    // Mavi çizgileri filtrele
    const isBlueElement = element.type === 'frame' && isBlueBorder;
    
    // Sadece mavi olmayan elemanları göster
    return !isBlueElement;
  });

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        width: '210mm',  // A4 genişliği
        height: '297mm', // A4 yüksekliği
        backgroundColor: 'white',
        overflow: 'hidden',
        display: visible ? 'block' : 'none',
        margin: '0 auto',
        boxSizing: 'border-box',
        pageBreakAfter: 'always',
        pageBreakInside: 'avoid'
      }}
    >
      {/* Filtrelenmiş elemanları göster */}
      {filteredElements.map(element => {
        // Normal elementler için stil tanımlaması
        const style = {
          position: 'absolute',
          left: `${element.position?.x || 0}px`,
          top: `${element.position?.y || 0}px`,
          width: `${element.size?.width || 100}px`,
          height: `${element.size?.height || 100}px`,
          boxSizing: 'border-box',
          backgroundColor: 'white',
          zIndex: element.zIndex || 1,
          transform: 'translate(0, 0)', // Sıfır transform değeri
          pointerEvents: 'none' // Etkileşimleri devre dışı bırak
        };
        
        let content;
        if (element.type === 'text' || element.type === 'field') {
          content = (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              fontSize: '1rem',
              textAlign: 'center',
              color: '#000',
              backgroundColor: 'transparent'
            }}>
              {element.content || element.title || ''}
            </div>
          );
        } else if (element.type === 'image') {
          content = (
            <img 
              src={element.content || element.image || ''} 
              alt={element.title || ''} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                backgroundColor: 'transparent'
              }} 
            />
          );
        } else {
          content = (
            <img 
              src={element.image || ''} 
              alt={element.title || ''} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: 'transparent'
              }} 
            />
          );
        }
        
        return (
          <div key={element.uniqueId} style={style}>
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default FormRenderer;