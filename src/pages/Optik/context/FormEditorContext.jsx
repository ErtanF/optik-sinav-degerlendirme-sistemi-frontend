import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { snapToGrid } from '../utils/helpers';

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
    
    setPageElements(prev => [
      ...prev,
      {
        ...element,
        uniqueId,
        position,
        size: element.size || { width: 100, height: 80 } // Default size
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
    
    const snappedDeltaX = Math.round(deltaX / 20) * 20; // gridSize = 20
    const snappedDeltaY = Math.round(deltaY / 20) * 20;
    
    const { width: startWidth, height: startHeight } = startSizeRef.current;
    const { x: startX, y: startY } = startElementPositionRef.current;
    
    let newWidth = startWidth;
    let newHeight = startHeight;
    let newX = startX;
    let newY = startY;
    
    // Köşeye göre hesaplama
    switch (resizeCorner) {
      case 'topLeft':
        newWidth = Math.max(20, startWidth - snappedDeltaX);
        newHeight = Math.max(20, startHeight - snappedDeltaY);
        newX = startX + (startWidth - newWidth);
        newY = startY + (startHeight - newHeight);
        break;
      case 'topRight':
        newWidth = Math.max(20, startWidth + snappedDeltaX);
        newHeight = Math.max(20, startHeight - snappedDeltaY);
        newY = startY + (startHeight - newHeight);
        break;
      case 'bottomLeft':
        newWidth = Math.max(20, startWidth - snappedDeltaX);
        newHeight = Math.max(20, startHeight + snappedDeltaY);
        newX = startX + (startWidth - newWidth);
        break;
      case 'bottomRight':
        newWidth = Math.max(20, startWidth + snappedDeltaX);
        newHeight = Math.max(20, startHeight + snappedDeltaY);
        break;
      default:
        break;
    }
    
    updateElement(activeElementId, {
      position: { x: newX, y: newY },
      size: { width: newWidth, height: newHeight }
    });
  }, [resizing, activeElementId, resizeCorner, updateElement]);

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

  // Öğrenci alanlarını güncelleme
  const updateStudentFields = useCallback((student) => {
    if (!student) return;
    
    setPageElements(elements => elements.map(element => {
      if (element.type === 'field') {
        if (element.id === 'nameSurname') {
          return { ...element, content: student.name };
        } else if (element.id === 'schoolNumber') {
          return { ...element, content: student.number };
        } else if (element.id === 'classInfo') {
          return { ...element, content: student.class };
        }
      }
      return element;
    }));
  }, []);

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
    updateStudentFields
  };

  return (
    <FormEditorContext.Provider value={value}>
      {children}
    </FormEditorContext.Provider>
  );
};