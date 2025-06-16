import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import examApi from '../../api/exam';
import optikApi from '../../api/optik';
import classApi from '../../api/classes'; // Sınıf API'sini ekledik
import { jsPDF } from 'jspdf';
import './SinavDetay.css';

const SinavDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [automaticCoding, setAutomaticCoding] = useState(true);
  const [classDetails, setClassDetails] = useState({}); // Sınıf detaylarını tutacak state ekledik
  
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
  
  // Sınav yüklendikten sonra, atanan sınıflar için detayları getir
  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!exam || !exam.assignedClasses || exam.assignedClasses.length === 0) return;
      
      try {
        // Sınıf bilgilerini getir
        const response = await classApi.getClassesBySchool();
        const allClasses = response.data || [];
        
        // Sınıf ID'leri ve bilgileri için bir nesne oluştur
        const classMap = {};
        allClasses.forEach(cls => {
          classMap[cls._id] = cls;
        });
        
        setClassDetails(classMap);
      } catch (error) {
        console.error('Sınıf bilgileri yüklenirken hata:', error);
      }
    };

    if (exam) {
      fetchClassDetails();
    }
  }, [exam]);
  
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
  
  // Numaraları optik formda işaretle
  const markStudentNumberOnTemplate = (doc, studentNumber, template, baseY) => {
    // Öğrenci numarası alanını template.components içinde bul
    const numberComponent = template.components.find(comp => comp.type === 'number');
    if (!numberComponent || !studentNumber) return;
    
    // Numarayı string'e çevir ve belirli bir uzunluğa tamamla
    const studentNumberStr = String(studentNumber).padStart(numberComponent.cols, '0');
    
    // Numaranın her bir rakamı için
    for (let i = 0; i < studentNumberStr.length && i < numberComponent.cols; i++) {
      const digit = parseInt(studentNumberStr[i], 10);
      
      if (isNaN(digit)) continue;
      
      // Konum hesapla (optik forma göre)
      // Başlangıç pozisyonuna 43 piksel aşağı ve 7 piksel sağa kaydırma uygula
      const bubbleX = numberComponent.position.x + (i * 17) + 7; // 17px grid genişliği + 7px sağa kayma
      const bubbleY = numberComponent.position.y + (digit * 17) + 43; // 17px grid yüksekliği + 43px aşağı kayma
      
      // PDF'de mm cinsinden konumu hesapla (A4: 210x297 mm)
      const pdfX = bubbleX * 0.264583;
      const pdfY = bubbleY * 0.264583;
      
      // Daireleri doldur
      doc.setFillColor(0, 0, 0);
      doc.circle(pdfX, pdfY, 1.7, 'F'); // 1.7mm yarıçaplı dolu daire
    }
  };
  
  // Ad-Soyad alanı varsa kodla
  const markStudentNameOnTemplate = (doc, studentName, template, baseY) => {
    // Ad Soyad alanını template.components içinde bul
    const nameComponent = template.components.find(comp => comp.type === 'nameSurname');
    if (!nameComponent || !studentName) return;
    
    // Adı büyük harfe çevir
    const upperName = studentName.toUpperCase().replace(/[^A-ZĞÜŞİÖÇ ]/g, '');
    
    // İsmin her bir harfi için
    for (let i = 0; i < upperName.length && i < nameComponent.cols; i++) {
      const char = upperName[i];
      if (char === ' ') continue;
      
      // Alfabedeki indeksi bul
      const alphabet = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
      const charIndex = alphabet.indexOf(char);
      
      if (charIndex === -1) continue;
      
      // Konum hesapla
      // Başlangıç pozisyonuna 68 piksel aşağı ve 5 piksel sağa kaydırma uygula
      const bubbleX = nameComponent.position.x + (i * 17) + 7; // 17px grid genişliği + 7px sağa kayma
      const bubbleY = nameComponent.position.y + (charIndex * 17) + 43; // 17px grid yüksekliği + 43px aşağı kayma
      
      // PDF'de mm cinsinden konumu hesapla
      const pdfX = bubbleX * 0.264583;
      const pdfY = bubbleY * 0.264583;
      
      // Daireleri doldur
      doc.setFillColor(0, 0, 0);
      doc.circle(pdfX, pdfY, 1.7, 'F'); // 1.7mm yarıçaplı dolu daire
    }
  };
  
  // PDF oluştur ve indir
  const handleDownloadPDF = async () => {
    if (!exam || !exam.opticalTemplate) {
      setError('Optik form şablonu bulunamadı.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Şablon detaylarını al
      const templateResponse = await optikApi.getFormById(exam.opticalTemplate._id);
      const template = templateResponse.data;
      
      // Otomatik kodlama seçeneğini sor
      const userAutomaticCoding = window.confirm('Öğrenci bilgilerini optik formlar üzerinde otomatik olarak işaretlemek ister misiniz? "Tamam" seçeneği öğrencilere özel kodlanmış formlar, "İptal" seçeneği tek bir boş form oluşturacaktır.');
      setAutomaticCoding(userAutomaticCoding);
      
      // Şablon görüntü URL'si
      const baseUrl = getBaseUrl();
      const templateImageUrl = `${baseUrl}${exam.opticalTemplate.opticalFormImage}`;
      
      // Görüntüyü yükle
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      img.onload = async () => {
        // A4 boyutunda bir PDF oluştur (210mm x 297mm)
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        // Otomatik kodlama seçili ise öğrenci sayısı kadar sayfa oluştur
        if (userAutomaticCoding) {
          // Öğrenci listesini kontrol et
          if (!exam.studentIds || exam.studentIds.length === 0) {
            setError('Bu sınav için atanmış öğrenci bulunamadı.');
            setLoading(false);
            return;
          }
          
          // Her öğrenci için bir sayfa oluştur
          for (let i = 0; i < exam.studentIds.length; i++) {
            const student = exam.studentIds[i];
            
            if (i > 0) {
              pdf.addPage();
            }
            
            // Şablon görüntüsünü ekle
            pdf.addImage(img, 'JPEG', 0, 0, 210, 297);
            
            // Öğrenci numarasını kodla
            markStudentNumberOnTemplate(pdf, student.studentNumber, template, 0);
            
            // Ad-Soyadı kodla
            markStudentNameOnTemplate(pdf, `${student.firstName} ${student.lastName}`, template, 0);
          }
        } else {
          // Otomatik kodlama seçili değilse tek bir boş optik form oluştur
          pdf.addImage(img, 'JPEG', 0, 0, 210, 297);
        }
        
        // PDF'i indir
        pdf.save(`${exam.title || 'Sınav'}_Optik_Form${userAutomaticCoding ? 'lar' : ''}.pdf`);
        setLoading(false);
      };
      
      img.onerror = () => {
        setError('Şablon görüntüsü yüklenirken hata oluştu.');
        setLoading(false);
      };
      
      img.src = templateImageUrl;
      
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      setError('PDF oluşturulurken bir hata oluştu: ' + error.message);
      setLoading(false);
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
          <Button variant="success" onClick={handleDownloadPDF}>Optik Formları İndir</Button>
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

          {/* Atanmış Sınıflar Bölümü - Akıllı Gösterim */}
          <div className="details-section">
            <h3>Atanan Sınıflar</h3>
            {exam.assignedClasses && exam.assignedClasses.length > 0 ? (
              <div className="assigned-classes-list">
                {exam.assignedClasses.map(cls => {
                  // cls bir obje veya string ID olabilir
                  const classId = typeof cls === 'object' ? cls._id : cls;
                  const className = typeof cls === 'object' && cls.name 
                    ? cls.name 
                    : classDetails[classId] 
                      ? classDetails[classId].name 
                      : `Sınıf #${classId ? classId.substring(0, 6) + '...' : 'Bilinmiyor'}`;
                  
                  return (
                    <div key={classId || Math.random().toString()} className="assigned-class-item">
                      {className}
                    </div>
                  );
                })}
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