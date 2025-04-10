import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { snapToGrid } from '../utils/helpers';

const FormEditorContext = createContext();

export const useFormEditor = () => useContext(FormEditorContext);

export const FormEditorProvider = ({ children }) => {
  const [pageElements, setPageElements] = useState([]);
  const [activeElementId, setActiveElementId] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null); // Seçilen araç: null, 'nameSurname', 'number', 'multipleChoice', 'image'
  const [isCreating, setIsCreating] = useState(false); // Alan oluşturma işlemi devam ediyor mu?
  const [tempImageData, setTempImageData] = useState(null); // Geçici resim verisi için state
  const fileInputRef = useRef(null); // Resim yükleme inputu için ref
  
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
      case 'image':
        // Resimler için varsayılan boyut
        return {
          width: 10 * gridSize, // 200px genişlik
          height: 10 * gridSize, // 200px yükseklik
          rows: 10,
          cols: 10
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

  // Resim yükleme işlemi
  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Dosya tipini kontrol et
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir resim dosyası seçin.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    console.log("Image file selected:", file.name, file.type, file.size);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      // Resim dosyasını Base64 formatında al
      const imageData = e.target.result;
      console.log("Image loaded, data length:", imageData.length);
      setTempImageData(imageData);
      
      // File input değerini sıfırla (aynı dosyayı tekrar seçebilmek için)
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
    
    // Pozisyonu grid'e hizala
    const alignedX = Math.floor(position.x / gridSize) * gridSize;
    const alignedY = Math.floor(position.y / gridSize) * gridSize;
    
    // Varsayılan boyutları al
    const defaultSize = getDefaultElementSize('image');
    
    // Benzersiz ID oluştur
    const uniqueId = `image-${Date.now()}`;
    
    // Yeni element objesi oluştur
    const newElement = {
      type: 'image',
      uniqueId,
      position: { x: alignedX, y: alignedY },
      size: {
        width: defaultSize.width,
        height: defaultSize.height
      },
      content: tempImageData, // Resim verisi
      title: 'Resim'
    };
    
    console.log("Creating image element:", uniqueId);
    
    // Element listesine ekle
    setPageElements(prev => [...prev, newElement]);
    
    // Geçici resim verisini temizle
    setTempImageData(null);
    
    // Araç seçimini sıfırla
    setSelectedTool(null);
    
    // Yeni eklenen resmi aktif element yap
    setActiveElementId(uniqueId);
    
    return uniqueId;
  }, [tempImageData, getDefaultElementSize]);

  // Yeni eleman ekleme - Tek tıklama ile
  const addElementAtPosition = useCallback((type, position) => {
    if (!type) return null;
    
    // Eğer resim ekleme ise ve geçici resim verisi yoksa, dosya seçim penceresini aç
    if (type === 'image') {
      if (!tempImageData) {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
        return null;
      } else {
        // Eğer geçici resim verisi varsa, resmi oluştur
        return createImageElement(position);
      }
    }
    
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
  }, [getDefaultElementSize, tempImageData, createImageElement]);
  
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
      
      // Seçili aracı sıfırla (tek bir eleman eklensin diye) - resim için bu işlem createImageElement içinde yapılıyor
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
    
    // Resim aracı seçildiğinde dosya seçimini aç
    if (tool === 'image' && fileInputRef.current) {
      fileInputRef.current.click();
    }
    
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
    tempImageData,
    gridSize: gridSizeRef.current,
    setActiveElement,
    updateElement,
    removeElement,
    selectTool,
    handleCanvasClick,
    addElementAtPosition,
    handleImageUpload,
    fileInputRef
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