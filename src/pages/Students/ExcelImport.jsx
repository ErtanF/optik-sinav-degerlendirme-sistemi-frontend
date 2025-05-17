import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import studentApi from '../../api/students';
import schoolApi from '../../api/schools';
import classApi from '../../api/classes';
import { useAuth } from '../../hooks/useAuth';
import './ExcelImport.css';

// Öğrenci Excel formatı için gerekli alanlar
const REQUIRED_FIELDS = ['Ad', 'Soyad', 'Öğrenci Numarası'];
const OPTIONAL_FIELDS = ['TC Kimlik No'];

const ExcelImport = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [importing, setImporting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Bu sayfaya erişmek için giriş yapmanız gerekmektedir');
      navigate('/login');
      return;
    }
    
    fetchSchools();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (selectedSchool) {
      fetchClassesBySchool(selectedSchool);
    } else {
      setClasses([]);
      setSelectedClass('');
    }
  }, [selectedSchool]);

  const fetchSchools = async () => {
    try {
      const response = await schoolApi.getAllSchools();
      setSchools(response.data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast.error('Okullar yüklenirken bir hata oluştu');
    }
  };

  const fetchClassesBySchool = async (schoolId) => {
    try {
      const response = await classApi.getClassesBySchool(schoolId);
      setClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Sınıflar yüklenirken bir hata oluştu');
    }
  };

  const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Excel'i JSON'a dönüştür
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Başlık satırı
          const headers = jsonData[0];
          
          // Başlık satırını doğrula
          const missingFields = REQUIRED_FIELDS.filter(field => !headers.includes(field));
          if (missingFields.length > 0) {
            reject(`Eksik sütunlar: ${missingFields.join(', ')}`);
            return;
          }
          
          // Verileri işle
          const students = [];
          const errors = [];
          
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row.length === 0 || !row.some(cell => cell)) {
              // Boş satırı atla
              continue;
            }
            
            const studentData = {};
            let hasError = false;
            
            // Gerekli alanları kontrol et
            REQUIRED_FIELDS.forEach((field) => {
              const value = row[headers.indexOf(field)];
              if (!value) {
                errors.push(`Satır ${i}: ${field} alanı boş olamaz`);
                hasError = true;
                return;
              }
              
              // Field adını API alanlarına dönüştür
              if (field === 'Ad') studentData.firstName = value;
              else if (field === 'Soyad') studentData.lastName = value;
              else if (field === 'Öğrenci Numarası') studentData.studentNumber = String(value);
            });
            
            // Opsiyonel alanları ekle
            OPTIONAL_FIELDS.forEach(field => {
              const index = headers.indexOf(field);
              if (index !== -1) {
                const value = row[index];
                if (field === 'TC Kimlik No') studentData.nationalId = value ? String(value) : '';
              }
            });
            
            if (!hasError) {
              students.push(studentData);
            }
          }
          
          resolve({ students, errors });
        } catch (error) {
          reject(`Excel dosyası okunamadı: ${error.message}`);
        }
      };
      
      reader.onerror = () => {
        reject('Dosya okuma hatası');
      };
      
      reader.readAsBinaryString(file);
    });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Dosya uzantısını kontrol et
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(fileExtension)) {
      toast.error('Lütfen geçerli bir Excel dosyası seçin (.xlsx, .xls, .csv)');
      return;
    }
    
    setFile(selectedFile);
    setLoading(true);
    
    try {
      const { students, errors } = await parseExcelFile(selectedFile);
      
      if (errors.length > 0) {
        setValidationErrors(errors);
        toast.warning(`${errors.length} hata bulundu. Lütfen kontrol edin.`);
      }
      
      if (students.length === 0) {
        toast.error('İçe aktarılacak geçerli öğrenci verisi bulunamadı');
        setLoading(false);
        return;
      }
      
      setParsedData(students);
      setStep(2);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      toast.error(typeof error === 'string' ? error : 'Excel dosyası işlenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleImport = async () => {
    if (!selectedSchool) {
      toast.error('Lütfen bir okul seçin');
      return;
    }

    if (!selectedClass) {
      toast.error('Lütfen bir sınıf seçin');
      return;
    }

    if (parsedData.length === 0) {
      toast.error('İçe aktarılacak veri bulunamadı');
      return;
    }

    try {
      setImporting(true);
      
      // Prepare student data with selected school and class
      const studentsData = parsedData.map(student => ({
        ...student,
        schoolId: selectedSchool,
        classId: selectedClass
      }));
      
      // Call the API to add students
      await studentApi.addStudentsFromList(studentsData);
      
      toast.success(`${parsedData.length} öğrenci başarıyla içe aktarıldı`);
      navigate('/students');
    } catch (error) {
      console.error('Error importing students:', error);
      toast.error('Öğrenciler içe aktarılırken bir hata oluştu');
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleTemplate = () => {
    // Excel şablonu oluştur
    const worksheet = XLSX.utils.json_to_sheet([]);
    
    // Başlık satırını ekle
    XLSX.utils.sheet_add_aoa(worksheet, [
      ['Ad', 'Soyad', 'Öğrenci Numarası', 'TC Kimlik No']
    ], { origin: 'A1' });
    
    // Örnek verileri ekle
    XLSX.utils.sheet_add_aoa(worksheet, [
      ['Ahmet', 'Yılmaz', '1001', '12345678901'],
      ['Ayşe', 'Kaya', '1002', '12345678902'],
      ['Mehmet', 'Demir', '1003', '12345678903']
    ], { origin: 'A2' });
    
    // Workbook oluştur
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Öğrenciler');
    
    // Dosyayı indir
    XLSX.writeFile(workbook, 'ogrenci_sablon.xlsx');
  };

  return (
    <div className="excel-import-page">
      <div className="excel-import-header">
        <h1>Excel'den Öğrenci İçe Aktar</h1>
      </div>
      
      <div className="excel-import-container">
        <div className="import-steps">
          <div className={`step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-text">Excel Dosyası</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-text">Sınıf Seçimi</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-text">Önizleme ve İçe Aktarma</div>
          </div>
        </div>
        
        {step === 1 && (
          <div className="import-step-content">
            <div className="file-upload-container">
              <div className="file-upload-info">
                <h3>Excel Dosyası Yükle</h3>
                <p>
                  Lütfen öğrenci verilerini içeren bir Excel dosyası seçin.
                  Dosya, en az şu alanları içermelidir: Ad, Soyad, Öğrenci Numarası.
                  İsteğe bağlı olarak TC Kimlik No eklenebilir.
                </p>
                <button className="button secondary" onClick={downloadSampleTemplate}>
                  <i className="icon-download"></i> Örnek Şablon İndir
                </button>
              </div>
              
              <div className="file-upload">
                <label htmlFor="excel-file" className="file-upload-label">
                  <div className="file-upload-icon">
                    <i className="icon-upload"></i>
                  </div>
                  <div className="file-upload-text">
                    <span>Excel Dosyası Seçin</span>
                    <span className="file-upload-subtext">veya sürükleyip bırakın</span>
                  </div>
                  {file && <div className="file-name">{file.name}</div>}
                </label>
                <input
                  type="file"
                  id="excel-file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="file-input"
                />
              </div>
              
              {validationErrors.length > 0 && (
                <div className="validation-errors">
                  <h4>Hata Listesi:</h4>
                  <ul>
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="import-step-content">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Excel dosyası işleniyor...</p>
              </div>
            ) : (
              <div className="school-class-selection">
                <h3>Okul ve Sınıf Seçin</h3>
                <p>İçe aktarılacak öğrencilerin ekleneceği okulu ve sınıfı seçin:</p>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="schoolId">Okul</label>
                    <select
                      id="schoolId"
                      value={selectedSchool}
                      onChange={handleSchoolChange}
                      required
                    >
                      <option value="">Okul Seçin</option>
                      {schools.map(school => (
                        <option key={school._id} value={school._id}>{school.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="classId">Sınıf</label>
                    <select
                      id="classId"
                      value={selectedClass}
                      onChange={handleClassChange}
                      disabled={!selectedSchool}
                      required
                    >
                      <option value="">Sınıf Seçin</option>
                      {classes.map(classItem => (
                        <option key={classItem._id} value={classItem._id}>{classItem.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setStep(1)}
                  >
                    Geri
                  </button>
                  <button
                    type="button"
                    className="button primary"
                    onClick={() => setStep(3)}
                    disabled={!selectedSchool || !selectedClass}
                  >
                    Devam
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {step === 3 && (
          <div className="import-step-content">
            <div className="preview-import">
              <h3>Önizleme ve İçe Aktarma</h3>
              <p>İçe aktarılacak {parsedData.length} öğrenci bulundu. Lütfen verileri kontrol edin:</p>
              
              <div className="data-preview">
                <table className="preview-table">
                  <thead>
                    <tr>
                      <th>Ad</th>
                      <th>Soyad</th>
                      <th>Öğrenci No</th>
                      <th>TC Kimlik No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.map((student, index) => (
                      <tr key={index}>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        <td>{student.studentNumber}</td>
                        <td>{student.nationalId || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setStep(2)}
                  disabled={importing}
                >
                  Geri
                </button>
                <button
                  type="button"
                  className="button primary"
                  onClick={handleImport}
                  disabled={importing}
                >
                  {importing ? 'İçe Aktarılıyor...' : 'İçe Aktar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelImport; 