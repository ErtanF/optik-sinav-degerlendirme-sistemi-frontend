import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import usersApi from '../../api/users';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import './Profile.css';
import { validateProfileForm, validatePasswordForm } from '../../utils/validators';

const Profile = () => {
  const { currentUser, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    school: null
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const errorShownRef = useRef(false);

  // İlk yüklemede context'ten başlat
  useEffect(() => {
    if (currentUser) {
      setUserData({
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        school: currentUser.school
      });
    }
    fetchUserProfile();
    // eslint-disable-next-line
  }, [currentUser]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getUserProfile();
      setUserData({
        name: response.name,
        email: response.email,
        role: response.role,
        school: response.school
      });
      // Context ve localStorage'ı da güncelle
      login(response, localStorage.getItem('token'));
      errorShownRef.current = false;
    } catch (error) {
      if (!errorShownRef.current && !currentUser) {
        toast.error(error.response?.data?.message || 'Profil bilgileri yüklenirken bir hata oluştu.');
        errorShownRef.current = true;
      }
      console.error('Profil yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Hata mesajı göstermek için yardımcı fonksiyon
  const showApiError = (error, defaultMsg) => {
    const msg = error.response?.data?.message || defaultMsg;
    toast.error(msg);
    console.error(msg, error);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateProfileForm(userData);
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      try {
        setSaving(true);
        const updated = await usersApi.updateUserProfile(userData);
        toast.success('Profil bilgileriniz başarıyla güncellendi.');
        // Sadece güncellenen kullanıcıyı context ve localStorage'a yaz
        login(updated.data, localStorage.getItem('token'));
      } catch (error) {
        showApiError(error, 'Profil güncellenirken bir hata oluştu.');
      } finally {
        setSaving(false);
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validatePasswordForm(passwordData);
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      try {
        setSaving(true);
        await usersApi.changePassword({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        });
        toast.success('Şifreniz başarıyla değiştirildi. Lütfen tekrar giriş yapın.');
        logout();
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        showApiError(error, 'Şifre değiştirilirken bir hata oluştu.');
      } finally {
        setSaving(false);
      }
    }
  };

  const getRoleName = (role) => {
    const roleNames = {
      'superadmin': 'Süper Admin',
      'admin': 'Okul Yöneticisi',
      'teacher': 'Öğretmen'
    };
    return roleNames[role] || role;
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Profil bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profil Bilgileri</h1>
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profil Bilgileri
          </button>
          <button 
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Şifre Değiştir
          </button>
        </div>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' ? (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Kullanıcı Rolü:</span>
                <span className="info-value">{getRoleName(userData.role)}</span>
              </div>
              {userData.school && (
                <div className="info-item">
                  <span className="info-label">Okul:</span>
                  <span className="info-value">{userData.school.name}</span>
                </div>
              )}
            </div>

            <Input
              type="text"
              label="Ad Soyad"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleProfileChange}
              placeholder="Adınızı ve soyadınızı girin"
              error={errors.name}
              required
            />
            
            <Input
              type="email"
              label="E-posta"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleProfileChange}
              placeholder="E-posta adresinizi girin"
              error={errors.email}
              required
            />
            
            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
              >
                {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="profile-form">
            <Input
              type="password"
              label="Mevcut Şifre"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Mevcut şifrenizi girin"
              error={errors.currentPassword}
              required
            />
            
            <Input
              type="password"
              label="Yeni Şifre"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Yeni şifrenizi girin"
              error={errors.newPassword}
              required
            />
            
            <Input
              type="password"
              label="Yeni Şifre Tekrarı"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Yeni şifrenizi tekrar girin"
              error={errors.confirmPassword}
              required
            />
            
            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
              >
                {saving ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
