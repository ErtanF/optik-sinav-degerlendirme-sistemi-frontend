import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import optikApi from '../../api/optik';
import classApi from '../../api/classes';
import studentApi from '../../api/students';
import { jsPDF } from 'jspdf';
import './SinavOlustur.css';

const SinavOlustur = () => {
  const navigate = useNavigate();
  
  // State tanımlamaları
  const [formTitle, setFormTitle] = useState('');
  const [examDate, setExamDate] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [opticalTemplates, setOpticalTemplates] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [classStudents, setClassStudents] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [automaticCoding, setAutomaticCoding] = useState(true);  // Otomatik kodlama seçeneği
  
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
  
  // Seçilen şablon değiştiğinde, şablon bilgilerini al
  useEffect(() => {
    if (selectedTemplateId) {
      fetchTemplateDetails(selectedTemplateId);
    } else {
      setSelectedTemplate(null);
    }
  }, [selectedTemplateId]);
  
  // Şablon detaylarını getir
  const fetchTemplateDetails = async (templateId) => {
    try {
      setLoading(true);
      const response = await optikApi.getFormById(templateId);
      setSelectedTemplate(response.data);
    } catch (error) {
      console.error('Şablon detayları yüklenirken hata:', error);
      setError('Şablon detayları yüklenemedi.');
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
  
  // Otomatik kodlama seçeneğini değiştir
  const handleAutomaticCodingChange = (e) => {
    setAutomaticCoding(e.target.checked);
  };
  
  // Numaraları optik formda işaretle
  const markStudentNumberOnTemplate = (doc, studentNumber, template, baseY) => {
    // Öğrenci numarası alanını template.components içinde bul
    const numberComponent = template.components.find(comp => comp.type === 'number');
    if (!numberComponent || !studentNumber) return;
    
    // Numarayı string'e çevir ve belirli bir uzunluğa tamamla
    const studentNumberStr = String(studentNumber).padStart(numberComponent.cols, '0');
    
    // Numaranın her bir rakamı için
    for (let i = 0; i < studentNumberStr.length && i < numberComponent.cols; i++) {
      const digit = parseInt(studentNumberStr[i], 10);
      
      if (isNaN(digit)) continue;
      
      // Konum hesapla (optik forma göre)
      // Başlangıç pozisyonuna 43 piksel aşağı ve 7 piksel sağa kaydırma uygula
      const bubbleX = numberComponent.position.x + (i * 17) + 7; // 17px grid genişliği + 7px sağa kayma
      const bubbleY = numberComponent.position.y + (digit * 17) + 43; // 17px grid yüksekliği + 43px aşağı kayma
      
      // PDF'de mm cinsinden konumu hesapla (A4: 210x297 mm)
      const pdfX = bubbleX * 0.264583;
      const pdfY = bubbleY * 0.264583;
      
      // Daireleri doldur
      doc.setFillColor(0, 0, 0);
      doc.circle(pdfX, pdfY, 1.7, 'F'); // 1.7mm yarıçaplı dolu daire
    }
  };
  
  // Ad-Soyad alanı varsa kodla
  const markStudentNameOnTemplate = (doc, studentName, template, baseY) => {
    // Ad Soyad alanını template.components içinde bul
    const nameComponent = template.components.find(comp => comp.type === 'nameSurname');
    if (!nameComponent || !studentName) return;
    
    // Adı büyük harfe çevir
    const upperName = studentName.toUpperCase().replace(/[^A-ZĞÜŞİÖÇ ]/g, '');
    
    // İsmin her bir harfi için
    for (let i = 0; i < upperName.length && i < nameComponent.cols; i++) {
      const char = upperName[i];
      if (char === ' ') continue;
      
      // Alfabedeki indeksi bul
      const alphabet = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
      const charIndex = alphabet.indexOf(char);
      
      if (charIndex === -1) continue;
      
      // Konum hesapla
      // Başlangıç pozisyonuna 68 piksel aşağı ve 5 piksel sağa kaydırma uygula
      const bubbleX = nameComponent.position.x + (i * 17) + 7; // 17px grid genişliği + 5px sağa kayma
      const bubbleY = nameComponent.position.y + (charIndex * 17) + 43; // 17px grid yüksekliği + 68px aşağı kayma
      
      // PDF'de mm cinsinden konumu hesapla
      const pdfX = bubbleX * 0.264583;
      const pdfY = bubbleY * 0.264583;
      
      // Daireleri doldur
      doc.setFillColor(0, 0, 0);
      doc.circle(pdfX, pdfY, 1.7, 'F'); // 1.7mm yarıçaplı dolu daire
    }
  };
  
  // PDF oluştur ve indir
  const generateAndDownloadPDF = async () => {
    if (!selectedTemplate || !selectedTemplateId) {
      setError('Lütfen bir optik şablon seçin.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Şablon görüntü URL'si
      const baseUrl = getBaseUrl();
      const templateImageUrl = `${baseUrl}${selectedTemplate.opticalFormImage}`;
      
      // Görüntüyü yükle
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      img.onload = async () => {
        // A4 boyutunda bir PDF oluştur (210mm x 297mm)
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        // Otomatik kodlama seçili ise öğrenci sayısı kadar sayfa oluştur
        if (automaticCoding) {
          // Tüm seçili sınıfların öğrencilerini topla
          const allStudents = [];
          selectedClasses.forEach(classId => {
            if (classStudents[classId]) {
              allStudents.push(...classStudents[classId]);
            }
          });
          
          if (allStudents.length === 0) {
            setError('Seçili sınıflarda öğrenci bulunamadı.');
            setLoading(false);
            return;
          }
          
          // Her öğrenci için bir sayfa oluştur
          for (let i = 0; i < allStudents.length; i++) {
            const student = allStudents[i];
            
            if (i > 0) {
              pdf.addPage();
            }
            
            // Şablon görüntüsünü ekle
            pdf.addImage(img, 'JPEG', 0, 0, 210, 297);
            
            // Öğrenci numarasını kodla
            markStudentNumberOnTemplate(pdf, student.studentNumber, selectedTemplate, 0);
            
            // Ad-Soyadı kodla
            markStudentNameOnTemplate(pdf, `${student.firstName} ${student.lastName}`, selectedTemplate, 0);
            
            // Not: Öğrenci bilgisini artık eklemiyoruz, sadece kodlama yapıyoruz
          }
        } else {
          // Otomatik kodlama seçili değilse tek bir boş optik form oluştur
          pdf.addImage(img, 'JPEG', 0, 0, 210, 297);
          
          // Not: Sınav bilgisini artık eklemiyoruz
        }
        
        // PDF'i indir
        pdf.save(`${formTitle || 'Sınav'}_Optik_Form${automaticCoding ? 'lar' : ''}.pdf`);
        setLoading(false);
        setSuccess('Optik form' + (automaticCoding ? 'lar' : '') + ' başarıyla oluşturuldu ve indirildi.');
      };
      
      img.onerror = () => {
        setError('Şablon görüntüsü yüklenirken hata oluştu.');
        setLoading(false);
      };
      
      img.src = templateImageUrl;
      
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      setError('PDF oluşturulurken bir hata oluştu: ' + error.message);
      setLoading(false);
    }
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
    
    // Optik formları indirme seçeneği
    const shouldDownloadForms = window.confirm('Sınav kaydedilecek. Ayrıca seçilen sınıfların öğrencileri için optik formları PDF olarak indirmek ister misiniz?');
    
    // PDF indirme işlemi
    if (shouldDownloadForms) {
      await generateAndDownloadPDF();
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
            
            {/* Otomatik Kodlama Seçeneği */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="automaticCoding"
                  checked={automaticCoding}
                  onChange={handleAutomaticCodingChange}
                />
                <label htmlFor="automaticCoding" className="checkbox-label">Öğrenci bilgilerini optik formlara otomatik kodla</label>
                <p className="checkbox-help">
                  Bu seçenek etkinleştirildiğinde, PDF oluşturulurken öğrenci numarası ve adı optik formlarda otomatik olarak işaretlenecektir.
                </p>
              </div>
            </div>
            
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
                      {classStudents[cls._id] ? 
                        `${classStudents[cls._id].length} Öğrenci` : 
                        'Yükleniyor...'}
                    </div>
                    {selectedClasses.includes(cls._id) && (
                      <div className="class-selected-badge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Seçildi
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-classes">
                  <p>Henüz sınıf oluşturmadınız.</p>
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
          
          <div className="form-actions">
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading}
            >
              {loading ? 'İşleniyor...' : 'Sınavı Oluştur'}
            </Button>
            
            <Button 
              type="button" 
              variant="secondary"
              onClick={generateAndDownloadPDF}
              disabled={loading || !selectedTemplateId || selectedClasses.length === 0}
            >
              Sadece Optik Formları İndir
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