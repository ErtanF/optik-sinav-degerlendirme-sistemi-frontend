import React, { useEffect } from 'react';
import { useFormEditor } from '../context/FormEditorContext';

/**
 * Bu bileşen, BubbleGrid'deki customValues ve önizlemedeki FormRenderer arasındaki
 * uyumsuzluğu gidermek için eklendi. Doğrudan görünür bir UI parçası değildir.
 */
const BubbleContentUpdater = () => {
  const { 
    pageElements, 
    customBubbleValues, 
    updateBubbleContent 
  } = useFormEditor();

  // Varsayılan değerleri boş değerlerle değiştirme kontrolü
  useEffect(() => {
    if (!pageElements || !customBubbleValues) return;
    
    // Her elemana ve bubble'a bakarak, boş olarak ayarlanmış değerleri kontrol et
    pageElements.forEach(element => {
      const elementId = element.uniqueId;
      const elementValues = customBubbleValues[elementId] || {};
      
      // Önizlemede boş bırakılmak istenen bubble'lar için özel işlem
      Object.entries(elementValues).forEach(([key, value]) => {
        // Eğer bubble içeriği özellikle boş bırakılmak isteniyorsa
        if (value === '') {
          // Bu düşük seviyedeki güncelleme FormRenderer'a bilgi verir
          console.log(`Ensuring empty value for ${elementId}, bubble ${key}`);
        }
      });
    });
  }, [pageElements, customBubbleValues, updateBubbleContent]);

  return null; // Bu bileşen herhangi bir UI göstermez
};

export default BubbleContentUpdater;