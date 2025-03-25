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

// FormEditor Context'ine erişmek için wrapper bileşen
const OptikOlusturmaContent = () => {
  const navigate = useNavigate();
  const { pageElements } = useFormEditor();
  const [formTitle, setFormTitle] = useState('Yeni Optik Form');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [formImage, setFormImage] = useState(null);
  
  // Önizleme için state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Component yüklendiğinde kullanıcı bilgilerini al
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        setUserData(parsedUser);
      }
    } catch (err) {
      console.error("Kullanıcı bilgileri alınamadı:", err);
    }
  }, []);
  
  const handleTitleChange = (e) => {
    setFormTitle(e.target.value);
  };
  
  // Elemanları düzenle (mavi çerçeveleri kaldırma burada yapılmaz, FormRenderer'da yapılır)
  const getEnhancedElements = () => {
    return pageElements;
  };
  
  // Kaydetme işlemi
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Form doğrulama kontrollerini yap
      if (!formTitle.trim()) {
        setError("Form başlığı boş olamaz");
        setSaving(false);
        return;
      }
      
      if (pageElements.length === 0) {
        setError("Form elemanları eklemeden kaydedemezsiniz");
        setSaving(false);
        return;
      }
      
      // Kullanıcı bilgilerini kontrol et
      if (!userData) {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setError("Oturum bilgileriniz bulunamadı. Lütfen tekrar giriş yapın.");
          setSaving(false);
          return;
        }
        
        try {
          setUserData(JSON.parse(userStr));
        } catch (err) {
          setError("Kullanıcı bilgileri geçersiz. Lütfen tekrar giriş yapın.");
          setSaving(false);
          return;
        }
      }
      
      if (!userData._id) {
        setError("Kullanıcı kimliği bulunamadı. Lütfen tekrar giriş yapın.");
        setSaving(false);
        return;
      }
      
      // Okul ID'sini doğru şekilde al
      let schoolId = null;
      if (userData.school && userData.school._id) {
        schoolId = userData.school._id;
      } else if (userData.schoolId) {
        schoolId = userData.schoolId;
      } else {
        setError("Okul bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
        setSaving(false);
        return;
      }
      
      // Form görüntüsünü kontrol et
      if (!formImage) {
        setError("Form görüntüsü oluşturulamadı. Lütfen tekrar deneyin.");
        setSaving(false);
        return;
      }
      
      // Form verisi
      const formData = {
        title: formTitle,
        school: schoolId,
        createdBy: userData._id,
        date: new Date().toISOString(),
        opticalFormImage: formImage,
        components: getEnhancedElements()
      };
      
      console.log("Gönderilecek veriler:", {
        title: formData.title,
        school: formData.school,
        createdBy: formData.createdBy,
        date: formData.date,
        imageSize: formData.opticalFormImage ? formData.opticalFormImage.length : 'yok',
        componentsCount: formData.components.length
      });
      
      // API ile kaydet
      const response = await optikApi.createForm(formData);
      console.log("API yanıtı:", response);
      
      // Başarıyla kaydedildi, dashboard'a yönlendir
      navigate('/dashboard', { 
        state: { message: 'Form başarıyla kaydedildi.' } 
      });
    } catch (error) {
      console.error('Form kaydedilirken hata:', error);
      
      // Detaylı hata mesajı göster
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
  
  // Önizleme modalını aç
  const openPreview = () => {
    setIsPreviewOpen(true);
  };

  // Önizleme modalını kapat
  const closePreview = () => {
    setIsPreviewOpen(false);
  };
  
  // Önizleme görünümünü kaydetme fonksiyonu
  const handleSavePreview = () => {
    closePreview();
    setTimeout(handleSave, 100); // Kısa bir gecikme ile kaydet
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
          <Link to="/dashboard">
            <Button variant="outline">Dashboard'a Dön</Button>
          </Link>
        </div>
      </div>
      
      {error && <div className="error-alert">{error}</div>}
      
      <div className="optik-creator-container">
        <LeftSidebar />
        <A4Container />
      </div>
      
      {/* Görünmez renderer - form görüntüsü oluşturmak için */}
      <div style={{ 
        position: 'absolute', 
        left: '-9999px', 
        top: '-9999px',
        width: '210mm',
        height: '297mm',
        overflow: 'hidden'
      }}>
        <FormRenderer 
          pageElements={getEnhancedElements()}
          formTitle={formTitle}
          onRender={setFormImage}
          visible={true} // Render için görünür yap
        />
      </div>
      
      {/* Önizleme Modalı */}
      <PreviewModal 
        isOpen={isPreviewOpen}
        onClose={closePreview}
        pageElements={getEnhancedElements()}
        formTitle={formTitle}
        onSave={handleSavePreview}
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