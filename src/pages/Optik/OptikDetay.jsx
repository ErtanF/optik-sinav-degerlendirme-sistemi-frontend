// src/pages/Optik/OptikDetay.jsx - Sınıf bilgilerini göstermek için düzenleme ve loglama eklendi
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './OptikDetay.css';
import Button from '../../components/ui/Button/Button';
import optikApi from '../../api/optik';
import classApi from '../../api/classes'; // Sınıf bilgilerini almak için

const OptikDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Seçili sınıfları tutmak için state
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(false);
  
  // Backend URL'ini al - API URL'inden "/api" kısmını çıkararak
  const getBaseUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5500/api';
    return apiUrl.replace('/api', '');
  };

  // Form detaylarını ve sınıfları getir
  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await optikApi.getFormById(id);
        
        // Form verilerini detaylı bir şekilde logla
        console.log('API yanıtı:', response);
        console.log('Form detayları:', response.data);
        
        // Özellikle assignedClasses alanını kontrol et ve logla
        if (response.data.assignedClasses) {
          console.log('Atanan sınıflar bulundu:', response.data.assignedClasses);
          console.log('Atanan sınıf sayısı:', response.data.assignedClasses.length);
          console.log('Atanan sınıf türü:', typeof response.data.assignedClasses);
          
          // Array olup olmadığını kontrol et
          if (Array.isArray(response.data.assignedClasses)) {
            console.log('assignedClasses bir dizi');
          } else {
            console.warn('assignedClasses bir dizi değil!');
            console.log('assignedClasses içeriği:', JSON.stringify(response.data.assignedClasses));
          }
        } else {
          console.warn('Atanan sınıflar bulunamadı!');
          console.log('Tüm form verisi:', JSON.stringify(response.data));
        }
        
        setForm(response.data);
        
        // Eğer form'da assignedClasses varsa, sınıf detaylarını getir
        if (response.data.assignedClasses && response.data.assignedClasses.length > 0) {
          console.log('Sınıf detayları getiriliyor...');
          fetchAssignedClasses(response.data.assignedClasses);
        } else {
          console.log('Atanmış sınıf olmadığı için sınıf detayları getirilmiyor');
        }
      } catch (error) {
        console.error('Form detayları yüklenirken hata:', error);
        setError('Form detayları yüklenirken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      console.log('Form detayları yükleniyor, ID:', id);
      fetchFormDetails();
    }
  }, [id]);
  
  // Atanmış sınıfların detaylarını getir
  const fetchAssignedClasses = async (classIds) => {
    try {
      console.log('Sınıf detayları için API çağrısı yapılıyor, Class IDs:', classIds);
      setClassesLoading(true);
      const response = await classApi.getClassesBySchool();
      console.log('Tüm sınıflar API yanıtı:', response);
      const allClasses = response.data || [];
      console.log('Okuldaki tüm sınıflar:', allClasses);
      
      // Sadece atanmış sınıfları filtrele
      const selectedClasses = allClasses.filter(cls => {
        const isIncluded = classIds.includes(cls._id);
        console.log(`Sınıf ${cls._id} (${cls.name}) kontrolü: ${isIncluded ? 'Eşleşti' : 'Eşleşmedi'}`);
        return isIncluded;
      });
      
      console.log('Filtreleme sonrası bulunan sınıflar:', selectedClasses);
      setAssignedClasses(selectedClasses);
    } catch (error) {
      console.error('Atanmış sınıflar yüklenirken hata:', error);
    } finally {
      setClassesLoading(false);
    }
  };

  const handlePrint = () => {
    // Mevcut yazdırma fonksiyonu
  };

  const handleDelete = async () => {
    // Mevcut silme fonksiyonu
  };

  if (loading) {
    return (
      <div className="optik-detay-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="optik-detay-page">
        <div className="error-container">
          <h2>Hata</h2>
          <p>{error}</p>
          <Link to="/optik-formlarim">
            <Button variant="primary">Formlara Geri Dön</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="optik-detay-page">
        <div className="error-container">
          <h2>Form Bulunamadı</h2>
          <p>İstediğiniz form bulunamadı veya silinmiş olabilir.</p>
          <Link to="/optik-formlarim">
            <Button variant="primary">Formlara Geri Dön</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Render öncesi form içeriğini logla
  console.log('Render edilecek form verisi:', form);
  console.log('Atanan sınıflar (render öncesi):', form.assignedClasses);
  console.log('Bulunan sınıf detayları:', assignedClasses);

  // Backend'in temel URL'ini oluştur
  const baseUrl = getBaseUrl();

  return (
    <div className="optik-detay-page">
      <div className="page-header">
        <div className="header-title">
          <h1>{form.title}</h1>
          <p className="form-meta">
            <span>Oluşturulma: {new Date(form.createdAt).toLocaleDateString('tr-TR')}</span>
            {form.school && <span> | Okul: {form.school.name}</span>}
          </p>
        </div>
        <div className="header-actions">
          <Button variant="primary" onClick={handlePrint}>Yazdır</Button>
          <Link to={`/optik-duzenle/${id}`}>
            <Button variant="outline">Düzenle</Button>
          </Link>
          <Button variant="secondary" onClick={handleDelete}>Sil</Button>
          <Link to="/optik-formlarim">
            <Button variant="outline">Geri Dön</Button>
          </Link>
        </div>
      </div>

      <div className="form-container">
        <div className="form-preview">
          {form.opticalFormImage ? (
            <img 
              src={`${baseUrl}${form.opticalFormImage}`}
              alt={form.title} 
              className="form-image"
            />
          ) : (
            <div className="no-image">Form görseli bulunamadı</div>
          )}
        </div>

        <div className="form-details">
          <div className="details-section">
            <h3>Form Bilgileri</h3>
            <table className="details-table">
              <tbody>
                <tr>
                  <td>Form Adı:</td>
                  <td>{form.title}</td>
                </tr>
                <tr>
                  <td>Oluşturulma Tarihi:</td>
                  <td>{new Date(form.createdAt).toLocaleString('tr-TR')}</td>
                </tr>
                {form.school && (
                  <tr>
                    <td>Okul:</td>
                    <td>{form.school.name}</td>
                  </tr>
                )}
                {form.date && (
                  <tr>
                    <td>Sınav Tarihi:</td>
                    <td>{new Date(form.date).toLocaleDateString('tr-TR')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Atanmış Sınıflar Bölümü - Her durumda gösterecek şekilde değiştirildi */}
          <div className="details-section">
            <h3>Atanan Sınıflar</h3>
            {classesLoading ? (
              <div className="loading-text">Sınıflar yükleniyor...</div>
            ) : form && form.assignedClasses && form.assignedClasses.length > 0 ? (
              <>
                <div className="assigned-classes-list">
                  {assignedClasses.length > 0 ? (
                    assignedClasses.map(cls => (
                      <div key={cls._id} className="assigned-class-item">
                        {cls.name}
                      </div>
                    ))
                  ) : (
                    <p>Sınıf bilgileri yüklenemedi. Sınıf ID'leri: {form.assignedClasses.join(', ')}</p>
                  )}
                </div>
              </>
            ) : (
              <p>Bu form için atanmış sınıf bulunamadı.</p>
            )}
          </div>

          <div className="details-section">
            <h3>Form Bileşenleri</h3>
            <div className="components-list">
              {form.components && form.components.length > 0 ? (
                <p>{form.components.length} adet bileşen içeriyor</p>
              ) : (
                <p>Bileşen bilgisi bulunamadı</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptikDetay;