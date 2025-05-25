import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: '📝',
      title: 'Optik Okuma',
      description: 'Tarayıcı yardımı ile siyah-beyaz cevap kağıtlarını tarayarak okuyabilirsiniz.',
      color: 'pink'
    },
    {
      icon: '📋',
      title: 'Form Oluşturma',
      description: 'Sınav veya anket uygulamalarınız için kişilere özel formlar oluşturabilirsiniz.',
      color: 'orange'
    },
    {
      icon: '📊',
      title: 'Analiz & Değerlendirme',
      description: 'Okunan formları analiz yapabilir. Detaylı karneler ve değerlendirme raporları alabilirsiniz.',
      color: 'blue'
    },
    {
      icon: '🏢',
      title: 'Salon Dağıtımı',
      description: 'Kelebek sistem olarak da bilinen farklı sınıflardaki adayları salonlara dağıtabilme.',
      color: 'green'
    },
    {
      icon: '🔧',
      title: 'Hata Düzeltme',
      description: 'Baskı ve tarama esnasındaki makine hatalarını, hatalı kodlama ile oluşan sorunları düzeltebilme.',
      color: 'purple'
    },
    {
      icon: '📄',
      title: 'Yazılı Sınavı & Yaprak Test',
      description: 'A4 Kağıtlarına iki yönlü olarak yazılı sınav kağıdı veya yaprak testler oluşturabilirme.',
      color: 'indigo'
    }
  ];

  return (
    <section id="features" className="features-section landing-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Optik Okuma Sistemimiz</h2>
          <p className="section-subtitle">
            Genel olarak aşağıdaki başlıklarda çalışmaktadır.
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className={`feature-card feature-${feature.color}`}>
              <div className="feature-icon">
                <span>{feature.icon}</span>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 