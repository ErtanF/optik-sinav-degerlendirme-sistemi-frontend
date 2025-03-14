import { useState, useRef, useCallback } from 'react';
import { snapToGrid } from '../utils/helpers';

export const useResizeElement = (pageElements, setPageElements) => {
  const [resizing, setResizing] = useState(false);
  const [resizeCorner, setResizeCorner] = useState(null);
  const [activeElementId, setActiveElementId] = useState(null);
  
  const startPositionRef = useRef({ x: 0, y: 0 });
  const startSizeRef = useRef({ width: 0, height: 0 });
  const startElementPositionRef = useRef({ x: 0, y: 0 });
  
  // Eleman güncelleme yardımcı fonksiyonu
  const updateElement = useCallback((uniqueId, updates) => {
    setPageElements(prev => prev.map(el => 
      el.uniqueId === uniqueId ? {...el, ...updates} : el
    ));
  }, [setPageElements]);
  
  // Boyutlandırma başlat
  const startResize = useCallback((e, uniqueId, corner) => {
    e.preventDefault();
    e.stopPropagation();
    
    setActiveElementId(uniqueId);
    setResizing(true);
    setResizeCorner(corner);
    
    startPositionRef.current = { x: e.clientX, y: e.clientY };
    
    const element = document.getElementById(uniqueId);
    if (!element) return;
    
    startSizeRef.current = { width: element.offsetWidth, height: element.offsetHeight };
    
    const elementData = pageElements.find(el => el.uniqueId === uniqueId);
    startElementPositionRef.current = elementData ? {...elementData.position} : { x: 0, y: 0 };
  }, [pageElements]);
  
  // Boyutlandırma sırasında
  const handleResize = useCallback((e) => {
    if (!resizing || !activeElementId || !resizeCorner) return;
    
    const deltaX = e.clientX - startPositionRef.current.x;
    const deltaY = e.clientY - startPositionRef.current.y;
    
    const snappedDeltaX = Math.round(deltaX / 20) * 20; // gridSize = 20
    const snappedDeltaY = Math.round(deltaY / 20) * 20;
    
    const { width: startWidth, height: startHeight } = startSizeRef.current;
    const { x: startX, y: startY } = startElementPositionRef.current;
    
    let newWidth = startWidth, newHeight = startHeight;
    let newX = startX, newY = startY;
    
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
  
  // Boyutlandırma durdur
  const stopResize = useCallback(() => {
    setResizing(false);
    setResizeCorner(null);
    setActiveElementId(null);
  }, []);
  
  return {
    resizing,
    resizeCorner,
    activeElementId,
    setActiveElementId,
    startResize,
    handleResize,
    stopResize
  };
};