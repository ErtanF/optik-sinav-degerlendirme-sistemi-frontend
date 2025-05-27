import React, { useState, useEffect } from 'react';
import './Landing.css';
import './Hakkimizda.css';

const LandingHakkimizda = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  const companyValues = [
    {
      id: 'value-1',
      title: 'Yenilikçilik',
      icon: '💡',
      color: 'blue',
      description: 'Sürekli olarak platformumuzu geliştirmek ve yeni özellikler eklemek için çalışıyoruz.'
    },
    {
      id: 'value-2',
      title: 'Güvenilirlik',
      icon: '🔒',
      color: 'green',
      description: 'Verilerinizin güvenliği ve sonuçların doğruluğu bizim için en önemli önceliktir.'
    },
    {
      id: 'value-3',
      title: 'Kullanıcı Odaklılık',
      icon: '👥',
      color: 'orange',
      description: 'Her özelliği kullanıcılarımızın gerçek ihtiyaçlarına göre tasarlıyoruz.'
    },
    {
      id: 'value-4',
      title: 'Erişilebilirlik',
      icon: '🌐',
      color: 'purple',
      description: 'Sistemimizi tüm eğitimcilerin kolayca erişebileceği ve kullanabileceği şekilde tasarladık.'
    }
  ];
  
  const teamMembers = [
    {
      id: 1,
      name: 'Mehmet Akif Balcı',
      role: 'Kurucu & CEO',
      image: ''
    },
    {
      id: 2,
      name: 'Ertan Efe',
      role: 'Backend Developer',
      image: ''
    },
    {
      id: 3,
      name: 'Baha Yıldız',
      role: 'Frontend Developer',
      image: ''
    }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.title = "Hakkımızda | Optik Sınav Değerlendirme Sistemi";
    
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
    
    const sections = document.querySelectorAll('.about-section');
    
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
    <div className={`about-page ${isPageLoaded ? 'page-loaded' : ''}`}>
      <div className="about-hero">
        <div className="container">
          <h1 className="about-hero-title">Hakkımızda</h1>
          <p className="about-hero-subtitle">
            Eğitimde teknoloji ile fark yaratıyoruz
          </p>
        </div>
      </div>

      <div className="about-content">
        <div className="container">
          <section className="about-section" data-section="vision">
            <div className="section-header">
              <h2 className="section-title">Vizyonumuz</h2>
            </div>
            <div className="section-content">
              <p className="section-text">
                Optik Sınav Değerlendirme Sistemi olarak vizyonumuz, eğitimcilerin sınav süreçlerini dijitalleştirerek
                zaman ve kaynak tasarrufu sağlamak, ölçme ve değerlendirme süreçlerini daha verimli hale getirmektir.
                Teknolojik altyapımız ve yenilikçi çözümlerimizle, eğitim kurumlarının sınav değerlendirme süreçlerinde
                lider konumda olmayı hedefliyoruz.
              </p>
            </div>
          </section>

          <section className="about-section" data-section="mission">
            <div className="section-header">
              <h2 className="section-title">Misyonumuz</h2>
            </div>
            <div className="section-content">
              <p className="section-text">
                Eğitimcilere ve kurumlara, kullanımı kolay, güvenilir ve hızlı bir optik form değerlendirme sistemi sunarak
                sınav süreçlerini optimize etmelerini sağlamak. Öğrenci başarısını ölçme ve değerlendirmede doğru,
                hızlı ve detaylı analizler sunarak eğitim kalitesinin artırılmasına katkıda bulunmak.
              </p>
            </div>
          </section>

          <section className="about-section" data-section="history">
            <div className="section-header">
              <h2 className="section-title">Tarihçemiz</h2>
            </div>
            <div className="section-content">
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">2024</h3>
                    <p className="timeline-text">
                      Eğitimcilerin ihtiyaçları doğrultusunda geliştirilen Optik Sınav Değerlendirme Sistemi,
                      ilk olarak küçük bir ekip tarafından yerel okullara hizmet vermek amacıyla kuruldu.
                    </p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">2025</h3>
                    <p className="timeline-text">
                      Tamamen yenilenen altyapımız ve genişletilmiş özelliklerimizle kullanıcılarımıza
                      daha kapsamlı analizler ve daha hızlı sonuçlar sunmaktayız. Sürekli gelişim anlayışımızla
                      eğitim sektörünün ihtiyaçlarını karşılamaya devam ediyoruz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="about-section" data-section="values">
            <div className="section-header">
              <h2 className="section-title">Değerlerimiz</h2>
            </div>
            <div className="values-grid">
              {companyValues.map(value => (
                <div key={value.id} className={`value-card value-${value.color}`}>
                  <div className="value-icon">{value.icon}</div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="about-section" data-section="team">
            <div className="section-header">
              <h2 className="section-title">Ekibimiz</h2>
              <p className="section-subtitle">
                Optik Sınav Değerlendirme Sistemi, eğitim ve teknoloji alanlarında uzman profesyonellerden oluşan
                dinamik bir ekip tarafından yönetilmektedir.
              </p>
            </div>
            <div className="team-grid">
              {teamMembers.map(member => (
                <div key={member.id} className="team-card">
                  <div className="team-image">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default LandingHakkimizda; 