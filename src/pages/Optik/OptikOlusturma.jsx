import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './OptikOlusturma.css';
import Button from '../../components/ui/Button/Button';
import LeftSidebar from './components/LeftSidebar';
import A4Container from './components/A4Container';
import PreviewModal from './components/PreviewModal';
import { FormEditorProvider, useFormEditor } from './context/FormEditorContext';
import optikApi from '../../api/optik';
import html2canvas from 'html2canvas';

// FormEditor Context'ine erişmek için wrapper bileşen
const OptikOlusturmaContent = () => {
  const navigate = useNavigate();
  const { pageElements } = useFormEditor();
  const [formTitle, setFormTitle] = useState('Yeni Optik Form');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  
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
  
  // A4 alanını resme dönüştür
  const captureFormImage = async () => {
    try {
      const a4Container = document.getElementById('a4-container');
      if (!a4Container) return null;
      
      // Kaldırma butonlarını ve yeniden boyutlandırma tutamaçlarını gizle
      const removeButtons = a4Container.querySelectorAll('.removeButton');
      const resizeHandles = a4Container.querySelectorAll('.resize-handle');
      
      // Geçici olarak gizle
      removeButtons.forEach(btn => btn.style.display = 'none');
      resizeHandles.forEach(handle => handle.style.display = 'none');
      
      // HTML2Canvas ile resim oluştur
      const canvas = await html2canvas(a4Container, {
        backgroundColor: 'white',
        scale: 1,
        useCORS: true,
        logging: false
      });
      
      // Gizlediğimiz elemanları tekrar göster
      removeButtons.forEach(btn => btn.style.display = '');
      resizeHandles.forEach(handle => handle.style.display = '');
      
      // Canvas'ı base64 resim URL'sine dönüştür
      return canvas.toDataURL('image/png');
    } catch (err) {
      console.error("Form resmi oluşturulurken hata:", err);
      return null;
    }
  };
  
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
      
      // Form görüntüsünü oluştur
      let opticalFormImage;
      try {
        opticalFormImage = await captureFormImage();
        if (!opticalFormImage) {
          throw new Error("Form görüntüsü oluşturulamadı");
        }
      } catch (err) {
        console.error("Form görüntüsü oluşturulurken hata:", err);
        setError("Form görüntüsü oluşturulamadı: " + err.message);
        setSaving(false);
        return;
      }
      
      // Form verilerini enhancedElements ile hazırla
      const enhancedElements = getEnhancedElements();
      
      // Form verisi
      const formData = {
        title: formTitle,
        school: schoolId,
        createdBy: userData._id,
        date: new Date().toISOString(),
        opticalFormImage: opticalFormImage,
        components: enhancedElements
      };
      
      console.log("Gönderilecek veriler:", {
        title: formData.title,
        school: formData.school,
        createdBy: formData.createdBy,
        date: formData.date,
        imageSize: formData.opticalFormImage.length,
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
  
  // Mavi çerçeveyi otomatik ekle
  const getEnhancedElements = () => {
    // Mavi çerçeve halihazırda var mı kontrol et
    const hasBlueFrame = pageElements.some(elem => elem.id === 'blueFrame');
    
    if (hasBlueFrame) {
      return pageElements;
    }
    
    // Yoksa elemanlara ekle
    return [
      {
        id: 'blueFrame',
        uniqueId: 'blueFrame-' + Date.now(),
        type: 'frame',
        position: { x: 160, y: 260 },
        size: { width: 320, height: 450 },
        zIndex: 0,
        border: '2px solid #0066cc'
      },
      ...pageElements
    ];
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
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
          <Button 
            variant="secondary" 
            onClick={openPreview}
          >
            Önizleme
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
      
      {/* Önizleme Modalı - mavi çerçeveyi dahil et */}
      <PreviewModal 
        isOpen={isPreviewOpen}
        onClose={closePreview}
        pageElements={getEnhancedElements()}
        formTitle={formTitle}
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