import React, { useState } from 'react';
import './Faq.css';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: 'Optik Sınav Sistemi nedir?',
      answer: 'Optik Sınav Sistemi, eğitimcilerin optik form oluşturmasını, öğrenci sınav sonuçlarını hızlı ve doğru bir şekilde değerlendirmesini sağlayan bir platformdur.'
    },
    {
      question: 'Sistemi nasıl kullanabilirim?',
      answer: 'Sistemi kullanmak için kayıt olmalısınız. Kayıt işleminden sonra, öğretmen hesabınızın kurum yöneticisi tarafından onaylanması gerekecektir. Onay sonrası optik formlarınızı oluşturmaya başlayabilirsiniz.'
    },
    {
      question: 'Optik form oluşturma sürecinde hangi seçeneklerim var?',
      answer: 'İstenilen sayıda soru, cevap şıkkı, öğrenci bilgi alanları gibi özellikleri kolayca ayarlayabilirsiniz. Ayrıca oluşturduğunuz formlar üzerinde düzenlemeler yapabilir, PDF olarak indirebilir ve yazdırabilirsiniz.'
    },
    {
      question: 'Sonuçları nasıl değerlendirebilirim?',
      answer: 'Sistemimiz, tarayıcıdan yüklediğiniz doldurulmuş optik formları otomatik olarak değerlendirip sonuçları raporlar. İstatistiksel analizler, başarı grafikleri ve detaylı öğrenci sonuçlarına kolayca erişebilirsiniz.'
    },
    {
      question: 'Sistemin kullanımı ücretli mi?',
      answer: 'Temel özelliklerimiz ücretsiz olarak sunulmaktadır. Gelişmiş analiz araçları ve yüksek hacimli değerlendirmeler için premium paketlerimiz mevcuttur. Detaylı bilgi için iletişim sayfamızı ziyaret edebilirsiniz.'
    }
  ];

  return (
    <div className="faq-container">
      <h1 className="faq-title">Sıkça Sorulan Sorular</h1>
      <p className="faq-description">
        Optik Sınav Sistemi hakkında en çok sorulan sorular ve yanıtları aşağıda bulabilirsiniz.
      </p>

      <div className="faq-items">
        {faqData.map((item, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          >
            <button 
              className="faq-question" 
              onClick={() => handleToggle(index)}
              aria-expanded={activeIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span>{item.question}</span>
              <svg 
                className="faq-icon" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d={activeIndex === index ? "M19 12H5" : "M19 12H5 M12 5v14"} 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
              </svg>
            </button>
            
            <div 
              className="faq-answer"
              id={`faq-answer-${index}`}
              style={{ display: activeIndex === index ? 'block' : 'none' }}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
