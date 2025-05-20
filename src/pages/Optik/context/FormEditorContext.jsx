import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const FormEditorContext = createContext();

export const useFormEditor = () => useContext(FormEditorContext);

export const FormEditorProvider = ({ children }) => {
  const [pageElements, setPageElements] = useState([]);
  const [activeElementId, setActiveElementId] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null); 
  const [isCreating, setIsCreating] = useState(false);
  const [tempImageData, setTempImageData] = useState(null);
  const fileInputRef = useRef(null);
  
  // Grid ve güvenli alan ayarları
  const gridSizeRef = useRef(20); // Grid boyutu
  const safeZoneMarginRef = useRef(30); // Köşe işaretlerinin bulunduğu kenar boşluğu
  const safeZonePaddingRef = useRef(10); // Güvenli alan ek boşluğu
  
  // Güvenli alan sınırlarını hesapla
  const getSafeZoneBounds = useCallback(() => {
    const margin = safeZoneMarginRef.current;
    const padding = safeZonePaddingRef.current;
    const totalMargin = margin + padding;
    
    return {
      top: totalMargin,
      left: totalMargin,
      right: 210 * 3.78 - totalMargin, // A4 genişliği 210mm, yaklaşık piksel değeri
      bottom: 297 * 3.78 - totalMargin  // A4 yüksekliği 297mm, yaklaşık piksel değeri
    };
  }, []);
  
  // Pozisyonun güvenli alan içinde olup olmadığını kontrol et
  const isWithinSafeZone = useCallback((position, size) => {
  if (!position || !size) return true;
  
  // Eleman boyutları
  const elementWidth = size.width || 100;
  const elementHeight = size.height || 100;
  
  // Yatay sınırlar
  const leftBoundary = 85 + 10;
  const rightBoundary = 745 - 10;
  
  // Dikey alt sınır
  const bottomBoundary = 1125 - 10;
  
  // Yatay ve alt sınır kontrolü
  const isWithinHorizontalBounds = 
    position.x >= leftBoundary && 
    (position.x + elementWidth) <= rightBoundary;
  
  const isWithinVerticalBounds = 
    position.y >= 0 && // Üst sınır yok
    (position.y + elementHeight) <= bottomBoundary; // Alt sınır
  
  return isWithinHorizontalBounds && isWithinVerticalBounds;
}, []);
  
 const constrainToSafeZone = useCallback((position, size) => {
  const gridSize = gridSizeRef.current;
  
  // Grid'e hizalama
  let x = Math.floor(position.x / gridSize) * gridSize;
  let y = Math.floor(position.y / gridSize) * gridSize;
  
  // Eleman boyutları
  const elementWidth = size?.width || 100;
  const elementHeight = size?.height || 100;
  
  // Yatay sınırlandırma - özel noktaların konumlarını kullanarak
  const leftBoundary = 85 + 10; // Sol sınır (özel nokta + biraz boşluk)
  const rightBoundary = 745 - 10; // Sağ sınır (özel nokta - biraz boşluk)
  
  // Dikey alt sınır - 1085px (özel nokta konumu)
  const bottomBoundary = 1125 - 10; // Alt sınır (özel nokta - biraz boşluk)
  
  // X pozisyonunu sınırla - eleman genişliğini hesaba kat
  x = Math.max(leftBoundary, x);
  x = Math.min(rightBoundary - elementWidth, x);
  
  // Y pozisyonunu sınırla - sadece alt sınır ve negatif değerler
  y = Math.max(0, y); // Üst sınır yok (sadece negatif değerleri önleme)
  y = Math.min(bottomBoundary - elementHeight, y); // Alt sınır
  
  return { x, y };
}, []);
  
  // Bubble içeriklerini saklamak için state
  const [customBubbleValues, setCustomBubbleValues] = useState({});
  
  // Bubble içeriğini güncelleme fonksiyonu
  const updateBubbleContent = useCallback((elementId, rowCol, value) => {
    setCustomBubbleValues(prev => {
      const elementValues = prev[elementId] || {};
      
      // Özel boş durumu kontrolü
      if (value === '') {
        const newElementValues = { ...elementValues };
        newElementValues[rowCol] = '';
        
        const newValues = { ...prev };
        newValues[elementId] = newElementValues;
        
        return newValues;
      }
      
      // Değer dolu ise, element ve değeri ekle/güncelle
      return {
        ...prev,
        [elementId]: {
          ...elementValues,
          [rowCol]: value.trim()
        }
      };
    });
  }, []);

  // Eleman güncelleme
  const updateElement = useCallback((uniqueId, updates) => {
    setPageElements(prev => prev.map(el => {
      if (el.uniqueId !== uniqueId) return el;
      
      const updatedElement = { ...el, ...updates };
      
      // Pozisyon güncellemesi varsa, güvenli alanda kaldığından emin ol
      if (updates.position) {
        const size = updatedElement.size || { width: 100, height: 100 };
        const constrainedPosition = constrainToSafeZone(updates.position, size);
        updatedElement.position = constrainedPosition;
      }
      
      return updatedElement;
    }));
  }, [constrainToSafeZone]);

  // Varsayılan eleman boyutlarını belirle
  // src/pages/Optik/context/FormEditorContext.jsx - getDefaultElementSize fonksiyonuna ekle
