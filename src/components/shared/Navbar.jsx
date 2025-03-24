import './Navbar.css';
import './NotificationBadge.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import TeacherApprovalDropdown from './TeacherApprovalDropdown';
import usersApi from '../../api/users';

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Kullanıcı süper admin veya okul yöneticisi mi?
  const canApproveTeachers = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">Optik Sınav Sistemi</Link>
        </div>
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar-item">Dashboard</Link>
              
              {/* Onay Bildirimleri - Sadece yönetici ve süper admin için */}
              {canApproveTeachers && <TeacherApprovalDropdown />}
              
              <div className="navbar-item user-dropdown">
                <span onClick={toggleDropdown} className="dropdown-trigger">
                  {currentUser?.name || 'Kullanıcı'} 
                  {currentUser?.role && (
                    <span className="user-role">
                      ({currentUser.role === 'superadmin' ? 'Süper Admin' : 
                         currentUser.role === 'admin' ? 'Okul Yöneticisi' : 'Öğretmen'})
                    </span>
                  )}
                </span>
                {dropdownOpen && (
                  <div className="dropdown-content">
                    <Link to="/profile">Profil</Link>
                    <button onClick={handleLogout}>Çıkış Yap</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-item">Giriş Yap</Link>
              <Link to="/register" className="navbar-item">Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;