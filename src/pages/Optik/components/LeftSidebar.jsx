import React from 'react';
import FormElementsSidebar from './FormElementsSidebar';
import styles from './LeftSidebar.module.css';
import { useFormEditor } from '../context/FormEditorContext';

const LeftSidebar = () => {
  const { selectedTool } = useFormEditor();
  
  return (
    <div className={styles.container}>
      <FormElementsSidebar />
      
      {/* Seçim modunda yardım */}
      {selectedTool && (
        <div className={styles.helpSection}>
          <h3>Nasıl Kullanılır?</h3>
          <ol className={styles.helpSteps}>
            <li>A4 sayfasında fare ile sürükleyerek bir alan belirleyin.</li>
            <li>Belirlediğiniz alanda otomatik kodlanabilir sahalar oluşacaktır.</li>
            <li>Oluşturulan alana tıklayarak düzenleyebilirsiniz.</li>
          </ol>
        </div>
      )}
      
      {/* Araç seçilmediğinde genel bilgi */}
      {!selectedTool && (
        <div className={styles.infoSection}>
        <h3>Optik Form Oluşturucu</h3>
        <p>Solda bulunan "Optik Form Elemanları" bölümünden bir eleman türü seçerek sınav formu oluşturmaya başlayabilirsiniz.</p>
        <ul className={styles.infoList}>
          <li><strong>Ad Soyad Alanı:</strong> Seçilen genişlik kadar harfler (A-Z) gösterilir. En fazla 26 grid genişliğinde olabilir.</li>
          <li><strong>Numara Alanı:</strong> Seçilen genişlik kadar rakamlar (0-9) gösterilir. En fazla 10 grid genişliğinde olabilir.</li>
          <li><strong>Çoktan Seçmeli:</strong> İlk sütunda soru numarası, diğer sütunlarda seçilen genişliğe göre A'dan E'ye kadar şıklar gösterilir.</li>
        </ul>
        <p className={styles.tip}>İpucu: Her bir grid, bir kodlanabilir daireye denk gelir. Sadece ihtiyacınız kadar grid seçin!</p>
      </div>
      )}
    </div>
  );
};

export default LeftSidebar;