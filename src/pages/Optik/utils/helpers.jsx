// Izgaraya oturma fonksiyonu
export const snapToGrid = (value, gridSize = 10) => {
  return Math.floor(value / gridSize) * gridSize;
};

// Grid boyutu sabitini tanımla
export const GRID_SIZE = 10;

// Element sürüklenebilirliğini sıfırlama
export const resetElementDraggable = (elementId, delay = 0) => {
  if (!elementId) return;
  
  const applyDraggable = () => {
    const element = document.getElementById(elementId);
    if (element) {
      // Elementin draggable özelliğini etkinleştir
      element.setAttribute('draggable', 'true');
      element.draggable = true;
      
      // Bir tık olayı tetikleyerek elementi etkinleştirmeye zorla
      const evt = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: false
      });
      element.dispatchEvent(evt);
    }
  };
  
  if (delay > 0) {
    setTimeout(applyDraggable, delay);
  } else {
    applyDraggable();
  }
};

// İki element pozisyonu arasında çarpışma kontrolü
export const calculateCollision = (pos1, pos2, size1 = { width: GRID_SIZE * 22, height: GRID_SIZE * 22 }, size2 = { width: GRID_SIZE * 22, height: GRID_SIZE * 22 }) => {
  // Eğer pozisyonlar tanımsızsa, çarpışma yoktur
  if (!pos1 || !pos2) return false;
  
  // Her iki kutunun köşe noktaları
  const rect1 = {
    left: pos1.x,
    right: pos1.x + size1.width,
    top: pos1.y,
    bottom: pos1.y + size1.height
  };
  
  const rect2 = {
    left: pos2.x,
    right: pos2.x + size2.width,
    top: pos2.y,
    bottom: pos2.y + size2.height
  };
  
  // Çarpışma tespiti
  // İki dikdörtgenin çarpışmaması için dört şarttan biri sağlanmalıdır:
  // 1. Birinci dikdörtgen ikincinin solunda
  // 2. Birinci dikdörtgen ikincinin sağında
  // 3. Birinci dikdörtgen ikincinin üstünde
  // 4. Birinci dikdörtgen ikincinin altında
  return !(
    rect1.right < rect2.left || // 1. durum
    rect1.left > rect2.right || // 2. durum
    rect1.bottom < rect2.top || // 3. durum
    rect1.top > rect2.bottom    // 4. durum
  );
};

// A4 Koordinatlarını alma
export const getA4Coordinates = (e) => {
  const container = document.getElementById('a4-container');
  const rect = container.getBoundingClientRect();
  return { 
    x: snapToGrid(e.clientX - rect.left),
    y: snapToGrid(e.clientY - rect.top)
  };
};

// Benzersiz ID üretme
export const generateUniqueId = (prefix) => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Format yardımcı fonksiyonları
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR');
};

// DOM element pozisyonu ve boyutunu alma
export const getElementLayout = (element) => {
  if (!element) return null;
  
  return {
    position: {
      x: parseInt(element.style.left || '0', 10),
      y: parseInt(element.style.top || '0', 10)
    },
    size: {
      width: element.offsetWidth,
      height: element.offsetHeight
    }
  };
};