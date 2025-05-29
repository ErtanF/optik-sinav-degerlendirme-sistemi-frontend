import React, { useState, useEffect, useCallback } from 'react';
import './ScreenshotsSection.css';

// Import images
import baha2 from '../../../assets/images/resim/baha2.png';
import baha3 from '../../../assets/images/resim/baha3.png';
import sorusayisi from '../../../assets/images/resim/sorusayisi.png';
import numara from '../../../assets/images/resim/numara.png';
import kitapcik from '../../../assets/images/resim/kitapçık.png';
import screenshot2 from '../../../assets/images/resim/Screenshot_2.png';

const ScreenshotsSection = () => {
  const [activeCategory, setActiveCategory] = useState('form');
  const [modalImage, setModalImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = [
    { id: 'form', name: 'FORM OLUŞTURMA', icon: '📋' },
    { id: 'optical', name: 'OPTİK OKUMA', icon: '📷' },
    { id: 'analysis', name: 'ANALİZ', icon: '📊' },
    { id: 'reports', name: 'KARNELER', icon: '📄' }
  ];

  const screenshots = {
    form: [
      { 
        id: 1, 
        title: 'Form Tasarım Arayüzü', 
        description: 'Sürükle-bırak form oluşturma sistemi ile kolayca sınav formları hazırlayın',
        image: baha2,
        category: 'Form Oluşturma'
      },
      { 
        id: 2, 
        title: 'Soru Sayısı Belirleme', 
        description: 'Sınav formunuzda kaç soru olacağını kolayca belirleyin',
        image: sorusayisi,
        category: 'Form Oluşturma'
      },
      { 
        id: 3, 
        title: 'Kitapçık Düzenleme', 
        description: 'Farklı kitapçık türleri ve düzenlemeleri yapın',
        image: kitapcik,
        category: 'Form Oluşturma'
      }
    ],
    optical: [
      { 
        id: 1, 
        title: 'Optik Okuma Sistemi', 
        description: 'Gelişmiş optik okuma teknolojisi ile cevapları otomatik algılayın',
        image: baha3,
        category: 'Optik Okuma'
      },
      { 
        id: 2, 
        title: 'Numara Tanıma', 
        description: 'Öğrenci numaralarını otomatik olarak tanıyan sistem',
        image: numara,
        category: 'Optik Okuma'
      },
      { 
        id: 3, 
        title: 'Hızlı İşleme', 
        description: 'Yüzlerce sınav kağıdını dakikalar içinde işleyin',
        image: screenshot2,
        category: 'Optik Okuma'
      }
    ],
    analysis: [
      { 
        id: 1, 
        title: 'Detaylı İstatistikler', 
        description: 'Sınav sonuçlarınızı detaylı grafikler ile analiz edin',
        image: baha2,
        category: 'Analiz ve Raporlama'
      },
      { 
        id: 2, 
        title: 'Soru Analizi', 
        description: 'Her sorunun başarı oranını ve zorluğunu görün',
        image: sorusayisi,
        category: 'Analiz ve Raporlama'
      },
      { 
        id: 3, 
        title: 'Karşılaştırmalı Analiz', 
        description: 'Sınıflar arası karşılaştırma yapın',
        image: baha3,
        category: 'Analiz ve Raporlama'
      }
    ],
    reports: [
      { 
        id: 1, 
        title: 'Bireysel Karneler', 
        description: 'Her öğrenci için detaylı başarı raporu oluşturun',
        image: screenshot2,
        category: 'Karne ve Raporlar'
      },
      { 
        id: 2, 
        title: 'Sınıf Raporları', 
        description: 'Tüm sınıfın genel durumunu değerlendirin',
        image: numara,
        category: 'Karne ve Raporlar'
      },
      { 
        id: 3, 
        title: 'Excel Çıktıları', 
        description: 'Tüm verileri Excel formatında dışa aktarın',
        image: kitapcik,
        category: 'Karne ve Raporlar'
      }
    ]
  };

  // Get current images based on active category
  const getCurrentImages = useCallback(() => screenshots[activeCategory], [activeCategory]);

  // Modal functions with useCallback for performance
  const openModal = useCallback((image, title, description, index) => {
    setModalImage({ image, title, description });
    setCurrentImageIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setModalImage(null);
    setCurrentImageIndex(0);
  }, []);

  const goToPrevious = useCallback(() => {
    const images = getCurrentImages();
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    setCurrentImageIndex(newIndex);
    const newImage = images[newIndex];
    setModalImage({ 
      image: newImage.image, 
      title: newImage.title, 
      description: newImage.description 
    });
  }, [currentImageIndex, getCurrentImages]);

  const goToNext = useCallback(() => {
    const images = getCurrentImages();
    const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(newIndex);
    const newImage = images[newIndex];
    setModalImage({ 
      image: newImage.image, 
      title: newImage.title, 
      description: newImage.description 
    });
  }, [currentImageIndex, getCurrentImages]);

  // Handle category change
  const handleCategoryChange = useCallback((categoryId) => {
    setActiveCategory(categoryId);
    if (modalImage) {
      closeModal(); // Close modal when category changes
    }
  }, [modalImage, closeModal]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }, [closeModal]);

  // Keyboard navigation with proper dependencies
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!modalImage) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Escape':
          e.preventDefault();
          closeModal();
          break;
        default:
          break;
      }
    };

    if (modalImage) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [modalImage, goToPrevious, goToNext, closeModal]);

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
              onClick={() => handleCategoryChange(category.id)}
              aria-label={`${category.name} kategorisini görüntüle`}
            >
              <span className="tab-icon" aria-hidden="true">{category.icon}</span>
              <span className="tab-name">{category.name}</span>
            </button>
          ))}
        </div>

        <div className="screenshots-content">
          <div className="screenshots-grid">
            {screenshots[activeCategory].map((screenshot, index) => (
              <div key={screenshot.id} className="screenshot-card">
                <div 
                  className="screenshot-image"
                  onClick={() => openModal(screenshot.image, screenshot.title, screenshot.description, index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openModal(screenshot.image, screenshot.title, screenshot.description, index);
                    }
                  }}
                  aria-label={`${screenshot.title} görselini büyüt`}
                >
                  <img 
                    src={screenshot.image} 
                    alt={screenshot.title}
                    className="screenshot-img"
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <div className="overlay-content">
                      <div className="zoom-icon" aria-hidden="true">🔍</div>
                    </div>
                  </div>
                </div>
                <div className="screenshot-info">
                  <div className="screenshot-category">{screenshot.category}</div>
                  <h3 className="screenshot-title">{screenshot.title}</h3>
                  <p className="screenshot-description">{screenshot.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {modalImage && (
          <div 
            className="image-modal" 
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <div className="modal-backdrop" onClick={closeModal}></div>
            
            {/* Close button - fixed to viewport */}
            <button 
              className="modal-close" 
              onClick={closeModal}
              aria-label="Modalı kapat"
            >
              ×
            </button>

            {/* Left navigation button - fixed to left edge */}
            <button 
              className="modal-nav modal-prev" 
              onClick={goToPrevious}
              aria-label="Önceki resim"
            >
              <span aria-hidden="true">❮</span>
            </button>

            {/* Right navigation button - fixed to right edge */}
            <button 
              className="modal-nav modal-next" 
              onClick={goToNext}
              aria-label="Sonraki resim"
            >
              <span aria-hidden="true">❯</span>
            </button>

            {/* Modal Content - centered */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-image-container">
                <img 
                  src={modalImage.image} 
                  alt={modalImage.title}
                  className="modal-image"
                />
              </div>
              <div className="modal-info">
                <h3 id="modal-title" className="modal-title">{modalImage.title}</h3>
                <p id="modal-description" className="modal-description">{modalImage.description}</p>
                <div className="modal-counter" aria-label={`${currentImageIndex + 1}. resim, toplam ${getCurrentImages().length} resim`}>
                  {currentImageIndex + 1} / {getCurrentImages().length}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default ScreenshotsSection; 