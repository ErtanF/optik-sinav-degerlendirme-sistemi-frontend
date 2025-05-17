import { useEffect, useState, useCallback } from 'react';
import './Kurumsal.css';

const Hakkimizda = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  const companyValues = [
    {
      id: 'value-1',
      title: 'Yenilikçilik',
      description: 'Sürekli olarak platformumuzu geliştirmek ve yeni özellikler eklemek için çalışıyoruz.'
    },
    {
      id: 'value-2',
      title: 'Güvenilirlik',
      description: 'Verilerinizin güvenliği ve sonuçların doğruluğu bizim için en önemli önceliktir.'
    },
    {
      id: 'value-3',
      title: 'Kullanıcı Odaklılık',
      description: 'Her özelliği kullanıcılarımızın gerçek ihtiyaçlarına göre tasarlıyoruz.'
    },
    {
      id: 'value-4',
      title: 'Erişilebilirlik',
      description: 'Sistemimizi tüm eğitimcilerin kolayca erişebileceği ve kullanabileceği şekilde tasarladık.'
    }
  ];
  
  const trackPageView = useCallback(() => {
    if (window.analytics) {
      window.analytics.trackPageView('about_us');
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.title = "Hakkımızda | Optik Sınav Değerlendirme Sistemi";
    
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
        <h1>Hakkımızda</h1>
        <div className="kurumsal-divider"></div>
      </div>

      <div className="kurumsal-content">
        <section className="kurumsal-section" data-section="vision">
          <h2>Vizyonumuz</h2>
          <p>
            Optik Sınav Değerlendirme Sistemi olarak vizyonumuz, eğitimcilerin sınav süreçlerini dijitalleştirerek
            zaman ve kaynak tasarrufu sağlamak, ölçme ve değerlendirme süreçlerini daha verimli hale getirmektir.
            Teknolojik altyapımız ve yenilikçi çözümlerimizle, eğitim kurumlarının sınav değerlendirme süreçlerinde
            lider konumda olmayı hedefliyoruz.
          </p>
        </section>

        <section className="kurumsal-section" data-section="mission">
          <h2>Misyonumuz</h2>
          <p>
            Eğitimcilere ve kurumlara, kullanımı kolay, güvenilir ve hızlı bir optik form değerlendirme sistemi sunarak
            sınav süreçlerini optimize etmelerini sağlamak. Öğrenci başarısını ölçme ve değerlendirmede doğru,
            hızlı ve detaylı analizler sunarak eğitim kalitesinin artırılmasına katkıda bulunmak.
          </p>
        </section>

        <section className="kurumsal-section" data-section="history">
          <h2>Tarihçemiz</h2>
          <p>
            2023 yılında eğitimcilerin ihtiyaçları doğrultusunda geliştirilen Optik Sınav Değerlendirme Sistemi,
            ilk olarak küçük bir ekip tarafından yerel okullara hizmet vermek amacıyla kuruldu. Kısa sürede gösterdiği
            başarılı performans ve kullanıcı memnuniyeti sayesinde hızla büyüyerek bugün ülke genelinde binlerce
            eğitim kurumuna hizmet verir hale geldi.
          </p>
          <p>
            2024 yılında tamamen yenilenen altyapımız ve genişletilmiş özelliklerimizle kullanıcılarımıza
            daha kapsamlı analizler ve daha hızlı sonuçlar sunmaktayız. Sürekli gelişim anlayışımızla
            eğitim sektörünün ihtiyaçlarını karşılamaya devam ediyoruz.
          </p>
        </section>

        <section className="kurumsal-section" data-section="values">
          <h2>Değerlerimiz</h2>
          <ul className="kurumsal-values-list" role="list">
            {companyValues.map(value => (
              <li key={value.id} className="value-item">
                <span className="value-title">{value.title}</span>
                <span className="value-desc">{value.description}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="kurumsal-section team-section" data-section="team">
          <h2>Ekibimiz</h2>
          <p>
            Optik Sınav Değerlendirme Sistemi, eğitim ve teknoloji alanlarında uzman profesyonellerden oluşan
            dinamik bir ekip tarafından yönetilmektedir. Yazılım geliştiriciler, eğitim uzmanları ve veri analistlerinden
            oluşan ekibimiz, sistemimizi sürekli olarak geliştirmek için çalışmaktadır.
          </p>
          <div className="team-members">
            {/* Ekip üyeleri burada listelenebilir */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hakkimizda; 