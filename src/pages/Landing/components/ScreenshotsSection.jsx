import React, { useState } from 'react';
import './ScreenshotsSection.css';

const ScreenshotsSection = () => {
  const [activeCategory, setActiveCategory] = useState('form');

  const categories = [
    { id: 'form', name: 'FORM OLUŞTURMA', icon: '📋' },
    { id: 'optical', name: 'OPTİK OKUMA', icon: '📷' },
    { id: 'analysis', name: 'ANALİZ', icon: '📊' },
    { id: 'reports', name: 'KARNELER', icon: '📄' }
  ];

  const screenshots = {
    form: [
      { id: 1, title: 'Form Tasarım Arayüzü', description: 'Sürükle-bırak form oluşturma' },
      { id: 2, title: 'Soru Düzenleme', description: 'Çoktan seçmeli sorular' },
      { id: 3, title: 'Form Önizleme', description: 'Formun son hali' }
    ],
    optical: [
      { id: 1, title: 'Optik Okuma', description: 'Taranmış formları işleme' },
      { id: 2, title: 'Otomatik Algılama', description: 'Cevapları otomatik tanıma' },
      { id: 3, title: 'Hata Düzeltme', description: 'Manuel düzeltme araçları' }
    ],
    analysis: [
      { id: 1, title: 'İstatistik Paneli', description: 'Detaylı analiz grafikleri' },
      { id: 2, title: 'Soru Analizi', description: 'Soru başarı oranları' },
      { id: 3, title: 'Karşılaştırma', description: 'Sınıf karşılaştırmaları' }
    ],
    reports: [
      { id: 1, title: 'Öğrenci Karnesi', description: 'Bireysel başarı raporu' },
      { id: 2, title: 'Sınıf Raporu', description: 'Toplu değerlendirme' },
      { id: 3, title: 'Excel Çıktısı', description: 'Veri dışa aktarımı' }
    ]
  };

  return (
    <section id="screenshots" className="screenshots-section landing-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">EKRAN GÖRÜNTÜLERİ</h2>
          <p className="section-subtitle">
            Sistemin farklı modüllerini keşfedin
          </p>
        </div>

        <div className="screenshots-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`tab-button ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="tab-icon">{category.icon}</span>
              <span className="tab-name">{category.name}</span>
            </button>
          ))}
        </div>

        <div className="screenshots-content">
          <div className="screenshots-grid">
            {screenshots[activeCategory].map((screenshot) => (
              <div key={screenshot.id} className="screenshot-card">
                <div className="screenshot-image">
                  <div className="image-placeholder">
                    <div className="placeholder-content">
                      <div className="placeholder-icon">
                        {categories.find(cat => cat.id === activeCategory)?.icon}
                      </div>
                      <div className="placeholder-text">
                        {screenshot.title}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="screenshot-info">
                  <h3 className="screenshot-title">{screenshot.title}</h3>
                  <p className="screenshot-description">{screenshot.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ScreenshotsSection; 