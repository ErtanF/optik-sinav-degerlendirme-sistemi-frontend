import React, { useEffect, useState } from 'react';
import styles from './ElementPropertiesPanel.module.css';
import { useFormEditor } from '../context/FormEditorContext';

// Alt bileşenler için ayırma
const DirectionControls = ({ posX, posY, onPositionChange }) => (
  <div className={styles.directionControls}>
    <div className={styles.directionRow}>
      <div className={styles.emptyCell}></div>
      <button className={styles.directionButton} onClick={() => onPositionChange('up')} title="Yukarı Taşı">▲</button>
      <div className={styles.emptyCell}></div>
    </div>
    <div className={styles.directionRow}>
      <button className={styles.directionButton} onClick={() => onPositionChange('left')} title="Sola Taşı">◄</button>
      <div className={styles.directionCenter}>
        <span className={styles.positionLabel}>X: {posX}, Y: {posY}</span>
      </div>
      <button className={styles.directionButton} onClick={() => onPositionChange('right')} title="Sağa Taşı">►</button>
    </div>
    <div className={styles.directionRow}>
      <div className={styles.emptyCell}></div>
      <button className={styles.directionButton} onClick={() => onPositionChange('down')} title="Aşağı Taşı">▼</button>
      <div className={styles.emptyCell}></div>
    </div>
  </div>
);

const QuantityControl = ({ label, value, onDecrease, onIncrease, min = 1, max = Infinity }) => (
  <div className={styles.propertyGroup}>
    <label className={styles.propertyLabel}>{label}</label>
    <div className={styles.propertyControls}>
      <button 
        className={styles.controlButton} 
        onClick={onDecrease} 
        disabled={value <= min}
      >-</button>
      <span className={styles.propertyValue}>{value}</span>
      <button 
        className={styles.controlButton} 
        onClick={onIncrease}
        disabled={value >= max}
      >+</button>
    </div>
  </div>
);

const InputControl = ({ label, value, onChange, min, step, unit = "px" }) => (
  <div className={styles.propertyGroup}>
    <label className={styles.propertyLabel}>{label}</label>
    <div className={styles.propertyControls}>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={onChange}
        className={styles.numberInput}
      />
      <span>{unit}</span>
    </div>
  </div>
);

const InfoBox = ({ title, children }) => (
  <div className={styles.infoBox}>
    <div className={styles.infoTitle}>{title}</div>
    {children}
  </div>
);

