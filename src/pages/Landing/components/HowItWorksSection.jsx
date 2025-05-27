import React from 'react';
import { Link } from 'react-router-dom';
import './HowItWorksSection.css';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Form Oluşturun',
      description: 'Sınav kağıdınızı kolayca oluşturun. Özelleştirilebilir şablonlar ile dakikalar içinde hazır.',
      icon: '📝'
    },
    {
      number: '02',
      title: 'Optik Okuma Yapın',
      description: 'Doldurulmuş formları tarayıcı ile okutun. Sistemimiz otomatik olarak cevapları algılar ve işler.',
      icon: '📷'
    },
    {
      number: '03',
      title: 'Sonuçları Analiz Edin',
      description: 'Detaylı raporlar ve analizler ile sonuçları değerlendirin. Grafik ve tablolar ile görselleştirin.',
      icon: '📊'
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works-section landing-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Nasıl Çalışır?</h2>
          <p className="section-subtitle">
            3 basit adımda optik okuma sistemini kullanmaya başlayın
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-number">
                <span>{step.number}</span>
              </div>
              <div className="step-content">
                <div className="step-icon">
                  <span>{step.icon}</span>
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="step-connector">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 