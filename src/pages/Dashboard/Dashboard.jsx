// src/pages/Dashboard/Dashboard.jsx - Güncelleme
import './Dashboard.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button/Button';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // Location state'inden mesajı al
  const message = location.state?.message;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Hoş geldiniz, {currentUser?.name || 'Kullanıcı'}</p>
      </div>
      
      {message && (
        <div className="success-alert">{message}</div>
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
              <Link to="/optik-formlarim">
                <Button variant="outline">Optik Formları Görüntüle</Button>
              </Link>
            </div>
          </div>
          
          <div className="dashboard-card">
            <h3>Sınavlar</h3>
            <p>Sınav sonuçlarını yönetin</p>
            <Link to="/sinav-olustur" className="btn-link">
              <Button variant="primary">Yeni Sınav Oluştur</Button>
            </Link>
            <Link to="/sinavlar" className="btn-link">
              <Button variant="outline">Tüm Sınavlar</Button>
            </Link>
          </div>
          
          <div className="dashboard-card">
            <h3>Raporlar</h3>
            <p>Sınav raporlarını görüntüleyin</p>
            <Button variant="outline" disabled>Görüntüle</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;