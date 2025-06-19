import React, { useState, useEffect } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
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
      
      // Form başarılı olduktan 3 saniye sonra mesajı kaldır ve formu temizle
      setTimeout(() => {
        setSubmitStatus(null);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>İletişim</h1>
          <p>Sorularınız için bize ulaşın</p>
        </div>

        <div className="contact-content">
          {/* Contact Form */}
          <div className="form-section">
            <h2>Mesaj Gönderin</h2>
            
            {submitStatus === 'success' && (
              <div className="success-message">
                ✅ Mesajınız gönderildi! En kısa sürede dönüş yapacağız.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Ad Soyad *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Adınızı ve soyadınızı girin"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-posta *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="ornek@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Konu *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Konu seçin</option>
                  <option value="general">Genel Bilgi</option>
                  <option value="technical">Teknik Destek</option>
                  <option value="sales">Satış ve Fiyatlandırma</option>
                  <option value="partnership">İş Birliği</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Mesajınız *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Mesajınızı yazın..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="submit-button" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="info-section">
            <h2>İletişim Bilgileri</h2>
            
            <div className="contact-info">
              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="info-content">
                  <h3>E-posta</h3>
                  <a href="mailto:destek@opturk.com">destek@opturk.com</a>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="info-content">
                  <h3>Telefon</h3>
                  <a href="tel:+902642956032">+90 (264) 295 60 32</a>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <div className="info-content">
                  <h3>Adres</h3>
                  <p>
                    Sakarya Üniversitesi<br />
                    Bilgisayar ve Bilişim Bilimleri Fakültesi<br />
                    Esentepe Kampüsü, 54187 Serdivan/Sakarya
                  </p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="info-content">
                  <h3>Çalışma Saatleri</h3>
                  <p>Pazartesi - Cuma: 08:00 - 17:00</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="map-section">
              <h3>Konum</h3>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.4697873087444!2d30.37481037647699!3d40.77694397138326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x409eb7d8e9b7b3f7%3A0x8b7b0d7c7f8a8e9b!2sSakarya%20%C3%9Cniversitesi%20Bilgisayar%20ve%20Bili%C5%9Fim%20Bilimleri%20Fak%C3%BCltesi!5e0!3m2!1str!2str!4v1703845678901!5m2!1str!2str"
                  width="100%"
                  height="150"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sakarya Üniversitesi Konumu"
                ></iframe>
                <a 
                  href="https://www.google.com/maps/dir//Sakarya+%C3%9Cniversitesi+Bilgisayar+ve+Bili%C5%9Fim+Bilimleri+Fak%C3%BCltesi/@40.77694397138326,30.37481037647699,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="map-icon">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                  Haritada Görüntüle
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 