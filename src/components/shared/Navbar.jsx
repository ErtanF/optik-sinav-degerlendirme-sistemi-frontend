import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import './NotificationBadge.css';
import favicon from '../../assets/favicon.jpg';
import usersApi from '../../api/users';
import { useAuth } from '../../hooks/useAuth';

// Throttle function to limit how often a function can be called
const throttle = (func, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
};

// Improved custom hook for scroll progress
const useScrollProgress = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  
  // Use a more efficient calculation method
  const calculateScrollPercent = useCallback(() => {
    // Check if document is fully loaded
    if (!document.body) return;
    
    const docHeight = Math.max(
      document.body.scrollHeight, 
      document.body.offsetHeight, 
      document.documentElement.clientHeight, 
      document.documentElement.scrollHeight, 
      document.documentElement.offsetHeight
    );
    
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    
    // Prevent division by zero
    if (docHeight <= windowHeight) {
      setScrollPercent(0);
      return;
    }
    
    // Calculate the scroll percentage with precision
    const newScrollPercent = Math.min(100, Math.max(0, (scrollTop / (docHeight - windowHeight)) * 100));
    
    // Only update if there's significant change (optimization)
    if (Math.abs(newScrollPercent - scrollPercent) > 0.5) {
      setScrollPercent(newScrollPercent);
      
      // Update the CSS variable for the progress bar
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--scroll', newScrollPercent.toFixed(2));
      });
    }
  }, [scrollPercent]);

  useEffect(() => {
    // Throttle the scroll handler to improve performance
    const handleScroll = throttle(calculateScrollPercent, 20);

    // Handle browser resize which affects scroll calculations
    const handleResize = throttle(() => {
      // Small delay to ensure DOM is updated
      setTimeout(calculateScrollPercent, 100);
    }, 250);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Initial call after DOM is ready
    if (document.readyState === 'complete') {
      calculateScrollPercent();
    } else {
      window.addEventListener('load', calculateScrollPercent);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', calculateScrollPercent);
    };
  }, [calculateScrollPercent]);

  return scrollPercent;
};

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false); 
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Yeni dropdown state'leri
  const [optikMenuOpen, setOptikMenuOpen] = useState(false);
  const [yonetimMenuOpen, setYonetimMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const scrollPreviousPosition = useRef(0);
  const optikMenuRef = useRef(null);
  const yonetimMenuRef = useRef(null);
  
  const canApproveTeachers = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.classList.contains('mobile-menu-toggle')
      ) {
        setMobileMenuOpen(false);
      }
      if (optikMenuRef.current && !optikMenuRef.current.contains(event.target)) {
        setOptikMenuOpen(false);
      }
      if (yonetimMenuRef.current && !yonetimMenuRef.current.contains(event.target)) {
        setYonetimMenuOpen(false);
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

  // Improved scroll handler with debounce to prevent excessive updates
  const handleScrollChange = useCallback(() => {
    const scrollPosition = window.scrollY;
    const scrollThreshold = 20;
    
    // Add hysteresis to prevent flickering at the threshold
    if (scrollPosition > scrollThreshold && !scrolled) {
      setScrolled(true);
    } else if (scrollPosition <= scrollThreshold - 5 && scrolled) { // Subtraction creates hysteresis
      setScrolled(false);
    }
    
    scrollPreviousPosition.current = scrollPosition;
  }, [scrolled]);

  useEffect(() => {
    // Adjust throttle for better performance
    const throttledHandleScroll = throttle(handleScrollChange, 30);

    // Use passive event listener for better performance
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    // Initial check - ensure scroll position is respected on page refresh or direct link access
    const checkInitialScroll = () => {
      handleScrollChange();
      
      // Double-check after page is fully loaded (images, fonts, etc)
      window.requestAnimationFrame(() => {
        handleScrollChange();
      });
    };
    
    checkInitialScroll();
    window.addEventListener('load', checkInitialScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      window.removeEventListener('load', checkInitialScroll);
    };
  }, [handleScrollChange]);

  // Add scroll progress indicator
  useScrollProgress();

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleOptikMenu = (e) => {
    e.preventDefault();
    setOptikMenuOpen(!optikMenuOpen);
    // Diğer açık menüleri kapat
    setYonetimMenuOpen(false);
  };

  const toggleYonetimMenu = (e) => {
    e.preventDefault();
    setYonetimMenuOpen(!yonetimMenuOpen);
    // Diğer açık menüleri kapat
    setOptikMenuOpen(false);
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
    // Path bir dizi ise, herhangi birindeyse aktif olarak işaretle (dropdown menüler için)
    if (Array.isArray(path)) {
      return path.some(p => location.pathname.startsWith(p)) ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };
  
  // Function to handle link navigation with scroll to top
  const handleNavigate = (to, event) => {
    event.preventDefault();
    navigate(to);
    window.scrollTo(0, 0);
    
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav 
      className={`navbar ${scrolled ? 'scrolled' : ''}`} 
      aria-label="Ana navigasyon"
      role="navigation"
    >
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" aria-label="Ana sayfaya git" onClick={(e) => handleNavigate('/', e)}>
            <img src={favicon || '/placeholder.svg'} alt="Optik Sınav Sistemi Logo" className="navbar-logo-image" />
            <span className="navbar-logo-text">Optik Sınav Sistemi</span>
          </Link>
          
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={mobileMenuOpen}
          >
            <span className={`hamburger-icon ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
        
        <div className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`} ref={mobileMenuRef}>
          {isAuthenticated ? (
            <>
              <div className="navbar-links">
                {/* Optik İşlemleri Dropdown */}
                <div className={`navbar-item nav-dropdown ${isActive(['/optik-olustur', '/optik-formlarim'])}`} ref={optikMenuRef}>
                  <span 
                    onClick={toggleOptikMenu} 
                    className="nav-dropdown-trigger"
                    tabIndex="0"
                    onKeyDown={(e) => e.key === 'Enter' && toggleOptikMenu(e)}
                    aria-haspopup="true"
                    aria-expanded={optikMenuOpen}
                  >
                    <span className="navbar-item-text">Optik İşlemleri</span>
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
                      className={`dropdown-arrow ${optikMenuOpen ? 'open' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                  
                  {optikMenuOpen && (
                    <div className="nav-dropdown-content">
                      <Link 
                        to="/optik-olustur" 
                        className={`dropdown-item ${isActive('/optik-olustur')}`}
                        onClick={(e) => handleNavigate('/optik-olustur', e)}
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
                          className="dropdown-icon"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="12" y1="18" x2="12" y2="12"></line>
                          <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                        Optik Form Oluştur
                      </Link>
                      <Link 
                        to="/optik-formlarim" 
                        className={`dropdown-item ${isActive('/optik-formlarim')}`}
                        onClick={(e) => handleNavigate('/optik-formlarim', e)}
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
                          className="dropdown-icon"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        Optik Formlarım
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Yönetim İşlemleri Dropdown */}
                <div className={`navbar-item nav-dropdown ${isActive(['/students', '/classes'])}`} ref={yonetimMenuRef}>
                  <span 
                    onClick={toggleYonetimMenu} 
                    className="nav-dropdown-trigger"
                    tabIndex="0"
                    onKeyDown={(e) => e.key === 'Enter' && toggleYonetimMenu(e)}
                    aria-haspopup="true"
                    aria-expanded={yonetimMenuOpen}
                  >
                    <span className="navbar-item-text">Yönetim İşlemleri</span>
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
                      className={`dropdown-arrow ${yonetimMenuOpen ? 'open' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                  
                  {yonetimMenuOpen && (
                    <div className="nav-dropdown-content">
                      <Link 
                        to="/students" 
                        className={`dropdown-item ${isActive('/students')}`}
                        onClick={(e) => handleNavigate('/students', e)}
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
                          className="dropdown-icon"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Öğrenci Yönetimi
                      </Link>
                      <Link 
                        to="/classes" 
                        className={`dropdown-item ${isActive('/classes')}`}
                        onClick={(e) => handleNavigate('/classes', e)}
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
                          className="dropdown-icon"
                        >
                          <path d="M3 3v18h18"></path>
                          <path d="M18.4 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9.6"></path>
                          <path d="M10 10h5v5h-5z"></path>
                        </svg>
                        Sınıf Yönetimi
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Yönetici Menüleri Tek Başına Bırakıldı */}
                {canApproveTeachers && (
                  <Link 
                    to="/approved-teachers" 
                    className={`navbar-item ${isActive('/approved-teachers')}`}
                    onClick={(e) => handleNavigate('/approved-teachers', e)}
                  >
                    <span className="navbar-item-text">Onaylı Öğretmenler</span>
                  </Link>
                )}
                {currentUser?.role === 'superadmin' && (
                  <Link 
                    to="/schools" 
                    className={`navbar-item ${isActive('/schools')}`}
                    onClick={(e) => handleNavigate('/schools', e)}
                  >
                    <span className="navbar-item-text">Okul Yönetimi</span>
                  </Link>
                )}
              </div>
              
              <div className="navbar-actions">
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
                              <Link 
                                to="/teacher-approvals" 
                                className="view-all-link" 
                                onClick={(e) => {
                                  setNotificationsOpen(false);
                                  handleNavigate('/teacher-approvals', e);
                                }}
                              >
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
                      <span className="user-name">{currentUser?.name || 'Kullanıcı'}</span>
                      {currentUser?.role && (
                        <span className="user-role">
                          {currentUser.role === 'superadmin' ? 'Süper Admin' : 
                           currentUser.role === 'admin' ? 'Okul Yöneticisi' : 'Öğretmen'}
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
                      <Link 
                        to="/profile" 
                        role="menuitem" 
                        tabIndex="0"
                        onClick={(e) => handleNavigate('/profile', e)}
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
                          className="dropdown-icon"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Profil
                      </Link>
                      <button onClick={handleLogout} role="menuitem" tabIndex="0">
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
                          className="dropdown-icon"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <Link 
                to="/login" 
                className={`auth-button login-button ${isActive('/login')}`}
                onClick={(e) => handleNavigate('/login', e)}
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
                  className="auth-icon"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                Giriş Yap
              </Link>
              <Link 
                to="/register" 
                className={`auth-button register-button ${isActive('/register')}`}
                onClick={(e) => handleNavigate('/register', e)}
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
                  className="auth-icon"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;