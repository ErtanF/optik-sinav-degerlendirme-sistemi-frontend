import React, { useState, useEffect } from 'react';
import './Landing.css';
import './Cerezler.css';

const LandingCerezler = () => {
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
    
    document.title = "Çerez Politikası | Optik Sınav Değerlendirme Sistemi";
    
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
    
    const sections = document.querySelectorAll('.cerezler-section');
    
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
    <div className={`cerezler-page ${isPageLoaded ? 'page-loaded' : ''}`}>
      <div className="cerezler-hero">
        <div className="container">
          <h1 className="cerezler-hero-title">Çerez Politikası</h1>
          <p className="cerezler-hero-subtitle">
            Optik Sınav Değerlendirme Sistemi web sitesinde kullanılan çerezler hakkında bilgilendirme
          </p>
        </div>
      </div>

      <div className="cerezler-content">
        <div className="container">
          <section className="cerezler-section" id="intro" data-section="intro">
            <p className="last-updated">
              Son güncelleme tarihi: 15 Mayıs 2024
            </p>
            <p className="cerezler-intro">
              Bu Çerez Politikası, Optik Sınav Değerlendirme Sistemi tarafından işletilen web sitesi ve 
              hizmetlerimiz üzerinde kullanılan çerezler ve benzer teknolojiler hakkında size bilgi vermek 
              amacıyla hazırlanmıştır. Web sitemizi kullanarak çerezlerin bu Çerez Politikası ile uyumlu 
              şekilde kullanılmasını kabul etmektesiniz.
            </p>
          </section>

          <section className="cerezler-section" id="what-are-cookies" data-section="what-are-cookies">
            <div className="section-header">
              <h2 className="section-title">1. Çerezler Nedir?</h2>
            </div>
            <div className="cerezler-subsection">
              <p>
                Çerezler (cookies), web sitelerinin bilgisayarınızda veya mobil cihazınızda depoladığı küçük 
                metin dosyalarıdır. Tarayıcılar genellikle çerez bilgilerini saklar ve web sitesi tekrar 
                ziyaret edildiğinde bu bilgileri web sitesine geri gönderir. Bu bilgiler kullanıcı oturumları, 
                tercihler ve site kullanımı hakkında bilgi içerebilir.
              </p>
              <p>
                Çerezler, web sitesinin daha etkin çalışmasını sağlayarak kullanıcı deneyimini iyileştirmek 
                ve web sitesi sahiplerine site hakkında analitik veriler sunmak için kullanılır.
              </p>
            </div>
          </section>

          <section className="cerezler-section" id="cookie-types" data-section="cookie-types">
            <div className="section-header">
              <h2 className="section-title">2. Kullandığımız Çerez Türleri</h2>
            </div>
            <div className="cerezler-subsection">
              <p>
                Web sitemizde aşağıdaki çerez türlerini kullanmaktayız:
              </p>

              <h3>Zorunlu Çerezler</h3>
              <p>
                Bu çerezler, web sitesinin düzgün çalışması için gereklidir ve sistemlerimizde kapatılamazlar. 
                Genellikle yalnızca sizin tarafınızdan gerçekleştirilen ve gizlilik tercihlerini ayarlama, 
                oturum açma veya form doldurma gibi hizmet taleplerine karşılık olarak ayarlanırlar.
              </p>

              <h3>Performans ve Analitik Çerezleri</h3>
              <p>
                Bu çerezler, ziyaretçilerin web sitemizi nasıl kullandığı hakkında bilgi toplar. Bu çerezler, 
                site performansını ölçmemize ve iyileştirmemize yardımcı olur. Ziyaretçilerin en çok hangi 
                sayfaları ziyaret ettiği, hata mesajları alıp almadıkları gibi bilgileri toplar.
              </p>

              <h3>İşlevsellik Çerezleri</h3>
              <p>
                Bu çerezler, web sitesinin size daha kişiselleştirilmiş bir deneyim sunmasını sağlar. 
                Dil tercihiniz veya bulunduğunuz bölge gibi bilgileri hatırlamak için kullanılabilirler.
              </p>

              <h3>Hedefleme/Reklam Çerezleri</h3>
              <p>
                Bu çerezler, size ve ilgi alanlarınıza yönelik reklamlar sunmak için kullanılabilir. 
                Ayrıca, bir reklamı görme sayınızı sınırlamak ve reklam kampanyasının etkinliğini ölçmeye 
                yardımcı olmak için de kullanılabilirler.
              </p>
            </div>
          </section>

          <section className="cerezler-section" id="cookie-purpose" data-section="cookie-purpose">
            <div className="section-header">
              <h2 className="section-title">3. Çerezleri Kullanma Amaçlarımız</h2>
            </div>
            <div className="cerezler-subsection">
              <p>
                Çerezleri aşağıdaki amaçlar doğrultusunda kullanmaktayız:
              </p>
              <ul>
                <li>
                  <strong>Web Sitesi İşlevselliği:</strong> Web sitemizin temel işlevlerini gerçekleştirmek 
                  için kullanıcı oturumlarını yönetmek, kullanıcı kimliğini doğrulamak ve güvenliği sağlamak.
                </li>
                <li>
                  <strong>Kullanıcı Deneyimini İyileştirme:</strong> Kullanıcıların web sitesini nasıl 
                  kullandığını anlamak ve site tasarımını, içeriğini ve işlevselliğini buna göre iyileştirmek.
                </li>
                <li>
                  <strong>Kişiselleştirme:</strong> Kullanıcıların tercihlerini hatırlamak ve daha 
                  kişiselleştirilmiş bir deneyim sunmak.
                </li>
                <li>
                  <strong>Analiz ve Performans:</strong> Web sitesi trafiğini izlemek, hataları tespit etmek 
                  ve sitemizdeki popüler içerikleri belirlemek.
                </li>
                <li>
                  <strong>Pazarlama:</strong> Kullanıcıların ilgi alanlarına göre hedeflenmiş reklamlar 
                  göstermek ve pazarlama kampanyalarının etkinliğini ölçmek.
                </li>
              </ul>
            </div>
          </section>

          <section className="cerezler-section" id="third-party-cookies" data-section="third-party-cookies">
            <div className="section-header">
              <h2 className="section-title">4. Üçüncü Taraf Çerezleri</h2>
            </div>
            <div className="cerezler-subsection">
              <p>
                Web sitemizde ayrıca üçüncü taraf hizmet sağlayıcılarının çerezleri de kullanılmaktadır. 
                Bu çerezler, web sitemizi ziyaret ettiğinizde üçüncü taraflarca yerleştirilir ve aşağıdaki 
                amaçlar için kullanılabilir:
              </p>
              <ul>
                <li>
                  <strong>Google Analytics:</strong> Web sitesi trafiğini ve kullanıcı davranışlarını 
                  analiz etmek için kullanılır.
                </li>
                <li>
                  <strong>Sosyal Medya Platformları:</strong> Sosyal medya paylaşım butonları ve içerik 
                  paylaşımı için kullanılır.
                </li>
                <li>
                  <strong>Ödeme İşlemcileri:</strong> Güvenli ödeme işlemleri için kullanılır.
                </li>
              </ul>
              <p>
                Üçüncü taraf çerezleri üzerinde kontrolümüz yoktur ve bu çerezlerin kullanımı ilgili 
                üçüncü tarafların gizlilik politikalarına tabidir. Lütfen bu üçüncü tarafların gizlilik 
                politikalarını inceleyiniz.
              </p>
            </div>
          </section>

          <section className="cerezler-section" id="cookie-management" data-section="cookie-management">
            <div className="section-header">
              <h2 className="section-title">5. Çerez Yönetimi</h2>
            </div>
            <div className="cerezler-subsection">
              <p>
                Çoğu web tarayıcısı, çerezleri kabul etmeyi varsayılan olarak ayarlar. Ancak, tarayıcı 
                ayarlarınızı değiştirerek çerezleri reddedebilir veya belirli çerezlerin depolanması 
                konusunda uyarı alabilirsiniz.
              </p>
              <p>
                Çerezleri yönetmek veya silmek için kullandığınız tarayıcının ayarlar menüsünü ziyaret edebilirsiniz:
              </p>
              <ul>
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer" target="_blank">Mozilla Firefox</a></li>
                <li><a href="https://support.microsoft.com/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank">Internet Explorer</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank">Safari</a></li>
                <li><a href="https://help.opera.com/en/latest/web-preferences/#cookies" target="_blank">Opera</a></li>
              </ul>
              <p>
                Çerezleri devre dışı bırakmanın, web sitemizin belirli özelliklerini ve işlevselliğini 
                etkileyebileceğini lütfen unutmayın. Örneğin, kullanıcı hesabınıza giriş yapmanızı veya 
                kişiselleştirilmiş içerik görüntülemenizi engelleyebilir.
              </p>
            </div>
          </section>

          <section className="cerezler-section" id="privacy-policy-relation" data-section="privacy-policy-relation">
            <div className="section-header">
              <h2 className="section-title">6. Gizlilik Politikası ile İlişkisi</h2>
            </div>
            <div className="cerezler-subsection">
              <p>
                Bu Çerez Politikası, Gizlilik Politikamızın bir parçasıdır. Kişisel verilerinizin nasıl 
                toplandığı, kullanıldığı, paylaşıldığı ve korunduğu hakkında daha fazla bilgi için lütfen 
                <a href="/gizlilik"> Gizlilik Politikamızı</a> inceleyiniz.
              </p>
            </div>
          </section>

          <section className="cerezler-section" id="changes" data-section="changes">
            <div className="section-header">
              <h2 className="section-title">7. Çerez Politikasında Değişiklikler</h2>
            </div>
            <div className="cerezler-subsection">
              <p>
                Optik Sınav Değerlendirme Sistemi, işbu Çerez Politikasını gerekli gördüğü hallerde güncelleyebilir. 
                Yapılan değişiklikler web sitemizde yayınlandığı tarihte yürürlüğe girer. Bu nedenle, güncel 
                gelişmeleri takip etmeniz önerilir.
              </p>
            </div>
          </section>

          <section className="cerezler-section" id="contact" data-section="contact">
            <div className="section-header">
              <h2 className="section-title">8. İletişim</h2>
            </div>
            <div className="cerezler-subsection">
              <p>
                Bu Çerez Politikası veya çerezlerin kullanımına ilişkin sorularınız için 
                <a href="mailto:iletisim@optiksistemi.com"> iletisim@optiksistemi.com</a> 
                adresinden bizimle iletişime geçebilirsiniz.
              </p>
            </div>
          </section>

          <section className="cerezler-section" id="cta" data-section="cta">
            <div className="cerezler-cta">
              <h2>Verilerinizin Güvenliği Önceliğimizdir</h2>
              <p>Çerez kullanımımız ve gizlilik uygulamalarımız hakkında daha fazla bilgi almak için bizimle iletişime geçebilirsiniz.</p>
              <div className="cta-buttons">
                <a href="/contact" className="cerezler-btn cerezler-btn-primary">
                  İletişime Geçin
                </a>
                <a href="/register" className="cerezler-btn cerezler-btn-outline">
                  Ücretsiz Başlayın
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {isPageLoaded && (
        <nav className="cerezler-navigation" aria-label="Çerez politikası bölümleri">
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
                className={activeSection === 'what-are-cookies' ? 'active' : ''} 
                onClick={() => handleSectionClick('what-are-cookies')}
              >
                Çerezler Nedir?
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'cookie-types' ? 'active' : ''} 
                onClick={() => handleSectionClick('cookie-types')}
              >
                Çerez Türleri
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'cookie-purpose' ? 'active' : ''} 
                onClick={() => handleSectionClick('cookie-purpose')}
              >
                Kullanım Amaçları
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'third-party-cookies' ? 'active' : ''} 
                onClick={() => handleSectionClick('third-party-cookies')}
              >
                Üçüncü Taraf Çerezleri
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'cookie-management' ? 'active' : ''} 
                onClick={() => handleSectionClick('cookie-management')}
              >
                Çerez Yönetimi
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'privacy-policy-relation' ? 'active' : ''} 
                onClick={() => handleSectionClick('privacy-policy-relation')}
              >
                Gizlilik İlişkisi
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default LandingCerezler; 