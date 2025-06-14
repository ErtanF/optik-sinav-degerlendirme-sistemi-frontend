import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import examApi from '../../api/exam';
import './SinavlarListesi.css';

const SinavlarListesi = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(location.state?.message || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  
  // Backend URL'ini al
  const getBaseUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5500/api';
    return apiUrl.replace('/api', '');
  };
  
  // Sınavları yükle
  useEffect(() => {
    fetchExams();
    
    // Mesajı 5 saniye sonra temizle
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await examApi.getExamsByCreator();
      setExams(response.data || []);
    } catch (error) {
      console.error('Sınavlar yüklenirken hata:', error);
      setError('Sınavlar yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };
  
  // Sınav silme
  const handleDeleteExam = async (id, title) => {
    if (window.confirm(`"${title}" adlı sınavı silmek istediğinizden emin misiniz?`)) {
      try {
        await examApi.deleteExam(id);
        setExams(exams.filter(exam => exam._id !== id));
        setMessage('Sınav başarıyla silindi.');
      } catch (error) {
        console.error('Sınav silinirken hata:', error);
        setError('Sınav silinirken bir sorun oluştu.');
      }
    }
  };
  
  // Arama ve filtreleme
  const filteredExams = exams.filter(exam => {
    // İsime göre arama
    const matchesTitle = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tarihe göre filtreleme
    const matchesDate = filterDate ? 
      new Date(exam.date).toISOString().substring(0, 10) === filterDate : true;
    
    return matchesTitle && matchesDate;
  });
  
  // Sınavları tarihe göre sırala (en yeni başta)
  const sortedExams = [...filteredExams].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  // Sınav tarihini formatla
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };
  
  return (
    <div className="sinavlar-page">
      <div className="page-header">
        <div className="header-title">
          <h1>Sınavlarım</h1>
        </div>
        <div className="header-actions">
          <Link to="/sinav-olustur">
            <Button variant="primary">Yeni Sınav Oluştur</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">Dashboard'a Dön</Button>
          </Link>
        </div>
      </div>
      
      {/* Bildirim mesajları */}
      {message && <div className="success-alert">{message}</div>}
      {error && <div className="error-alert">{error}</div>}
      
      {/* Arama ve Filtreleme */}
      <div className="filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Sınav ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="date-filter">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="date-input"
          />
          {filterDate && (
            <button 
              className="clear-filter" 
              onClick={() => setFilterDate('')}
              title="Filtreyi Temizle"
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {/* Sınav Listesi */}
      <div className="sinavlar-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : sortedExams.length > 0 ? (
          <div className="sinavlar-grid">
            {sortedExams.map(exam => (
              <div key={exam._id} className="sinav-card">
                <div className="sinav-header">
                  <h3 className="sinav-title">{exam.title}</h3>
                  <span className={`sinav-status ${new Date(exam.date) > new Date() ? 'upcoming' : 'past'}`}>
                    {new Date(exam.date) > new Date() ? 'Yaklaşan' : 'Geçmiş'}
                  </span>
                </div>
                
                <div className="sinav-date">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{formatDate(exam.date)}</span>
                </div>
                
                <div className="sinav-details">
                  {/* Sınıf bilgileri */}
                  <div className="sinav-classes">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3v18h18"></path>
                      <path d="M18.4 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9.6"></path>
                      <path d="M10 10h5v5h-5z"></path>
                    </svg>
                    <span>
                      {exam.assignedClasses?.length || 0} Sınıf,{' '}
                      {exam.studentIds?.length || 0} Öğrenci
                    </span>
                  </div>
                  
                  {/* Optik form önizleme */}
                  <div className="sinav-template">
                    <div className="template-preview">
                      {exam.opticalTemplate?.opticalFormImage ? (
                        <img 
                          src={`${getBaseUrl()}${exam.opticalTemplate.opticalFormImage}`} 
                          alt="Optik Form" 
                          onClick={() => navigate(`/sinav/${exam._id}`)}
                        />
                      ) : (
                        <div className="no-preview">
                          <span>Önizleme yok</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="sinav-actions">
                  <Button 
                    variant="primary" 
                    size="small"
                    onClick={() => navigate(`/sinav/${exam._id}`)}
                  >
                    Görüntüle
                  </Button>
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => navigate(`/sinav-duzenle/${exam._id}`)}
                  >
                    Düzenle
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="small"
                    onClick={() => handleDeleteExam(exam._id, exam.title)}
                  >
                    Sil
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Henüz Sınav Yok</h3>
            <p>Oluşturduğunuz sınavlar burada listelenecek.</p>
            <Link to="/sinav-olustur">
              <Button variant="primary">İlk Sınavınızı Oluşturun</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinavlarListesi;