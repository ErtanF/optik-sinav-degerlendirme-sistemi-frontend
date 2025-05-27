import { useEffect, useState, useCallback } from 'react';
import './Kurumsal.css';

const GizlilikPolitikasi = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  
  const trackPageView = useCallback(() => {
    if (window.analytics) {
      window.analytics.trackPageView('privacy_policy');
    }
  }, []);

  const handleSectionClick = useCallback((sectionId) => {
    setActiveSection(sectionId);
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.title = "Gizlilik Politikası | Optik Sınav Değerlendirme Sistemi";
    
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
      trackPageView();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      document.title = "Optik Sınav Değerlendirme Sistemi";
    };
  }, [trackPageView]);

  useEffect(() => {
    if (!isPageLoaded) return;
    
    const sections = document.querySelectorAll('.kurumsal-section');
    
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
    <div className={`kurumsal-page-container ${isPageLoaded ? 'page-loaded' : ''}`}>
      <div className="kurumsal-header" role="banner">
        <h1>Gizlilik Politikası</h1>
        <div className="kurumsal-divider"></div>
      </div>

      <div className="kurumsal-content">
        <section className="kurumsal-section" id="intro" data-section="intro">
          <p className="last-updated">
            Son güncelleme tarihi: 15 Mayıs 2024
          </p>
          <p className="policy-intro">
            Bu gizlilik politikası, Optik Sınav Değerlendirme Sistemi'nin ("biz", "bizim" veya "Şirket") 
            web sitesini ve hizmetlerini kullanırken kişisel verilerinizi nasıl topladığımızı, kullandığımızı, 
            koruduğumuzu ve ifşa ettiğimizi açıklamaktadır. Lütfen bu politikayı dikkatlice okuyunuz.
          </p>
        </section>

        <section className="kurumsal-section" id="collected-info" data-section="collected-info">
          <h2>1. Toplanan Bilgiler</h2>
          <div className="policy-subsection">
            <h3>1.1. Doğrudan Sağladığınız Bilgiler</h3>
            <p>
              Hizmetlerimize kaydolduğunuzda, hesap oluşturduğunuzda, formları doldurduğunuzda veya bizimle iletişime geçtiğinizde 
              aşağıdaki türde kişisel bilgileri toplayabiliriz:
            </p>
            <ul>
              <li>Ad, soyad ve diğer kimlik bilgileri</li>
              <li>İletişim bilgileri (e-posta adresi, telefon numarası, okul/kurum adresi)</li>
              <li>Hesap kimlik bilgileri (kullanıcı adı, şifre)</li>
              <li>Kurum/okul bilgileri ve pozisyonunuz</li>
              <li>Hizmetlerimizi kullanımınızla ilgili tercihleriniz</li>
            </ul>
          </div>
          
          <div className="policy-subsection">
            <h3>1.2. Otomatik Olarak Toplanan Bilgiler</h3>
            <p>
              Hizmetlerimizi kullandığınızda, aşağıdaki bilgileri otomatik olarak toplayabiliriz:
            </p>
            <ul>
              <li>Cihaz bilgileri (IP adresi, tarayıcı türü, işletim sistemi)</li>
              <li>Kullanım verileri (ziyaret ettiğiniz sayfalar, tıklamalar, etkileşimler)</li>
              <li>Çerezler ve benzer teknolojiler aracılığıyla toplanan bilgiler</li>
              <li>Sistem performans verileri ve hata raporları</li>
            </ul>
          </div>
          
          <div className="policy-subsection">
            <h3>1.3. Öğrenci Verileri</h3>
            <p>
              Eğitimci/öğretmen olarak sistemimize yüklediğiniz öğrenci verilerini sadece hizmetlerimizi sağlamak için 
              kullanırız ve bu verileri korumak için en üst düzey güvenlik önlemlerini alırız. Bu veriler aşağıdakileri 
              içerebilir:
            </p>
            <ul>
              <li>Öğrenci adı, soyadı ve kimlik bilgileri</li>
              <li>Sınıf ve okul bilgileri</li>
              <li>Sınav sonuçları ve akademik performans verileri</li>
            </ul>
          </div>
        </section>

        <section className="kurumsal-section" id="data-usage" data-section="data-usage">
          <h2>2. Bilgilerin Kullanımı</h2>
          <p>
            Topladığımız bilgileri aşağıdaki amaçlarla kullanırız:
          </p>
          <ul>
            <li>Hizmetlerimizi sağlamak, sürdürmek ve iyileştirmek</li>
            <li>Hesabınızı oluşturmak ve yönetmek</li>
            <li>Size teknik destek ve müşteri hizmetleri sağlamak</li>
            <li>Hizmetlerimizle ilgili güncellemeler ve bildirimler göndermek</li>
            <li>Hizmetlerimizi kişiselleştirmek ve geliştirmek</li>
            <li>Hileli veya yasadışı faaliyetleri tespit etmek ve önlemek</li>
            <li>Yasal yükümlülüklerimizi yerine getirmek</li>
          </ul>
        </section>

        <section className="kurumsal-section" id="data-security" data-section="data-security">
          <h2>3. Veri Güvenliği</h2>
          <p>
            Kişisel verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri uyguluyoruz. 
            Bu önlemler arasında:
          </p>
          <ul>
            <li>SSL/TLS şifreleme teknolojileri ile veri aktarımı</li>
            <li>Hassas verilere erişimin sıkı kontrolü</li>
            <li>Düzenli güvenlik denetimleri ve güncellemeleri</li>
            <li>Personelimiz için veri gizliliği eğitimleri</li>
            <li>Fiziksel ve elektronik güvenlik önlemleri</li>
          </ul>
          <p>
            Ancak, internet üzerindeki hiçbir veri aktarımı veya depolama sisteminin %100 güvenli olmadığını 
            belirtmek isteriz. Verilerinizin korunması için elimizden geleni yapmakla birlikte, mutlak güvenliği 
            garanti edemeyiz.
          </p>
        </section>

        <section className="kurumsal-section" id="data-sharing" data-section="data-sharing">
          <h2>4. Bilgilerin Paylaşımı</h2>
          <p>
            Kişisel verilerinizi önceden açık izniniz olmadan üçüncü taraflarla paylaşmayız; ancak aşağıdaki 
            durumlarda bilgilerinizi paylaşabiliriz:
          </p>
          <ul>
            <li>Hizmet sağlayıcılarımız: Hizmetlerimizi sunmak için bizim adımıza çalışan hizmet sağlayıcılar (veri depolama, analiz, güvenlik)</li>
            <li>Yasal gereklilikler: Geçerli yasa, yönetmelik, yasal süreç veya resmi talep gerektirdiğinde</li>
            <li>İş ortakları: Sizinle iletişim kurarken açıkça belirtildiği üzere, ortak hizmetleri sunmak için</li>
            <li>Şirket birleşmeleri: Şirket birleşmesi, satışı veya yeniden yapılanma durumunda</li>
          </ul>
        </section>

        <section className="kurumsal-section" id="user-rights" data-section="user-rights">
          <h2>5. Haklarınız</h2>
          <p>
            Kişisel verilerinizle ilgili olarak aşağıdaki haklara sahipsiniz:
          </p>
          <ul>
            <li>Kişisel verilerinize erişim talep etme</li>
            <li>Yanlış veya eksik bilgilerin düzeltilmesini isteme</li>
            <li>Belirli koşullar altında verilerinizin silinmesini talep etme</li>
            <li>Veri işleme faaliyetlerimizi sınırlandırma</li>
            <li>Verilerinizin taşınabilirliğini isteme</li>
            <li>Belirli durumlarda veri işlememize itiraz etme</li>
          </ul>
          <p>
            Bu haklarınızı kullanmak için <a href="mailto:gizlilik@optiksistemi.com">gizlilik@optiksistemi.com</a> adresinden bizimle iletişime geçebilirsiniz.
          </p>
        </section>

        <section className="kurumsal-section" id="cookies" data-section="cookies">
          <h2>6. Çerezler ve Benzer Teknolojiler</h2>
          <p>
            Web sitemizde ve hizmetlerimizde çerezleri ve benzer teknolojileri kullanıyoruz. Bu teknolojiler, 
            hizmetlerimizi iyileştirmemize, kullanıcı deneyimini kişiselleştirmemize ve kullanım analizleri 
            yapmamıza olanak tanır.
          </p>
          <p>
            Çerezler hakkında daha fazla bilgi için <a href="/cerezler">Çerez Politikamıza</a> bakınız.
          </p>
        </section>

        <section className="kurumsal-section" id="policy-changes" data-section="policy-changes">
          <h2>7. Politika Değişiklikleri</h2>
          <p>
            Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda, 
            web sitemizde belirgin bir bildirim yayınlayarak veya e-posta yoluyla bildirim göndererek 
            sizi bilgilendireceğiz. Her durumda, en güncel politikayı web sitemizde bulabilirsiniz.
          </p>
        </section>

        <section className="kurumsal-section" id="contact" data-section="contact">
          <h2>8. İletişim</h2>
          <p>
            Bu gizlilik politikası ile ilgili sorularınız veya endişeleriniz varsa, lütfen <a href="mailto:gizlilik@optiksistemi.com">gizlilik@optiksistemi.com</a> 
            adresinden bizimle iletişime geçin.
          </p>
          <div className="contact-details">
            <p>Optik Sınav Değerlendirme Sistemi</p>
            <p>Adres: Teknoloji Vadisi B Blok No:42</p>
            <p>Telefon: +90 212 123 4567</p>
          </div>
        </section>
      </div>
      
      {isPageLoaded && (
        <nav className="policy-navigation" aria-label="Gizlilik politikası bölümleri">
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
                className={activeSection === 'collected-info' ? 'active' : ''} 
                onClick={() => handleSectionClick('collected-info')}
              >
                Toplanan Bilgiler
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'data-usage' ? 'active' : ''} 
                onClick={() => handleSectionClick('data-usage')}
              >
                Bilgilerin Kullanımı
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'data-security' ? 'active' : ''} 
                onClick={() => handleSectionClick('data-security')}
              >
                Veri Güvenliği
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'data-sharing' ? 'active' : ''} 
                onClick={() => handleSectionClick('data-sharing')}
              >
                Bilgilerin Paylaşımı
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'user-rights' ? 'active' : ''} 
                onClick={() => handleSectionClick('user-rights')}
              >
                Haklarınız
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'cookies' ? 'active' : ''} 
                onClick={() => handleSectionClick('cookies')}
              >
                Çerezler
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'policy-changes' ? 'active' : ''} 
                onClick={() => handleSectionClick('policy-changes')}
              >
                Değişiklikler
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'contact' ? 'active' : ''} 
                onClick={() => handleSectionClick('contact')}
              >
                İletişim
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default GizlilikPolitikasi; 