// src/components/shared/TeacherApprovalDropdown.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NotificationBadge.css';
import usersApi from '../../api/users';
import Button from '../ui/Button/Button';

const TeacherApprovalDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Dropdown dışı tıklamayı yakala
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Onay bekleyen öğretmenleri getir
    fetchPendingTeachers();
  }, []);

  const fetchPendingTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersApi.getPendingTeachers();
      setPendingTeachers(response.data || []);
    } catch (error) {
      console.error('Onay bekleyen öğretmenler getirilirken hata oluştu:', error);
      setError('Öğretmenler yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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
      setError('Öğretmen onaylanırken bir sorun oluştu.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (teacherId) => {
    try {
      setActionInProgress(teacherId);
      await usersApi.rejectTeacherLocally(teacherId);
      setPendingTeachers(prevTeachers => 
        prevTeachers.filter(teacher => teacher._id !== teacherId)
      );
    } catch (error) {
      console.error('Öğretmen reddedilirken hata oluştu:', error);
      setError('Öğretmen reddedilirken bir sorun oluştu.');
    } finally {
      setActionInProgress(null);
    }
  };

  const goToApprovalPage = () => {
    navigate('/teacher-approvals');
    setDropdownOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div className="navbar-item notification-dropdown" ref={dropdownRef}>
      <div 
        onClick={toggleDropdown} 
        className="notification-trigger"
        tabIndex="0"
        onKeyDown={(e) => e.key === 'Enter' && toggleDropdown()}
        aria-label="Bildirimler"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
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
      </div>
      
      {dropdownOpen && (
        <div className="notification-content">
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
            <div className="notification-empty">
              <div className="loading-spinner-small"></div>
              <p>Yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="notification-empty">
              <p>{error}</p>
              <Button variant="outline" size="small" onClick={fetchPendingTeachers}>
                Tekrar Dene
              </Button>
            </div>
          ) : pendingTeachers.length === 0 ? (
            <div className="notification-empty">
              <p>Onay bekleyen öğretmen bulunmuyor.</p>
            </div>
          ) : (
            <>
              <div className="notification-list">
                {pendingTeachers.slice(0, 3).map(teacher => (
                  <div key={teacher._id} className="notification-item">
                    <div className="notification-item-header">
                      <div className="notification-item-title">{teacher.name}</div>
                      <div className="notification-item-date">{formatDate(teacher.createdAt)}</div>
                    </div>
                    <div className="notification-item-content">
                      <p><strong>E-posta:</strong> {teacher.email}</p>
                      <p><strong>Okul:</strong> {teacher.school?.name || 'Belirtilmemiş'}</p>
                    </div>
                    <div className="notification-item-actions">
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleApprove(teacher._id)}
                        disabled={actionInProgress === teacher._id}
                      >
                        {actionInProgress === teacher._id ? 'İşleniyor...' : 'Onayla'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleReject(teacher._id)}
                        disabled={actionInProgress === teacher._id}
                      >
                        {actionInProgress === teacher._id ? 'İşleniyor...' : 'Reddet'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Onay sayfasına gitme linki */}
              {pendingTeachers.length > 3 && (
                <div className="notification-footer">
                  <span>{pendingTeachers.length - 3} adet daha bildirim var</span>
                </div>
              )}
              
              <div className="notification-view-all">
                <Button 
                  variant="outline" 
                  size="medium" 
                  onClick={goToApprovalPage} 
                  className="view-all-button"
                >
                  Tüm Bildirimleri Görüntüle
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherApprovalDropdown;