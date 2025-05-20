import React, { useState, useEffect } from 'react';
import usersApi from '../api/users'; // API yolunun doğru olduğundan emin olun
import Button from '../components/ui/Button/Button';
import { useAuth } from '../hooks/useAuth';
import './TeacherApprovalsPage.css'; // Gerekirse bu CSS dosyasını kopyalayıp ApprovedTeachersPage.css olarak yeniden adlandırın veya ortak bir CSS kullanın

const ApprovedTeachersPage = () => {
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'superadmin';
  
  // Sıralama durumu için state - varsayılan olarak kayıt tarihine göre azalan sıralama
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'descending'
  });

  useEffect(() => {
    fetchApprovedTeachers();
  }, [isSuperAdmin]);

  const fetchApprovedTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (isSuperAdmin) {
        // Superadmin tüm onaylanmış öğretmenleri görebilir
        response = await usersApi.getAllApprovedTeachers();
      } else {
        // Okul müdürü sadece kendi okulundaki onaylanmış öğretmenleri görebilir
        response = await usersApi.getApprovedTeachersBySchool(); 
      }
      
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

  // Sıralama fonksiyonu
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sıralanmış öğretmenleri getir
  const getSortedTeachers = () => {
    const sortableTeachers = [...approvedTeachers];
    if (sortConfig.key) {
      sortableTeachers.sort((a, b) => {
        let aValue, bValue;
        
        // Özel durumlar için değerleri hazırla
        if (sortConfig.key === 'school') {
          aValue = a.school?.name || '';
          bValue = b.school?.name || '';
        } else if (sortConfig.key === 'createdAt' || sortConfig.key === 'approvedAt') {
          aValue = new Date(a[sortConfig.key] || 0).getTime();
          bValue = new Date(b[sortConfig.key] || 0).getTime();
        } else {
          aValue = a[sortConfig.key] || '';
          bValue = b[sortConfig.key] || '';
        }
        
        // String ise case-insensitive karşılaştır
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTeachers;
  };

  // Sıralama gösterge ikonu
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <span className="sort-icon">⇅</span>;
    }
    return sortConfig.direction === 'ascending' 
      ? <span className="sort-icon active">↑</span> 
      : <span className="sort-icon active">↓</span>;
  };

  return (
    <div className="approval-page-container"> 
      <div className="approval-page-header">
        <h1>
          {isSuperAdmin ? 'Tüm Onaylanmış Öğretmenler' : 'Okulunuzdaki Onaylanmış Öğretmenler'}
        </h1>
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
          <p>
            {isSuperAdmin 
              ? 'Sistemde henüz onaylanmış öğretmen bulunmamaktadır.' 
              : 'Bu okulda henüz onaylanmış öğretmen bulunmamaktadır.'}
          </p>
        </div>
      ) : (
        <div className="approval-page-table-container">
          <table className="approval-page-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')} className="sortable-header">
                  İsim {getSortIcon('name')}
                </th>
                <th onClick={() => requestSort('email')} className="sortable-header">
                  E-posta {getSortIcon('email')}
                </th>
                <th onClick={() => requestSort('school')} className="sortable-header">
                  Okul {getSortIcon('school')}
                </th>
                <th onClick={() => requestSort('createdAt')} className="sortable-header">
                  Kayıt Tarihi {getSortIcon('createdAt')}
                </th>
                <th onClick={() => requestSort('approvedAt')} className="sortable-header">
                  Onay Tarihi {getSortIcon('approvedAt')}
                </th> 
              </tr>
            </thead>
            <tbody>
              {getSortedTeachers().map((teacher) => (
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

export default ApprovedTeachersPage;