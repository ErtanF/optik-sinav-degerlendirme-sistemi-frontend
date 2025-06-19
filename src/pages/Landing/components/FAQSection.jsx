import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FAQSection.css';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'OpTürk Optik Sınav Değerlendirme Sistemi nedir?',
      answer: 'OpTürk, eğitimcilerin kolayca optik sınav formları oluşturmasını, öğrenci sınavlarını düzenlemesini ve sonuçları otomatik olarak değerlendirmesini sağlayan modern bir web tabanlı platformdur.'
    },
    {
      id: 2,
      question: 'Sistemi kullanabilmek için nasıl kayıt olabilirim?',
      answer: 'Ana sayfadan "Ücretsiz Başla" butonuna tıklayarak kayıt olabilirsiniz. Kayıt sonrası öğretmen hesabınızın okul yöneticisi tarafından onaylanması gerekir. Onay sonrası tüm özelliklere erişim sağlarsınız.'
    },
    {
      id: 3,
      question: 'Optik form nasıl oluştururum?',
      answer: 'Dashboard\'tan "Optik Form Oluştur" seçeneğine tıklayarak form oluşturma arayüzüne erişebilirsiniz. Sol panelden form elemanlarını seçip A4 sayfasına sürükleyerek formunuzu tasarlayabilirsiniz.'
    },
    {
      id: 4,
      question: 'Sistem ücretsiz mi?',
      answer: 'Temel özellikler ücretsizdir. Aylık 100 forma kadar ücretsiz kullanım hakkınız bulunmaktadır. Daha fazla kullanım ve gelişmiş özellikler için uygun fiyatlı premium paketlerimiz mevcuttur.'
    },
    {
      id: 5,
      question: 'Verilerim güvende mi?',
      answer: 'Evet, tüm verileriniz SSL şifreleme ile korunmaktadır. KVKK uyumlu olarak çalışıyoruz ve verilerinizi kesinlikle üçüncü şahıslarla paylaşmıyoruz.'
    }
  ];

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section id="faq" className="faq-section landing-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Sıkça Sorulan Sorular</h2>
          <p className="section-subtitle">
            Merak ettiğiniz soruların cevapları burada
          </p>
        </div>

        <div className="faq-container">
          <div className="faq-list">
            {faqs.map((faq) => (
              <div key={faq.id} className={`faq-item ${openFAQ === faq.id ? 'open' : ''}`}>
                <button 
                  className="faq-question"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <span className="question-text">{faq.question}</span>
                  <span className="question-icon">
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      className={`chevron ${openFAQ === faq.id ? 'rotated' : ''}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div className="answer-content">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="faq-view-all">
              <Link to="/faq" className="view-all-link">
                <span>Tüm Soruları Görüntüle</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="view-all-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="faq-contact">
            <div className="contact-card">
              <h3>Başka sorularınız mı var?</h3>
              <p>Size yardımcı olmaktan mutluluk duyarız. Bizimle iletişime geçin.</p>
              <div className="contact-actions">
                <Link to="/contact" className="btn btn-primary">
                  İletişime Geç
                </Link>
                <a href="mailto:destek@optikoku.com" className="btn btn-outline">
                  E-posta Gönder
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 