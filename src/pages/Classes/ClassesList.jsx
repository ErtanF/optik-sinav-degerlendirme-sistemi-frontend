import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit, FiEye, FiTrash2, FiUpload, FiPlus } from 'react-icons/fi';
import classApi from '../../api/classes';
import schoolApi from '../../api/schools';
import './ClassesList.css';

const ClassesList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [filters, setFilters] = useState({
    schoolId: '',
    grade: '',
    searchTerm: ''
  });

  useEffect(() => {
    fetchClasses();
    fetchSchools();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classApi.getClasses();
      setClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Sınıflar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await schoolApi.getAllSchools();
      setSchools(response.data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast.error('Okullar yüklenirken bir hata oluştu');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filterClasses = () => {
    if (!classes) return [];

    return classes.filter(classItem => {
      const matchesSchool = !filters.schoolId || classItem.school._id === filters.schoolId;
      const matchesGrade = !filters.grade || classItem.grade === parseInt(filters.grade, 10);
      const matchesSearch = !filters.searchTerm || 
        classItem.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      return matchesSchool && matchesGrade && matchesSearch;
    });
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Bu sınıfı silmek istediğinizden emin misiniz? Sınıftaki öğrenciler silinmeyecek ancak sınıf ilişkileri kaldırılacaktır.')) {
      return;
    }

    try {
      await classApi.deleteClass(classId);
      setClasses(classes.filter(classItem => classItem._id !== classId));
      toast.success('Sınıf başarıyla silindi');
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Sınıf silinirken bir hata oluştu');
    }
  };

  // Sınıf seviyesi için seçenekler (1-12)
  const gradeOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  
  const filteredClasses = filterClasses();

  return (
    <div className="classes-page">
      <div className="classes-header">
        <h1>Sınıf Yönetimi</h1>
        <div className="classes-actions">
          <Link to="/classes/import" className="button primary">
            <FiUpload className="button-icon" /> Excel ile Toplu Ekle
          </Link>
          <Link to="/classes/new" className="button secondary">
            <FiPlus className="button-icon" /> Yeni Sınıf
          </Link>
        </div>
      </div>

      <div className="classes-filters">
        <div className="filter-group">
          <label htmlFor="schoolId">Okul:</label>
          <select 
            id="schoolId" 
            name="schoolId" 
            value={filters.schoolId} 
            onChange={handleFilterChange}
          >
            <option value="">Tüm Okullar</option>
            {schools.map(school => (
              <option key={school._id} value={school._id}>{school.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="grade">Sınıf Seviyesi:</label>
          <select 
            id="grade" 
            name="grade" 
            value={filters.grade} 
            onChange={handleFilterChange}
          >
            <option value="">Tüm Seviyeler</option>
            {gradeOptions.map(grade => (
              <option key={grade} value={grade}>{grade}. Sınıf</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="searchTerm">Ara:</label>
          <input 
            type="text" 
            id="searchTerm" 
            name="searchTerm" 
            value={filters.searchTerm} 
            onChange={handleFilterChange}
            placeholder="Sınıf adı"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Sınıflar yükleniyor...</p>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="empty-state">
          <p>Sınıf bulunamadı.</p>
        </div>
      ) : (
        <div className="classes-table-container">
          <table className="classes-table">
            <thead>
              <tr>
                <th>Sınıf Adı</th>
                <th>Seviye</th>
                <th>Okul</th>
                <th>Öğrenci Sayısı</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map(classItem => (
                <tr key={classItem._id}>
                  <td>
                    <Link 
                      to={`/classes/detail/${classItem._id}`}
                      className="class-name-link"
                    >
                      {classItem.name}
                    </Link>
                  </td>
                  <td>{classItem.grade}. Sınıf</td>
                  <td>{classItem.school.name}</td>
                  <td>{classItem.students ? classItem.students.length : 0}</td>
                  <td className="action-buttons">
                    <Link 
                      to={`/classes/edit/${classItem._id}`}
                      className="edit-button"
                      title="Düzenle"
                    >
                      <FiEdit size={16} />
                    </Link>
                    <Link
                      to={`/classes/detail/${classItem._id}`}
                      className="view-button"
                      title="Görüntüle"
                    >
                      <FiEye size={16} />
                    </Link>
                    <button 
                      className="delete-button"
                      title="Sil"
                      onClick={() => handleDeleteClass(classItem._id)}
                    >
                      <FiTrash2 size={16} color="white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClassesList; 