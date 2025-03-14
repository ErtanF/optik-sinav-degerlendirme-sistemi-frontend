import { useCallback } from 'react';
import { snapToGrid } from '../utils/helpers';

export const useDragDrop = (pageElements, setPageElements, activeElementId, setActiveElementId) => {
  // Element üzerinde sürükleme başlatma
  const handleElementDragStart = useCallback((e, uniqueId) => {
    if (e.target.closest('.resize-handle') || e.target.closest('.text-element.editing')) {
      e.preventDefault();
      return;
    }
    
    setActiveElementId(uniqueId);
    e.dataTransfer.setData('application/json', JSON.stringify({ uniqueId }));
    
    // Görünmez sürükleme resmi
    const emptyImg = new Image();
    emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(emptyImg, 0, 0);
  }, [setActiveElementId]);

  // Element sürükleme tamamlandığında
  const handleElementDragEnd = useCallback(() => {
    if (activeElementId) {
      const activeElement = document.getElementById(activeElementId);
      if (activeElement) {
        updateElement(activeElementId, {
          position: {
            x: parseInt(activeElement.style.left, 10),
            y: parseInt(activeElement.style.top, 10)
          }
        });
      }
      setActiveElementId(null);
    }
  }, [activeElementId, setActiveElementId]);
  
  // Sidebar'dan sürükleme başlatma
  const handleSidebarDragStart = useCallback((e, element) => {
    setActiveElementId(null);
    e.dataTransfer.setData('application/json', JSON.stringify(element));
    
    // Görünmez sürükleme resmi
    const emptyImg = new Image();
    emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(emptyImg, 0, 0);
  }, [setActiveElementId]);
  
  // A4 üzerinde sürükleme
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    
    if (activeElementId) {
      const container = document.getElementById('a4-container');
      const rect = container.getBoundingClientRect();
      const x = snapToGrid(e.clientX - rect.left);
      const y = snapToGrid(e.clientY - rect.top);
      
      const activeElement = document.getElementById(activeElementId);
      if (activeElement) {
        activeElement.style.left = `${x}px`;
        activeElement.style.top = `${y}px`;
      }
    }
  }, [activeElementId]);
  
  // Element bırakıldığında
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    
    const elementDataStr = e.dataTransfer.getData('application/json');
    if (!elementDataStr) return;
    
    const elementData = JSON.parse(elementDataStr);
    
    // Mevcut elemanın sürüklenmesi değilse yeni eleman ekle
    if (!elementData.uniqueId) {
      const container = document.getElementById('a4-container');
      const rect = container.getBoundingClientRect();
      const coords = {
        x: snapToGrid(e.clientX - rect.left),
        y: snapToGrid(e.clientY - rect.top)
      };
      
      const uniqueId = `${elementData.id}-${Date.now()}`;
      
      setPageElements(prev => [
        ...prev,
        {
          ...elementData,
          uniqueId,
          position: coords,
          size: { width: 100, height: 80 }
        }
      ]);
    }
  }, [setPageElements]);
  
  // Element güncelleme yardımcı fonksiyonu
  const updateElement = useCallback((uniqueId, updates) => {
    setPageElements(prev => prev.map(el => 
      el.uniqueId === uniqueId ? {...el, ...updates} : el
    ));
  }, [setPageElements]);
  
  return {
    handleElementDragStart,
    handleElementDragEnd,
    handleSidebarDragStart,
    handleDragOver,
    handleDrop,
    updateElement
  };
};