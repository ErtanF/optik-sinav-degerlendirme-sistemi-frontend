import React, { memo } from 'react';
import styles from './CornerMarks.module.css';

/**
 * Optik formun dört köşesine kalibrasyon işaretleri ekleyen bileşen
 * Bu işaretler optik tarama sırasında formun doğru hizalanması için kullanılır
 */
const CornerMarks = memo(function CornerMarks({ 
  safeZoneMargin = 17, // Köşe işaretlerinin kenara uzaklığı
  safeZonePadding = 10, // Güvenli alan çizgisi ek boşluğu
  isVisible = true // Görünürlük kontrolü
}) {
  if (!isVisible) return null;
  
  // Toplam güvenli alan kenar boşluğu
  const totalSafeZoneMargin = safeZoneMargin + safeZonePadding;
  
  return (
    <div className={styles.cornerMarksContainer} data-testid="corner-marks">
      {/* Sol Üst Köşe */}
      <div className={styles.cornerMark} style={{ top: safeZoneMargin, left: safeZoneMargin }}>
        <div className={styles.outerBox}>
          <div className={styles.innerDot}></div>
        </div>
      </div>
      
      {/* Sağ Üst Köşe */}
      <div className={styles.cornerMark} style={{ top: safeZoneMargin, right: safeZoneMargin }}>
        <div className={styles.outerBox}>
          <div className={styles.innerDot}></div>
        </div>
      </div>
      
      {/* Sol Alt Köşe */}
      <div className={styles.cornerMark} style={{ bottom: safeZoneMargin, left: safeZoneMargin }}>
        <div className={styles.outerBox}>
          <div className={styles.innerDot}></div>
        </div>
      </div>
      
      {/* Sağ Alt Köşe */}
      <div className={styles.cornerMark} style={{ bottom: safeZoneMargin, right: safeZoneMargin }}>
        <div className={styles.outerBox}>
          <div className={styles.innerDot}></div>
        </div>
      </div>
      
      {/* Güvenli Çalışma Alanı Sınırı */}
      <div 
        className={styles.safeZoneBorder}
        style={{
          top: totalSafeZoneMargin,
          left: totalSafeZoneMargin,
          right: totalSafeZoneMargin,
          bottom: totalSafeZoneMargin
        }}
      ></div>
    </div>
  );
});

export default CornerMarks;