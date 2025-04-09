import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { snapToGrid } from '../utils/helpers';

const FormEditorContext = createContext();

export const useFormEditor = () => useContext(FormEditorContext);

export const FormEditorProvider = ({ children }) => {
  const [pageElements, setPageElements] = useState([]);
  const [activeElementId, setActiveElementId] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null); // Seçilen araç: null, 'nameSurname', 'number', 'multipleChoice'
  const [selectionMode, setSelectionMode] = useState(false); // Alan seçme modu aktif mi?
  const [selectionStart, setSelectionStart] = useState(null); // Seçimin başlangıç koordinatları
  const [selectionEnd, setSelectionEnd] = useState(null); // Seçimin bitiş koordinatları
  const [isCreating, setIsCreating] = useState(false); // Alan oluşturma işlemi devam ediyor mu?
  
  // Grid boyutları
  const gridSizeRef = useRef(20); // Piksel olarak grid boyutu - tüm hesaplamalar bu değere göre yapılır
  
  // Eleman güncelleme
  const updateElement = useCallback((uniqueId, updates) => {
    setPageElements(prev => prev.map(el => 
      el.uniqueId === uniqueId ? {...el, ...updates} : el
    ));
  }, []);

  // Yeni eleman ekleme - Optik Element
  const addOptikElement = useCallback((type, startPos, endPos) => {
    const gridSize = gridSizeRef.current;
    
    // Başlangıç ve bitiş pozisyonlarını al
    const startX = Math.min(startPos.x, endPos.x);
    const startY = Math.min(startPos.y, endPos.y);
    const endX = Math.max(startPos.x, endPos.x);
    const endY = Math.max(startPos.y, endPos.y);
    
    // Izgara içinde kaç satır ve sütun var?
    const rows = Math.floor((endY - startY) / gridSize);
    const cols = Math.floor((endX - startX) / gridSize);
    
    // Element türüne göre minimum boyut kontrolü
    let minRows = 2, minCols = 2;
    
    switch(type) {
      case 'nameSurname':
        minCols = 2; // En az 2 harf için alan
        break;
      case 'number':
        minCols = 2; // En az 2 rakam için alan
        break;
      case 'multipleChoice':
        minCols = 1; // En az 1 şık (A şıkkı)
        break;
    }
    
    // Seçilen alan minimum boyut kontrolü
    if (rows < minRows || cols < minCols) {
      console.warn(`Seçilen alan çok küçük. En az ${minRows}x${minCols} grid seçilmelidir.`);
      return null;
    }
    
    // Elementin yerleşim ve boyut bilgileri - gridler içinde tam olarak sığacak şekilde
    const position = {
      x: startX,
      y: startY
    };
    
    const size = {
      width: cols * gridSize,
      height: rows * gridSize
    };
    
    // Benzersiz ID oluştur
    const uniqueId = `${type}-${Date.now()}`;
    
    // Yeni element objesi oluştur
    const newElement = {
      type,
      uniqueId,
      position,
      size,
      rows: rows,
      cols: cols // Seçilen sütun sayısını koru
    };
    
    // Element listesine ekle
    setPageElements(prev => [...prev, newElement]);
    
    // Eklenen elementin ID'sini döndür (başka işlemler için kullanılabilir)
    return uniqueId;
  }, []);
  
  // Eleman silme
  const removeElement = useCallback((uniqueId) => {
    setPageElements(prev => prev.filter(el => el.uniqueId !== uniqueId));
    
    if (activeElementId === uniqueId) {
      setActiveElementId(null);
    }
  }, [activeElementId]);
  
  // Alan seçme modunu başlat
  const startAreaSelection = useCallback((tool, startPosition) => {
    if (!tool) return;
    
    // Başlangıç pozisyonunu grid'e hizala
    const gridSize = gridSizeRef.current;
    const alignedStart = {
      x: Math.floor(startPosition.x / gridSize) * gridSize,
      y: Math.floor(startPosition.y / gridSize) * gridSize
    };
    
    setSelectedTool(tool);
    setSelectionMode(true);
    setSelectionStart(alignedStart);
    setSelectionEnd(alignedStart); // Başlangıçta başlangıç ve bitiş aynı
    setIsCreating(true);
  }, []);
  
  // Alan seçimi sırasında
  const updateAreaSelection = useCallback((currentPosition) => {
    if (!selectionMode || !selectionStart) return;
    
    // Izgara tabanlı bitiş pozisyonu
    const gridSize = gridSizeRef.current;
    const endX = Math.floor(currentPosition.x / gridSize) * gridSize;
    const endY = Math.floor(currentPosition.y / gridSize) * gridSize;
    
    setSelectionEnd({ x: endX, y: endY });
  }, [selectionMode, selectionStart]);
  
  // Alan seçimini tamamla
  const completeAreaSelection = useCallback(() => {
    if (!selectionMode || !selectionStart || !selectionEnd || !selectedTool) {
      setSelectionMode(false);
      setSelectionStart(null);
      setSelectionEnd(null);
      setIsCreating(false);
      return;
    }
    
    // Tam grid çizgilerine hizalanan seçim sınırlarını hesapla
    const gridSize = gridSizeRef.current;
    
    // Başlangıç ve bitiş noktaları tam grid çizgilerine hizalanır
    const alignedStart = {
      x: Math.floor(selectionStart.x / gridSize) * gridSize,
      y: Math.floor(selectionStart.y / gridSize) * gridSize
    };
    
    const alignedEnd = {
      x: Math.ceil(selectionEnd.x / gridSize) * gridSize,
      y: Math.ceil(selectionEnd.y / gridSize) * gridSize
    };
    
    // Yeni optik element oluştur
    addOptikElement(selectedTool, alignedStart, alignedEnd);
    
    // Seçim modunu sıfırla
    setSelectionMode(false);
    setSelectionStart(null);
    setSelectionEnd(null);
    setSelectedTool(null);
    setIsCreating(false);
  }, [selectionMode, selectionStart, selectionEnd, selectedTool, addOptikElement]);
  
  // İptal etme
  const cancelAreaSelection = useCallback(() => {
    setSelectionMode(false);
    setSelectionStart(null);
    setSelectionEnd(null);
    setIsCreating(false);
  }, []);
  
  // Aktif elemanı ayarlama
  const setActiveElement = useCallback((uniqueId) => {
    // Seçim modu aktifse seçimi iptal et
    if (selectionMode) {
      cancelAreaSelection();
    }
    
    setActiveElementId(uniqueId);
  }, [selectionMode, cancelAreaSelection]);
  
  // Araç seçimi
  const selectTool = useCallback((tool) => {
    setSelectedTool(tool);
    
    // Aktif elemandan çık
    setActiveElementId(null);
  }, []);
  
  // Geçerli seçim alanının boyutları
  const selectionArea = useMemo(() => {
    if (!selectionStart || !selectionEnd) return null;
    
    const startX = Math.min(selectionStart.x, selectionEnd.x);
    const startY = Math.min(selectionStart.y, selectionEnd.y);
    const width = Math.abs(selectionEnd.x - selectionStart.x);
    const height = Math.abs(selectionEnd.y - selectionStart.y);
    
    return { 
      x: startX, 
      y: startY, 
      width, 
      height 
    };
  }, [selectionStart, selectionEnd]);

  // Context değeri
  const value = {
    pageElements,
    activeElementId,
    selectedTool,
    selectionMode,
    selectionStart,
    selectionEnd,
    selectionArea,
    isCreating,
    gridSize: gridSizeRef.current,
    setActiveElement,
    updateElement,
    removeElement,
    selectTool,
    startAreaSelection,
    updateAreaSelection,
    completeAreaSelection,
    cancelAreaSelection
  };

  return (
    <FormEditorContext.Provider value={value}>
      {children}
    </FormEditorContext.Provider>
  );
};

export default FormEditorContext;