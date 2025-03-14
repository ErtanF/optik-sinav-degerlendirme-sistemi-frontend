import './OptikOlusturma.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import LeftSidebar from './components/LeftSidebar';
import A4Container from './components/A4Container';
import { formElementsData } from './utils/formElements';

const OptikOlusturma = () => {
  // Form elemanları için state
  const [pageElements, setPageElements] = useState([]);
  // Seçilen öğrenci için state
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Sidebar'dan sürükleme başlatma
  const handleDragStart = (e, element) => {
    e.dataTransfer.setData('application/json', JSON.stringify(element));
    
    // Görünmez sürükleme resmi
    const emptyImg = new Image();
    emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(emptyImg, 0, 0);
  };
  
  // Öğrenci seçildiğinde
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    
    // Ad Soyad alanlarını güncelle
    updateStudentFields(student);
  };
  
  // Öğrenci bilgilerini ilgili alanlara yaz
  const updateStudentFields = (student) => {
    // Mevcut form elemanlarını kontrol et
    const updatedElements = pageElements.map(element => {
      // Eğer bu eleman bir Ad Soyad alanı ise
      if (element.type === 'field' && element.id === 'nameSurname') {
        return {
          ...element,
          content: student.name
        };
      } 
      // Eğer bu eleman bir Okul Numarası alanı ise
      else if (element.type === 'field' && element.id === 'schoolNumber') {
        return {
          ...element,
          content: student.number
        };
      }
      // Eğer bu eleman bir Sınıf Bilgisi alanı ise  
      else if (element.type === 'field' && element.id === 'classInfo') {
        return {
          ...element,
          content: student.class
        };
      }
      
      // Diğer elemanları olduğu gibi bırak
      return element;
    });
    
    setPageElements(updatedElements);
  };
  
  return (
    <div className="optik-olusturma-page">
      <div className="page-header">
        <h1>Optik Form Oluştur</h1>
        <div className="header-actions">
          <Button variant="primary">Kaydet</Button>
          <Link to="/dashboard"><Button variant="outline">Dashboard'a Dön</Button></Link>
        </div>
      </div>
      
      <div className="optik-creator-container">
        {/* Sol taraf - Öğrenci seçimi ve form elemanları */}
        <LeftSidebar 
          formElements={formElementsData}
          onDragStart={handleDragStart}
          onStudentSelect={handleStudentSelect}
        />
        
        {/* Sağ taraf - A4 kağıdı */}
        <A4Container 
          pageElements={pageElements} 
          setPageElements={setPageElements}
        />
      </div>
    </div>
  );
};

export default OptikOlusturma;