// src/pages/Auth/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import authApi from '../../api/auth';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors({ ...errors, email: '' });
        }
    };

    const validateForm = () => {
        const formErrors = {};
        let isValid = true;

        if (!email) {
            formErrors.email = 'E-posta adresi gereklidir';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            formErrors.email = 'Geçerli bir e-posta adresi giriniz';
            isValid = false;
        }

        setErrors(formErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            try {
                // API çağrımı yap
                await authApi.forgotPassword(email);

                setSuccess('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
                setEmail('');
            } catch (error) {
                setErrors({
                    ...errors,
                    general: error.response?.data?.message || 'İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.'
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="forgot-password-page">
            <h2 className="auth-title">Şifremi Unuttum</h2>

            {errors.general && <div className="error-alert">{errors.general}</div>}
            {success && <div className="success-alert">{success}</div>}

            <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="form-description">
                    Şifrenizi sıfırlamak için hesabınıza bağlı e-posta adresini girin. E-posta adresinize bir sıfırlama bağlantısı göndereceğiz.
                </div>

                <Input
                    type="email"
                    label="E-posta"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="E-posta adresinizi girin"
                    error={errors.email}
                    required
                />

                <div className="form-actions">
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                    </Button>
                </div>
            </form>

            <div className="auth-links">
                <Link to="/login" className="auth-link">
                    Giriş sayfasına geri dön
                </Link>
            </div>
        </div>
    );
};

export default ForgotPassword;