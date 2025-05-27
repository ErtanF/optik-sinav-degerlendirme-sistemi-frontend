import React from 'react';
import { Link } from 'react-router-dom';
import './CTASection.css';

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content-simple">
          <h2 className="cta-title-simple">
            Optik Okuma Sistemini <span className="cta-highlight">Hemen Deneyin</span>
          </h2>
          <p className="cta-description-simple">
            Ücretsiz hesap oluşturun ve eğitimde teknolojinin gücünü keşfedin.
          </p>
          
          <div className="cta-buttons">
            <Link to="/register" className="cta-button-primary">
              <span>Ücretsiz Hesap Oluştur</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link to="/login" className="cta-button-secondary">
              Zaten hesabınız var mı? <span>Giriş Yapın</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 