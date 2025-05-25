import React, { useState, useEffect } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Sayfa yüklendiğinde en üste scroll yap
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simüle edilmiş form gönderimi
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    }, 2000);
  };

      return (
      <div className="contact-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="container">
            <h1>İletişim</h1>
            <div className="header-divider"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="container">
            <div className="content-wrapper">
            
            {/* Contact Info */}
            <div className="contact-info">
              <h2>İletişim Bilgileri</h2>
              
              <div className="info-item">
                <div className="icon">📧</div>
                <div className="content">
                  <h3>E-posta</h3>
                  <p><a href="mailto:destek@opturk.com">destek@opturk.com</a></p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon">📞</div>
                <div className="content">
                  <h3>Telefon</h3>
                  <p>+90 (212) 555 0123</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon">📍</div>
                <div className="content">
                  <h3>Adres</h3>
                  <p>
                    <a 
                      href="https://www.google.com/maps/search/Teknoloji+Mahallesi+İnovasyon+Caddesi+No+123+34000+İstanbul" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Teknoloji Mahallesi<br />İnovasyon Caddesi No: 123<br />34000 İstanbul
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <div className="form-header">
                <h2>Mesaj Gönder</h2>
                <div className="form-divider"></div>
              </div>

              {submitStatus === 'success' && (
                <div className="success-message">
                  ✅ Mesajınız gönderildi!
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>Ad Soyad</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Adınızı girin"
                  />
                </div>

                <div className="form-group">
                  <label>E-posta</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="E-posta adresinizi girin"
                  />
                </div>

                <div className="form-group">
                  <label>Mesaj</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Mesajınızı yazın..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 