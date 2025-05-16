
import React, { useState, useEffect } from 'react';
import usersApi from '../api/users'; // API yolunun doğru olduğundan emin olun
import Button from '../components/ui/Button/Button';
import './TeacherApprovalsPage.css'; // Gerekirse bu CSS dosyasını kopyalayıp ApprovedTeachersPage.css olarak yeniden adlandırın veya ortak bir CSS kullanın

const ApprovedTeachersPage = () => {
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApprovedTeachers();
  }, []);

  const fetchApprovedTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersApi.getApprovedTeachersBySchool(); 
      setApprovedTeachers(response.data || []);
    } catch (error) {
      console.error('Onaylanmış öğretmenler getirilirken hata oluştu:', error);
      if (error.response && error.response.status === 403) {
        setError('Bu işlemi yapmak için yetkiniz bulunmamaktadır.');
      } else if (error.response && error.response.status === 404) {
        setError('Onaylanmış öğretmenler bulunamadı veya API endpoint hatalı.');
      } else {
        setError('Öğretmenler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div className="approval-page-container"> 
      <div className="approval-page-header">
        <h1>Onaylanmış Öğretmenler</h1>
        <Button 
          variant="outline" 
          onClick={fetchApprovedTeachers}
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
          <Button variant="primary" onClick={fetchApprovedTeachers}>
            Tekrar Dene
          </Button>
        </div>
      ) : approvedTeachers.length === 0 ? (
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
            <path d="m9 12 2 2 4-4"></path> 
          </svg>
          <h2>Onaylanmış Öğretmen Bulunmuyor</h2>
          <p>Bu okulda henüz onaylanmış öğretmen bulunmamaktadır.</p>
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
                <th>Onay Tarihi</th> 
              </tr>
            </thead>
            <tbody>
              {approvedTeachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.school?.name || 'Belirtilmemiş'}</td>
                  <td>{formatDate(teacher.createdAt)}</td>
                  <td>{teacher.approvedAt ? formatDate(teacher.approvedAt) : '-'}</td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApprovedTeachersPage; // Default export burada!