const ElementPropertiesPanel = () => {
  const { 
    activeElementId, pageElements, updateElement, fileInputRef,
     isWithinSafeZone
  } = useFormEditor();
  
  // Aktif eleman
  const activeElement = pageElements.find(el => el.uniqueId === activeElementId);
  
  // Eleman özelliklerini local state'e al
  const [properties, setProperties] = useState({
    rows: 0, cols: 0, startNumber: 1,
    posX: 0, posY: 0, width: 0, height: 0
  });
  
  // Güvenli alan içinde olup olmadığını kontrol et
  const [isInSafeZone, setIsInSafeZone] = useState(true);
  
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
      
      // Güvenli alan kontrolü
      const inSafeZone = isWithinSafeZone(
        activeElement.position || { x: 0, y: 0 },
        activeElement.size || { width: 100, height: 100 }
      );
      setIsInSafeZone(inSafeZone);
    }
  }, [activeElement, isWithinSafeZone]);
  
  if (!activeElement) return null;
  
  // Eleman tipine göre panel başlığı
  const getPanelTitle = () => {
    const titles = {
      'nameSurname': 'Ad Soyad Alanı Özellikleri',
      'number': 'Numara Alanı Özellikleri',
      'tcNumber': 'TC Kimlik No Özellikleri',
      'phoneNumber': 'Telefon No Özellikleri',
      'multipleChoice': 'Çoktan Seçmeli Test Özellikleri',
      'textArea': 'Yazı Alanı Özellikleri',
      'image': 'Resim Özellikleri'
    };
    return titles[activeElement.type] || 'Eleman Özellikleri';
  };
  
  // İşlev yöneticileri
  const handleRowsChange = (increment) => {
    if (activeElement.type !== 'multipleChoice') return;
    
    const newRows = Math.max(1, properties.rows + increment);
    setProperties(prev => ({ ...prev, rows: newRows }));
    
    updateElement(activeElementId, {
      rows: newRows,
      size: {
        ...activeElement.size,
        height: newRows * 20 + 30 // 30px başlık + satır başına 20px
      }
    });
  };
  
  const handleColsChange = (increment) => {
    if (activeElement.type === 'tcNumber' || activeElement.type === 'phoneNumber' || activeElement.type === 'classNumber' || 
      activeElement.type === 'classBranch') return;
    
    let newCols = properties.cols + increment;
    let maxCols = 26;
    
    if (activeElement.type === 'multipleChoice') {
      maxCols = 5;
      newCols = Math.min(maxCols, Math.max(1, newCols));
      
      updateElement(activeElementId, {
        cols: newCols,
        size: { ...activeElement.size, width: (newCols + 1) * 20 }
      });
    } 
    else if (activeElement.type === 'bookletCode') {
      // Kitapçık kodu için özel ölçeklendirme
      maxCols = 5;
      newCols = Math.min(maxCols, Math.max(1, newCols));
      
      updateElement(activeElementId, {
        cols: newCols,
        size: { 
          ...activeElement.size, 
          width: newCols * 20 // Her şıkkın tam olarak 20px genişliği olur
        }
      });
    }
    else if (activeElement.type === 'nameSurname' || activeElement.type === 'number') {
      maxCols = activeElement.type === 'number' ? 15 : 26;
      newCols = Math.min(maxCols, Math.max(1, newCols));
      
      updateElement(activeElementId, {
        cols: newCols,
        size: { ...activeElement.size, width: newCols * 20 }
      });
    }
    
    setProperties(prev => ({ ...prev, cols: newCols }));
  };
  
  const handleStartNumberChange = (e) => {
    const newStartNumber = parseInt(e.target.value) || 1;
    setProperties(prev => ({ ...prev, startNumber: newStartNumber }));
    updateElement(activeElementId, { startNumber: newStartNumber });
  };
  
  const handlePositionChange = (direction, amount = 20) => {
    let { posX, posY } = properties;
    
    switch(direction) {
      case 'left': posX = Math.max(0, posX - amount); break;
      case 'right': posX = posX + amount; break;
      case 'up': posY = Math.max(0, posY - amount); break;
      case 'down': posY = posY + amount; break;
    }
    
    setProperties(prev => ({ ...prev, posX, posY }));
    updateElement(activeElementId, { position: { x: posX, y: posY } });
    
    // Güvenli alan kontrolü
    setTimeout(() => {
      const current = pageElements.find(el => el.uniqueId === activeElementId);
      if (current) {
        setIsInSafeZone(isWithinSafeZone(current.position, current.size));
      }
    }, 10);
  };
  
  const handleSizeChange = (dimension, e) => {
    // textArea tipinde elemanlar için güncelleme yapılabilir
    if (activeElement.type !== 'image' && activeElement.type !== 'textArea') return;
    
    const value = parseInt(e.target.value) || 0;
    const gridSize = 20;
    const alignedValue = Math.max(gridSize, Math.floor(value / gridSize) * gridSize);
    
    setProperties(prev => ({ ...prev, [dimension]: alignedValue }));
    
    updateElement(activeElementId, {
      size: { ...activeElement.size, [dimension]: alignedValue }
    });
    
    // Güvenli alan kontrolü
    setTimeout(() => {
      const current = pageElements.find(el => el.uniqueId === activeElementId);
      if (current) {
        setIsInSafeZone(isWithinSafeZone(current.position, current.size));
      }
    }, 10);
  };
  
  const handleChangeImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          updateElement(activeElementId, { content: e.target.result });
          if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsDataURL(file);
      };
      
      fileInputRef.current.click();
    }
  };

  // İçerik render işlemleri
  const renderChoiceItems = () => (
    <div className={styles.choicesList}>
      {Array.from({ length: properties.cols }).map((_, i) => (
        <span key={i} className={styles.choiceItem}>{String.fromCharCode(65 + i)}</span>
      ))}
    </div>
  );
  
  return (
    <div className={styles.panel}>
      <h3 className={styles.panelTitle}>{getPanelTitle()}</h3>
      
      {/* Güvenli alan uyarısı */}
      {!isInSafeZone && (
        <div className={styles.safeZoneWarning}>
          <span className={styles.warningIcon}>⚠️</span>
          <p>Eleman güvenli bölge dışında! Lütfen köşelerdeki kalibrasyon işaretlerinden uzak durması için elemanı güvenli alan içinde tutun.</p>
        </div>
      )}
      
      {/* Konum Kontrolleri */}
      <div className={styles.propertySection}>
        <h4 className={styles.sectionTitle}>Eleman Konumu</h4>
        <DirectionControls 
          posX={properties.posX}
          posY={properties.posY}
          onPositionChange={handlePositionChange}
        />
      </div>

      {/* Elemana özgü ayarlar */}
      {activeElement.type === 'image' && (
        <>
          <div className={styles.propertySection}>
            <h4 className={styles.sectionTitle}>Resim Boyutu</h4>
            <InputControl 
              label="Genişlik:" 
              value={properties.width}
              onChange={(e) => handleSizeChange('width', e)}
              min={20}
              step={20}
            />
            <InputControl 
              label="Yükseklik:" 
              value={properties.height}
              onChange={(e) => handleSizeChange('height', e)}
              min={20}
              step={20}
            />
          </div>
          
          <div className={styles.propertyGroup}>
            <button
              className={styles.changeImageButton}
              onClick={handleChangeImage}
            >
              Resmi Değiştir
            </button>
          </div>
        </>
      )}
      {activeElement.type === 'textArea' && (
  <div className={styles.propertySection}>
    <h4 className={styles.sectionTitle}>Yazı Alanı Ayarları</h4>
    <InputControl 
      label="Genişlik:" 
      value={properties.width}
      onChange={(e) => handleSizeChange('width', e)}
      min={20}
      step={20}
    />
    <InputControl 
      label="Yükseklik:" 
      value={properties.height}
      onChange={(e) => handleSizeChange('height', e)}
      min={20}
      step={20}
    />
    
    <div className={styles.helpText}>
      İpucu: Yazı alanına metin eklemek için alanı seçin ve içine çift tıklayın. 
      Düzenleme modundayken dışarıya tıklayarak veya CTRL+Enter tuşlarına basarak 
      değişiklikleri kaydedebilirsiniz. ESC tuşu ile değişiklikleri iptal edebilirsiniz.
    </div>
  </div>
)}
      {/* Çoktan seçmeli test ayarları */}
      {activeElement.type === 'multipleChoice' && (
        <>
          <InputControl 
            label="Başlangıç Soru Numarası:" 
            value={properties.startNumber}
            onChange={handleStartNumberChange}
            min={1}
            step={1}
            unit=""
          />
          
          <QuantityControl 
            label="Soru Sayısı:"
            value={properties.rows}
            onDecrease={() => handleRowsChange(-1)}
            onIncrease={() => handleRowsChange(1)}
            min={1}
          />
          
          <QuantityControl 
            label="Şık Sayısı:"
            value={properties.cols}
            onDecrease={() => handleColsChange(-1)}
            onIncrease={() => handleColsChange(1)}
            min={1}
            max={5}
          />
          
          <InfoBox title="Şıklar:">
            {renderChoiceItems()}
          </InfoBox>
        </>
      )}
      {activeElement.type === 'bookletCode' && (
  <div className={styles.propertySection}>
    <h4 className={styles.sectionTitle}>Kitapçık Türü Ayarları</h4>
    
    <QuantityControl 
      label="Şık Sayısı:"
      value={properties.cols}
      onDecrease={() => handleColsChange(-1)}
      onIncrease={() => handleColsChange(1)}
      min={1}
      max={5}
    />
    
    <InfoBox title="Mevcut Şıklar:">
      {renderChoiceItems()}
    </InfoBox>
  </div>
)}
      
      {/* Ad Soyad veya Numara ayarları */}
      {(activeElement.type === 'nameSurname' || activeElement.type === 'number') && (
        <QuantityControl 
          label={activeElement.type === 'nameSurname' ? 'Harf Sayısı:' : 'Rakam Sayısı:'}
          value={properties.cols}
          onDecrease={() => handleColsChange(-1)}
          onIncrease={() => handleColsChange(1)}
          min={1}
          max={activeElement.type === 'number' ? 15 : undefined}
        />
      )}
      
      {/* TC Kimlik No ve Telefon için sabit bilgi */}
      {activeElement.type === 'tcNumber' && (
        <InfoBox title="TC Kimlik Numarası:">
          <div className={styles.infoText}>11 haneli TC kimlik numarası alanı</div>
        </InfoBox>
      )}
      
      {activeElement.type === 'phoneNumber' && (
        <InfoBox title="Telefon Numarası:">
          <div className={styles.infoText}>10 haneli telefon numarası alanı</div>
        </InfoBox>
      )}
      
      {/* Yardımcı ipuçları */}
      <div className={styles.helpText}>
        {activeElement.type === 'multipleChoice' 
          ? 'İpucu: Soru sayısını ve şık sayısını değiştirmek için + ve - butonlarını, konumunu değiştirmek için yön oklarını kullanın.'
          : activeElement.type === 'tcNumber' || activeElement.type === 'phoneNumber'
            ? `İpucu: ${activeElement.type === 'tcNumber' ? 'TC Kimlik no alanı sabit 11 hanedir.' : 'Telefon numarası alanı sabit 10 hanedir.'} Konumunu ayarlamak için yön oklarını kullanın.`
            : 'İpucu: Elemanın konumunu değiştirmek için yön oklarını kullanın.'}
      </div>
      
      {/* Kalibrasyon işaretleri uyarısı */}
      <div className={styles.calibrationNote}>
        <p>
          <strong>Önemli:</strong> Formun köşelerindeki kare kalibrasyon işaretleri, optik okuyucunun formu doğru şekilde tespit etmesi için gereklidir. Lütfen tüm elemanları kesikli çizgi ile gösterilen güvenli alan içinde tutun.
        </p>
      </div>
    </div>
  );
};

export default ElementPropertiesPanel;