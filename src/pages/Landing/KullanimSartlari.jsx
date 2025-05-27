import React, { useState, useEffect } from 'react';
import './Landing.css';
import './KullanimSartlari.css';

const LandingKullanimSartlari = () => {
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
    
    document.title = "Kullanım Şartları | Optik Sınav Değerlendirme Sistemi";
    
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
    
    const sections = document.querySelectorAll('.terms-section');
    
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
    <div className={`terms-page ${isPageLoaded ? 'page-loaded' : ''}`}>
      <div className="terms-hero">
        <div className="container">
          <h1 className="terms-hero-title">Kullanım Şartları</h1>
          <p className="terms-hero-subtitle">
            Hizmetlerimizi kullanırken uymanız gereken koşullar
          </p>
        </div>
      </div>

      <div className="terms-content">
        <div className="container">
          <section className="terms-section" id="intro" data-section="intro">
            <p className="last-updated">
              Son güncelleme tarihi: 15 Mayıs 2024
            </p>
            <p className="terms-intro">
              Bu Kullanım Şartları ("Şartlar"), Optik Sınav Değerlendirme Sistemi web sitesini ve hizmetlerini
              kullanımınızı düzenleyen koşulları belirtir. Lütfen bu şartları dikkatlice okuyunuz.
              Web sitemizi ziyaret ederek veya hizmetlerimizi kullanarak bu şartları kabul etmiş sayılırsınız.
            </p>
          </section>

          <section className="terms-section" id="service-usage" data-section="service-usage">
            <div className="section-header">
              <h2 className="section-title">1. Hizmet Kullanımı</h2>
            </div>
            <div className="terms-subsection">
              <h3>1.1. Hesap Oluşturma</h3>
              <p>
                Hizmetlerimizin bazı bölümlerine erişmek için bir hesap oluşturmanız gerekebilir. Hesap oluşturduğunuzda:
              </p>
              <ul>
                <li>Doğru, güncel ve eksiksiz bilgiler sağlamayı kabul edersiniz.</li>
                <li>Hesap bilgilerinizin gizliliğini korumakla yükümlüsünüz.</li>
                <li>Hesabınız altında gerçekleşen tüm etkinliklerden sorumlu olursunuz.</li>
              </ul>
              <p>
                Yetkisiz erişim veya hesap güvenliğine ilişkin şüpheli bir durumla karşılaşırsanız, 
                derhal bizi bilgilendirmelisiniz.
              </p>
            </div>
            
            <div className="terms-subsection">
              <h3>1.2. Kullanım Kısıtlamaları</h3>
              <p>
                Hizmetlerimizi kullanırken aşağıdaki eylemlerde bulunmayacağınızı kabul edersiniz:
              </p>
              <ul>
                <li>Yasalara, üçüncü taraf haklarına aykırı veya zararlı içerik yüklemek</li>
                <li>Kötü amaçlı yazılım veya virüs göndermek</li>
                <li>Hizmetin güvenliğini tehdit eden eylemler yapmak</li>
                <li>Hizmeti kanun dışı veya yetkisiz amaçlarla kullanmak</li>
                <li>Sistemlerimizi veya altyapımızı aşırı yüklemek</li>
                <li>Üçüncü taraf bilgileri (öğrenci verileri dahil) için geçerli tüm yasalara uymak zorundasınız</li>
              </ul>
            </div>
          </section>

          <section className="terms-section" id="intellectual-property" data-section="intellectual-property">
            <div className="section-header">
              <h2 className="section-title">2. Fikri Mülkiyet Hakları</h2>
            </div>
            <div className="terms-subsection">
              <h3>2.1. Hizmete İlişkin Haklar</h3>
              <p>
                Web sitesi ve hizmete ilişkin tüm haklar, unvanlar ve çıkarlar (tüm içerikler, tasarım, metin, grafikler, 
                arayüz, logo, kod ve yazılımlar dahil) Optik Sınav Değerlendirme Sistemi'nin mülkiyetindedir. 
                Bu materyaller telif hakkı, ticari marka ve diğer fikri mülkiyet yasaları tarafından korunmaktadır.
              </p>
            </div>
            
            <div className="terms-subsection">
              <h3>2.2. Kullanıcı İçeriği</h3>
              <p>
                Hizmetimize içerik yüklediğinizde (optik form şablonları veya öğrenci verileri dahil), bu içeriklere ilişkin
                haklarınızı saklı tutarsınız. Ancak, hizmetin sağlanması amacıyla bu içeriği kullanmamız, depolamamız ve 
                işlememiz için bize sınırlı bir lisans vermiş olursunuz.
              </p>
              <p>
                Yüklediğiniz içeriğin yasal haklarına sahip olduğunuzu veya kullanım için gerekli izinlere sahip olduğunuzu
                taahhüt edersiniz.
              </p>
            </div>
          </section>

          <section className="terms-section" id="liability" data-section="liability">
            <div className="section-header">
              <h2 className="section-title">3. Sorumluluk Sınırlamaları</h2>
            </div>
            <div className="terms-subsection">
              <p>
                Hizmetlerimizi "olduğu gibi" ve "mevcut olduğu şekliyle" sunuyoruz. Yürürlükteki yasaların izin verdiği 
                azami ölçüde, aşağıdakiler dahil ancak bunlarla sınırlı olmamak üzere, açık veya zımni hiçbir türde 
                garanti vermiyoruz:
              </p>
              <ul>
                <li>Hizmetin kesintisiz, hatasız veya güvenli olacağına dair garantiler</li>
                <li>Ticari elverişlilik, belirli bir amaca uygunluk veya ihlal etmeme garantileri</li>
              </ul>
            </div>
            
            <div className="terms-subsection">
              <p>
                Hiçbir durumda aşağıdakilerden sorumlu olmayacağız:
              </p>
              <ul>
                <li>Dolaylı, tesadüfi, özel, cezai veya sonuç olarak ortaya çıkan zararlar</li>
                <li>Kar, gelir, veri veya iş kaybı</li>
                <li>Hizmetimizle ilgili olarak herhangi bir üçüncü taraf tarafından yapılan herhangi bir işlem</li>
              </ul>
            </div>
          </section>

          <section className="terms-section" id="pricing" data-section="pricing">
            <div className="section-header">
              <h2 className="section-title">4. Ücretlendirme ve Ödeme</h2>
            </div>
            <div className="terms-subsection">
              <h3>4.1. Abonelik ve Ücretler</h3>
              <p>
                Bazı hizmetlerimiz ücretli abonelik gerektirebilir. Ücret ve ödeme koşulları satın alma sırasında
                belirtilecektir. Belirtilen tüm ücretler, aksi açıkça belirtilmedikçe vergileri içermez.
              </p>
            </div>
            
            <div className="terms-subsection">
              <h3>4.2. Abonelik İptali</h3>
              <p>
                Aboneliğinizi istediğiniz zaman hesap ayarlarınızdan iptal edebilirsiniz. İptal işlemi, mevcut fatura 
                döneminin sonunda geçerli olacaktır. İade politikamız hakkında daha fazla bilgi için lütfen 
                müşteri hizmetleriyle iletişime geçin.
              </p>
            </div>
            
            <div className="terms-subsection">
              <h3>4.3. Fiyat Değişiklikleri</h3>
              <p>
                Hizmet ücretlerimizi değiştirme hakkını saklı tutarız. Fiyat değişiklikleri en az 30 gün önceden 
                bildirilecektir. Fiyat değişikliğini kabul etmiyorsanız, hizmet kullanımını durdurma ve aboneliğinizi 
                iptal etme hakkınız vardır.
              </p>
            </div>
          </section>

          <section className="terms-section" id="termination" data-section="termination">
            <div className="section-header">
              <h2 className="section-title">5. Fesih</h2>
            </div>
            <div className="terms-subsection">
              <p>
                Bu şartları veya hizmet koşullarımızın herhangi birini ihlal etmeniz durumunda, hesabınızı önceden 
                bildirimde bulunmaksızın sonlandırma veya askıya alma hakkını saklı tutarız. Ayrıca, aşağıdaki 
                durumlarda hesabınızı sonlandırabiliriz:
              </p>
              <ul>
                <li>Uzun süreli hareketsizlik</li>
                <li>Yasal gereklilikler veya mahkeme kararları</li>
                <li>Hizmetin sonlandırılması veya önemli değişiklikler</li>
              </ul>
            </div>
          </section>

          <section className="terms-section" id="indemnification" data-section="indemnification">
            <div className="section-header">
              <h2 className="section-title">6. Bizi Tazmin Etme</h2>
            </div>
            <div className="terms-subsection">
              <p>
                Bu Kullanım Şartlarını ihlal etmeniz, geçerli yasaları ihlal etmeniz veya üçüncü taraf haklarını 
                ihlal etmenizden kaynaklanan tüm iddialar, sorumluluklar, zararlar, kayıplar ve masraflardan 
                bizi ve iştiraklarimizi, yöneticilerimizi, çalışanlarımızı ve temsilcilerimizi savunmayı, tazmin etmeyi
                ve zarar görmemelerini sağlamayı kabul edersiniz.
              </p>
            </div>
          </section>

          <section className="terms-section" id="changes" data-section="changes">
            <div className="section-header">
              <h2 className="section-title">7. Değişiklikler</h2>
            </div>
            <div className="terms-subsection">
              <p>
                Bu Kullanım Şartlarını herhangi bir zamanda değiştirme hakkını saklı tutarız. Değişiklikler 
                web sitemizde yayınlandıktan sonra yürürlüğe girer. Önemli değişiklikler olduğunda, açık bir bildirim 
                yayınlayacağız. Değişiklikler yürürlüğe girdikten sonra hizmetlerimizi kullanmaya devam etmeniz, 
                güncellenmiş şartları kabul ettiğiniz anlamına gelir.
              </p>
            </div>
          </section>

          <section className="terms-section" id="law" data-section="law">
            <div className="section-header">
              <h2 className="section-title">8. Uygulanacak Hukuk</h2>
            </div>
            <div className="terms-subsection">
              <p>
                Bu Kullanım Şartları, Türkiye Cumhuriyeti yasalarına göre yönetilir ve yorumlanır. Bu Şartlarla ilgili 
                herhangi bir anlaşmazlık, Türkiye Cumhuriyeti mahkemelerinin münhasır yargı yetkisine tabi olacaktır.
              </p>
            </div>
          </section>

          <section className="terms-section" id="contact" data-section="contact">
            <div className="section-header">
              <h2 className="section-title">9. İletişim</h2>
            </div>
            <div className="terms-subsection">
              <p>
                Bu Kullanım Şartları hakkında sorularınız varsa, lütfen <a href="mailto:hukuk@optiksistemi.com">hukuk@optiksistemi.com</a> 
                adresinden bizimle iletişime geçin.
              </p>
              <div className="contact-card">
                <h3>Optik Sınav Değerlendirme Sistemi</h3>
                <p>Adres: Teknoloji Vadisi B Blok No:42</p>
                <p>Telefon: +90 212 123 4567</p>
              </div>
            </div>
          </section>

          <section className="terms-section" id="cta" data-section="cta">
            <div className="terms-cta">
              <h2>Hizmetlerimizi Keşfedin</h2>
              <p>Öğrencilerinizin performansını değerlendirmek için modern optik sınav çözümlerimizi deneyin.</p>
              <div className="cta-buttons">
                <a href="/contact" className="terms-btn terms-btn-primary">
                  İletişime Geçin
                </a>
                <a href="/register" className="terms-btn terms-btn-outline">
                  Ücretsiz Başlayın
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {isPageLoaded && (
        <nav className="terms-navigation" aria-label="Kullanım şartları bölümleri">
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
                className={activeSection === 'service-usage' ? 'active' : ''} 
                onClick={() => handleSectionClick('service-usage')}
              >
                Hizmet Kullanımı
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'intellectual-property' ? 'active' : ''} 
                onClick={() => handleSectionClick('intellectual-property')}
              >
                Fikri Mülkiyet
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'liability' ? 'active' : ''} 
                onClick={() => handleSectionClick('liability')}
              >
                Sorumluluk
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'pricing' ? 'active' : ''} 
                onClick={() => handleSectionClick('pricing')}
              >
                Ücretlendirme
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'termination' ? 'active' : ''} 
                onClick={() => handleSectionClick('termination')}
              >
                Fesih
              </button>
            </li>
            <li>
              <button 
                className={activeSection === 'changes' ? 'active' : ''} 
                onClick={() => handleSectionClick('changes')}
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

export default LandingKullanimSartlari; 