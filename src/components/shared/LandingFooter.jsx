import React from 'react';
import { Link } from 'react-router-dom';
import './LandingFooter.css';

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="landing-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <h3 className="brand-title">OPTİK OKU</h3>
              <p className="brand-description">
                Düşük maliyet, akılcı çözümler ile optik sınav değerlendirme sistemi.
                Eğitimde teknolojinin gücünü keşfedin.
              </p>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="section-title">Ürün</h4>
            <ul className="footer-links">
              <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Özellikler</button></li>
              <li><button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>Nasıl Çalışır</button></li>
              <li><button onClick={() => document.getElementById('screenshots')?.scrollIntoView({ behavior: 'smooth' })}>Ekran Görüntüleri</button></li>
              <li><Link to="/demo">Demo</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="section-title">Destek</h4>
            <ul className="footer-links">
              <li><button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>S.S.S.</button></li>
              <li><Link to="/contact">İletişim</Link></li>
              <li><Link to="/hakkimizda">Hakkımızda</Link></li>
              <li><Link to="/help">Yardım Merkezi</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="section-title">Yasal</h4>
            <ul className="footer-links">
              <li><Link to="/gizlilik">Gizlilik Politikası</Link></li>
              <li><Link to="/kullanim-sartlari">Kullanım Şartları</Link></li>
              <li><Link to="/kvkk">KVKK</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="section-title">Bağlantılar</h4>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Optik Oku. Tüm hakları saklıdır.
            </p>
            <div className="footer-bottom-links">
              <Link to="/gizlilik">Gizlilik</Link>
              <Link to="/kullanim-sartlari">Şartlar</Link>
              <Link to="/cookies">Çerezler</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter; 