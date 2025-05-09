import React, { useState, useEffect } from 'react';
import usersApi from '../api/users';
import Button from '../components/ui/Button/Button';
import './TeacherApprovalsPage.css';

const TeacherApprovalsPage = () => {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);

  useEffect(() => {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div className="approval-page-container">
      <div className="approval-page-header">
        <h1>Onay Bekleyen Öğretmenler</h1>
        <Button 
          variant="outline" 
          onClick={fetchPendingTeachers}
          disabled={loading}
        >
          Yenile
        </Button>
      </div>
      
      {loading ? (
        <div className="approval-page-loading">
          <div className="loading-spinner"></div>
          <p>Öğretmenler yükleniyor...</p>
        </div>
      ) : error ? (
        <div className="approval-page-error">
          <p>{error}</p>
          <Button variant="primary" onClick={fetchPendingTeachers}>
            Tekrar Dene
          </Button>
        </div>
      ) : pendingTeachers.length === 0 ? (
        <div className="approval-page-empty">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="approval-page-empty-icon"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v4"></path>
            <path d="M12 16h.01"></path>
          </svg>
          <h2>Onay Bekleyen Öğretmen Bulunmuyor</h2>
          <p>Şu anda onay bekleyen öğretmen bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="approval-page-table-container">
          <table className="approval-page-table">
            <thead>
              <tr>
                <th>İsim</th>
                <th>E-posta</th>
                <th>Okul</th>
                <th>Kayıt Tarihi</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {pendingTeachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.school?.name || 'Belirtilmemiş'}</td>
                  <td>{formatDate(teacher.createdAt)}</td>
                  <td className="approval-page-actions">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherApprovalsPage;