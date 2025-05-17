import { useEffect, useState, useCallback } from 'react';
import './Kurumsal.css';

const JobListing = ({ title, department, location, type, description, requirements }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="job-listing">
      <div className="job-header" onClick={() => setExpanded(!expanded)}>
        <h3>{title}</h3>
        <div className="job-meta">
          <span className="job-department">{department}</span>
          <span className="job-location">{location}</span>
          <span className="job-type">{type}</span>
        </div>
        <button 
          className="job-toggle" 
          aria-label={expanded ? "Pozisyon detaylarını kapat" : "Pozisyon detaylarını aç"}
          aria-expanded={expanded}
        >
          {expanded ? '−' : '+'}
        </button>
      </div>
      
      {expanded && (
        <div className="job-details" role="region" aria-label={`${title} detayları`}>
          <div className="job-description">
            <h4>Pozisyon Açıklaması</h4>
            <p>{description}</p>
          </div>
          <div className="job-requirements">
            <h4>Aranan Nitelikler</h4>
            <ul>
              {requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
          <button className="apply-button">Başvuru Yap</button>
        </div>
      )}
    </div>
  );
};

const Kariyer = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  const [jobs] = useState([
    {
      id: 1,
      title: "Senior Frontend Geliştirici",
      department: "Yazılım Geliştirme",
      location: "Uzaktan / Remote",
      type: "Tam Zamanlı",
      description: "Optik sınav değerlendirme sistemimizin web arayüzünü geliştirmek ve sürdürmek için deneyimli bir frontend geliştiricisi arıyoruz. Kullanıcı deneyimini iyileştirecek ve performansı artıracak çözümler geliştirerek ekibe katkı sağlayacaksınız.",
      requirements: [
        "En az 3 yıl React deneyimi",
        "Modern JavaScript (ES6+) ve TypeScript bilgisi",
        "State yönetimi (Redux, Context API, Zustand vb.) konusunda deneyim",
        "Responsive tasarım ve CSS framework'leri (Tailwind, Bootstrap vb.) konusunda deneyim",
        "CI/CD süreçleri hakkında bilgi",
        "Test-driven development yaklaşımı (Jest, React Testing Library)"
      ]
    },
    {
      id: 2,
      title: "Backend Geliştirici",
      department: "Yazılım Geliştirme",
      location: "Hibrit",
      type: "Tam Zamanlı",
      description: "Optik form işleme ve analiz sistemimizin backend servislerini geliştirmek için deneyimli bir backend geliştirici arıyoruz. Yüksek performanslı ve ölçeklenebilir API'lar tasarlayarak ürünümüzün teknik altyapısını güçlendireceksiniz.",
      requirements: [
        "En az 2 yıl Node.js deneyimi",
        "Express.js veya NestJS framework'leri ile deneyim",
        "SQL ve NoSQL veritabanları konusunda bilgi",
        "RESTful API tasarımı ve geliştirme deneyimi",
        "Mikroservis mimarisi hakkında bilgi",
        "AWS, Azure gibi bulut platformlarında geliştirme deneyimi"
      ]
    },
    {
      id: 3,
      title: "Veri Bilimci",
      department: "Veri Analizi",
      location: "Şehir İçi",
      type: "Tam Zamanlı",
      description: "Optik formlardan toplanan verileri analiz ederek anlamlı içgörüler elde edecek ve makine öğrenimi modellerini geliştirecek bir veri bilimcisi arıyoruz. Eğitim alanında veri odaklı çözümler sunmak için ekibimize katılın.",
      requirements: [
        "İstatistik, matematik veya bilgisayar bilimleri alanında lisans veya yüksek lisans derecesi",
        "Python ve veri analizi kütüphaneleri (Pandas, NumPy, scikit-learn) konusunda deneyim",
        "Veri görselleştirme araçları (Matplotlib, Seaborn, Plotly) ile deneyim",
        "Makine öğrenimi modelleri geliştirme konusunda deneyim",
        "SQL sorgulama dilleri konusunda bilgi",
        "Eğitim sektöründe veri analizi deneyimi tercih sebebidir"
      ]
    }
  ]);

  const trackPageView = useCallback(() => {
    if (window.analytics) {
      window.analytics.trackPageView('career_page');
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.title = "Kariyer | Optik Sınav Değerlendirme Sistemi";
    
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
        <h1>Kariyer</h1>
        <div className="kurumsal-divider"></div>
      </div>

      <div className="kurumsal-content">
        <section className="kurumsal-section" data-section="intro">
          <h2>Bizimle Çalışın</h2>
          <p>
            Optik Sınav Değerlendirme Sistemi olarak, eğitim teknolojilerinin geleceğini şekillendiren
            yenilikçi ekibimizin bir parçası olacak yetenekli profesyoneller arıyoruz. Dinamik çalışma
            ortamımızda, sürekli öğrenme ve gelişme fırsatları bulacaksınız.
          </p>
          <p>
            Açık pozisyonlarımıza göz atın ve geleceğin eğitim teknolojilerini birlikte geliştirelim.
          </p>
        </section>

        <section className="kurumsal-section career-benefits" data-section="benefits">
          <h2>Çalışan Avantajları</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon" aria-hidden="true">🌱</div>
              <h3>Kişisel Gelişim</h3>
              <p>Eğitim bütçesi ve gelişim programları ile kişisel ve profesyonel gelişiminizi destekliyoruz.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon" aria-hidden="true">⏰</div>
              <h3>Esnek Çalışma</h3>
              <p>Uzaktan ve esnek çalışma seçenekleriyle iş-yaşam dengenizi koruyabilirsiniz.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon" aria-hidden="true">🏥</div>
              <h3>Sağlık Sigortası</h3>
              <p>Kapsamlı özel sağlık sigortası ve düzenli sağlık kontrolleri sunuyoruz.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon" aria-hidden="true">🏆</div>
              <h3>Performans Primi</h3>
              <p>Başarılı çalışanlarımızı ödüllendiriyor ve performansa dayalı primler sağlıyoruz.</p>
            </div>
          </div>
        </section>

        <section className="kurumsal-section job-listings-section" data-section="positions">
          <h2>Açık Pozisyonlar</h2>
          <div className="job-listings" role="list">
            {jobs.map(job => (
              <JobListing
                key={job.id}
                title={job.title}
                department={job.department}
                location={job.location}
                type={job.type}
                description={job.description}
                requirements={job.requirements}
              />
            ))}
          </div>
        </section>

        <section className="kurumsal-section contact-section" data-section="contact">
          <h2>İletişim</h2>
          <p>
            Açık pozisyonlarımızla ilgili sorularınız için veya özgeçmişinizi göndermek için:
            <a href="mailto:kariyer@optiksistemi.com" className="contact-email">kariyer@optiksistemi.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Kariyer; 