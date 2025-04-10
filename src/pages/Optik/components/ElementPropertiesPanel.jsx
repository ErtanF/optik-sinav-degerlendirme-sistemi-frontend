import React, { useEffect, useState, useRef } from 'react';
import styles from './ElementPropertiesPanel.module.css';
import { useFormEditor } from '../context/FormEditorContext';

const ElementPropertiesPanel = () => {
  const { 
    activeElementId, 
    pageElements, 
    updateElement,
    handleImageUpload,
    fileInputRef
  } = useFormEditor();
  
  // Aktif eleman
  const activeElement = pageElements.find(el => el.uniqueId === activeElementId);
  
  // Eleman özelliklerini local state'e al
  const [properties, setProperties] = useState({
    rows: 0,
    cols: 0,
    startNumber: 1, // Başlangıç soru numarası
    posX: 0,        // X pozisyonu
    posY: 0,         // Y pozisyonu
    width: 0,       // Genişlik
    height: 0       // Yükseklik
  });
  
  // Özel resim dosyası input referansı
  const imageInputRef = useRef(null);
  
  // Aktif eleman değiştiğinde özellikleri güncelle
  useEffect(() => {
    if (activeElement) {
      setProperties({
        rows: activeElement.rows || 0,
        cols: activeElement.cols || 0,
        startNumber: activeElement.startNumber || 1,
        posX: activeElement.position?.x || 0,
        posY: activeElement.position?.y || 0,
        width: activeElement.size?.width || 0,
        height: activeElement.size?.height || 0
      });
    }
  }, [activeElement]);
  
  // Eleman seçili değilse panel gösterme
  if (!activeElement) {
    return null;
  }
  
  // Eleman tipine göre panel başlığı
  const getPanelTitle = () => {
    switch (activeElement.type) {
      case 'nameSurname':
        return 'Ad Soyad Alanı Özellikleri';
      case 'number':
        return 'Numara Alanı Özellikleri';
      case 'tcNumber':
        return 'TC Kimlik No Özellikleri';
      case 'phoneNumber':
        return 'Telefon No Özellikleri';
      case 'multipleChoice':
        return 'Çoktan Seçmeli Test Özellikleri';
      case 'image':
        return 'Resim Özellikleri';
      default:
        return 'Eleman Özellikleri';
    }
  };
  
  // Satır sayısını artır/azalt (sadece çoktan seçmeli için)
  const handleRowsChange = (increment) => {
    if (activeElement.type !== 'multipleChoice') return;
    
    const newRows = Math.max(1, properties.rows + increment);
    
    // Özelliği güncelle
    setProperties(prev => ({
      ...prev,
      rows: newRows
    }));
    
    // Elemanı güncelle
    updateElement(activeElementId, {
      rows: newRows,
      // Satır sayısı değiştiğinde yüksekliği de güncelle
      size: {
        ...activeElement.size,
        height: newRows * 20 + 30 // 30px başlık yüksekliği + her satır 20px
      }
    });
  };
  
  // Sütun sayısını artır/azalt
  const handleColsChange = (increment) => {
    // TC kimlik ve telefon için kolonlar sabit
    if (activeElement.type === 'tcNumber' || activeElement.type === 'phoneNumber') {
      return;
    }
    
    if (activeElement.type === 'multipleChoice') {
      // Çoktan seçmeli için maksimum 5 şık (A-E)
      const maxCols = 5;
      const newCols = Math.min(maxCols, Math.max(1, properties.cols + increment));
      
      // Özelliği güncelle
      setProperties(prev => ({
        ...prev,
        cols: newCols
      }));
      
      // Elemanı güncelle
      updateElement(activeElementId, {
        cols: newCols,
        size: {
          ...activeElement.size,
          width: (newCols + 1) * 20 // Soru numarası sütunu (1) + her şık 20px
        }
      });
    } 
    else if (activeElement.type === 'nameSurname' || activeElement.type === 'number') {
      // Ad Soyad ve Numara için sütun sayısını değiştir
      // Numara için maksimum 15, Ad Soyad için istediği kadar
      const maxCols = activeElement.type === 'number' ? 15 : 26;
      const newCols = Math.min(maxCols, Math.max(1, properties.cols + increment));
      
      // Özelliği güncelle
      setProperties(prev => ({
        ...prev,
        cols: newCols
      }));
      
      // Elemanı güncelle
      updateElement(activeElementId, {
        cols: newCols,
        size: {
          ...activeElement.size,
          width: newCols * 20 // Her sütun 20px
        }
      });
    }
  };
  
  // Başlangıç soru numarasını değiştir
  const handleStartNumberChange = (e) => {
    const newStartNumber = parseInt(e.target.value) || 1;
    
    // Özelliği güncelle
    setProperties(prev => ({
      ...prev,
      startNumber: newStartNumber
    }));
    
    // Elemanı güncelle
    updateElement(activeElementId, {
      startNumber: newStartNumber
    });
  };
  
  // Eleman pozisyonunu değiştir
  const handlePositionChange = (direction, amount = 20) => {
    let newPosX = properties.posX;
    let newPosY = properties.posY;
    
    // Yöne göre pozisyonu güncelle
    switch(direction) {
      case 'left':
        newPosX = Math.max(0, newPosX - amount);
        break;
      case 'right':
        newPosX = newPosX + amount;
        break;
      case 'up':
        newPosY = Math.max(0, newPosY - amount);
        break;
      case 'down':
        newPosY = newPosY + amount;
        break;
    }
    
    // Özelliği güncelle
    setProperties(prev => ({
      ...prev,
      posX: newPosX,
      posY: newPosY
    }));
    
    // Elemanı güncelle
    updateElement(activeElementId, {
      position: {
        x: newPosX,
        y: newPosY
      }
    });
  };
  
  // Resim boyutunu değiştir
  const handleSizeChange = (dimension, value) => {
    if (activeElement.type !== 'image') return;
    
    const gridSize = 20;
    // Grid'e hizalanmış değer
    const alignedValue = Math.max(gridSize, Math.floor(value / gridSize) * gridSize);
    
    // Özelliği güncelle
    setProperties(prev => ({
      ...prev,
      [dimension]: alignedValue
    }));
    
    // Elemanı güncelle
    updateElement(activeElementId, {
      size: {
        ...activeElement.size,
        [dimension]: alignedValue
      }
    });
  };
  
  // Resim değiştir
  const handleChangeImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          // Resim verilerini güncelle
          updateElement(activeElementId, {
            content: e.target.result
          });
          
          // Input değerini sıfırla
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        };
        reader.readAsDataURL(file);
      };
      
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className={styles.panel}>
      <h3 className={styles.panelTitle}>{getPanelTitle()}</h3>
      
      {/* Eleman Konumu - Tüm elemanlar için */}
      <div className={styles.propertySection}>
        <h4 className={styles.sectionTitle}>Eleman Konumu</h4>
        <div className={styles.directionControls}>
          <div className={styles.directionRow}>
            <div className={styles.emptyCell}></div>
            <button 
              className={styles.directionButton}
              onClick={() => handlePositionChange('up')}
              title="Yukarı Taşı"
            >
              ▲
            </button>
            <div className={styles.emptyCell}></div>
          </div>
          <div className={styles.directionRow}>
            <button 
              className={styles.directionButton}
              onClick={() => handlePositionChange('left')}
              title="Sola Taşı"
            >
              ◄
            </button>
            <div className={styles.directionCenter}>
              <span className={styles.positionLabel}>
                X: {properties.posX}, Y: {properties.posY}
              </span>
            </div>
            <button 
              className={styles.directionButton}
              onClick={() => handlePositionChange('right')}
              title="Sağa Taşı"
            >
              ►
            </button>
          </div>
          <div className={styles.directionRow}>
            <div className={styles.emptyCell}></div>
            <button 
              className={styles.directionButton}
              onClick={() => handlePositionChange('down')}
              title="Aşağı Taşı"
            >
              ▼
            </button>
            <div className={styles.emptyCell}></div>
          </div>
        </div>
      </div>

      {/* Resim için özel ayarlar */}
      {activeElement.type === 'image' && (
        <>
          <div className={styles.propertySection}>
            <h4 className={styles.sectionTitle}>Resim Boyutu</h4>
            <div className={styles.propertyGroup}>
              <label className={styles.propertyLabel}>Genişlik:</label>
              <div className={styles.propertyControls}>
                <input
                  type="number"
                  min="20"
                  step="20"
                  value={properties.width}
                  onChange={(e) => handleSizeChange('width', parseInt(e.target.value) || 0)}
                  className={styles.numberInput}
                />
                <span>px</span>
              </div>
            </div>
            <div className={styles.propertyGroup}>
              <label className={styles.propertyLabel}>Yükseklik:</label>
              <div className={styles.propertyControls}>
                <input
                  type="number"
                  min="20"
                  step="20"
                  value={properties.height}
                  onChange={(e) => handleSizeChange('height', parseInt(e.target.value) || 0)}
                  className={styles.numberInput}
                />
                <span>px</span>
              </div>
            </div>
          </div>
          
          <div className={styles.propertyGroup}>
            <button
              className={styles.changeImageButton}
              onClick={handleChangeImage}
            >
              Resmi Değiştir
            </button>
          </div>
          
          <div className={styles.helpText}>
            İpucu: Resmin konumunu değiştirmek için yön oklarını kullanın. Boyutunu değiştirmek için yukarıdaki değerleri girebilirsiniz.
          </div>
        </>
      )}

      {/* Çoktan seçmeli test için başlangıç soru numarası */}
      {activeElement.type === 'multipleChoice' && (
        <div className={styles.propertyGroup}>
          <label className={styles.propertyLabel}>Başlangıç Soru Numarası:</label>
          <div className={styles.propertyControls}>
            <input
              type="number"
              min="1"
              value={properties.startNumber}
              onChange={handleStartNumberChange}
              className={styles.numberInput}
            />
          </div>
        </div>
      )}
      
      {/* Satır sayısı ayarı - Sadece çoktan seçmeli için */}
      {activeElement.type === 'multipleChoice' && (
        <div className={styles.propertyGroup}>
          <label className={styles.propertyLabel}>Soru Sayısı:</label>
          <div className={styles.propertyControls}>
            <button
              className={styles.controlButton}
              onClick={() => handleRowsChange(-1)}
              disabled={properties.rows <= 1}
            >
              -
            </button>
            <span className={styles.propertyValue}>{properties.rows}</span>
            <button
              className={styles.controlButton}
              onClick={() => handleRowsChange(1)}
            >
              +
            </button>
          </div>
        </div>
      )}
      
      {/* Sütun sayısı ayarı - TC ve Telefon için gösterme */}
      {activeElement.type !== 'tcNumber' && activeElement.type !== 'phoneNumber' && activeElement.type !== 'image' && (
        <div className={styles.propertyGroup}>
          <label className={styles.propertyLabel}>
            {activeElement.type === 'multipleChoice' ? 'Şık Sayısı:' : 
             activeElement.type === 'nameSurname' ? 'Harf Sayısı:' : 
             'Rakam Sayısı:'}
          </label>
          <div className={styles.propertyControls}>
            <button
              className={styles.controlButton}
              onClick={() => handleColsChange(-1)}
              disabled={properties.cols <= 1}
            >
              -
            </button>
            <span className={styles.propertyValue}>{properties.cols}</span>
            <button
              className={styles.controlButton}
              onClick={() => handleColsChange(1)}
              disabled={(activeElement.type === 'multipleChoice' && properties.cols >= 5) ||
                       (activeElement.type === 'number' && properties.cols >= 15)}
            >
              +
            </button>
          </div>
          
          {activeElement.type === 'number' && properties.cols >= 15 && (
            <div className={styles.infoMessage}>Maksimum 15 rakam eklenebilir.</div>
          )}
        </div>
      )}
      
      {/* TC Kimlik No ve Telefon için sabit bilgi göster */}
      {activeElement.type === 'tcNumber' && (
        <div className={styles.infoBox}>
          <div className={styles.infoTitle}>TC Kimlik Numarası:</div>
          <div className={styles.infoText}>
            11 haneli TC kimlik numarası alanı
          </div>
        </div>
      )}
      
      {activeElement.type === 'phoneNumber' && (
        <div className={styles.infoBox}>
          <div className={styles.infoTitle}>Telefon Numarası:</div>
          <div className={styles.infoText}>
            10 haneli telefon numarası alanı
          </div>
        </div>
      )}
      
      {/* Şık isimleri gösterimi (sadece çoktan seçmeli için) */}
      {activeElement.type === 'multipleChoice' && (
        <div className={styles.infoBox}>
          <div className={styles.infoTitle}>Şıklar:</div>
          <div className={styles.choicesList}>
            {Array.from({ length: properties.cols }).map((_, i) => (
              <span key={i} className={styles.choiceItem}>
                {String.fromCharCode(65 + i)}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {activeElement.type !== 'image' && (
        <div className={styles.helpText}>
          {activeElement.type === 'multipleChoice' ? 
            'İpucu: Soru sayısını ve şık sayısını değiştirmek için + ve - butonlarını, konumunu değiştirmek için yön oklarını kullanın.' :
            activeElement.type === 'tcNumber' ?
            'İpucu: TC Kimlik no alanı sabit 11 hanedir. Konumunu ayarlamak için yön oklarını kullanın.' :
            activeElement.type === 'phoneNumber' ?
            'İpucu: Telefon numarası alanı sabit 10 hanedir. Konumunu ayarlamak için yön oklarını kullanın.' :
            'İpucu: Elemanın konumunu değiştirmek için yön oklarını kullanın.'}
        </div>
      )}
    </div>
  );
};

export default ElementPropertiesPanel;