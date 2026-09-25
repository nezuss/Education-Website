import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/AuthPages.css';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="nex-auth-wrapper">
      <div className="nex-auth-card">
        <h1 className="nex-auth-title">Відновлення пароля</h1>
        <p className="nex-auth-subtitle">
          Введіть адресу електронної пошти, на яку зареєстровано акаунт
        </p>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>✉️</div>
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

            <button type="submit" className="nex-auth-submit-btn">
              Надіслати інструкцію
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
