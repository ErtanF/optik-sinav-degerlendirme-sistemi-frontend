// src/pages/Optik/OptikOlusturma.jsx - Güncelleme
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './OptikOlusturma.css';
import Button from '../../components/ui/Button/Button';
import LeftSidebar from './components/LeftSidebar';
import A4Container from './components/A4Container';
import { FormEditorProvider, useFormEditor } from './context/FormEditorContext';
import optikApi from '../../api/optik';

// FormEditor Context'ine erişmek için wrapper bileşen
const OptikOlusturmaContent = () => {
  const navigate = useNavigate();
  const { pageElements } = useFormEditor();
  const [formTitle, setFormTitle] = useState('Yeni Optik Form');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
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