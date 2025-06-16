// src/pages/Optik/OptikOlusturma.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import './OptikOlusturma.css';
import Button from '../../components/ui/Button/Button';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import A4Container from './components/A4Container';
import PreviewModal from './components/PreviewModal';
import FormRenderer from './components/FormRenderer';
import { FormEditorProvider, useFormEditor } from './context/FormEditorContext';
import optikApi from '../../api/optik';
import classApi from '../../api/classes';

// FormEditor Context'ine erişmek için wrapper bileşen
const OptikOlusturmaContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit'); // URL'den düzenleme ID'sini al
  const { pageElements, customBubbleValues, loadFormState, getFormStateForSave } = useFormEditor();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [formTitle, setFormTitle] = useState('Yeni Optik Form');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [formImage, setFormImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  
  // Eğer düzenleme modu ise, form verilerini yükle
  useEffect(() => {
    if (editId) {
      setIsEditMode(true);
      setLoading(true);
      loadExistingForm(editId);
    }
  }, [editId]);
  
  // Mevcut formu yükleme fonksiyonu
  // OptikOlusturma.jsx - loadExistingForm fonksiyonunu güncelle

const loadExistingForm = async (formId) => {
  try {
    setLoading(true);
    setError(null);
    
    // Form verilerini API'den al
    const response = await optikApi.getFormById(formId);
    
    if (!response || !response.data) {
      throw new Error("Form verileri alınamadı");
    }
    
    const formData = response.data;
    
    // Form başlığını ayarla - artık 'name' alanından geliyor
    setFormTitle(formData.name || 'Düzenlenen Form');
    
    // Form görüntüsünü ayarla
    if (formData.opticalFormImage) {
      setFormImage(formData.opticalFormImage);
    }
    
   
    
    // Form bileşenlerini FormEditor context'ine yükle
    if (formData.components && Array.isArray(formData.components)) {
      // Form elemanlarını ve bubble değerlerini ayırma
      const elements = formData.components.map(comp => {
        const { ...elementData } = comp;
        return elementData;
      });
      
      // Bubble değerlerini ayırma
      const bubbleValues = {};
      formData.components.forEach(comp => {
        if (comp.bubbleValues && comp.uniqueId) {
          bubbleValues[comp.uniqueId] = comp.bubbleValues;
        }
      });
      
      // FormEditor context'ine form durumunu yükle
      loadFormState({
        pageElements: elements,
        customBubbleValues: bubbleValues
      });
    }
    
    console.log('Optik form şablonu başarıyla yüklendi:', formData.name);
    
  } catch (error) {
    console.error('Form yüklenirken hata:', error);
    setError('Form yüklenirken bir sorun oluştu: ' + (error.message || 'Bilinmeyen hata'));
  } finally {
    setLoading(false);
  }
};
  
  // Kullanıcı bilgilerini yükle
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUserData(userData);
        
        
      }
    } catch (err) {
      console.error("Kullanıcı bilgileri alınamadı:", err);
    }
  }, []);
  
  // Form başlığı değişikliği
  const handleTitleChange = (e) => {
    setFormTitle(e.target.value);
  };
  
  // Form kaydetme - düzenleme modunu destekleyecek şekilde güncellenmiş
  // OptikOlusturma.jsx - handleSave fonksiyonunu güncelle

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
    
    // Form görüntüsü kontrolü
    if (!formImage) {
      throw new Error("Form görüntüsü oluşturulamadı. Lütfen tekrar deneyin.");
    }
    
    // OpticalTemplate modeline uygun veri yapısı
    const formData = {
      name: formTitle,                    // title yerine name
      createdBy: user._id,               // createdBy alanı korunuyor
      opticalFormImage: formImage,       // opticalFormImage alanı korunuyor
      components: pageElements.map(element => ({
        ...element,
        bubbleValues: customBubbleValues[element.uniqueId] || {}
      })),                               // components alanı korunuyor
      isPublic: false                    // Yeni alan - şimdilik false
    };

    // NOT: school, date, assignedClasses alanları OpticalTemplate'de yok
    // Bunlar artık Exam modelinde kullanılacak
    
    let response;
    
    // Düzenleme modu veya yeni oluşturma moduna göre API çağrısı yap
    if (isEditMode && editId) {
      response = await optikApi.updateForm(editId, formData);
      console.log('Optik form şablonu güncellendi:', response);
    } else {
      response = await optikApi.createForm(formData);
      console.log('Yeni optik form şablonu oluşturuldu:', response);
    }
    
    // Başarıyla kaydetme ve yönlendirme
    navigate('/optik-formlarim', {  
      state: { 
        message: isEditMode 
          ? 'Optik form şablonu başarıyla güncellendi.' 
          : 'Optik form şablonu başarıyla kaydedildi.' 
      } 
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
  
  // Yükleniyor durumunu göster
  if (loading) {
    return (
      <div className="optik-olusturma-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Form yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="optik-olusturma-page">
      <div className="page-header">
        <div className="header-title">
          <h1>{isEditMode ? 'Optik Form Düzenle' : 'Optik Form Oluştur'}</h1>
          <div className="form-header-inputs">
            <input
              type="text"
              value={formTitle}
              onChange={handleTitleChange}
              className="form-title-input"
              placeholder="Form Başlığı"
            />
          </div>
        </div>
        <div className="header-actions">
          <Button
            variant="primary"
            onClick={openPreview}
            disabled={saving}
          >
            {saving ? 'Kaydediliyor...' : isEditMode ? 'Önizle ve Güncelle' : 'Önizle ve Kaydet'}
          </Button>
          <Link to={isEditMode ? `/optik/${editId}` : "/"}>
            <Button variant="outline">{isEditMode ? 'Detaya Dön' : 'Dashboard\'a Dön'}</Button>
          </Link>
        </div>
      </div>
      
      {error && <div className="error-alert">{error}</div>}
      
      <div className="optik-creator-container">
        {/* Sol kenar çubuğu - Sadece form elemanları */}
        <div className="sidebar-container">
          <LeftSidebar />
        </div>
        
        {/* Orta kısım - A4 kağıdı */}
        <div className="a4-container-wrapper">
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <A4Container />
          </div>
        </div>
        
        {/* Yeni sağ kenar çubuğu - Bilgi kısmı */}
        <div className="right-sidebar-container">
          <RightSidebar />
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