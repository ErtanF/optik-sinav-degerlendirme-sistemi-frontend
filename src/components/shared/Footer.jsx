import './Footer.css';
import { Link } from 'react-router-dom';
import favicon from '../../assets/favicon.jpg';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-content">          <div className="footer-brand">
            <Link to="/" aria-label="Ana sayfaya git">
              <img src={favicon} alt="Optik Sınav Sistemi Logo" className="footer-logo" />
              <h3 className="footer-title">Optik Sınav Sistemi</h3>
            </Link>
          </div>

          <div className="footer-links-container">
            {/* Sütun sayısını azaltabilir veya her sütundaki link sayısını azaltabilirsiniz */}            <div className="footer-links-column">
              <h4>Hızlı Erişim</h4>
              <nav className="footer-nav" aria-label="Footer navigasyon">
                <Link to="/">Ana Sayfa</Link>
                <Link to="/optik-olustur">Optik Oluştur</Link>
                <Link to="/optik-formlarim">Optik Formlarım</Link>
              </nav>
            </div>            <div className="footer-links-column">
              <h4>Yardım</h4>
              <nav className="footer-nav" aria-label="Yardım linkleri">
                <Link to="/profile">Profil</Link>
                <Link to="/faq">Sıkça Sorulan Sorular</Link>
                <Link to="/contact">İletişim</Link>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} Optik Sınav Sistemi
          </p>          <div className="footer-social">
            {/* Sosyal medya linkleri */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Optik Sınav Sistemi Twitter sayfasını ziyaret et">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="Optik Sınav Sistemi GitHub sayfasını ziyaret et">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;