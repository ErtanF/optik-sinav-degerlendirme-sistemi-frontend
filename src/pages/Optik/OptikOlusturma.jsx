import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './OptikOlusturma.css';
import Button from '../../components/ui/Button/Button';
import LeftSidebar from './components/LeftSidebar';
import A4Container from './components/A4Container';
import PreviewModal from './components/PreviewModal';
import { FormEditorProvider, useFormEditor } from './context/FormEditorContext';
import optikApi from '../../api/optik';

// FormEditor Context'ine erişmek için wrapper bileşen
const OptikOlusturmaContent = () => {
  const navigate = useNavigate();
  const { pageElements } = useFormEditor();
  const [formTitle, setFormTitle] = useState('Yeni Optik Form');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Önizleme için state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const handleTitleChange = (e) => {
    setFormTitle(e.target.value);
  };
  
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Form verilerini hazırla
      const formData = {
        title: formTitle,
        elements: pageElements
      };
      
      // API ile kaydet
      await optikApi.createForm(formData);
      
      // Başarıyla kaydedildi, dashboard'a yönlendir
      navigate('/dashboard', { 
        state: { message: 'Form başarıyla kaydedildi.' } 
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Form kaydedilirken bir hata oluştu.');
      console.error('Form kaydedilirken hata:', error);
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