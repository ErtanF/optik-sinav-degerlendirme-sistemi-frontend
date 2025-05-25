import React from 'react';
import { Link } from 'react-router-dom';
import './CTASection.css';

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <div className="cta-text">
            <h2 className="cta-title">
              Optik Okuma Sistemini
              <span className="cta-highlight"> Hemen Deneyin</span>
            </h2>
            <p className="cta-description">
              Ücretsiz hesap oluşturun ve eğitimde teknolojinin gücünü keşfedin. 
              Dakikalar içinde kurulum, anında kullanıma hazır.
            </p>
            <div className="cta-features">
              <div className="cta-feature">
                <span className="feature-icon">✅</span>
                <span>Ücretsiz başlangıç</span>
              </div>
              <div className="cta-feature">
                <span className="feature-icon">✅</span>
                <span>Kredi kartı gerektirmez</span>
              </div>
              <div className="cta-feature">
                <span className="feature-icon">✅</span>
                <span>Anında kullanıma hazır</span>
              </div>
            </div>
          </div>
          
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary btn-large cta-primary">
              <span>Ücretsiz Hesap Oluştur</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="btn-icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <div className="cta-secondary">
              <p>Zaten hesabınız var mı?</p>
              <Link to="/login" className="login-link">
                Giriş Yapın
              </Link>
            </div>
          </div>
        </div>

        <div className="cta-visual">
          <div className="cta-stats">
            <div className="stat-card">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Değerlendirilen Sınav</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Mutlu Kullanıcı</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Doğruluk Oranı</div>
            </div>
          </div>
          
          <div className="cta-testimonial">
            <div className="testimonial-content">
              <p>"Optik okuma sistemi sayesinde sınav değerlendirme süremiz %80 azaldı. Harika bir çözüm!"</p>
              <div className="testimonial-author">
                <div className="author-info">
                  <div className="author-name">Ahmet Yılmaz</div>
                  <div className="author-title">Matematik Öğretmeni</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 