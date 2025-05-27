import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: '📝',
      title: 'Optik Okuma',
      description: 'Tarayıcı ile optik formları tarayarak hızlı ve doğru şekilde okuma.',
      color: 'pink'
    },
    {
      icon: '📋',
      title: 'Form Oluşturma',
      description: 'Sınavlar için kişiselleştirilmiş optik formlar oluşturma.',
      color: 'orange'
    },
    {
      icon: '📊',
      title: 'Analiz & Değerlendirme',
      description: 'Detaylı karneler ve kapsamlı değerlendirme raporları.',
      color: 'blue'
    },
    {
      icon: '🏢',
      title: 'Salon Dağıtımı',
      description: 'Kelebek sistem ile adayları salonlara otomatik dağıtma.',
      color: 'green'
    },
    {
      icon: '🔧',
      title: 'Hata Düzeltme',
      description: 'Baskı ve tarama hatalarını otomatik tespit ve düzeltme.',
      color: 'purple'
    },
    {
      icon: '📄',
      title: 'Yazılı Sınavı',
      description: 'A4 kağıtlarına çift yönlü yazılı sınav formları oluşturma.',
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