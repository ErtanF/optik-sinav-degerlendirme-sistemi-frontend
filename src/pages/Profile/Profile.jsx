import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import usersApi from '../../api/users';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ProfileCard from '../../components/ui/ProfileCard';
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
  const profileFetchedRef = useRef(false); // Profil bilgisinin çekilip çekilmediğini takip etmek için

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
    
    // Profil bilgisi sadece bir kez çekilsin
    if (!profileFetchedRef.current) {
      fetchUserProfile();
      profileFetchedRef.current = true;
    }
    // eslint-disable-next-line
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getUserProfile();
      
      const profileData = response.data;
      // console.log(profileData); // Sürekli log yapmayı kaldırıyoruz
      
      // Eğer okul bir ID ise, okul bilgilerini çek
      if (profileData.school && typeof profileData.school === 'string') {
        try {
          const schoolResponse = await usersApi.getSchoolById(profileData.school);
          if (schoolResponse.data) {
            profileData.school = schoolResponse.data;
          }
        } catch (err) {
          console.error('Okul bilgisi çekilemedi:', err);
        }
      }
      
      setUserData({
        name: profileData.name,
        email: profileData.email,
        role: profileData.role,
        school: profileData.school
      });
      
      // Context ve localStorage'ı da güncelle
      login(profileData, localStorage.getItem('token'));
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
    // Email alanı değişikliğini engelle (readonly olduğu için buraya gelmemeli)
    if (name === 'email') return;

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
        // userData might contain school as an object. API likely expects ID or handles it.
        // The response from updateUserProfile is assumed to have school as an ID.
        const updatedResponse = await usersApi.updateUserProfile(userData);
        let profileDataAfterUpdate = updatedResponse.data;

        // If school is an ID in the response, fetch the full school object
        if (profileDataAfterUpdate.school && typeof profileDataAfterUpdate.school === 'string') {
          const schoolIdToFetch = profileDataAfterUpdate.school;
          try {
            const schoolApiResponse = await usersApi.getSchoolById(schoolIdToFetch);
            // Ensure schoolApiResponse.data is a valid school object with a name
            if (schoolApiResponse.data && typeof schoolApiResponse.data === 'object' && schoolApiResponse.data.name) {
              profileDataAfterUpdate.school = schoolApiResponse.data; // Replace ID with school object
            } else {
              // If lookup returns invalid data or no name, school remains an ID.
              console.warn(`Could not fully resolve school details for ID: ${schoolIdToFetch} after profile update. Displaying ID.`);
              // profileDataAfterUpdate.school remains the ID string in this case.
            }
          } catch (fetchSchoolError) {
            console.error(`Error fetching school details for ID ${schoolIdToFetch} after profile update:`, fetchSchoolError);
            const errorDetail = fetchSchoolError.response?.data?.message || fetchSchoolError.message || 'Bilinmeyen bir hata oluştu.';
            toast.error(`Okul detayları alınamadı: ${errorDetail}`);
            // School remains an ID in profileDataAfterUpdate.school on error.
          }
        }

        toast.success('Profil bilgileriniz başarıyla güncellendi.');
        // login is called with profileDataAfterUpdate, where school is now an object (if fetch succeeded) or an ID (if fetch failed).
        login(profileDataAfterUpdate, localStorage.getItem('token'));
        
        // The useEffect hook that depends on [currentUser] will update the local userData state.
        // Optionally, to make the local state update more immediate:
        // setUserData(prev => ({
        //   ...prev,
        //   name: profileDataAfterUpdate.name,
        //   email: profileDataAfterUpdate.email,
        //   role: profileDataAfterUpdate.role,
        //   school: profileDataAfterUpdate.school,
        // }));
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

  // Okul bilgisini formatlama
  const getSchoolDisplay = (school) => {
    if (!school) return 'Okul atanmamış';
    
    if (typeof school === 'object' && school !== null) {
      // Okul bir nesne ve içinde name varsa
      return school.name || 'Okul bilgisi eksik';
    }
    
    // Okul bir ID ise (string)
    if (typeof school === 'string') {
      return school;
    }
    
    return 'Okul bilgisi bulunamadı';
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <LoadingSpinner size="medium" />
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
            <ProfileCard 
              label="Kullanıcı Rolü" 
              value={getRoleName(userData.role)} 
            />
            
            {userData.school && (
              <ProfileCard 
                label="Okul" 
                value={getSchoolDisplay(userData.school)} 
              />
            )}

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
              disabled={true}
              readOnly={true}
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
            <div className="password-info">
              <p className="password-info-text">Şifrenizi değiştirmek için önce mevcut şifrenizi, ardından yeni şifrenizi girmeniz gerekmektedir.</p>
            </div>
            
            <div className="password-fields">
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
            </div>
            
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