const getDefaultElementSize = useCallback((type) => {
  const gridSize = gridSizeRef.current;
  
  switch (type) {
    case 'nameSurname':
       return {
    width: 10 * gridSize,
    height: (29 * gridSize) + 60, // 26 yerine 29 (Türkçe alfabe için)
    rows: 29, // 26 yerine 29
    cols: 10
  };
    case 'number':
      return {
        width: 6 * gridSize,
        height: (10 * gridSize) + 60,
        rows: 10,
        cols: 6
      };
    case 'tcNumber':
      return {
        width: 11 * gridSize,
        height: (10 * gridSize) + 60,
        rows: 10,
        cols: 11
      };
    case 'phoneNumber':
      return {
        width: 10 * gridSize,
        height: (10 * gridSize) + 60,
        rows: 10,
        cols: 10
      };
    case 'multipleChoice':
      return {
        width: (5 + 1) * gridSize,
        height: (20 * gridSize) + 30,
        rows: 20,
        cols: 5
      };
      case 'textArea':
        return {
          width: 15 * gridSize,
          height: 6 * gridSize,
          rows: 0,
          cols: 0
        };
    // Yeni eklenen Kitapçık Kodu elemanı
    case 'bookletCode':
      return {
        width: 5 * gridSize,
        height: 2 * gridSize, // Tek satır + başlık yüksekliği
        rows: 1, // Tek satır
        cols: 5  // Varsayılan 5 karakter (A,B,C,D,E)
      };
      case 'classNumber':
  return {
    width: 3 * gridSize,
    height: (12 * gridSize) + 60, // Ad Soyad gibi +60 ekleyerek
    rows: 12,
    cols: 1
  };
case 'classBranch':
  return {
    width: 3 * gridSize,
    height: (26 * gridSize) + 60, // Ad Soyad gibi +60 ekleyerek
    rows: 26,
    cols: 1
  };
    case 'image':
      return {
        width: 10 * gridSize,
        height: 10 * gridSize,
        rows: 10,
        cols: 10
      };
    default:
      return {
        width: 5 * gridSize,
        height: 5 * gridSize,
        rows: 5,
        cols: 5
      };
  }
}, []);

  // Resim yükleme işlemi
  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir resim dosyası seçin.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      setTempImageData(imageData);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      alert('Resim yüklenirken bir hata oluştu.');
    };
    
    reader.readAsDataURL(file);
  }, []);

  // Yeni resim elementini oluştur
  const createImageElement = useCallback((position) => {
    if (!tempImageData) return null;
    
    const gridSize = gridSizeRef.current;
    const defaultSize = getDefaultElementSize('image');
    
    // Pozisyonu grid'e ve güvenli alana sığdır
    const constrainedPosition = constrainToSafeZone(
      { 
        x: Math.floor(position.x / gridSize) * gridSize,
        y: Math.floor(position.y / gridSize) * gridSize 
      },
      defaultSize
    );
    
    const uniqueId = `image-${Date.now()}`;
    
    const newElement = {
      type: 'image',
      uniqueId,
      position: constrainedPosition,
      size: {
        width: defaultSize.width,
        height: defaultSize.height
      },
      content: tempImageData,
      title: 'Resim'
    };
    
    setPageElements(prev => [...prev, newElement]);
    
    setTempImageData(null);
    
    setSelectedTool(null);
    
    setActiveElementId(uniqueId);
    
    return uniqueId;
  }, [tempImageData, getDefaultElementSize, constrainToSafeZone]);

  // Yeni eleman ekleme - Tek tıklama ile
  // Yeni eleman ekleme - Tek tıklama ile
