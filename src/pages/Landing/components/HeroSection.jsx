import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Düşük Maliyet
              <span className="hero-highlight"> Akılcı Çözümler</span>
            </h1>
            <p className="hero-description">
              Optik sınav değerlendirme sistemi ile eğitimde teknolojinin gücünü keşfedin. 
              Hızlı, güvenilir ve kullanıcı dostu çözümlerle sınavlarınızı dijitalleştirin.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Ücretsiz Başlayın
              </Link>
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-outline btn-large"
              >
                Özellikleri Keşfedin
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Değerlendirilen Sınav</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Aktif Kullanıcı</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Doğruluk Oranı</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-container">
              <div className="hero-image-placeholder">
                <div className="floating-card card-1">
                  <div className="card-icon">📊</div>
                  <div className="card-text">Analiz & Raporlama</div>
                </div>
                <div className="floating-card card-2">
                  <div className="card-icon">⚡</div>
                  <div className="card-text">Hızlı Okuma</div>
                </div>
                <div className="floating-card card-3">
                  <div className="card-icon">🎯</div>
                  <div className="card-text">Yüksek Doğruluk</div>
                </div>
                <div className="main-visual">
                  <div className="visual-screen">
                    <div className="screen-header">
                      <div className="screen-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <div className="screen-content">
                      <div className="content-line long"></div>
                      <div className="content-line medium"></div>
                      <div className="content-line short"></div>
                      <div className="content-chart">
                        <div className="chart-bar" style={{height: '60%'}}></div>
                        <div className="chart-bar" style={{height: '80%'}}></div>
                        <div className="chart-bar" style={{height: '40%'}}></div>
                        <div className="chart-bar" style={{height: '90%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 