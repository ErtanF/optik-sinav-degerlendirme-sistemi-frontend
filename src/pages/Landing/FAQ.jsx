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
      question: 'Hangi form elemanları kullanılabilir?',
      answer: 'Sistemde Ad Soyad Alanı (A-Z harfler), Numara Alanı (0-9 rakamlar), TC Kimlik No (11 haneli), Telefon No (10 haneli), Çoktan Seçmeli Sorular (A-E şıkları), Kitapçık Kodu, Sınıf ve Şube kodlama alanları bulunmaktadır.'
    },
    {
      id: 5,
      question: 'Yazı alanı ve resim ekleyebilir miyim?',
      answer: 'Evet, form elemanları arasında bulunan "Yazı Alanı" ile düzenlenebilir metin alanları ve "Resim Ekle" özelliği ile cihazınızdan yüklediğiniz görselleri formunuza ekleyebilirsiniz.'
    },
    {
      id: 6,
      question: 'Kalibrasyon işaretleri nedir ve neden önemli?',
      answer: 'Formun dört köşesindeki kare işaretler optik okuyucular için kalibrasyon noktalarıdır. Bu işaretler sayesinde form doğru tanınır, eğri taramalar düzeltilir ve tüm elemanlar doğru konumlarında okunur.'
    },
    {
      id: 7,
      question: 'Sınav nasıl oluştururum?',
      answer: '"Sınav Oluştur" sayfasından sınav adını, tarihini belirleyip önceden oluşturduğunuz optik form şablonlarından birini seçebilirsiniz. Ardından sınava katılacak sınıfları seçerek sınavınızı oluşturabilirsiniz.'
    },
    {
      id: 8,
      question: 'Sınıf ve öğrenci yönetimi nasıl çalışır?',
      answer: 'Sistemde sınıflarınızı oluşturup öğrencilerinizi tek tek ekleyebilir veya Excel dosyası ile toplu olarak içeri aktarabilirsiniz. Her sınıf için ayrı ayrı optik formlar atayabilirsiniz.'
    },
    {
      id: 9,
      question: 'Oluşturduğum formları nasıl düzenleyebilirim?',
      answer: '"Optik Formlarım" sayfasından formlarınızı görüntüleyebilir, düzenleyebilir veya silebilirsiniz. Her formun yanındaki "Düzenle" butonuna tıklayarak form editörünü açabilirsiniz.'
    },
    {
      id: 10,
      question: 'Formları yazdırabilir miyim?',
      answer: 'Evet, oluşturduğunuz formları yüksek kalitede yazdırabilirsiniz. Form detay sayfasında "Yazdır" butonu bulunmaktadır. Sistem A4 formatında tasarlanmıştır.'
    },
    {
      id: 11,
      question: 'Sistem mobil cihazlarda çalışır mı?',
      answer: 'Evet, OpTürk responsive tasarıma sahiptir. Tablet ve akıllı telefonlardan da sistemi kullanabilirsiniz. Ancak form oluşturma işlemleri daha büyük ekranlarda daha rahat yapılabilir.'
    },
    {
      id: 12,
      question: 'Verilerim güvende mi?',
      answer: 'Evet, tüm verileriniz SSL şifreleme ile korunmaktadır. KVKK uyumlu olarak çalışıyoruz ve verilerinizi kesinlikle üçüncü şahıslarla paylaşmıyoruz.'
    },
    {
      id: 13,
      question: 'Kaç öğrenci için kullanabilirim?',
      answer: 'Sistemimizde öğrenci sayısı sınırlaması bulunmamaktadır. İster küçük bir sınıf, ister büyük bir okul veya kurum için rahatlıkla kullanabilirsiniz.'
    },
    {
      id: 14,
      question: 'Sistem ücretsiz mi?',
      answer: 'Temel özellikler ücretsizdir. Aylık 100 forma kadar ücretsiz kullanım hakkınız bulunmaktadır. Daha fazla kullanım ve gelişmiş özellikler için uygun fiyatlı premium paketlerimiz mevcuttur.'
    },
    {
      id: 15,
      question: 'Sınavlarımı nasıl takip edebilirim?',
      answer: '"Sınavlar" sayfasından oluşturduğunuz tüm sınavları görüntüleyebilir, düzenleyebilir ve detaylarına bakabilirsiniz. Her sınav için atanan sınıfları ve öğrencileri görebilirsiniz.'
    },
    {
      id: 16,
      question: 'Form elemanlarını nasıl konumlandırırım?',
      answer: 'Sol panelden bir form elemanı seçtikten sonra A4 sayfasında istediğiniz konuma tıklayarak yerleştirebilirsiniz. Elemanları daha sonra sürükleyerek yeniden konumlandırabilirsiniz.'
    },
    {
      id: 17,
      question: 'Formlara başlık ekleyebilir miyim?',
      answer: 'Evet, her form elemanının varsayılan başlığı vardır (ör. AD SOYAD, NUMARA, TEST). Bu başlıkları element özelliklerinden özelleştirebilirsiniz.'
    },
    {
      id: 18,
      question: 'Birden fazla sayfalı form oluşturabilir miyim?',
      answer: 'Şu anda sistem tek sayfa A4 formatında form oluşturmayı desteklemektedir. Çok uzun sınavlar için ayrı formlar oluşturmanız önerilir.'
    },
    {
      id: 19,
      question: 'Dashboard\'ta neler görebilirim?',
      answer: 'Dashboard\'ta hızlı erişim menüleri, son oluşturduğunuz formlar, yaklaşan sınavlar ve sistem istatistiklerinizi görebilirsiniz.'
    },
    {
      id: 20,
      question: 'Optik okuma nasıl çalışacak?',
      answer: 'Gelecek güncellemelerde, tarayıcı ile taranmış optik formları sisteme yükleyerek otomatik değerlendirme yapılabilecek. Gelişmiş görüntü işleme algoritmaları ile yüksek doğruluk oranı sağlanacak.'
    },
    {
      id: 21,
      question: 'Sınıflara form ataması nasıl yapılır?',
      answer: 'Sınav oluşturma sayfasında optik form şablonunu seçtikten sonra, "Sınıf Seçimi" bölümünden sınava katılacak sınıfları işaretleyebilirsiniz.'
    },
    {
      id: 22,
      question: 'Öğrenci bilgilerini Excel ile ekleyebilir miyim?',
      answer: 'Evet, "Öğrenciler" sayfasında "Excel İçe Aktar" özelliği bulunmaktadır. Excel dosyanızı sisteme yükleyerek toplu öğrenci kaydı yapabilirsiniz.'
    },
    {
      id: 23,
      question: 'Teknik destek alabilir miyim?',
      answer: 'Tabii ki! İletişim sayfamızdan bizlere ulaşabilir, e-posta ve telefon ile destek alabilirsiniz. Ayrıca bu SSS sayfası da size yardımcı olmak için tasarlanmıştır.'
    },
    {
      id: 24,
      question: 'Sistemde kaç tane form oluşturabilirim?',
      answer: 'Ücretsiz hesaplarda aylık 100 forma kadar sınır bulunmaktadır. Premium hesaplarda bu sınır kaldırılmış olup sınırsız form oluşturabilirsiniz.'
    },
    {
      id: 25,
      question: 'Form önizlemesi nasıl çalışır?',
      answer: 'Form oluşturma sayfasında "Önizleme" butonuna tıklayarak formunuzun son halini görebilir ve bu görünümü kayıt edebilirsiniz. Önizleme modunda formunuzun yazıcıda nasıl görüneceğini de kontrol edebilirsiniz.'
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