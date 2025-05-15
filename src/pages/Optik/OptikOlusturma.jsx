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
  
  // Kullanıcı bilgilerini yükle
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUserData(JSON.parse(userStr));
      }
    } catch (err) {
      console.error("Kullanıcı bilgileri alınamadı:", err);
    }
  }, []);
  
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
      
      // Form verisini hazırla
      const formData = {
        title: formTitle,
        school: schoolId,
        createdBy: user._id,
        date: new Date().toISOString(),
        opticalFormImage: formImage,
        components: pageElements.map(element => ({
          ...element,
          bubbleValues: customBubbleValues[element.uniqueId] || {}
        }))
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
          <input
            type="text"
            value={formTitle}
            onChange={handleTitleChange}
            className="form-title-input"
            placeholder="Form Başlığı"
          />
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