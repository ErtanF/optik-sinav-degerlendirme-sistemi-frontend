// src/components/shared/TeacherApprovalDropdown.jsx
import React, { useState, useEffect, useRef } from 'react';
import './NotificationBadge.css';
import usersApi from '../../api/users';
import Button from '../ui/Button/Button';

const TeacherApprovalDropdown = () => {
  // Bildirim sayısını prop olarak da alabiliriz
  const [isOpen, setIsOpen] = useState(false);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);
  const dropdownRef = useRef(null);

  // Onay bekleyen öğretmenleri yükle
  const fetchPendingTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersApi.getPendingTeachers();
      setPendingTeachers(response.data || []);
    } catch (error) {
      console.error('Onay bekleyen öğretmenler yüklenirken hata:', error);
      setError('Öğretmenler yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Dropdown açıldığında öğretmenleri yükle
  useEffect(() => {
    if (isOpen) {
      fetchPendingTeachers();
    }
  }, [isOpen]);

  // Dışarı tıklandığında dropdown'ı kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Öğretmen onaylama
  const handleApprove = async (teacherId) => {
    try {
      setActionInProgress(teacherId);
      await usersApi.approveTeacher(teacherId);
      // Başarılı ise listeden kaldır
      setPendingTeachers(pendingTeachers.filter(teacher => teacher._id !== teacherId));
    } catch (error) {
      console.error('Öğretmen onaylanırken hata:', error);
      setError('Öğretmen onaylanırken bir sorun oluştu.');
    } finally {
      setActionInProgress(null);
    }
  };

  // Öğretmen reddetme (sadece listeden kaldırma)
  const handleReject = async (teacherId) => {
    try {
      setActionInProgress(teacherId);
      // Backend'e istek göndermek yerine sadece UI'dan kaldırıyoruz
      await usersApi.rejectTeacherLocally(teacherId);
      
      // Listeden kaldır
      setPendingTeachers(prevTeachers => 
        prevTeachers.filter(teacher => teacher._id !== teacherId)
      );
      
    } catch (error) {
      console.error('Öğretmen reddedilirken hata:', error);
      setError('Öğretmen reddedilirken bir sorun oluştu.');
    } finally {
      setActionInProgress(null);
    }
  };

  // Tarihi formatlama
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div className="notification-badge-container" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} title="Onay Bekleyen Öğretmenler">
        <i className="notification-icon">🔔</i>
        {pendingTeachers.length > 0 && (
          <span className="notification-count">{pendingTeachers.length}</span>
        )}
      </div>
      
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <span>Onay Bekleyen Öğretmenler</span>
            <button onClick={fetchPendingTeachers} className="refresh-button" title="Yenile">
              🔄
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
            <div className="notification-list">
              {pendingTeachers.map(teacher => (
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
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherApprovalDropdown;