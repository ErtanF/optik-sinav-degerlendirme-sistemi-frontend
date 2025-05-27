import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './LandingNavbar.css';
import favicon from '../../assets/favicon3.png';

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    // Eğer ana sayfada değilsek, önce ana sayfaya git
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }
    
    // Ana sayfadaysak direkt scroll yap
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`landing-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <button 
            onClick={() => {
              if (location.pathname !== '/') {
                navigate('/');
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }} 
            className="brand-link"
            aria-label="Ana sayfaya git"
          >
            <img 
              src={favicon || "/placeholder.svg"} 
              alt="OpTürk Logo" 
              className="brand-logo" 
            />
            <div className="brand-text">
              <span className="brand-name">OpTürk</span>
              <span className="brand-slogan">Optik Sınav Değerlendirme Sistemi</span>
            </div>
          </button>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
          <div className="navbar-nav">
            <button 
              onClick={() => scrollToSection('features')} 
              className="nav-link"
              aria-label="Özellikler bölümüne git"
            >
              <span>Özellikler</span>
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="nav-link"
              aria-label="Nasıl çalışır bölümüne git"
            >
              <span>Nasıl Çalışır</span>
            </button>
            <button 
              onClick={() => scrollToSection('screenshots')} 
              className="nav-link"
              aria-label="Ekran görüntüleri bölümüne git"
            >
              <span>Ekran Görüntüleri</span>
            </button>
            <Link to="/faq" className="nav-link" aria-label="Sıkça sorulan sorular sayfasına git">
              <span>S.S.S.</span>
            </Link>
            <Link to="/contact" className="nav-link" aria-label="İletişim sayfasına git">
              <span>İletişim</span>
            </Link>
          </div>

          <div className="navbar-actions">
            <Link 
              to="/login" 
              className="btn btn-outline" 
              aria-label="Giriş yap"
            >
              <span>Giriş Yap</span>
            </Link>
            <Link to="/register" className="btn btn-primary" aria-label="Ücretsiz kayıt ol">
              <span>Ücretsiz Başla</span>
            </Link>
          </div>
        </div>

        <button 
          className={`navbar-burger ${isMenuOpen ? 'is-active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Menüyü aç/kapat"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default LandingNavbar; 