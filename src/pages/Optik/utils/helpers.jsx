// Izgaraya oturma fonksiyonu
export const snapToGrid = (value, gridSize = 20) => {
  return Math.floor(value / gridSize) * gridSize;
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