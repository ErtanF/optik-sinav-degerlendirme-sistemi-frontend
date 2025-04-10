import React, { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import BubbleGrid from './elements/BubbleGrid';

const FormRenderer = ({ pageElements, onRender, visible = false, showGrid = false }) => {
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

  // Elemanları render et
  const renderElements = () => {
    return pageElements.map(element => {
      // Element stilini tanımla
      const style = {
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
      };
      
      // Element tipine göre içeriği render et
      let content;
      
      if (element.type === 'image') {
        // Resim türü elemanlar
        content = (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={element.content} 
              alt="Form Image" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain'
              }} 
            />
          </div>
        );
      } else if (element.type === 'text' || element.type === 'field') {
        // Metin türü elemanlar
        content = (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textAlign: 'center',
            padding: '8px'
          }}>
            {element.content || 'Metin alanı'}
          </div>
        );
      } else if (element.type === 'nameSurname' || 
                element.type === 'number' || 
                element.type === 'tcNumber' || 
                element.type === 'phoneNumber' || 
                element.type === 'multipleChoice') {
        
        // Başlık belirleme
        let headerTitle = '';
        switch(element.type) {
          case 'nameSurname':
            headerTitle = 'AD SOYAD';
            break;
          case 'number':
            headerTitle = 'NUMARA';
            break;
          case 'tcNumber':
            headerTitle = 'TC KİMLİK NO';
            break;
          case 'phoneNumber':
            headerTitle = 'TELEFON NO';
            break;
          case 'multipleChoice':
            headerTitle = 'TEST';
            break;
          default:
            headerTitle = 'FORM ELEMANI';
        }
        
        // Başlık ve içerik yüksekliği hesaplama
        // Çoktan seçmeli için başlık alanını daha kompakt yap
        const isMultipleChoice = element.type === 'multipleChoice';
        const headerHeight = isMultipleChoice ? '20px' : '20px';
        const headerPadding = isMultipleChoice ? '4px' : '4px';
        const headerFontSize = isMultipleChoice ? '14px' : '14px';
        
        // Optik form elemanları - Özellikle çoktan seçmeli sorular
        content = (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            position: 'relative', 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ 
              backgroundColor: '#f8f8f8', 
              padding: headerPadding, 
              textAlign: 'center',
              borderBottom: '1px solid #ddd',
              fontWeight: 'bold',
              fontSize: headerFontSize,
              height: headerHeight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: headerHeight,
              maxHeight: headerHeight,
              flexShrink: 0
            }}>
              {headerTitle}
            </div>
            <div style={{ 
              padding: 0, 
              flex: '1 1 auto', 
              overflow: 'hidden',
              display: 'flex'
            }}>
              {/* BubbleGrid için iç içe geçmiş div, genişlik/yükseklik 100% */}
              <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                <BubbleGrid 
                  rows={element.rows || 20} 
                  cols={element.cols || 5}
                  type={element.type}
                  startNumber={element.startNumber || 1}
                />
              </div>
            </div>
          </div>
        );
      } else {
        // Bilinmeyen eleman tipleri
        content = (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#f5f5f5',
            padding: '10px'
          }}>
            Eleman: {element.title || 'Bilinmeyen eleman'}
          </div>
        );
      }
      
      return (
        <div key={element.uniqueId} style={style}>
          {content}
        </div>
      );
    });
  };

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
      {/* Grid çizgileri - showGrid parametresine göre göster/gizle */}
      {showGrid && (
        <div 
          className="gridLines"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundSize: '20px 20px',
            backgroundImage: `
              linear-gradient(to right, rgba(230, 230, 230, 0.5) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(230, 230, 230, 0.5) 1px, transparent 1px)
            `,
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
      )}
      
      {/* Tüm elemanları render et */}
      {renderElements()}
    </div>
  );
};

export default FormRenderer;