import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import classApi from '../../api/classes';
import schoolApi from '../../api/schools';
import './ClassExcelImport.css';

// Sample data Excel format
const SAMPLE_DATA = [
  { 
    name: '9-A', 
    grade: 9, 
    school: 'school-id'
  },
  { 
    name: '9-B', 
    grade: 9, 
    school: 'school-id'
  }
];

const ClassExcelImport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await schoolApi.getAllSchools();
      setSchools(response.data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast.error('Okullar yüklenirken bir hata oluştu');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // In a real application, you would parse the Excel file here
      // For this example, we'll simulate parsing after a delay
      setLoading(true);
      setTimeout(() => {
        // This is a simplified example - in a real application, you would parse the Excel file
        // and extract the class data
        const mockParsedData = [
          { name: '9-A', grade: 9 },
          { name: '9-B', grade: 9 },
          { name: '10-A', grade: 10 },
        ];
        
        setParsedData(mockParsedData);
        setLoading(false);
        setStep(2);
      }, 1000);
    }
  };

  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
  };

  const handleImport = async () => {
    if (!selectedSchool) {
      toast.error('Lütfen bir okul seçin');
      return;
    }

    if (parsedData.length === 0) {
      toast.error('İçe aktarılacak veri bulunamadı');
      return;
    }

    try {
      setImporting(true);
      
      // Prepare class data with selected school
      const classesData = parsedData.map(classItem => ({
        ...classItem,
        school: selectedSchool
      }));
      
      // Call the API to add classes
      // In a real application, you would make a bulk API call
      // For this example, we'll make individual calls
      for (const classData of classesData) {
        try {
          await classApi.addClass(classData);
        } catch (error) {
          // Skip duplicates or log specific errors
          console.error(`Error adding class ${classData.name}:`, error);
        }
      }
      
      toast.success(`${parsedData.length} sınıf içe aktarma işlemi tamamlandı`);
      navigate('/classes');
    } catch (error) {
      console.error('Error importing classes:', error);
      toast.error('Sınıflar içe aktarılırken bir hata oluştu');
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleTemplate = () => {
    // In a real application, you would generate an Excel file
    // For this example, we'll convert the sample data to JSON and offer it as a download
    const jsonString = JSON.stringify(SAMPLE_DATA, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sinif_sablon.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="class-excel-import-page">
      <div className="class-excel-import-header">
        <h1>Excel'den Sınıf İçe Aktar</h1>
      </div>
      
      <div className="class-excel-import-container">
        <div className="import-steps">
          <div className={`step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-text">Excel Dosyası</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-text">Okul Seçimi</div>
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
                  Lütfen sınıf verilerini içeren bir Excel dosyası seçin.
                  Dosya, aşağıdaki alanları içermelidir: Sınıf Adı, Sınıf Seviyesi.
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
              <div className="school-selection">
                <h3>Okul Seçin</h3>
                <p>İçe aktarılacak sınıfların ekleneceği okulu seçin:</p>
                
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
                    disabled={!selectedSchool}
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
              <p>İçe aktarılacak {parsedData.length} sınıf bulundu. Lütfen verileri kontrol edin:</p>
              
              <div className="data-preview">
                <table className="preview-table">
                  <thead>
                    <tr>
                      <th>Sınıf Adı</th>
                      <th>Sınıf Seviyesi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.map((classItem, index) => (
                      <tr key={index}>
                        <td>{classItem.name}</td>
                        <td>{classItem.grade}. Sınıf</td>
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

export default ClassExcelImport; 