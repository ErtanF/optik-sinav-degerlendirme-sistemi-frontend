// src/pages/Optik/OptikOlusturma.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './OptikOlusturma.css';
import Button from '../../components/ui/Button/Button';
import LeftSidebar from './components/LeftSidebar';
import A4Container from './components/A4Container';
import PreviewModal from './components/PreviewModal';
import FormRenderer from './components/FormRenderer';
import { FormEditorProvider, useFormEditor } from './context/FormEditorContext';
import optikApi from '../../api/optik';
import classApi from '../../api/classes'; // Sınıfları getirmek için API'yi ekleyin

// FormEditor Context'ine erişmek için wrapper bileşen
const OptikOlusturmaContent = () => {
  const navigate = useNavigate();
  const { pageElements, customBubbleValues} = useFormEditor();
  
  // State değişkenleri
  const [formTitle, setFormTitle] = useState('Yeni Optik Form');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [formImage, setFormImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Sınıf listesi ve seçim için state ekleyin
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(false);
  
  // Kullanıcı bilgilerini yükle
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUserData(userData);
        
        // Kullanıcı bilgileri yüklendiğinde okulun sınıflarını getir
        if (userData.school?._id || userData.schoolId) {
          fetchClasses();
        }
      }
    } catch (err) {
      console.error("Kullanıcı bilgileri alınamadı:", err);
    }
  }, []);
  
  // Okul sınıflarını getir
  const fetchClasses = async () => {
    try {
      setClassesLoading(true);
      const response = await classApi.getClassesBySchool();
      setClasses(response.data || []);
    } catch (error) {
      console.error("Sınıflar yüklenirken hata:", error);
      setError("Okul sınıfları yüklenirken bir sorun oluştu.");
    } finally {
      setClassesLoading(false);
    }
  };
  
  // Sınıf seçimi işleme
  const handleClassSelect = (classId) => {
    setSelectedClasses(prevSelected => {
      // Eğer sınıf zaten seçiliyse, seçimden kaldır
      if (prevSelected.includes(classId)) {
        return prevSelected.filter(id => id !== classId);
      }
      // Değilse listeye ekle
      return [...prevSelected, classId];
    });
  };
  
  // Form başlığı değişikliği
  const handleTitleChange = (e) => {
    setFormTitle(e.target.value);
  };
  
  // Form kaydetme
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Doğrulama kontrolleri
      if (!formTitle.trim()) {
        throw new Error("Form başlığı boş olamaz");
      }
      
      if (pageElements.length === 0) {
        throw new Error("Form elemanları eklemeden kaydedemezsiniz");
      }
      
      // Kullanıcı bilgilerini kontrol et
      const user = userData || getUserFromStorage();
      if (!user?._id) {
        throw new Error("Kullanıcı kimliği bulunamadı. Lütfen tekrar giriş yapın.");
      }
      
      // Okul ID'sini doğru şekilde al
      const schoolId = user.school?._id || user.schoolId;
      if (!schoolId) {
        throw new Error("Okul bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
      }
      
      // Form görüntüsü kontrolü
      if (!formImage) {
        throw new Error("Form görüntüsü oluşturulamadı. Lütfen tekrar deneyin.");
      }
      
      // Form verisini hazırla - sınıf bilgisini ekliyoruz
      const formData = {
        title: formTitle,
        school: schoolId,
        createdBy: user._id,
        date: new Date().toISOString(),
        opticalFormImage: formImage,
        components: pageElements.map(element => ({
          ...element,
          bubbleValues: customBubbleValues[element.uniqueId] || {}
        })),
        // Seçilen sınıfları ekle
        assignedClasses: selectedClasses
      };
      
      // Form verisini sunucuya gönder
      await optikApi.createForm(formData);
      
      // Başarıyla kaydetme ve yönlendirme
      navigate('/', { 
        state: { message: 'Form başarıyla kaydedildi.' } 
      });
    } catch (error) {
      // Hata mesajını hazırla
      const errorMessage = error.response?.data?.message || error.message || 'Form kaydedilirken bir hata oluştu.';
      let detailMessage = '';
      
      if (error.response?.data?.errors) {
        detailMessage = ': ' + error.response.data.errors.join(', ');
      }
      
      setError(errorMessage + detailMessage);
    } finally {
      setSaving(false);
    }
  };
  
  // LocalStorage'dan kullanıcı bilgisini alma
  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (err) {
      console.error("Kullanıcı bilgileri parse edilemedi:", err);
      throw new Error("Kullanıcı bilgileri geçersiz. Lütfen tekrar giriş yapın.");
    }
  };
  
  // Önizleme modalını aç
  const openPreview = () => {
    setIsPreviewOpen(true);
  };

  // Önizleme modalını kapat
  const closePreview = () => {
    setIsPreviewOpen(false);
  };
  
  // Önizleme görünümünü kaydetme
  const handleSavePreview = () => {
    closePreview();
    setTimeout(handleSave, 100);
  };
  
  return (
    <div className="optik-olusturma-page">
      <div className="page-header">
        <div className="header-title">
          <h1>Optik Form Oluştur</h1>
          <div className="form-header-inputs">
            <input
              type="text"
              value={formTitle}
              onChange={handleTitleChange}
              className="form-title-input"
              placeholder="Form Başlığı"
            />
            
            {/* Sınıf seçim alanı */}
            <div className="class-selection-container">
              <div className="class-selection-label">Sınıflar:</div>
              <div className="class-selection-chips">
                {classesLoading ? (
                  <div className="loading-text">Sınıflar yükleniyor...</div>
                ) : classes.length > 0 ? (
                  <div className="classes-dropdown">
                    <button className="classes-dropdown-button">
                      {selectedClasses.length > 0 
                        ? `${selectedClasses.length} sınıf seçildi` 
                        : "Sınıf seçin"}
                      <span className="dropdown-arrow">▼</span>
                    </button>
                    <div className="classes-dropdown-content">
                      {classes.map(cls => (
                        <div key={cls._id} className="class-item">
                          <label className="class-checkbox-label">
                            <input
                              type="checkbox"
                              checked={selectedClasses.includes(cls._id)}
                              onChange={() => handleClassSelect(cls._id)}
                            />
                            {cls.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="no-classes">Okulunuza ait sınıf bulunamadı</div>
                )}
                
                {selectedClasses.length > 0 && (
                  <div className="selected-classes-list">
                    {selectedClasses.map(classId => {
                      const classItem = classes.find(c => c._id === classId);
                      return (
                        <div key={classId} className="selected-class-chip">
                          {classItem?.name || 'Sınıf'}
                          <button
                            className="remove-class-btn"
                            onClick={() => handleClassSelect(classId)}
                          >
                            &times;
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <Button
            variant="primary"
            onClick={openPreview}
            disabled={saving}
          >
            Önizle ve Kaydet
          </Button>
          <Link to="/">
            <Button variant="outline">Dashboard'a Dön</Button>
          </Link>
        </div>
      </div>
      
      {error && <div className="error-alert">{error}</div>}
      
      <div className="optik-creator-container">
        <div className="sidebar-container">
          <LeftSidebar />
        </div>
        <div className="a4-container-wrapper">
          <A4Container />
        </div>
      </div>
      
      {/* Görünmez renderer - form görüntüsü oluşturmak için */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '210mm', height: '297mm', overflow: 'hidden' }}>
        <FormRenderer 
          pageElements={pageElements}
          formTitle={formTitle}
          onRender={setFormImage}
          visible={true}
          showGrid={false}
          customBubbleValues={customBubbleValues}
        />
      </div>
      
      {/* Önizleme Modalı */}
      <PreviewModal 
        isOpen={isPreviewOpen}
        onClose={closePreview}
        pageElements={pageElements}
        formTitle={formTitle}
        onSave={handleSavePreview}
        customBubbleValues={customBubbleValues}
      />
    </div>
  );
};

// Ana bileşen
const OptikOlusturma = () => {
  return (
    <FormEditorProvider>
      <OptikOlusturmaContent />
    </FormEditorProvider>
  );
};

export default OptikOlusturma;