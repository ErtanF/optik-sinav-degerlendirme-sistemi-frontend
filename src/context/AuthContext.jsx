import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LocalStorage'dan kullanıcı bilgilerini kontrol et
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  // Login işlemi
  const login = (userData, token) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    
    // LocalStorage'a kaydet
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout işlemi
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    // LocalStorage'dan temizle
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Login sayfasına yönlendir
    navigate('/login');
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;