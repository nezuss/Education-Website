import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../services/authService";
import "../../styles/AuthPages.css";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password"));
    const confirmPassword = String(formData.get("confirmPassword"));

    if (password !== confirmPassword) {
      setError("Паролі не збігаються");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await signUp({
        username: String(formData.get("username")),
        email: String(formData.get("email")),
        password,
      });
      navigate("/choose-role");
    } catch (e) {
      setError((e as Error)?.message ?? "Не вдалося зареєструватися. Спробуйте інший email.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="nex-auth-wrapper">
      <div className="nex-auth-card">
        
        <div className="nex-auth-steps">
          <div className="nex-auth-step-bar active"></div>
          <div className="nex-auth-step-bar"></div>
          <div className="nex-auth-step-bar"></div>
        </div>

        <h1 className="nex-auth-title">Створення акаунту</h1>
        <p className="nex-auth-subtitle">
          Зареєструйтесь, щоб отримати доступ до курсів та платформи NEXYLVA
        </p>

        {error && (
          <div className="nex-auth-error-box" role="alert">
            {error}
          </div>
        )}

        <form className="nex-auth-form" onSubmit={handleSubmit}>
          <div className="nex-auth-input-wrap">
            <input
              name="username"
              type="text"
              className="nex-auth-input"
              placeholder="Ім’я та прізвище"
              required
            />
          </div>

          <div className="nex-auth-input-wrap">
            <input
              name="email"
              type="email"
              className="nex-auth-input"
              placeholder="Email: name@email.com"
              required
            />
          </div>

          <div className="nex-auth-input-wrap">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className="nex-auth-input"
              placeholder="Придумайте пароль"
              required
            />
            <button
              type="button"
              className="nex-auth-pwd-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {showPassword ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </>
                )}
              </svg>
            </button>
          </div>

          <div className="nex-auth-input-wrap">
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              className="nex-auth-input"
              placeholder="Повторіть пароль"
              required
            />
          </div>

          <button
            type="submit"
            className="nex-auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Створення..." : "Продовжити"}
          </button>
        </form>

        <div className="nex-auth-divider">— або —</div>

        <div className="nex-auth-socials">
          <button type="button" className="nex-auth-social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.47c.63-.78 1.07-1.85.95-2.93-.93.04-2.04.62-2.7 1.39-.58.67-1.1 1.76-.96 2.82 1.03.08 2.08-.52 2.71-1.28z"></path>
            </svg>
            Apple ID
          </button>

          <button type="button" className="nex-auth-social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"></path>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"></path>
            </svg>
            Google
          </button>
        </div>

        <div className="nex-auth-bottom-switch">
          Вже є обліковий запис?
          <Link to="/login">Увійти</Link>
        </div>
      </div>
    </div>
  );
}
