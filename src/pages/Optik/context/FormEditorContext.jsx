import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { snapToGrid } from '../utils/helpers';

const FormEditorContext = createContext();

export const useFormEditor = () => useContext(FormEditorContext);

export const FormEditorProvider = ({ children }) => {
  const [pageElements, setPageElements] = useState([]);
  const [activeElementId, setActiveElementId] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null); 
  const [isCreating, setIsCreating] = useState(false);
  const [tempImageData, setTempImageData] = useState(null);
  const fileInputRef = useRef(null);
  
  // Grid boyutları
  const gridSizeRef = useRef(20);
  
  // Bubble içeriklerini saklamak için yeni state
  // Formatı: { elementId: { "row-col": "özelleştirilmiş değer" } }
  const [customBubbleValues, setCustomBubbleValues] = useState({});
  
  // Bubble içeriğini güncelleme fonksiyonu
  const updateBubbleContent = useCallback((elementId, rowCol, value) => {
    setCustomBubbleValues(prev => {
      const elementValues = prev[elementId] || {};
      
      // Debug log ekleyelim
      console.log(`updateBubbleContent: Element ${elementId}, rowCol ${rowCol}, value "${value}"`);
      
      // Özel boş durumu kontrolü
      if (value === '') {
        // Boş değer için özel durumu ele alıyoruz - önemli: tamamen silmek yerine boş değeri saklıyoruz
        const newElementValues = { ...elementValues };
        // Boş değeri açıkça kaydet
        newElementValues[rowCol] = '';
        
        const newValues = { ...prev };
        newValues[elementId] = newElementValues;
        
        // Boş değerleri saydır (debug)
        const emptyCount = Object.values(newElementValues).filter(v => v === '').length;
        console.log(`Element ${elementId} now has ${emptyCount} empty values`);
        
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

  const handleBubbleContentUpdate = (rowCol, value) => {
    if (onBubbleContentUpdate) {
      onBubbleContentUpdate(rowCol, value);
      
      // Değişiklik yapıldığını konsola yaz (debug)
      console.log(`Bubble ${rowCol} updated to: "${value}"`);
    }
  };

  // Eleman güncelleme
  const updateElement = useCallback((uniqueId, updates) => {
    setPageElements(prev => prev.map(el => 
      el.uniqueId === uniqueId ? {...el, ...updates} : el
    ));
  }, []);

  // Varsayılan eleman boyutlarını belirle
  const getDefaultElementSize = useCallback((type) => {
    const gridSize = gridSizeRef.current;
    
    switch (type) {
      case 'nameSurname':
        return {
          width: 10 * gridSize,
          height: (26 * gridSize) + 60,
          rows: 26,
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
    
    const alignedX = Math.floor(position.x / gridSize) * gridSize;
    const alignedY = Math.floor(position.y / gridSize) * gridSize;
    
    const defaultSize = getDefaultElementSize('image');
    
    const uniqueId = `image-${Date.now()}`;
    
    const newElement = {
      type: 'image',
      uniqueId,
      position: { x: alignedX, y: alignedY },
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
  }, [tempImageData, getDefaultElementSize]);

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
    
    const alignedX = Math.floor(position.x / gridSize) * gridSize;
    const alignedY = Math.floor(position.y / gridSize) * gridSize;
    
    const defaultSize = getDefaultElementSize(type);
    
    const uniqueId = `${type}-${Date.now()}`;
    
    const newElement = {
      type,
      uniqueId,
      position: { x: alignedX, y: alignedY },
      size: {
        width: defaultSize.width,
        height: defaultSize.height
      },
      rows: defaultSize.rows,
      cols: defaultSize.cols,
      startNumber: 1
    };
    
    setPageElements(prev => [...prev, newElement]);
    
    return uniqueId;
  }, [getDefaultElementSize, tempImageData, createImageElement]);
  
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
    loadFormState
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

export default FormEditorContext;