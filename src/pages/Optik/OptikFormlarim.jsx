import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './OptikFormlarim.css';
import Button from '../../components/ui/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import optikApi from '../../api/optik';

const OptikFormlarim = () => {
  const { currentUser } = useAuth();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Formları yükle
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        
        // Kullanıcı ID'sini kontrol et
        let userId = null;
        if (currentUser && currentUser._id) {
          userId = currentUser._id;
        } else {
          // LocalStorage'dan kullanıcı bilgilerini almayı dene
          const userStr = localStorage.getItem('user');
          if (userStr) {
            try {
              const userData = JSON.parse(userStr);
              if (userData && userData._id) {
                userId = userData._id;
              }
            } catch (err) {
              console.error('Kullanıcı bilgileri parse edilemedi:', err);
            }
          }
        }
        
        if (!userId) {
          setError('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
          setLoading(false);
          return;
        }
        
        console.log('Formlar getiriliyor, kullanıcı ID:', userId);
        const response = await optikApi.getAllForms(userId);
        setForms(response.data || []);
      } catch (error) {
        setError('Formlar yüklenirken bir hata oluştu.');
        console.error('Formlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchForms();
  }, [currentUser]);
  
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
    <div className="optik-formlarim-page">
      <div className="page-header">
        <div className="header-title">
          <h1>Optik Formlarım</h1>
        </div>
        <div className="header-actions">
          <Link to="/optik-olustur">
            <Button variant="primary">Yeni Optik Oluştur</Button>
          </Link>
          <Link to="/">
            <Button variant="outline">Dashboard'a Dön</Button>
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="error-alert">{error}</div>
      )}
      
      <div className="optik-forms-container">
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
  );
};

export default OptikFormlarim;