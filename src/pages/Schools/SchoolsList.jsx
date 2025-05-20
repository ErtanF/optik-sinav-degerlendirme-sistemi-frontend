import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import schoolApi from '../../api/schools';
import { useAuth } from '../../hooks/useAuth';
import './SchoolsList.css';

const SchoolsList = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Süperadmin kontrolü
  useEffect(() => {
    if (currentUser?.role !== 'superadmin') {
      navigate('/');
      toast.error('Bu sayfaya erişim izniniz yok');
    }
  }, [currentUser, navigate]);

  // Okulları getir
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const response = await schoolApi.getAllSchools();
        setSchools(response.data || []);
      } catch (error) {
        console.error('Okullar getirilirken hata oluştu:', error);
        toast.error('Okullar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  // Okul silme işlemi
  const handleDeleteSchool = async (id) => {
    try {
      await schoolApi.deleteSchool(id);
      setSchools(schools.filter(school => school._id !== id));
      toast.success('Okul başarıyla silindi');
      setConfirmDelete(null);
    } catch (error) {
      console.error('Okul silinirken hata oluştu:', error);
      toast.error('Okul silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="schools-container">
      <div className="schools-header">
        <h1>Okul Yönetimi</h1>
        <Link to="/schools/new" className="btn-add-school">
          Yeni Okul Ekle
        </Link>
      </div>

      {schools.length === 0 ? (
        <div className="no-schools">
          <p>Henüz okul bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="schools-list">
          <div className="schools-table-header">
            <div className="school-name-header">Okul Adı</div>
            <div className="school-city-header">Şehir</div>
            <div className="school-admin-header">Admin</div>
            <div className="school-actions-header">İşlemler</div>
          </div>
          
          {schools.map((school) => (
            <div key={school._id} className="school-item">
              <div className="school-name">{school.name}</div>
              <div className="school-city">{school.city}</div>
              <div className="school-admin">
                {school.admin ? school.admin.name : (
                  <span className="no-admin">Admin Atanmamış</span>
                )}
              </div>
              <div className="school-actions">
                <Link to={`/schools/edit/${school._id}`} className="btn-edit">
                  Düzenle
                </Link>
                
                {confirmDelete === school._id ? (
                  <div className="delete-confirm">
                    <button 
                      onClick={() => handleDeleteSchool(school._id)}
                      className="btn-confirm-yes"
                    >
                      Evet
                    </button>
                    <button 
                      onClick={() => setConfirmDelete(null)}
                      className="btn-confirm-no"
                    >
                      Hayır
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setConfirmDelete(school._id)}
                    className="btn-delete"
                  >
                    Sil
                  </button>
                )}
                
                {!school.admin && (
                  <Link to={`/schools/add-admin/${school._id}`} className="btn-add-admin">
                    Admin Ekle
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolsList; 