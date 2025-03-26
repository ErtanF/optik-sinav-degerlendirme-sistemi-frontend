import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { GRID_SIZE } from '../utils/helpers';

const FormEditorContext = createContext();

export const useFormEditor = () => useContext(FormEditorContext);

export const FormEditorProvider = ({ children }) => {
  const [pageElements, setPageElements] = useState([]);
  const [activeElementId, setActiveElementId] = useState(null);
  const [editingTextId, setEditingTextId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [resizing, setResizing] = useState(false);
  const [resizeCorner, setResizeCorner] = useState(null);
  
  // Referanslar
  const startPositionRef = useRef({ x: 0, y: 0 });
  const startSizeRef = useRef({ width: 0, height: 0 });
  const startElementPositionRef = useRef({ x: 0, y: 0 });

  // İki elementin çarpışıp çarpışmadığını kontrol et
  const checkCollision = (rect1, rect2) => {
    // Sadece tam üst üste gelme durumunu kontrol et
    return !(
      rect1.right <= rect2.left ||
      rect1.left >= rect2.right ||
      rect1.bottom <= rect2.top ||
      rect1.top >= rect2.bottom
    );
  };
  
  // Yeni boyut ve pozisyon ile çarpışma kontrolü
  const isResizeValid = (elementId, newX, newY, newWidth, newHeight) => {
    const newRect = {
      left: newX,
      top: newY,
      right: newX + newWidth,
      bottom: newY + newHeight
    };
    
    // Diğer elementlerle çarpışma kontrolü
    const hasCollision = pageElements.some(el => {
      if (el.uniqueId === elementId) return false; // Kendisiyle çarpışma kontrolü yapma
      
      const otherRect = {
        left: el.position.x,
        top: el.position.y,
        right: el.position.x + (el.size?.width || GRID_SIZE * 22),
        bottom: el.position.y + (el.size?.height || GRID_SIZE * 22)
      };
      
      return checkCollision(newRect, otherRect);
    });
    
    return !hasCollision;
  };

  // Eleman güncelleme
  const updateElement = useCallback((uniqueId, updates) => {
    setPageElements(prev => prev.map(el => 
      el.uniqueId === uniqueId ? {...el, ...updates} : el
    ));
  }, []);

  // Yeni eleman ekleme
  const addElement = useCallback((element, position) => {
    const uniqueId = `${element.id}-${Date.now()}`;
    
    console.log('Adding element with ID:', uniqueId, 'Element:', element, 'Position:', position);
    
    // Grid boyutu 10px olduğundan, 22 mazgal için 22x10 = 220px
    const gridSize = GRID_SIZE;
    const mazgalSayisi = 22;
    
    setPageElements(prev => [
      ...prev,
      {
        ...element,
        uniqueId,
        position,
        size: element.size || { 
          width: gridSize * mazgalSayisi, 
          height: gridSize * mazgalSayisi 
        } // 22 mazgal boyutunda
      }
    ]);
    
    return uniqueId;
  }, []);

  // Eleman silme
  const removeElement = useCallback((uniqueId) => {
    setPageElements(prev => prev.filter(el => el.uniqueId !== uniqueId));
    
    if (editingTextId === uniqueId) {
      setEditingTextId(null);
      setEditingContent('');
    }
    
    if (activeElementId === uniqueId) {
      setActiveElementId(null);
    }
  }, [activeElementId, editingTextId]);

  // Boyutlandırma başlatma
  const startResize = useCallback((e, uniqueId, corner) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Starting resize for element:', uniqueId, 'corner:', corner);
    
    setActiveElementId(uniqueId);
    setResizing(true);
    setResizeCorner(corner);
    
    startPositionRef.current = { x: e.clientX, y: e.clientY };
    
    const element = document.getElementById(uniqueId);
    if (element) {
      startSizeRef.current = { 
        width: element.offsetWidth, 
        height: element.offsetHeight 
      };
      
      const elementData = pageElements.find(el => el.uniqueId === uniqueId);
      if (elementData) {
        startElementPositionRef.current = { 
          x: elementData.position.x, 
          y: elementData.position.y 
        };
      }
    }
  }, [pageElements]);

  // Boyutlandırma devam ediyor
  const handleResize = useCallback((e) => {
    if (!resizing || !activeElementId || !resizeCorner) return;
    
    console.log('Resizing element:', activeElementId, 'corner:', resizeCorner);
    
    const deltaX = e.clientX - startPositionRef.current.x;
    const deltaY = e.clientY - startPositionRef.current.y;
    
    // Grid'e göre hizalama
    const gridSize = GRID_SIZE; // Mazgal boyutu
    const snappedDeltaX = Math.round(deltaX / gridSize) * gridSize;
    const snappedDeltaY = Math.round(deltaY / gridSize) * gridSize;
    
    const { width: startWidth, height: startHeight } = startSizeRef.current;
    const { x: startX, y: startY } = startElementPositionRef.current;
    
    let newWidth = startWidth;
    let newHeight = startHeight;
    let newX = startX;
    let newY = startY;
    
    // Köşeye göre hesaplama
    switch (resizeCorner) {
      case 'topLeft':
        newWidth = Math.max(gridSize, startWidth - snappedDeltaX);
        newHeight = Math.max(gridSize, startHeight - snappedDeltaY);
        // Mazgal boyutuna göre ayarla
        newWidth = Math.round(newWidth / gridSize) * gridSize;
        newHeight = Math.round(newHeight / gridSize) * gridSize;
        newX = startX + (startWidth - newWidth);
        newY = startY + (startHeight - newHeight);
        break;
      case 'topRight':
        newWidth = Math.max(gridSize, startWidth + snappedDeltaX);
        newHeight = Math.max(gridSize, startHeight - snappedDeltaY);
        // Mazgal boyutuna göre ayarla
        newWidth = Math.round(newWidth / gridSize) * gridSize;
        newHeight = Math.round(newHeight / gridSize) * gridSize;
        newY = startY + (startHeight - newHeight);
        break;
      case 'bottomLeft':
        newWidth = Math.max(gridSize, startWidth - snappedDeltaX);
        newHeight = Math.max(gridSize, startHeight + snappedDeltaY);
        // Mazgal boyutuna göre ayarla
        newWidth = Math.round(newWidth / gridSize) * gridSize;
        newHeight = Math.round(newHeight / gridSize) * gridSize;
        newX = startX + (startWidth - newWidth);
        break;
      case 'bottomRight':
        newWidth = Math.max(gridSize, startWidth + snappedDeltaX);
        newHeight = Math.max(gridSize, startHeight + snappedDeltaY);
        // Mazgal boyutuna göre ayarla
        newWidth = Math.round(newWidth / gridSize) * gridSize;
        newHeight = Math.round(newHeight / gridSize) * gridSize;
        break;
      default:
        break;
    }
    
    // Konumu da mazgala göre ayarla
    newX = Math.round(newX / gridSize) * gridSize;
    newY = Math.round(newY / gridSize) * gridSize;
    
    // Çarpışma kontrolü
    if (isResizeValid(activeElementId, newX, newY, newWidth, newHeight)) {
      updateElement(activeElementId, {
        position: { x: newX, y: newY },
        size: { width: newWidth, height: newHeight }
      });
    }
  }, [resizing, activeElementId, resizeCorner, updateElement, pageElements]);

  // Boyutlandırma durdurma
  const stopResize = useCallback(() => {
    console.log('Stopping resize');
    setResizing(false);
    setResizeCorner(null);
  }, []);

  // Metin düzenleme başlatma
  const startEditing = useCallback((element) => {
    if (element.type === 'text' || element.type === 'field') {
      setEditingTextId(element.uniqueId);
      setEditingContent(element.content || '');
    }
  }, []);

  // Metin içeriğini değiştirme
  const handleContentChange = useCallback((e) => {
    setEditingContent(e.target.value);
  }, []);

  // Metin içeriğini kaydetme
  const saveTextContent = useCallback(() => {
    if (!editingTextId) return;
    
    updateElement(editingTextId, { content: editingContent });
    setEditingTextId(null);
    setEditingContent('');
  }, [editingTextId, editingContent, updateElement]);

  // Aktif elemanı ayarlama
  const setActiveElement = useCallback((uniqueId) => {
    if (editingTextId && editingTextId !== uniqueId) {
      saveTextContent();
    }
    setActiveElementId(uniqueId);
  }, [editingTextId, saveTextContent]);



  // Sıraya göre elemanları verme
  const sortedElements = useMemo(() => {
    return [...pageElements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  }, [pageElements]);

  const value = {
    pageElements: sortedElements,
    activeElementId,
    editingTextId,
    editingContent,
    resizing,
    resizeCorner,
    setActiveElement,
    updateElement,
    addElement,
    removeElement,
    startResize,
    handleResize,
    stopResize,
    setResizing,
    setResizeCorner,
    startEditing,
    handleContentChange,
    saveTextContent,
  };

  return (
    <FormEditorContext.Provider value={value}>
      {children}
    </FormEditorContext.Provider>
  );
};