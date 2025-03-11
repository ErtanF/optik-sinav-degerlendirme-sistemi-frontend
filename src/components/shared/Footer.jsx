const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <p className="copyright">
              &copy; {currentYear} Optik Sınav Değerlendirme Sistemi. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;