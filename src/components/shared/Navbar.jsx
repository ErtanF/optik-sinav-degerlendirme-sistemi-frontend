import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import './NotificationBadge.css';
import favicon from '../../assets/favicon.jpg';
import usersApi from '../../api/users';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false); 
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  
  const canApproveTeachers = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (isAuthenticated && canApproveTeachers) {
      fetchPendingTeachers();
    }
  }, [isAuthenticated, canApproveTeachers]);

  const fetchPendingTeachers = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getPendingTeachers();
      setPendingTeachers(response.data || []);
    } catch (error) {
      console.error('Onay bekleyen öğretmenler getirilirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const handleApprove = async (teacherId) => {
    try {
      setActionInProgress(teacherId);
      await usersApi.approveTeacher(teacherId);
      setPendingTeachers(prevTeachers => 
        prevTeachers.filter(teacher => teacher._id !== teacherId)
      );
    } catch (error) {
      console.error('Öğretmen onaylanırken hata oluştu:', error);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (teacherId) => {
    try {
      setActionInProgress(teacherId);
      await usersApi.rejectTeacher(teacherId);
      setPendingTeachers(prevTeachers => 
        prevTeachers.filter(teacher => teacher._id !== teacherId)
      );
    } catch (error) {
      console.error('Öğretmen reddedilirken hata oluştu:', error);
    } finally {
      setActionInProgress(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' ? 'active' : '';
    }
    return location.pathname === path ? 'active' : '';
  };
  

  return (
    <nav className="navbar" aria-label="Ana navigasyon">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" aria-label="Ana sayfaya git">
            <img src={favicon} alt="Optik Sınav Sistemi Logo" className="navbar-logo-image" />
            <span className="navbar-logo-text">Optik Sınav Sistemi</span>
          </Link>
        </div>
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/optik-olustur" className={`navbar-item ${isActive('/optik-olustur')}`}>Optik Oluştur</Link>
              <Link to="/optik-formlarim" className={`navbar-item ${isActive('/optik-formlarim')}`}>Optik Formlarım</Link>
              
              {canApproveTeachers && (
                <div className="navbar-item notification-container" ref={notificationRef}>
                  <button 
                    onClick={toggleNotifications} 
                    className="notification-trigger"
                    aria-label="Bildirimler"
                    aria-haspopup="true"
                    aria-expanded={notificationsOpen}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="notification-bell-icon" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    {pendingTeachers.length > 0 && (
                      <span className="notification-badge">{pendingTeachers.length}</span>
                    )}
                  </button>
                  
                  {notificationsOpen && (
                    <div className="notification-dropdown">
                      <div className="notification-header">
                        <h3>Onay Bekleyen Öğretmenler</h3>
                        <button 
                          className="refresh-button" 
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchPendingTeachers();
                          }}
                          aria-label="Bildirimleri yenile"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M23 4v6h-6"></path>
                            <path d="M1 20v-6h6"></path>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                          </svg>
                        </button>
                      </div>
                      
                      {loading ? (
                        <div className="notification-loading">
                          <div className="loading-spinner-small"></div>
                          <p>Yükleniyor...</p>
                        </div>
                      ) : pendingTeachers.length === 0 ? (
                        <div className="notification-empty">
                          <p>Onay bekleyen öğretmen bulunmuyor.</p>
                        </div>
                      ) : (
                        <>
                          <div className="notification-list">
                            {pendingTeachers.map(teacher => (
                              <div key={teacher._id} className="notification-item">
                                <div className="notification-item-content">
                                  <p className="notification-title">{teacher.name}</p>
                                  <p className="notification-date">{formatDate(teacher.createdAt)}</p>
                                </div>
                                <div className="notification-item-actions">
                                  <button 
                                    className="approve-button" 
                                    onClick={() => handleApprove(teacher._id)}
                                    disabled={actionInProgress === teacher._id}
                                  >
                                    Onayla
                                  </button>
                                  <button 
                                    className="reject-button" 
                                    onClick={() => handleReject(teacher._id)}
                                    disabled={actionInProgress === teacher._id}
                                  >
                                    Reddet
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="notification-footer">
                            <Link to="/teacher-approvals" className="view-all-link" onClick={() => setNotificationsOpen(false)}>
                              Tümünü Görüntüle
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <div className="navbar-item user-dropdown" ref={dropdownRef}>
                <span 
                  onClick={toggleDropdown} 
                  className="dropdown-trigger" 
                  tabIndex="0"
                  onKeyDown={(e) => e.key === 'Enter' && toggleDropdown()}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <div className="user-info">
                    {currentUser?.name || 'Kullanıcı'} 
                    {currentUser?.role && (
                      <span className="user-role">
                        ({currentUser.role === 'superadmin' ? 'Süper Admin' : 
                           currentUser.role === 'admin' ? 'Okul Yöneticisi' : 'Öğretmen'})
                      </span>
                    )}
                  </div>
                  
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="user-avatar-icon" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                {dropdownOpen && (
                  <div className="dropdown-content" role="menu">
                    <Link to="/profile" role="menuitem" tabIndex="0">Profil</Link>
                    <button onClick={handleLogout} role="menuitem" tabIndex="0">Çıkış Yap</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={`navbar-item ${isActive('/login')}`}>Giriş Yap</Link>
              <Link to="/register" className={`navbar-item ${isActive('/register')}`}>Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;