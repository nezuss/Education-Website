import UiIcon from "../../components/ui/Icon/UiIcon";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../../services/authService';
import '../../styles/AuthPages.css';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError('');
    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (reason) {
      setError((reason as Error)?.message || 'Не вдалося надіслати лист. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nex-auth-wrapper">
      <div className="nex-auth-card">
        <h1 className="nex-auth-title">Відновлення пароля</h1>
        <p className="nex-auth-subtitle">
          Введіть адресу електронної пошти, на яку зареєстровано акаунт
        </p>

        {error && <div className="nex-auth-error-box" role="alert">{error}</div>}

        {sent ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '44px', marginBottom: '16px' }}><UiIcon name="mail" size={44} /></div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-brand-dark)', marginBottom: '8px' }}>
              Інструкцію надіслано!
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-brand-soft)', lineHeight: 1.5, marginBottom: '24px' }}>
              Ми надіслали посилання для відновлення пароля на <strong>{email}</strong>. Перевірте поштову скриньку або папку Спам.
            </p>
            <Link to="/login" className="nex-auth-submit-btn" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
              Повернутися до входу
            </Link>
          </div>
        ) : (
          <form className="nex-auth-form" onSubmit={handleSubmit}>
            <div className="nex-auth-input-wrap">
              <input
                type="email"
                className="nex-auth-input"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="nex-auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Надсилання...' : 'Надіслати інструкцію'}
            </button>
          </form>
        )}

        <div className="nex-auth-bottom-switch" style={{ marginTop: '24px' }}>
          Згадали пароль?
          <Link to="/login">Увійти</Link>
        </div>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