const addElementAtPosition = useCallback((type, position) => {
  if (!type) return null;
  
  if (type === 'image') {
    if (!tempImageData) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
      return null;
    } else {
      return createImageElement(position);
    }
  }
  
  const gridSize = gridSizeRef.current;
  const defaultSize = getDefaultElementSize(type);
  
  // Pozisyonu grid'e ve güvenli alana sığdır
  const constrainedPosition = constrainToSafeZone(
    { 
      x: Math.floor(position.x / gridSize) * gridSize,
      y: Math.floor(position.y / gridSize) * gridSize 
    },
    defaultSize
  );
  
  const uniqueId = `${type}-${Date.now()}`;
  
  const newElement = {
    type,
    uniqueId,
    position: constrainedPosition,
    size: {
      width: defaultSize.width,
      height: defaultSize.height
    },
    rows: defaultSize.rows,
    cols: defaultSize.cols,
    startNumber: 1,
    content: type === 'textArea' ? '' : undefined // Yazı alanı için boş içerik
  };
  
  setPageElements(prev => [...prev, newElement]);
  
  return uniqueId;
}, [getDefaultElementSize, tempImageData, createImageElement, constrainToSafeZone]);"q  q2"
  
  // Eleman silme
  const removeElement = useCallback((uniqueId) => {
    setPageElements(prev => prev.filter(el => el.uniqueId !== uniqueId));
    
    // Özelleştirilmiş bubble değerlerini de temizle
    setCustomBubbleValues(prev => {
      const newValues = { ...prev };
      delete newValues[uniqueId];
      return newValues;
    });
    
    if (activeElementId === uniqueId) {
      setActiveElementId(null);
    }
  }, [activeElementId]);
  
  // A4 sayfasına tıklandığında elemanı ekle
  const handleCanvasClick = useCallback((position) => {
    if (!selectedTool) return;
    
    const newElementId = addElementAtPosition(selectedTool, position);
    
    if (newElementId) {
      setActiveElementId(newElementId);
      
      if (selectedTool !== 'image' || tempImageData) {
        setSelectedTool(null);
      }
      
      setIsCreating(false);
    }
  }, [selectedTool, addElementAtPosition, tempImageData]);
  
  // Aktif elemanı ayarlama
  const setActiveElement = useCallback((uniqueId) => {
    setActiveElementId(uniqueId);
  }, []);
  
  // Araç seçimi
  const selectTool = useCallback((tool) => {
    setSelectedTool(tool);
    
    if (tool === 'image' && fileInputRef.current) {
      fileInputRef.current.click();
    }
    
    setActiveElementId(null);
    
    setIsCreating(!!tool);
  }, []);

  // Form verilerini kaydetme ve geri yükleme için
  const getFormStateForSave = useCallback(() => {
    return {
      pageElements,
      customBubbleValues
    };
  }, [pageElements, customBubbleValues]);
  
  const loadFormState = useCallback((formState) => {
    if (formState.pageElements) {
      setPageElements(formState.pageElements);
    }
    
    if (formState.customBubbleValues) {
      setCustomBubbleValues(formState.customBubbleValues);
    }
  }, []);

  // Context değeri
  const value = {
    pageElements,
    activeElementId,
    selectedTool,
    isCreating,
    tempImageData,
    gridSize: gridSizeRef.current,
    safeZoneMargin: safeZoneMarginRef.current,
    safeZonePadding: safeZonePaddingRef.current,
    customBubbleValues,
    updateBubbleContent,
    setActiveElement,
    updateElement,
    removeElement,
    selectTool,
    handleCanvasClick,
    addElementAtPosition,
    handleImageUpload,
    fileInputRef,
    getFormStateForSave,
    loadFormState,
    getSafeZoneBounds,
    constrainToSafeZone,
    isWithinSafeZone
  };

  return (
    <FormEditorContext.Provider value={value}>
      {/* Gizli dosya input alanı */}
      <input 
        type="file" 
        ref={fileInputRef}
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleImageUpload}
      />
      {children}
    </FormEditorContext.Provider>
  );
};