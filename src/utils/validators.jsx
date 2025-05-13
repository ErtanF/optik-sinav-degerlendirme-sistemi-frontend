// Profile form validation
export function validateProfileForm(userData) {
  const errors = {};
  if (!userData.name) {
    errors.name = 'Ad Soyad gereklidir';
  }
  if (!userData.email) {
    errors.email = 'E-posta adresi gereklidir';
  } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
    errors.email = 'Geçerli bir e-posta adresi giriniz';
  }
  return errors;
}

// Password form validation
export function validatePasswordForm(passwordData) {
  const errors = {};
  if (!passwordData.currentPassword) {
    errors.currentPassword = 'Mevcut şifre gereklidir';
  }
  if (!passwordData.newPassword) {
    errors.newPassword = 'Yeni şifre gereklidir';
  } else if (passwordData.newPassword.length < 6) {
    errors.newPassword = 'Şifre en az 6 karakter olmalıdır';
  }
  if (!passwordData.confirmPassword) {
    errors.confirmPassword = 'Şifre tekrarı gereklidir';
  } else if (passwordData.newPassword !== passwordData.confirmPassword) {
    errors.confirmPassword = 'Şifreler eşleşmiyor';
  }
  return errors;
}
