import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { snapToGrid } from '../utils/helpers';

const FormEditorContext = createContext();

export const useFormEditor = () => useContext(FormEditorContext);

export const FormEditorProvider = ({ children }) => {
  const [pageElements, setPageElements] = useState([]);
  const [activeElementId, setActiveElementId] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null); // Seçilen araç: null, 'nameSurname', 'number', 'multipleChoice'
  const [isCreating, setIsCreating] = useState(false); // Alan oluşturma işlemi devam ediyor mu?
  
  // Grid boyutları
  const gridSizeRef = useRef(20); // Piksel olarak grid boyutu - tüm hesaplamalar bu değere göre yapılır
  
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
        // Ad soyad için varsayılan: 10 sütun genişliğinde, 26 satır (A-Z harfleri) + başlık ve yazı alanı
        return {
          width: 10 * gridSize,
          height: (26 * gridSize) + 60, // 30px başlık + 30px el yazı alanı
          rows: 26,
          cols: 10
        };
      case 'number':
        // Numara alanı için varsayılan: 6 sütun genişliğinde, 10 satır (0-9 rakamları) + başlık ve yazı alanı
        return {
          width: 6 * gridSize,
          height: (10 * gridSize) + 60, // 30px başlık + 30px el yazı alanı
          rows: 10,
          cols: 6
        };
      case 'tcNumber':
        // TC Kimlik No için sabit: 11 sütun (11 hane), 10 satır (0-9 rakamları) + başlık ve yazı alanı
        return {
          width: 11 * gridSize,
          height: (10 * gridSize) + 60, // 30px başlık + 30px el yazı alanı
          rows: 10,
          cols: 11
        };
      case 'phoneNumber':
        // Telefon No için sabit: 10 sütun (10 hane), 10 satır (0-9 rakamları) + başlık ve yazı alanı
        return {
          width: 10 * gridSize,
          height: (10 * gridSize) + 60, // 30px başlık + 30px el yazı alanı
          rows: 10,
          cols: 10
        };
      case 'multipleChoice':
        // Çoktan seçmeli için varsayılan: 5 sütun (A-E) + 1 sütun (soru numarası) ve 20 satır (20 soru)
        return {
          width: (5 + 1) * gridSize, // 5 şık + soru numarası sütunu
          height: (20 * gridSize) + 30, // 20 soru + 30px başlık
          rows: 20,
          cols: 5
        };
      default:
        // Varsayılan boyut
        return {
          width: 5 * gridSize,
          height: 5 * gridSize,
          rows: 5,
          cols: 5
        };
    }
  }, []);

  // Yeni eleman ekleme - Tek tıklama ile
  const addElementAtPosition = useCallback((type, position) => {
    if (!type) return null;
    
    const gridSize = gridSizeRef.current;
    
    // Pozisyonu grid'e hizala
    const alignedX = Math.floor(position.x / gridSize) * gridSize;
    const alignedY = Math.floor(position.y / gridSize) * gridSize;
    
    // Varsayılan boyutları al
    const defaultSize = getDefaultElementSize(type);
    
    // Benzersiz ID oluştur
    const uniqueId = `${type}-${Date.now()}`;
    
    // Yeni element objesi oluştur
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
      startNumber: 1 // Varsayılan başlangıç soru numarası
    };
    
    // Element listesine ekle
    setPageElements(prev => [...prev, newElement]);
    
    // Eklenen elementin ID'sini döndür (başka işlemler için kullanılabilir)
    return uniqueId;
  }, [getDefaultElementSize]);
  
  // Eleman silme
  const removeElement = useCallback((uniqueId) => {
    setPageElements(prev => prev.filter(el => el.uniqueId !== uniqueId));
    
    if (activeElementId === uniqueId) {
      setActiveElementId(null);
    }
  }, [activeElementId]);
  
  // A4 sayfasına tıklandığında elemanı ekle
  const handleCanvasClick = useCallback((position) => {
    if (!selectedTool) return;
    
    // Elemanı ekle
    const newElementId = addElementAtPosition(selectedTool, position);
    
    // Yeni oluşturulan elemanı seç (özelliklerini düzenlemeye hazır olması için)
    if (newElementId) {
      setActiveElementId(newElementId);
    }
    
    // Seçili aracı sıfırla (tek bir eleman eklensin diye)
    setSelectedTool(null);
    setIsCreating(false);
  }, [selectedTool, addElementAtPosition]);
  
  // Aktif elemanı ayarlama
  const setActiveElement = useCallback((uniqueId) => {
    setActiveElementId(uniqueId);
  }, []);
  
  // Araç seçimi
  const selectTool = useCallback((tool) => {
    setSelectedTool(tool);
    
    // Aktif elemandan çık
    setActiveElementId(null);
    
    // Eleman oluşturma modu
    setIsCreating(!!tool);
  }, []);

  // Context değeri
  const value = {
    pageElements,
    activeElementId,
    selectedTool,
    isCreating,
    gridSize: gridSizeRef.current,
    setActiveElement,
    updateElement,
    removeElement,
    selectTool,
    handleCanvasClick,
    addElementAtPosition
  };

  return (
    <FormEditorContext.Provider value={value}>
      {children}
    </FormEditorContext.Provider>
  );
};

export default FormEditorContext;