// src/pages/Dashboard/Dashboard.jsx - Güncelleme
import './Dashboard.css';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button/Button';
import optikApi from '../../api/optik';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Location state'inden mesajı al
  const message = location.state?.message;
  
  // Formları yükle
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const response = await optikApi.getAllForms();
        setForms(response.data || []);
      } catch (error) {
        setError('Formlar yüklenirken bir hata oluştu.');
        console.error('Formlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchForms();
  }, []);
  
  // Bir formu silme
  const handleDeleteForm = async (id) => {
    if (window.confirm('Bu formu silmek istediğinizden emin misiniz?')) {
      try {
        await optikApi.deleteForm(id);
        // Silinen formu listeden kaldır
        setForms(forms.filter(form => form._id !== id));
      } catch (error) {
        setError('Form silinirken bir hata oluştu.');
        console.error('Form silinirken hata:', error);
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Hoş geldiniz, {currentUser?.name || 'Kullanıcı'}</p>
      </div>
      
      {message && (
        <div className="success-alert">{message}</div>
      )}
      
      {error && (
        <div className="error-alert">{error}</div>
      )}
      
      <div className="dashboard-content">
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Optik Formlar</h3>
            <p>Optik formlarınızı yönetin</p>
            <div className="card-actions">
              <Link to="/optik-olustur">
                <Button variant="primary">Optik Oluştur</Button>
              </Link>
            </div>
          </div>
          
          <div className="dashboard-card">
            <h3>Sınavlar</h3>
            <p>Sınav sonuçlarını yönetin</p>
            <Button variant="outline" disabled>Görüntüle</Button>
          </div>
          
          <div className="dashboard-card">
            <h3>Raporlar</h3>
            <p>Sınav raporlarını görüntüleyin</p>
            <Button variant="outline" disabled>Görüntüle</Button>
          </div>
        </div>
        
        <div className="dashboard-forms">
          <h2>Optik Formlarım</h2>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : forms.length > 0 ? (
            <div className="forms-grid">
              {forms.map(form => (
                <div key={form._id} className="form-card">
                  <h3>{form.title}</h3>
                  <p>Oluşturulma: {new Date(form.createdAt).toLocaleDateString('tr-TR')}</p>
                  <div className="form-actions">
                    <Link to={`/optik/${form._id}`}>
                      <Button variant="outline" size="small">Görüntüle</Button>
                    </Link>
                    <Link to={`/optik-duzenle/${form._id}`}>
                      <Button variant="primary" size="small">Düzenle</Button>
                    </Link>
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => handleDeleteForm(form._id)}
                    >
                      Sil
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Henüz oluşturulmuş optik form bulunmuyor.</p>
              <Link to="/optik-olustur">
                <Button variant="primary">İlk Formunuzu Oluşturun</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;