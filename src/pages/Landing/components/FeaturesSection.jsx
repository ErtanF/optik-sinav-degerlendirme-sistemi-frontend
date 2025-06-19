import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      icon: '📝',
      title: 'Optik Form Oluşturma',
      description: 'Sınavlarınız için özelleştirilebilir optik formlar kolayca oluşturun. Çoktan seçmeli sorular için profesyonel form tasarımı.',
      illustration: 'communication',
      route: '/optik-olustur',
      detailInfo: 'Gelişmiş editör ile öğrenci bilgileri, çoktan seçmeli sorular, kitapçık kodları ve daha fazlasını içeren profesyonel optik formlar tasarlayın. Farklı soru sayıları ve düzenler için esnek seçenekler.'
    },
    {
      icon: '📊',
      title: 'Otomatik Değerlendirme',
      description: 'Optik formları tarayarak anında değerlendirme yapın. Hızlı ve hatasız sonuç alma imkanı.',
      illustration: 'design',
      route: '/sinavlar',
      detailInfo: 'Tarayıcı veya mobil cihazınızla optik formları okutun. Yapay zeka destekli algoritmalar ile %99.9 doğrulukta sonuç alın. Toplu değerlendirme ve hata düzeltme özellikleri.'
    },
    {
      icon: '📈',
      title: 'Detaylı Analiz Raporları',
      description: 'Öğrenci performansını analiz edin. Detaylı istatistikler ve karneler ile kapsamlı değerlendirme.',
      illustration: 'customers',
      route: '/dashboard',
      detailInfo: 'Sınıf bazında başarı grafikleri, soru bazında analiz, öğrenci karneleri ve Excel raporları. Zaman içinde performans takibi ve karşılaştırmalı analizler.'
    }
  ];

  const handleFeatureClick = (feature) => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate(feature.route);
    } else {
      setSelectedFeature(feature);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFeature(null);
  };

  return (
    <>
      <section id="features" className="features-section landing-section">
        <div className="section-container">
          <div className="section-header">
            <p className="section-label">ÖZELLİKLER</p>
            <h2 className="section-title">Özelliklerimiz & Hizmetlerimiz</h2>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-illustration">
                  <div className={`illustration-${feature.illustration}`}>
                    <span className="feature-icon">{feature.icon}</span>
                  </div>
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <button 
                    className="feature-btn"
                    onClick={() => handleFeatureClick(feature)}
                  >
                    DAHA FAZLA
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detay Modal */}
      {showModal && selectedFeature && (
        <div className="feature-modal-overlay" onClick={closeModal}>
          <div className="feature-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedFeature.icon} {selectedFeature.title}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-content">
              <p className="modal-description">{selectedFeature.detailInfo}</p>
              <div className="modal-actions">
                <button 
                  className="modal-btn primary"
                  onClick={() => navigate('/register')}
                >
                  Ücretsiz Kayıt Ol
                </button>
                <button 
                  className="modal-btn secondary"
                  onClick={() => navigate('/login')}
                >
                  Giriş Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturesSection; 