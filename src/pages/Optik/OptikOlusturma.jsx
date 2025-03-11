import './OptikOlusturma.css';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';

const OptikOlusturma = () => {
  // Form elemanları
  const formElementsData = [
    { id: 'header', type: 'header', title: 'Başlık', image: 'https://via.placeholder.com/100x30/e0e0e0/333333?text=Başlık' },
    { id: 'studentInfo', type: 'studentInfo', title: 'Öğrenci Bilgileri', image: 'https://via.placeholder.com/100x60/e0e0e0/333333?text=Öğrenci+Bilgi' },
    { id: 'multipleChoice20', type: 'multipleChoice', title: '20 Soruluk Test', image: 'https://via.placeholder.com/100x80/e0e0e0/333333?text=20+Soru' },
    { id: 'multipleChoice40', type: 'multipleChoice', title: '40 Soruluk Test', image: 'https://via.placeholder.com/100x80/e0e0e0/333333?text=40+Soru' },
    { id: 'nameSurname', type: 'field', title: 'Ad Soyad Alanı', image: 'https://via.placeholder.com/100x30/e0e0e0/333333?text=Ad+Soyad' },
    { id: 'schoolNumber', type: 'field', title: 'Okul Numarası', image: 'https://via.placeholder.com/100x30/e0e0e0/333333?text=Okul+No' },
    { id: 'classInfo', type: 'field', title: 'Sınıf Bilgisi', image: 'https://via.placeholder.com/100x30/e0e0e0/333333?text=Sınıf' },
    { id: 'textLabel', type: 'text', title: 'Metin Alanı', image: 'https://via.placeholder.com/100x30/e0e0e0/333333?text=Metin+Alanı', content: 'Çift tıklayarak düzenle' },
  ];

  // State ve referanslar
  const [pageElements, setPageElements] = useState([]);
  const [activeElementId, setActiveElementId] = useState(null);
  const [resizing, setResizing] = useState(false);
  const [resizeCorner, setResizeCorner] = useState(null);
  const [editingTextId, setEditingTextId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  
  const startPositionRef = useRef({ x: 0, y: 0 });
  const startSizeRef = useRef({ width: 0, height: 0 });
  const startElementPositionRef = useRef({ x: 0, y: 0 });
  const textInputRef = useRef(null);
  
  const gridSize = 20;

  // Etki fonksiyonları
  useEffect(() => {
    // Boyutlandırma için olay dinleyicileri
    if (resizing && activeElementId) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', stopResize);
      return () => {
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', stopResize);
      };
    }
  }, [resizing, activeElementId, resizeCorner]);
  
  useEffect(() => {
    // Metin düzenleme aktif olduğunda input'a focus
    if (editingTextId && textInputRef.current) textInputRef.current.focus();
  }, [editingTextId]);

  useEffect(() => {
    // Dışarı tıklandığında metin düzenlemeyi kaydetme
    if (editingTextId) {
      const handleClickOutside = (e) => {
        if (textInputRef.current && !textInputRef.current.contains(e.target)) saveTextContent();
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [editingTextId, editingContent]);
  
  // Yardımcı fonksiyonlar
  const snapToGrid = (value) => Math.floor(value / gridSize) * gridSize;
  
  const updateElement = (uniqueId, updates) => {
    setPageElements(prev => prev.map(el => 
      el.uniqueId === uniqueId ? {...el, ...updates} : el
    ));
  };
  
  const getA4Coordinates = (e) => {
    const container = document.getElementById('a4-container');
    const rect = container.getBoundingClientRect();
    return { 
      x: snapToGrid(e.clientX - rect.left),
      y: snapToGrid(e.clientY - rect.top)
    };
  };
  
  // Metin işlemleri
  const startEditing = (element) => {
    if (element.type === 'text') {
      setEditingTextId(element.uniqueId);
      setEditingContent(element.content || '');
    }
  };
  
  const saveTextContent = () => {
    if (!editingTextId) return;
    
    updateElement(editingTextId, { content: editingContent });
    setEditingTextId(null);
    setEditingContent('');
  };
  
  const cancelTextEditing = () => {
    setEditingTextId(null);
    setEditingContent('');
  };
  
  // Olay işleyicileri
  const handleContainerClick = (e) => {
    if (e.target.id === 'a4-container' || e.target.className === 'grid-lines') {
      setActiveElementId(null);
      saveTextContent();
    }
  };
  
  const startResize = (e, uniqueId, corner) => {
    e.preventDefault();
    e.stopPropagation();
    
    saveTextContent();
    setActiveElementId(uniqueId);
    setResizing(true);
    setResizeCorner(corner);
    
    startPositionRef.current = { x: e.clientX, y: e.clientY };
    
    const element = document.getElementById(uniqueId);
    if (!element) return;
    
    startSizeRef.current = { width: element.offsetWidth, height: element.offsetHeight };
    
    const elementData = pageElements.find(el => el.uniqueId === uniqueId);
    startElementPositionRef.current = elementData ? {...elementData.position} : { x: 0, y: 0 };
  };
  
  const handleResize = (e) => {
    if (!resizing || !activeElementId || !resizeCorner) return;
    
    const deltaX = e.clientX - startPositionRef.current.x;
    const deltaY = e.clientY - startPositionRef.current.y;
    
    const snappedDeltaX = Math.round(deltaX / gridSize) * gridSize;
    const snappedDeltaY = Math.round(deltaY / gridSize) * gridSize;
    
    const { width: startWidth, height: startHeight } = startSizeRef.current;
    const { x: startX, y: startY } = startElementPositionRef.current;
    
    let newWidth = startWidth, newHeight = startHeight;
    let newX = startX, newY = startY;
    
    // Köşeye göre hesaplama
    switch (resizeCorner) {
      case 'topLeft':
        newWidth = Math.max(gridSize, startWidth - snappedDeltaX);
        newHeight = Math.max(gridSize, startHeight - snappedDeltaY);
        newX = startX + (startWidth - newWidth);
        newY = startY + (startHeight - newHeight);
        break;
      case 'topRight':
        newWidth = Math.max(gridSize, startWidth + snappedDeltaX);
        newHeight = Math.max(gridSize, startHeight - snappedDeltaY);
        newY = startY + (startHeight - newHeight);
        break;
      case 'bottomLeft':
        newWidth = Math.max(gridSize, startWidth - snappedDeltaX);
        newHeight = Math.max(gridSize, startHeight + snappedDeltaY);
        newX = startX + (startWidth - newWidth);
        break;
      case 'bottomRight':
        newWidth = Math.max(gridSize, startWidth + snappedDeltaX);
        newHeight = Math.max(gridSize, startHeight + snappedDeltaY);
        break;
    }
    
    updateElement(activeElementId, {
      position: { x: newX, y: newY },
      size: { width: newWidth, height: newHeight }
    });
  };
  
  const stopResize = () => {
    setResizing(false);
    setResizeCorner(null);
    setActiveElementId(null);
  };
  
  const handleDragStart = (e, element) => {
    setActiveElementId(null);
    saveTextContent();
    e.dataTransfer.setData('application/json', JSON.stringify(element));
    
    // Görünmez sürükleme resmi
    const emptyImg = new Image();
    emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(emptyImg, 0, 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    
    if (activeElementId && !resizing) {
      const coords = getA4Coordinates(e);
      const activeElement = document.getElementById(activeElementId);
      if (activeElement) {
        activeElement.style.left = `${coords.x}px`;
        activeElement.style.top = `${coords.y}px`;
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    
    const elementDataStr = e.dataTransfer.getData('application/json');
    if (!elementDataStr) return;
    
    const elementData = JSON.parse(elementDataStr);
    
    // Mevcut elemanın sürüklenmesi değilse yeni eleman ekle
    if (!(activeElementId && pageElements.some(el => el.uniqueId === activeElementId))) {
      const coords = getA4Coordinates(e);
      const uniqueId = `${elementData.id}-${Date.now()}`;
      
      setPageElements([
        ...pageElements,
        {
          ...elementData,
          uniqueId,
          position: coords,
          size: { width: 100, height: 80 }
        }
      ]);
    }
  };

  const handleElementDragStart = (e, uniqueId) => {
    if (resizing || editingTextId) {
      e.preventDefault();
      return;
    }
    
    setActiveElementId(uniqueId);
    e.dataTransfer.setData('application/json', JSON.stringify({uniqueId}));
  };

  const handleElementDragEnd = () => {
    if (!resizing && activeElementId) {
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
  };

  // Köşe tutaçlarını oluşturan fonksiyon
  const renderResizeHandles = (element) => {
    const corners = [
      { name: 'top-left', corner: 'topLeft' },
      { name: 'top-right', corner: 'topRight' },
      { name: 'bottom-left', corner: 'bottomLeft' },
      { name: 'bottom-right', corner: 'bottomRight' }
    ];
    
    return corners.map(({name, corner}) => (
      <div 
        key={`${element.uniqueId}-${name}`}
        className={`resize-handle ${name}`}
        onMouseDown={(e) => startResize(e, element.uniqueId, corner)}
      />
    ));
  };
  
  // Element içeriğini render etme
  const renderElementContent = (element) => {
    if (element.type === 'text') {
      if (editingTextId === element.uniqueId) {
        return (
          <input
            ref={textInputRef}
            type="text"
            className="editable-text-input"
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveTextContent();
              else if (e.key === 'Escape') cancelTextEditing();
            }}
            placeholder="Metin girin..."
          />
        );
      }
      return (
        <div className="text-content" onDoubleClick={() => startEditing(element)}>
          {element.content || 'Çift tıklayarak düzenle'}
        </div>
      );
    }
    return <img src={element.image} alt={element.title} style={{ width: '100%', height: '100%' }} />;
  };

  return (
    <div className="optik-olusturma-page">
      <div className="page-header">
        <h1>Optik Form Oluştur</h1>
        <div className="header-actions">
          <Button variant="primary">Kaydet</Button>
          <Link to="/dashboard"><Button variant="outline">Dashboard'a Dön</Button></Link>
        </div>
      </div>
      
      <div className="optik-creator-container">
        {/* Sol taraf - Form elemanları */}
        <div className="form-elements-sidebar">
          <h3>Form Elemanları</h3>
          <div className="elements-list">
            {formElementsData.map(element => (
              <div 
                key={element.id}
                className="form-element-item"
                draggable
                onDragStart={(e) => handleDragStart(e, element)}
              >
                <img src={element.image} alt={element.title} />
                <span>{element.title}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sağ taraf - A4 kağıdı */}
        <div className="a4-container-wrapper">
          <div 
            id="a4-container"
            className="a4-container"
            onDragOver={handleDragOver}
            onDragEnter={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={handleContainerClick}
          >
            <div className="grid-lines"></div>
            
            {/* A4 üzerindeki elemanlar */}
            {pageElements.map(element => (
              <div
                id={element.uniqueId}
                key={element.uniqueId}
                className={`page-element ${activeElementId === element.uniqueId ? 'active' : ''} 
                           ${resizing && activeElementId === element.uniqueId ? 'resizing' : ''} 
                           ${element.type === 'text' ? 'text-element' : ''} 
                           ${editingTextId === element.uniqueId ? 'editing' : ''}`}
                style={{
                  left: `${element.position.x}px`,
                  top: `${element.position.y}px`,
                  width: element.size?.width ? `${element.size.width}px` : 'auto',
                  height: element.size?.height ? `${element.size.height}px` : 'auto'
                }}
                draggable={!resizing && editingTextId !== element.uniqueId}
                onDragStart={(e) => handleElementDragStart(e, element.uniqueId)}
                onDragEnd={handleElementDragEnd}
                onClick={(e) => {
                  e.stopPropagation();
                  if (editingTextId !== element.uniqueId) {
                    saveTextContent();
                    setActiveElementId(element.uniqueId);
                  }
                }}
              >
                {renderElementContent(element)}
                
                <button 
                  className="remove-element"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (editingTextId === element.uniqueId) cancelTextEditing();
                    setPageElements(elements => elements.filter(el => el.uniqueId !== element.uniqueId));
                  }}
                >
                  &times;
                </button>
                
                {renderResizeHandles(element)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptikOlusturma;