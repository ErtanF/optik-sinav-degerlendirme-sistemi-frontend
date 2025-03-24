import React from 'react';
import { Link } from 'react-router-dom';
import './OptikOlusturma.css';
import Button from '../../components/ui/Button/Button';
import LeftSidebar from './components/LeftSidebar';
import A4Container from './components/A4Container';
import { FormEditorProvider } from './context/FormEditorContext';

const OptikOlusturma = () => {
  return (
    <div className="optik-olusturma-page">
      <div className="page-header">
        <h1>Optik Form Oluştur</h1>
        <div className="header-actions">
          <Button variant="primary">Kaydet</Button>
          <Link to="/dashboard"><Button variant="outline">Dashboard'a Dön</Button></Link>
        </div>
      </div>
      
      <FormEditorProvider>
        <div className="optik-creator-container">
          {/* Sol taraf - Öğrenci seçimi ve form elemanları */}
          <LeftSidebar />
          
          {/* Sağ taraf - A4 kağıdı */}
          <A4Container />
        </div>
      </FormEditorProvider>
    </div>
  );
};

export default OptikOlusturma;