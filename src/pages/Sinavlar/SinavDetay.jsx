import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import examApi from '../../api/exam';
import './SinavDetay.css';

const SinavDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Backend URL'ini al
  const getBaseUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5500/api';
    return apiUrl.replace('/api', '');
  };

  // Sınav detaylarını getir
  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await examApi.getExamById(id);
        
        if (!response || !response.data) {
          throw new Error("Sınav detayları alınamadı");
        }
        
        setExam(response.data);
        console.log("Sınav detayları:", response.data);
        
      } catch (error) {
        console.error('Sınav detayları yüklenirken hata:', error);
        setError('Sınav detayları yüklenirken bir sorun oluştu: ' + (error.message || 'Bilinmeyen hata'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExamDetails();
    }
  }, [id]);
  
  // Sınavı sil
  const handleDelete = async () => {
    if (!exam) return;
    
    // Silme işlemi için kullanıcıdan onay al
    const isConfirmed = window.confirm(`"${exam.title}" adlı sınavı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`);
    
    if (!isConfirmed) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await examApi.deleteExam(exam._id);
      
      // Başarılı mesajı göster ve listeye yönlendir
      navigate('/sinavlar', { 
        state: { 
          message: `"${exam.title}" adlı sınav başarıyla silindi.`,
          success: true
        } 
      });
      
    } catch (error) {
      console.error('Sınav silinirken hata:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Sınav silinirken bir hata oluştu.';
      setError(errorMessage);
      setLoading(false);
      
      window.scrollTo(0, 0); // Hata mesajının görünmesi için sayfanın üstüne kaydır
    }
  };
  
  // Sınavı yazdır
  const handlePrint = () => {
    if (!exam) return;
    
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Lütfen popup engelleyiciyi devre dışı bırakın.');
        return;
      }
      
      const baseUrl = getBaseUrl();
      const formImageUrl = exam.opticalTemplate?.opticalFormImage 
        ? `${baseUrl}${exam.opticalTemplate.opticalFormImage}`
        : '';
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${exam.title}</title>
          <style>
            @page { 
              size: A4 portrait; 
              margin: 0; 
            }
            body { 
              margin: 0; 
              padding: 0; 
              display: flex;
              flex-direction: column;
              align-items: center;
              background-color: white;
              font-family: Arial, sans-serif;
            }
            .exam-header {
              width: 90%;
              max-width: 800px;
              margin: 20px auto;
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 1px solid #eee;
            }
            .exam-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .exam-date {
              font-size: 16px;
              color: #666;
              margin-bottom: 10px;
            }
            .exam-school {
              font-size: 16px;
              color: #666;
            }
            .form-container {
              width: 210mm;
              height: 297mm;
              overflow: hidden;
              position: relative;
              background-color: white;
              margin: 0 auto;
            }
            .form-image { 
              width: 100%;
              height: 100%;
              object-fit: contain;
              display: block;
            }
            @media print {
              .no-print { 
                display: none; 
              }
              html, body {
                width: 210mm;
                height: 297mm;
              }
              .exam-header {
                margin: 10px auto;
                padding-bottom: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="position: fixed; top: 10px; right: 10px; z-index: 9999;">
            <button onclick="window.print()" style="padding: 8px 16px; background: #0056b3; color: white; border: none; border-radius: 4px; cursor: pointer;">Yazdır</button>
            <button onclick="window.close()" style="padding: 8px 16px; margin-left: 10px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Kapat</button>
          </div>
          
          <div class="exam-header">
            <div class="exam-title">${exam.title}</div>
            <div class="exam-date">Tarih: ${new Date(exam.date).toLocaleDateString('tr-TR')}</div>
            ${exam.school ? `<div class="exam-school">Okul: ${exam.school.name}</div>` : ''}
          </div>
          
          <div class="form-container">
            <img src="${formImageUrl}" alt="${exam.title}" class="form-image" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100%\\' height=\\'100%\\' viewBox=\\'0 0 24 24\\'><text x=\\'50%\\' y=\\'50%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-size=\\'14\\'>Optik form görüntüsü yok</text></svg>'; this.style.padding='20px'; this.style.border='1px dashed #ccc';" />
          </div>
          
          <script>
            // Resim başarıyla yüklendiğinde otomatik yazdırma işlemi başlat
            document.querySelector('.form-image').onload = function() {
              // Yazdırma işlemi için kısa bir gecikme ekle
              setTimeout(() => {
                window.print();
              }, 300);
            };
          </script>
        </body>
        </html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (error) {
      console.error('Yazdırma işlemi sırasında hata:', error);
      alert('Yazdırma işlemi sırasında bir hata oluştu: ' + error.message);
    }
  };
  
  // Tarih formatla
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };
  
  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="sinav-detay-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="sinav-detay-page">
        <div className="error-container">
          <h2>Hata</h2>
          <p>{error}</p>
          <Link to="/sinavlar">
            <Button variant="primary">Sınavlara Geri Dön</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Sınav bulunamadı durumu
  if (!exam) {
    return (
      <div className="sinav-detay-page">
        <div className="error-container">
          <h2>Sınav Bulunamadı</h2>
          <p>İstediğiniz sınav bulunamadı veya silinmiş olabilir.</p>
          <Link to="/sinavlar">
            <Button variant="primary">Sınavlara Geri Dön</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sinav-detay-page">
      <div className="page-header">
        <div className="header-title">
          <h1>{exam.title}</h1>
          <p className="exam-meta">
            <span>Tarih: {formatDate(exam.date)}</span>
            {exam.school && <span> | Okul: {exam.school.name}</span>}
          </p>
        </div>
        <div className="header-actions">
          <Button variant="primary" onClick={handlePrint}>Yazdır</Button>
          <Link to={`/sinav-duzenle/${id}`}>
            <Button variant="outline">Düzenle</Button>
          </Link>
          <Button variant="secondary" onClick={handleDelete}>Sil</Button>
          <Link to="/sinavlar">
            <Button variant="outline">Geri Dön</Button>
          </Link>
        </div>
      </div>

      <div className="sinav-container">
        <div className="sinav-preview">
          {exam.opticalTemplate?.opticalFormImage ? (
            <img 
              src={`${getBaseUrl()}${exam.opticalTemplate.opticalFormImage}`}
              alt={exam.title} 
              className="sinav-image"
            />
          ) : (
            <div className="no-image">Optik form görseli bulunamadı</div>
          )}
        </div>

        <div className="sinav-details">
          <div className="details-section">
            <h3>Sınav Bilgileri</h3>
            <table className="details-table">
              <tbody>
                <tr>
                  <td>Sınav Adı:</td>
                  <td>{exam.title}</td>
                </tr>
                <tr>
                  <td>Sınav Tarihi:</td>
                  <td>{formatDate(exam.date)}</td>
                </tr>
                {exam.school && (
                  <tr>
                    <td>Okul:</td>
                    <td>{exam.school.name}</td>
                  </tr>
                )}
                <tr>
                  <td>Oluşturulma Tarihi:</td>
                  <td>{new Date(exam.createdAt).toLocaleString('tr-TR')}</td>
                </tr>
                <tr>
                  <td>Form Şablonu:</td>
                  <td>{exam.opticalTemplate?.name || 'Bilinmiyor'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Atanmış Sınıflar Bölümü */}
          <div className="details-section">
            <h3>Atanan Sınıflar</h3>
            {exam.assignedClasses && exam.assignedClasses.length > 0 ? (
              <div className="assigned-classes-list">
                {exam.assignedClasses.map(cls => (
                  <div key={cls._id} className="assigned-class-item">
                    {cls.name || 'Bilinmeyen Sınıf'}
                  </div>
                ))}
              </div>
            ) : (
              <p>Bu sınav için atanmış sınıf bulunamadı.</p>
            )}
          </div>

          {/* Öğrenci Listesi Bölümü */}
          <div className="details-section">
            <h3>Sınava Katılacak Öğrenciler</h3>
            {exam.studentIds && exam.studentIds.length > 0 ? (
              <div className="students-section">
                <p>{exam.studentIds.length} öğrenci</p>
                <div className="students-list-container">
                  <table className="students-table">
                    <thead>
                      <tr>
                        <th>Öğrenci No</th>
                        <th>Ad Soyad</th>
                        <th>Sınıf</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exam.studentIds.map(student => (
                        <tr key={student._id}>
                          <td>{student.studentNumber || '-'}</td>
                          <td>{student.firstName} {student.lastName}</td>
                          <td>{student.class?.name || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p>Bu sınav için atanmış öğrenci bulunamadı.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinavDetay;