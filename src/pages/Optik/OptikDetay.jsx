// src/pages/Optik/OptikDetay.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './OptikDetay.css';
import Button from '../../components/ui/Button/Button';
import optikApi from '../../api/optik';

const OptikDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Backend URL'ini al - API URL'inden "/api" kısmını çıkararak
  const getBaseUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5500/api';
    return apiUrl.replace('/api', '');
  };

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await optikApi.getFormById(id);
        console.log('Form verisi:', response.data); // Veriyi kontrol etmek için
        setForm(response.data);
      } catch (error) {
        console.error('Form detayları yüklenirken hata:', error);
        setError('Form detayları yüklenirken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFormDetails();
    }
  }, [id]);

  const handlePrint = () => {
    if (!form) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Lütfen popup engelleyiciyi devre dışı bırakın.');
      return;
    }
    
    const baseUrl = getBaseUrl();
    const formImageUrl = `${baseUrl}${form.opticalFormImage}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${form.title}</title>
        <style>
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; }
          .container { width: 100%; max-width: 800px; margin: 0 auto; padding: 20px; }
          .form-image { width: 100%; height: auto; aspect-ratio: 210/297; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${form.title}</h1>
          <img src="${formImageUrl}" alt="${form.title}" class="form-image" />
        </div>
        <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 500); };</script>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleDelete = async () => {
    if (!form) return;
    
    if (window.confirm(`"${form.title}" formunu silmek istediğinizden emin misiniz?`)) {
      try {
        await optikApi.deleteForm(id);
        navigate('/optik-formlarim', { state: { message: 'Form başarıyla silindi.' } });
      } catch (error) {
        console.error('Form silinirken hata:', error);
        setError('Form silinirken bir sorun oluştu.');
      }
    }
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