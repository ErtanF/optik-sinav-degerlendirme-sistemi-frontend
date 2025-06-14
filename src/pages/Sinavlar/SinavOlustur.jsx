import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import optikApi from '../../api/optik';
import classApi from '../../api/classes';
import studentApi from '../../api/students';
import './SinavOlustur.css';

const SinavOlustur = () => {
  const navigate = useNavigate();
  
  // State tanımlamaları
  const [formTitle, setFormTitle] = useState('');
  const [examDate, setExamDate] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [opticalTemplates, setOpticalTemplates] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [classStudents, setClassStudents] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Backend URL'ini al
  const getBaseUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5500/api';
    return apiUrl.replace('/api', '');
  };
  
  // Sayfa yüklendiğinde verileri getir
  useEffect(() => {
    fetchOpticalTemplates();
    fetchClasses();
  }, []);
  
  // Optik form şablonlarını getir
  const fetchOpticalTemplates = async () => {
    try {
      setLoading(true);
      const response = await optikApi.getAllForms();
      setOpticalTemplates(response.data || []);
    } catch (error) {
      console.error('Optik şablonları yüklenirken hata:', error);
      setError('Optik form şablonları yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };
  
  // Sınıfları getir
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classApi.getClassesBySchool();
      setClasses(response.data || []);
    } catch (error) {
      console.error('Sınıflar yüklenirken hata:', error);
      setError('Sınıflar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };
  
  // Sınıf seçildiğinde öğrencileri getir
  const handleClassSelect = async (classId) => {
    // Sınıf zaten seçili mi kontrol et
    if (selectedClasses.includes(classId)) {
      // Seçimi kaldır
      setSelectedClasses(prev => prev.filter(id => id !== classId));
      return;
    }
    
    // Sınıfı seçilenlere ekle
    setSelectedClasses(prev => [...prev, classId]);
    
    // Sınıfın öğrencilerini getir (eğer daha önce yüklenmediyse)
    if (!classStudents[classId]) {
      try {
        setLoading(true);
        const response = await studentApi.getStudentsByClass(classId);
        setClassStudents(prev => ({
          ...prev,
          [classId]: response.data || []
        }));
      } catch (error) {
        console.error(`${classId} sınıfının öğrencileri yüklenirken hata:`, error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Optik şablon seçimi
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplateId(templateId);
  };
  
  // Formu kaydet
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form doğrulama
    if (!formTitle.trim()) {
      setError('Lütfen sınav adını girin.');
      return;
    }
    
    if (!examDate) {
      setError('Lütfen sınav tarihini seçin.');
      return;
    }
    
    if (!selectedTemplateId) {
      setError('Lütfen bir optik form şablonu seçin.');
      return;
    }
    
    if (selectedClasses.length === 0) {
      setError('Lütfen en az bir sınıf seçin.');
      return;
    }
    
    // Tüm seçili sınıfların öğrenci ID'lerini topla
    const allStudentIds = [];
    selectedClasses.forEach(classId => {
      if (classStudents[classId]) {
        classStudents[classId].forEach(student => {
          allStudentIds.push(student._id);
        });
      }
    });
    
    try {
      setLoading(true);
      setError('');
      
      // Exam API endpoint'ine istek gönder
      const response = await fetch(`${getBaseUrl()}/api/exam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: formTitle,
          date: examDate,
          opticalTemplateId: selectedTemplateId,
          assignedClasses: selectedClasses,
          studentIds: allStudentIds
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Sınav oluşturulurken bir hata oluştu.');
      }
      
      setSuccess('Sınav başarıyla oluşturuldu!');
      
      // Başarılı oluşturma sonrası sınavlar sayfasına yönlendir
      setTimeout(() => {
        navigate('/sinavlar');
      }, 1500);
      
    } catch (error) {
      console.error('Sınav oluşturma hatası:', error);
      setError(error.message || 'Sınav oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="sinav-olustur-page">
      <div className="page-header">
        <div className="header-title">
          <h1>Yeni Sınav Oluştur</h1>
          <p className="page-description">
            Sınav bilgilerini, kullanılacak optik formu ve katılacak sınıfları seçin.
          </p>
        </div>
        <div className="header-actions">
          <Button
            variant="outline"
            onClick={() => navigate('/sinavlar')}
          >
            Sınavlara Dön
          </Button>
        </div>
      </div>
      
      {error && <div className="error-alert">{error}</div>}
      {success && <div className="success-alert">{success}</div>}
      
      <div className="sinav-form-container">
        <form onSubmit={handleSubmit} className="sinav-form">
          <div className="form-section">
            <h2 className="section-title">Sınav Bilgileri</h2>
            <div className="form-group">
              <Input
                type="text"
                label="Sınav Adı"
                id="formTitle"
                name="formTitle"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Örn: 1. Dönem Matematik Sınavı"
                required
              />
            </div>
            <div className="form-group">
              <Input
                type="date"
                label="Sınav Tarihi"
                id="examDate"
                name="examDate"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-section">
            <h2 className="section-title">Optik Form Şablonu</h2>
            <p className="section-description">
              Sınavda kullanmak istediğiniz optik form şablonunu seçin.
            </p>
            
            {loading && <div className="loading-container"><div className="loading-spinner"></div></div>}
            
            <div className="template-grid">
              {opticalTemplates.length > 0 ? (
                opticalTemplates.map(template => (
                  <div 
                    key={template._id}
                    className={`template-card ${selectedTemplateId === template._id ? 'selected' : ''}`}
                    onClick={() => handleTemplateSelect(template._id)}
                  >
                    <div className="template-image">
                      <img 
                        src={`${getBaseUrl()}${template.opticalFormImage}`} 
                        alt={template.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/200x280?text=Önizleme+Yok';
                        }}
                      />
                    </div>
                    <div className="template-info">
                      <h3>{template.name}</h3>
                      <p className="template-date">
                        {new Date(template.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-templates">
                  <p>Henüz optik form şablonu oluşturmadınız.</p>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/optik-olustur')}
                  >
                    Optik Form Oluştur
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="form-section">
            <h2 className="section-title">Sınıf Seçimi</h2>
            <p className="section-description">
              Sınava katılacak sınıfları seçin. Seçilen sınıfların tüm öğrencileri otomatik olarak sınava dahil edilecektir.
            </p>
            
            {loading && <div className="loading-container"><div className="loading-spinner"></div></div>}
            
            <div className="classes-grid">
              {classes.length > 0 ? (
                classes.map(cls => (
                  <div 
                    key={cls._id}
                    className={`class-card ${selectedClasses.includes(cls._id) ? 'selected' : ''}`}
                    onClick={() => handleClassSelect(cls._id)}
                  >
                    <div className="class-header">
                      <h3>{cls.name}</h3>
                      <span className="class-grade">{cls.grade}. Sınıf</span>
                    </div>
                    <div className="class-students-count">
                      {cls.students?.length || 0} Öğrenci
                    </div>
                    {selectedClasses.includes(cls._id) && (
                      <div className="class-selected-badge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Seçildi
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-classes">
                  <p>Okulunuza ait sınıf bulunamadı.</p>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/classes/new')}
                  >
                    Sınıf Oluştur
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {selectedClasses.length > 0 && (
            <div className="form-section">
              <h2 className="section-title">Seçilen Sınıfların Öğrencileri</h2>
              <p className="section-description">
                Seçtiğiniz sınıfların tüm öğrencileri aşağıda listelenmiştir.
              </p>
              
              <div className="students-accordion">
                {selectedClasses.map(classId => {
                  const classInfo = classes.find(c => c._id === classId);
                  const students = classStudents[classId] || [];
                  
                  return (
                    <div key={classId} className="class-students-panel">
                      <div className="class-students-header">
                        <h3>{classInfo?.name || 'Sınıf'}</h3>
                        <span className="student-count">{students.length} Öğrenci</span>
                      </div>
                      <div className="class-students-body">
                        {students.length > 0 ? (
                          <div className="students-list">
                            <table className="students-table">
                              <thead>
                                <tr>
                                  <th>Öğrenci No</th>
                                  <th>Ad Soyad</th>
                                </tr>
                              </thead>
                              <tbody>
                                {students.map(student => (
                                  <tr key={student._id}>
                                    <td>{student.studentNumber}</td>
                                    <td>{student.firstName} {student.lastName}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="no-students">
                            <p>Bu sınıfta öğrenci bulunmuyor.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Oluşturuluyor...' : 'Sınavı Oluştur'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/sinavlar')}
            >
              İptal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SinavOlustur;