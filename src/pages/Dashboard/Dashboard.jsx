import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button/Button';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Hoş geldiniz, {currentUser?.name || 'Kullanıcı'}</p>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Optik Formlar</h3>
            <p>Optik formlarınızı yönetin</p>
            <Button variant="outline">Görüntüle</Button>
          </div>
          
          <div className="dashboard-card">
            <h3>Sınavlar</h3>
            <p>Sınav sonuçlarını yönetin</p>
            <Button variant="outline">Görüntüle</Button>
          </div>
          
          <div className="dashboard-card">
            <h3>Raporlar</h3>
            <p>Sınav raporlarını görüntüleyin</p>
            <Button variant="outline">Görüntüle</Button>
          </div>
        </div>
        
        <div className="dashboard-summary">
          <h2>Özet</h2>
          <div className="summary-stats">
            <div className="stat-item">
              <h4>Toplam Sınav</h4>
              <p className="stat-value">0</p>
            </div>
            <div className="stat-item">
              <h4>Toplam Öğrenci</h4>
              <p className="stat-value">0</p>
            </div>
            <div className="stat-item">
              <h4>Son Sınav</h4>
              <p className="stat-value">-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;