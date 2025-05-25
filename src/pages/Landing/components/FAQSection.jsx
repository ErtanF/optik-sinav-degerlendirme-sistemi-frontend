import React, { useState } from 'react';
import './FAQSection.css';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'Optik okuma sistemi nasıl çalışır?',
      answer: 'Sistemimiz, tarayıcı ile taranmış optik formları otomatik olarak okur ve cevapları dijital ortama aktarır. Gelişmiş görüntü işleme algoritmaları sayesinde yüksek doğruluk oranı sağlar.'
    },
    {
      id: 2,
      question: 'Hangi tarayıcı türleri destekleniyor?',
      answer: 'Çoğu standart tarayıcı ile uyumludur. 300 DPI ve üzeri çözünürlükte tarama yapabilen herhangi bir tarayıcı kullanabilirsiniz.'
    },
    {
      id: 3,
      question: 'Sistem ücretsiz mi?',
      answer: 'Temel özellikler ücretsizdir. Aylık 100 forma kadar ücretsiz kullanım hakkınız bulunmaktadır. Daha fazla kullanım için uygun fiyatlı paketlerimiz mevcuttur.'
    },
    {
      id: 4,
      question: 'Verilerim güvende mi?',
      answer: 'Evet, tüm verileriniz SSL şifreleme ile korunmaktadır. KVKK uyumlu olarak çalışıyoruz ve verilerinizi üçüncü şahıslarla paylaşmıyoruz.'
    },
    {
      id: 5,
      question: 'Mobil cihazlardan kullanabilir miyim?',
      answer: 'Evet, sistemimiz responsive tasarıma sahiptir. Tablet ve akıllı telefonlardan da rahatlıkla kullanabilirsiniz.'
    },
    {
      id: 6,
      question: 'Teknik destek alabilir miyim?',
      answer: 'Tabii ki! E-posta, telefon ve canlı destek kanallarımız ile 7/24 teknik destek sağlıyoruz.'
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
          </div>

          <div className="faq-contact">
            <div className="contact-card">
              <h3>Başka sorularınız mı var?</h3>
              <p>Size yardımcı olmaktan mutluluk duyarız. Bizimle iletişime geçin.</p>
              <div className="contact-actions">
                <a href="/contact" className="btn btn-primary">
                  İletişime Geç
                </a>
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