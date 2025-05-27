import React, { useState, useEffect } from 'react';
import './Landing.css';
import './KVKK.css';

const LandingKVKK = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.title = "KVKK | Optik Sınav Değerlendirme Sistemi";
    
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      document.title = "Optik Sınav Değerlendirme Sistemi";
    };
  }, []);

  useEffect(() => {
    if (!isPageLoaded) return;
    
    const sections = document.querySelectorAll('.kvkk-section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          const sectionId = entry.target.getAttribute('id');
          if (sectionId) {
            setActiveSection(sectionId);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, [isPageLoaded]);

  return (
    <div className={`kvkk-page ${isPageLoaded ? 'page-loaded' : ''}`}>
      <div className="kvkk-hero">
        <div className="container">
          <h1 className="kvkk-hero-title">Kişisel Verilerin Korunması</h1>
          <p className="kvkk-hero-subtitle">
            6698 Sayılı Kişisel Verilerin Korunması Kanunu Hakkında Bilgilendirme
          </p>
        </div>
      </div>

      <div className="kvkk-content">
        <div className="container">
          <section className="kvkk-section" id="intro" data-section="intro">
            <p className="last-updated">
              Son güncelleme tarihi: 15 Mayıs 2024
            </p>
            <p className="kvkk-intro">
              Bu aydınlatma metni, Optik Sınav Değerlendirme Sistemi tarafından 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") 
              uyarınca veri sorumlusu sıfatıyla işlenen kişisel verilerinize ilişkin olarak sizleri bilgilendirmek amacıyla hazırlanmıştır.
            </p>
          </section>

          <section className="kvkk-section" id="data-controller" data-section="data-controller">
            <div className="section-header">
              <h2 className="section-title">1. Veri Sorumlusu</h2>
            </div>
            <div className="kvkk-subsection">
              <p>
                Kişisel verileriniz, veri sorumlusu sıfatıyla Optik Sınav Değerlendirme Sistemi tarafından aşağıda açıklanan 
                kapsamda işlenebilecektir.
              </p>
              <div className="contact-card">
                <h3>Veri Sorumlusu Bilgileri</h3>
                <p>Unvan: Optik Sınav Değerlendirme Sistemi A.Ş.</p>
                <p>Adres: Teknoloji Vadisi B Blok No:42</p>
                <p>Telefon: +90 212 123 4567</p>
                <p>E-posta: kvkk@optiksistemi.com</p>
              </div>
            </div>
          </section>

          <section className="kvkk-section" id="data-processed" data-section="data-processed">
            <div className="section-header">
              <h2 className="section-title">2. İşlenen Kişisel Veriler</h2>
            </div>
            <div className="kvkk-subsection">
              <p>
                Optik Sınav Değerlendirme Sistemi olarak, hizmetlerimizin sunulması kapsamında aşağıdaki kişisel verilerinizi 
                işlemekteyiz:
              </p>
              <ul>
                <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, T.C. Kimlik numarası, doğum tarihi vb.</li>
                <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, adres vb.</li>
                <li><strong>Kurum/Okul Bilgileri:</strong> Çalıştığınız kurum/okul adı, adresi, pozisyonunuz vb.</li>
                <li><strong>Kullanıcı Hesap Bilgileri:</strong> Kullanıcı adı, şifre, hesap ayarları vb.</li>
                <li><strong>Öğrenci Verileri:</strong> Öğrenci adı, soyadı, sınıfı, numarası, sınav sonuçları vb.</li>
                <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı bilgileri, kullanım istatistikleri vb.</li>
                <li><strong>Finansal Bilgiler:</strong> Ödeme bilgileri, fatura bilgileri vb.</li>
              </ul>
              <p>
                Öğrenci verileri, öğretmen veya yetkili kurum temsilcileri tarafından sisteme yüklenen veriler olup, 
                bu verilerin işlenmesi konusunda kurumların ve yetkililerin yasal sorumluluğu bulunmaktadır.
              </p>
            </div>
          </section>

          <section className="kvkk-section" id="processing-purpose" data-section="processing-purpose">
            <div className="section-header">
              <h2 className="section-title">3. Kişisel Verilerin İşlenme Amaçları</h2>
            </div>
            <div className="kvkk-subsection">
              <p>
                Kişisel verileriniz aşağıdaki amaçlar doğrultusunda işlenmektedir:
              </p>
              <ul>
                <li>Hizmetlerimizin sağlanması ve yönetilmesi</li>
                <li>Kullanıcı hesaplarının oluşturulması ve yönetilmesi</li>
                <li>Optik form değerlendirme hizmetlerinin sunulması</li>
                <li>Sınav sonuçlarının işlenmesi ve raporlanması</li>
                <li>Müşteri ilişkilerinin yürütülmesi ve destek hizmetlerinin sağlanması</li>
                <li>Sistem güvenliğinin sağlanması ve hizmet kalitesinin artırılması</li>
                <li>Faturalandırma ve ödeme işlemlerinin gerçekleştirilmesi</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                <li>İstatistiksel analizlerin yapılması ve hizmet kalitesinin artırılması</li>
                <li>Bilgilendirme ve tanıtım faaliyetlerinin yürütülmesi (izniniz dahilinde)</li>
              </ul>
            </div>
          </section>

          <section className="kvkk-section" id="legal-basis" data-section="legal-basis">
            <div className="section-header">
              <h2 className="section-title">4. Kişisel Verilerin İşlenmesinin Hukuki Sebepleri</h2>
            </div>
            <div className="kvkk-subsection">
              <p>
                Kişisel verileriniz, KVKK'nın 5. ve 6. maddelerinde belirtilen aşağıdaki hukuki sebeplere dayanarak işlenmektedir:
              </p>
              <ul>
                <li>Açık rızanızın bulunması</li>
                <li>Kanunlarda açıkça öngörülmesi</li>
                <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması</li>
                <li>Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması</li>
                <li>Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması</li>
                <li>İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması</li>
              </ul>
            </div>
          </section>

          <section className="kvkk-section" id="data-transfer" data-section="data-transfer">
            <div className="section-header">
              <h2 className="section-title">5. Kişisel Verilerin Aktarılması</h2>
            </div>
            <div className="kvkk-subsection">
              <p>
                Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda ve KVKK'nın 8. ve 9. maddelerine 
                uygun olarak aşağıdaki alıcı gruplarına aktarılabilir:
              </p>
              <ul>
                <li>Hizmet aldığımız iş ortaklarımız ve tedarikçilerimiz (barındırma hizmetleri, teknik destek vb.)</li>
                <li>Yasal yükümlülüklerimiz kapsamında yetkili kamu kurum ve kuruluşları</li>
                <li>Hukuki süreçlerin yürütülmesi amacıyla adli makamlar ve yetkili hukuk büroları</li>
                <li>İlgili mevzuat hükümlerine göre kişisel veri aktarımına izin verilen kurum ve kuruluşlar</li>
              </ul>
              <p>
                Kişisel verileriniz, açık rızanız olmaksızın yurt dışına aktarılmamaktadır. Verilerinizin yurt dışında 
                bulunan sunucularda barındırılması durumunda, gerekli güvenlik önlemleri alınmakta ve yasal yükümlülükler 
                yerine getirilmektedir.
              </p>
            </div>
          </section>

          <section className="kvkk-section" id="rights" data-section="rights">
            <div className="section-header">
              <h2 className="section-title">6. İlgili Kişi Olarak Haklarınız</h2>
            </div>
            <div className="kvkk-subsection">
              <p>
                KVKK'nın 11. maddesi uyarınca ilgili kişi olarak aşağıdaki haklara sahipsiniz:
              </p>
              <ul>
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
                <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
                <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
                <li>Kişisel verilerinizin aktarıldığı üçüncü kişilere yukarıda sayılan (e) ve (f) bentleri uyarınca yapılan işlemlerin bildirilmesini isteme</li>
                <li>İşlenen verilerinizin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
              </ul>
            </div>
          </section>

          <section className="kvkk-section" id="application" data-section="application">
            <div className="section-header">
              <h2 className="section-title">7. Başvuru Yöntemi</h2>
            </div>
            <div className="kvkk-subsection">
              <p>
                Yukarıda belirtilen haklarınızı kullanmak için kimliğinizi tespit edici gerekli bilgiler ve 
                kullanmak istediğiniz hakkınıza yönelik açıklamalarınızla birlikte aşağıdaki yöntemlerden biri ile 
                başvurabilirsiniz:
              </p>
              <ul>
                <li>Adresimize şahsen başvuru ile</li>
                <li>Noter vasıtasıyla</li>
                <li>Kayıtlı elektronik posta (KEP) adresimize güvenli elektronik imzalı olarak</li>
                <li>Sistemimizde kayıtlı e-posta adresiniz üzerinden kvkk@optiksistemi.com adresine e-posta göndererek</li>
              </ul>
              <p>
                Başvurunuz, niteliğine göre en kısa sürede ve en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır. 
                Ancak, işlemin ayrıca bir maliyet gerektirmesi hâlinde, Kişisel Verileri Koruma Kurulu tarafından 
                belirlenen tarifedeki ücret alınabilir.
              </p>
            </div>
          </section>

          <section className="kvkk-section" id="measures" data-section="measures">
            <div className="section-header">
              <h2 className="section-title">8. Kişisel Verilerin Korunmasına İlişkin Önlemler</h2>
            </div>
            <div className="kvkk-subsection">
              <p>
                Kişisel verilerinizin güvenliğini sağlamak amacıyla, teknolojik imkânlar dâhilinde her türlü teknik ve 
                idari tedbir alınmaktadır. Bu kapsamda:
              </p>
              <ul>
                <li>Ağ güvenliği ve uygulama güvenliği sağlanmaktadır</li>
                <li>Kişisel veri içeren sistemlere kullanıcı adı ve şifre ile erişim sağlanmaktadır</li>
                <li>Kişisel veriler mümkün olduğunca azaltılmaktadır</li>
                <li>Kişisel verilere erişim, görev değişikliği ve işten ayrılma durumlarında yetki kontrolü yapılmaktadır</li>
                <li>Kişisel verilerin güvenli bir biçimde saklanmasını sağlamak için hukuka uygun yedekleme programları kullanılmaktadır</li>
                <li>Çalışanlar için veri güvenliği eğitimleri düzenlenmektedir</li>
              </ul>
            </div>
          </section>

          <section className="kvkk-section" id="changes" data-section="changes">
            <div className="section-header">
              <h2 className="section-title">9. Aydınlatma Metninde Değişiklikler</h2>
            </div>
            <div className="kvkk-subsection">
              <p>
                Optik Sınav Değerlendirme Sistemi, işbu aydınlatma metnini gerekli gördüğü hallerde güncelleyebilir. 
                Yapılan değişiklikler web sitemizde yayınlandığı tarihte yürürlüğe girer. Bu nedenle, güncel gelişmeleri 
                takip etmeniz önerilir.
              </p>
            </div>
          </section>

          <section className="kvkk-section" id="contact" data-section="contact">
            <div className="section-header">
              <h2 className="section-title">10. İletişim</h2>
            </div>
            <div className="kvkk-subsection">
              <p>
                Bu aydınlatma metni veya kişisel verilerinizin işlenmesine ilişkin sorularınız için <a href="mailto:kvkk@optiksistemi.com">kvkk@optiksistemi.com</a> 
                adresinden bizimle iletişime geçebilirsiniz.
              </p>
            </div>
          </section>

          <section className="kvkk-section" id="cta" data-section="cta">
            <div className="kvkk-cta">
              <h2>Verilerinizin Güvenliği Önceliğimizdir</h2>
              <p>Kişisel verilerin korunması hakkında daha fazla bilgi almak için bizimle iletişime geçebilirsiniz.</p>
              <div className="cta-buttons">
                <a href="/contact" className="kvkk-btn kvkk-btn-primary">
                  İletişime Geçin
                </a>
                <a href="/register" className="kvkk-btn kvkk-btn-outline">
                  Ücretsiz Başlayın
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {isPageLoaded && (
        <nav className="kvkk-navigation" aria-label="KVKK bölümleri">
          <ul>
            <li>
              <button 
                className={activeSection === 'intro' ? 'active' : ''} 
                onClick={() => handleSectionClick('intro')}
              >
                Giriş
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'data-controller' ? 'active' : ''} 
                onClick={() => handleSectionClick('data-controller')}
              >
                Veri Sorumlusu
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'data-processed' ? 'active' : ''} 
                onClick={() => handleSectionClick('data-processed')}
              >
                İşlenen Veriler
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'processing-purpose' ? 'active' : ''} 
                onClick={() => handleSectionClick('processing-purpose')}
              >
                İşleme Amaçları
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'legal-basis' ? 'active' : ''} 
                onClick={() => handleSectionClick('legal-basis')}
              >
                Hukuki Sebepler
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'data-transfer' ? 'active' : ''} 
                onClick={() => handleSectionClick('data-transfer')}
              >
                Veri Aktarımı
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'rights' ? 'active' : ''} 
                onClick={() => handleSectionClick('rights')}
              >
                Haklarınız
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'application' ? 'active' : ''} 
                onClick={() => handleSectionClick('application')}
              >
                Başvuru Yöntemi
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default LandingKVKK; 