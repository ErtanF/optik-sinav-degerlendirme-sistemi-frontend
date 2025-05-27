import React, { useState, useEffect } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setOpenFAQ(null); // Close any open FAQ when searching
  };

  const clearSearch = () => {
    setSearchTerm('');
    setOpenFAQ(null);
  };

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
    },
    {
      id: 7,
      question: 'Optik formları nasıl oluşturabilirim?',
      answer: 'Sistem içindeki form oluşturma modülü ile kolayca optik formlar oluşturabilirsiniz. Hazır şablonlar kullanabilir veya tamamen özelleştirilmiş formlar tasarlayabilirsiniz.'
    },
    {
      id: 8,
      question: 'Kaç öğrenci için kullanabilirim?',
      answer: 'Sistemimizde öğrenci sayısı sınırlaması bulunmamaktadır. İster küçük bir sınıf, ister büyük bir okul veya kurum için kullanabilirsiniz.'
    },
    {
      id: 9,
      question: 'Sonuçları nasıl paylaşabilirim?',
      answer: 'Sonuçları PDF, Excel veya CSV formatında dışa aktarabilir, e-posta ile paylaşabilir veya sistem üzerinden öğrencilere özel erişim sağlayabilirsiniz.'
    },
    {
      id: 10,
      question: 'Farklı sınav türleri oluşturabilir miyim?',
      answer: 'Evet, çoktan seçmeli, doğru/yanlış, eşleştirme ve açık uçlu sorular içeren sınavlar oluşturabilirsiniz.'
    },
    {
      id: 11,
      question: 'Form elemanları nelerdir ve nasıl kullanılır?',
      answer: 'Ad Soyad Alanı (A-Z harfler), Numara Alanı (0-9 rakamlar), TC Kimlik No (11 haneli), Telefon No (10 haneli), Çoktan Seçmeli (A-E şıkları), Kitapçık Kodu, Sınıf ve Şube kodlama alanları mevcuttur.'
    },
    {
      id: 12,
      question: 'Kalibrasyon işaretleri nedir?',
      answer: 'Formun dört köşesindeki kare işaretler optik tarayıcılar için kalibrasyon noktalarıdır. Bu işaretler sayesinde form doğru tanınır ve eğri taramalar düzeltilir.'
    },
    {
      id: 13,
      question: 'Formlara resim ekleyebilir miyim?',
      answer: 'Evet, form oluşturma arayüzünde resim ekleme özelliği bulunmaktadır. Cihazınızdan yükleyeceğiniz resimler forma entegre edilebilir.'
    },
    {
      id: 14,
      question: 'Yazı alanı nasıl eklenir?',
      answer: 'Form elemanları arasında bulunan "Yazı Alanı" seçeneği ile forma düzenlenebilir metin alanları ekleyebilirsiniz.'
    },
    {
      id: 15,
      question: 'Oluşturduğum formları nasıl düzenlerim?',
      answer: '"Optik Formlarım" sayfasından istediğiniz formu seçip "Düzenle" butonuna tıklayarak form üzerinde değişiklik yapabilirsiniz.'
    },
    {
      id: 16,
      question: 'Formları yazdırabilir miyim?',
      answer: 'Evet, oluşturduğunuz formları yüksek kalitede yazdırabilirsiniz. Form detay sayfasında "Yazdır" butonu bulunmaktadır.'
    },
    {
      id: 17,
      question: 'Sınıflara form ataması nasıl yapılır?',
      answer: 'Form oluştururken veya düzenlerken sınıf seçim alanından bir veya birden fazla sınıfı formunuza atayabilirsiniz.'
    },
    {
      id: 18,
      question: 'A4 sayfa formatı destekleniyor mu?',
      answer: 'Evet, sistemimiz standart A4 sayfa formatını desteklemektedir ve tüm form elemanları A4 boyutlarına uygun olarak tasarlanmıştır.'
    },
    {
      id: 19,
      question: 'Form elemanlarını nasıl konumlandırırım?',
      answer: 'Form elemanlarını seçtikten sonra A4 sayfasında istediğiniz konuma tıklayarak yerleştirebilirsiniz. Elemanları daha sonra sürükleyerek de taşıyabilirsiniz.'
    },
    {
      id: 20,
      question: 'Birden fazla sayfalı form oluşturabilir miyim?',
      answer: 'Şu anda sistem tek sayfa A4 formatında form oluşturmayı desteklemektedir. Çok uzun sınavlar için ayrı formlar oluşturmanız önerilir.'
    },
    {
      id: 21,
      question: 'Form başlığını nasıl değiştiririm?',
      answer: 'Form oluşturma sayfasında üst kısımda bulunan "Form Başlığı" alanından formunuzun başlığını değiştirebilirsiniz.'
    },
    {
      id: 22,
      question: 'Oluşturduğum formları silebilir miyim?',
      answer: 'Evet, "Optik Formlarım" sayfasından istediğiniz formu seçip "Sil" butonuna tıklayarak formlarınızı silebilirsiniz.'
    },
    {
      id: 23,
      question: 'Okul bilgilerim sistem tarafından nasıl kullanılıyor?',
      answer: 'Okul bilgileriniz formlarınızı organize etmek ve sadece sizin okulunuza ait sınıfları göstermek için kullanılır. Verileriniz güvenli şekilde saklanır.'
    },
    {
      id: 24,
      question: 'Sistemde kaç tane form oluşturabilirim?',
      answer: 'Ücretsiz hesaplarda aylık 100 forma kadar sınır bulunmaktadır. Premium hesaplarda bu sınır kaldırılmıştır.'
    },
    {
      id: 25,
      question: 'Form önizlemesi nasıl çalışır?',
      answer: '"Önizle ve Kaydet" butonuna tıklayarak formunuzun son halini görebilir ve bu görünümü kayıt edebilirsiniz.'
    }
  ];

  // Filter FAQs based on search term
  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="faq-page">
      <div className="faq-container">
        {/* Hero Section */}
        <div className="faq-hero">
          <div className="faq-hero-content">
            <div className="faq-hero-text">
              <h1 className="faq-hero-title">FAQs</h1>
              <p className="faq-hero-subtitle">
                Sorularınız mı var? İş ortaklarımız tarafından en çok değer verilen yanıtları, 
                adım adım talimatlar ve destek erişimiyle birlikte burada bulacaksınız.
              </p>
            </div>
            <div className="faq-hero-visual">
              <div className="faq-hero-person">
                <div className="person-head">
                  <div className="person-hair"></div>
                  <div className="person-face">
                    <div className="person-glasses"></div>
                  </div>
                </div>
                <div className="person-body">
                  <div className="person-shirt"></div>
                  <div className="laptop">
                    <div className="laptop-screen">
                      <div className="laptop-circle"></div>
                    </div>
                    <div className="laptop-base"></div>
                  </div>
                </div>
              </div>
              <div className="question-marks">
                <div className="question-mark q1">?</div>
                <div className="question-mark q2">?</div>
                <div className="question-mark q3">?</div>
                <div className="question-mark q4">?</div>
              </div>
              <div className="desk-items">
                <div className="coffee-cup">
                  <div className="coffee-steam"></div>
                </div>
                <div className="plant">
                  <div className="pot"></div>
                  <div className="leaves"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="faq-search">
          <div className="search-container">
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Sorularda arama yapın..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button className="clear-search" onClick={clearSearch}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="search-results-info">
                {filteredFAQs.length} sonuç bulundu
              </div>
            )}
          </div>
        </div>

        <div className="faq-list">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <div key={faq.id} className={`faq-item ${openFAQ === faq.id ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => toggleFAQ(faq.id)}>
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
            ))
          ) : (
            searchTerm && (
              <div className="no-results">
                <div className="no-results-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                </div>
                <h3>Sonuç bulunamadı</h3>
                <p>Aradığınız terimlere uygun soru bulunamadı. Farklı kelimeler deneyebilirsiniz.</p>
                <button className="clear-search-btn" onClick={clearSearch}>
                  Aramayı Temizle
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ; 