import React from 'react';
import FormElementsSidebar from './FormElementsSidebar';
import ElementPropertiesPanel from './ElementPropertiesPanel';
import styles from './LeftSidebar.module.css';
import { useFormEditor } from '../context/FormEditorContext';

const LeftSidebar = () => {
  const { selectedTool, activeElementId } = useFormEditor();
  
  return (
    <div className={styles.container}>
      {/* Aktif eleman özellikleri panel - Artık üstte */}
      {activeElementId && <ElementPropertiesPanel />}
      
      {/* Form Elemanları Seçici - Artık altta */}
      <FormElementsSidebar />
      
      {/* Seçim modunda yardım */}
      {selectedTool && !activeElementId && (
        <div className={styles.helpSection}>
          <h3>Nasıl Kullanılır?</h3>
          <ol className={styles.helpSteps}>
            <li>A4 sayfasında elemanın yerleşmesini istediğiniz yere tıklayın.</li>
            <li>Eleman sayfaya varsayılan boyutuyla eklenecektir.</li>
            <li>Oluşturulan elemana tıklayarak özelliklerini düzenleyebilirsiniz.</li>
          </ol>
        </div>
      )}
      
      {/* Araç seçilmediğinde ve aktif eleman yokken genel bilgi */}
      {!selectedTool && !activeElementId && (
        <div className={styles.infoSection}>
          <h3>Optik Form Oluşturucu</h3>
          <p>Aşağıdaki "Optik Form Elemanları" bölümünden bir eleman türü seçerek sınav formu oluşturmaya başlayabilirsiniz.</p>
          <ul className={styles.infoList}>
            <li><strong>Ad Soyad Alanı:</strong> Harfler (A-Z) ile ad soyad kodlama alanı oluşturur.</li>
            <li><strong>Numara Alanı:</strong> Rakamlar (0-9) ile öğrenci numarası alanı oluşturur.</li>
            <li><strong>TC Kimlik No:</strong> Sabit 11 haneli TC kimlik numarası için kodlama alanı oluşturur.</li>
            <li><strong>Telefon No:</strong> Sabit 10 haneli telefon numarası için kodlama alanı oluşturur.</li>
            <li><strong>Çoktan Seçmeli:</strong> İlk sütunda soru numarası, diğer sütunlarda A'dan E'ye kadar şıklar gösterilir.</li>
          </ul>
          <p className={styles.tip}>İpucu: Her bir eleman varsayılan boyutla eklenir. Ekledikten sonra özelliklerini düzenleyebilirsiniz!</p>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;