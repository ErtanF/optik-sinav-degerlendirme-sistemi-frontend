// src/context/AuthContext.jsx - Güncelleme
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LocalStorage ve SessionStorage'dan kullanıcı bilgilerini kontrol et
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (token && user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  // Login işlemi
  const login = (userData, token, rememberMe = false) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    
    // rememberMe seçeneğine göre localStorage veya sessionStorage'a kaydet
    if (rememberMe) {
      // Kalıcı olarak sakla
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      // SessionStorage'ı temizle
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    } else {
      // Geçici olarak sakla (tarayıcı kapandığında silinir)
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(userData));
      // LocalStorage'ı temizle
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  // Logout işlemi
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    // Her iki storage'dan da temizle
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
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