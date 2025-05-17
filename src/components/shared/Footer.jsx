import './Footer.css';
import { Link, useNavigate } from 'react-router-dom';
import favicon from '../../assets/favicon.jpg';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  
  // Function to handle link clicks - navigate and scroll to top
  const handleLinkClick = (to, event) => {
    event.preventDefault();
    navigate(to);
    window.scrollTo(0, 0);
  };
  
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" aria-label="Ana sayfaya git" onClick={(e) => handleLinkClick('/', e)}>
              <img src={favicon || "/placeholder.svg"} alt="Optik Sınav Sistemi Logo" className="footer-logo" />
              <h3 className="footer-title">Optik Sınav Sistemi</h3>
            </Link>
          </div>

          <div className="footer-links-container">
            <div className="footer-links-column">
              <h4>Hızlı Erişim</h4>
              <nav className="footer-nav" aria-label="Footer navigasyon">
                <Link to="/" onClick={(e) => handleLinkClick('/', e)}>Ana Sayfa</Link>
                <Link to="/optik-olustur" onClick={(e) => handleLinkClick('/optik-olustur', e)}>Optik Oluştur</Link>
                <Link to="/optik-formlarim" onClick={(e) => handleLinkClick('/optik-formlarim', e)}>Optik Formlarım</Link>
                <Link to="/students" onClick={(e) => handleLinkClick('/students', e)}>Öğrenci Yönetimi</Link>
                <Link to="/classes" onClick={(e) => handleLinkClick('/classes', e)}>Sınıf Yönetimi</Link>
              </nav>
            </div>
            <div className="footer-links-column">
              <h4>Yardım</h4>
              <nav className="footer-nav" aria-label="Yardım linkleri">
                <Link to="/profile" onClick={(e) => handleLinkClick('/profile', e)}>Profil</Link>
                <Link to="/faq" onClick={(e) => handleLinkClick('/faq', e)}>Sıkça Sorulan Sorular</Link>
                <Link to="/contact" onClick={(e) => handleLinkClick('/contact', e)}>İletişim</Link>
              </nav>
            </div>
            <div className="footer-links-column">
              <h4>Kaynaklar</h4>
              <nav className="footer-nav" aria-label="Kaynak linkleri">
                <Link to="/kilavuzlar" onClick={(e) => handleLinkClick('/kilavuzlar', e)}>Kullanım Kılavuzları</Link>
                <Link to="/videolar" onClick={(e) => handleLinkClick('/videolar', e)}>Eğitim Videoları</Link>
                <Link to="/ornekler" onClick={(e) => handleLinkClick('/ornekler', e)}>Örnek Formlar</Link>
                <Link to="/blog" onClick={(e) => handleLinkClick('/blog', e)}>Blog</Link>
              </nav>
            </div>
            <div className="footer-links-column">
              <h4>Kurumsal</h4>
              <nav className="footer-nav" aria-label="Kurumsal linkleri">
                <Link to="/hakkimizda" onClick={(e) => handleLinkClick('/hakkimizda', e)}>Hakkımızda</Link>
                <Link to="/kariyer" onClick={(e) => handleLinkClick('/kariyer', e)}>Kariyer</Link>
                <Link to="/gizlilik" onClick={(e) => handleLinkClick('/gizlilik', e)}>Gizlilik Politikası</Link>
                <Link to="/kullanim-sartlari" onClick={(e) => handleLinkClick('/kullanim-sartlari', e)}>Kullanım Şartları</Link>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} Optik Sınav Sistemi
          </p>
          <div className="footer-social">
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