import { useState } from 'react';

const useAuthForm = (initialData = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const setError = (field, message) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    // Email validation
    if (validationRules.email && formData.email !== undefined) {
      if (!formData.email) {
        formErrors.email = 'E-posta adresi gereklidir';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        formErrors.email = 'Geçerli bir e-posta adresi giriniz';
        isValid = false;
      }
    }

    // Password validation
    if (validationRules.password && formData.password !== undefined) {
      if (!formData.password) {
        formErrors.password = 'Şifre gereklidir';
        isValid = false;
      } else if (validationRules.password.minLength && formData.password.length < validationRules.password.minLength) {
        formErrors.password = `Şifre en az ${validationRules.password.minLength} karakter olmalıdır`;
        isValid = false;
      }
    }

    // Confirm password validation
    if (validationRules.confirmPassword && formData.confirmPassword !== undefined) {
      if (!formData.confirmPassword) {
        formErrors.confirmPassword = 'Şifre tekrarı gereklidir';
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        formErrors.confirmPassword = 'Şifreler eşleşmiyor';
        isValid = false;
      }
    }

    // Name validation
    if (validationRules.name && formData.name !== undefined) {
      if (!formData.name) {
        formErrors.name = 'Ad Soyad gereklidir';
        isValid = false;
      }
    }

    // School validation
    if (validationRules.schoolId && formData.schoolId !== undefined) {
      if (!formData.schoolId) {
        formErrors.schoolId = 'Lütfen bir okul seçin';
        isValid = false;
      }
    }

    // Custom validations
    if (validationRules.custom) {
      const customErrors = validationRules.custom(formData);
      Object.assign(formErrors, customErrors);
      if (Object.keys(customErrors).length > 0) {
        isValid = false;
      }
    }

    setErrors(formErrors);
    return isValid;
  };

  return {
    formData,
    errors,
    handleChange,
    setError,
    clearErrors,
    validateForm,
    setFormData
  };
};

export default useAuthForm; 