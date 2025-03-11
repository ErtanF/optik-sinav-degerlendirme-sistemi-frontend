import { Link } from 'react-router-dom';
import Button from '../components/ui/Button/Button';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Sayfa Bulunamadı</h2>
        <p>Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
        <Link to="/">
          <Button variant="primary">Ana Sayfaya Dön</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;