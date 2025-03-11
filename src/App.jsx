import { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);
  
  // Router bileşenimizi oluşturuyoruz
  const routing = useRoutes(routes(isAuthenticated));
  
  useEffect(() => {
    // Auth durumu yüklendiğinde
    if (!loading) {
      setIsReady(true);
    }
  }, [loading]);

  if (!isReady) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return <>{routing}</>;
}

export default App;