import PasswordField from "../../components/auth/PasswordField";
import type { FormEvent } from "react";
import { useCallback, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import { signIn, signInWithGoogle } from "../../services/authService";
import { getProfile } from "../../services/profileService";
import "../../styles/AuthPages.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setError("");
    setIsLoading(true);

    try {
      await signIn({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      });

      const from = searchParams.get("from") || searchParams.get("redirect");
      if (from) {
        navigate(decodeURIComponent(from), { replace: true });
        return;
      }

      const parsed = await getProfile();
      if (parsed?.role === "Admin") {
        navigate("/admin", { replace: true });
      } else if (parsed?.role === "Teacher") {
        navigate("/mentor", { replace: true });
      } else {
        navigate("/student", { replace: true });
      }
    } catch (e) {
      setError((e as Error)?.message ?? "Email або пароль введено неправильно.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleCredential = useCallback(async (idToken: string) => {
    setError("");
    setIsLoading(true);

    try {
      await signInWithGoogle(idToken);
      const from = searchParams.get("from") || searchParams.get("redirect");
      if (from) {
        navigate(decodeURIComponent(from), { replace: true });
        return;
      }

      const parsed = await getProfile();
      navigate(parsed?.role === "Admin" ? "/admin" : parsed?.role === "Teacher" ? "/mentor" : "/student", { replace: true });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, searchParams]);

  const handleGoogleError = useCallback((message: string) => {
    setError(message);
    setIsLoading(false);
  }, []);

  return (
    <div className="nex-auth-wrapper nex-auth-login">
      <div className={`nex-auth-card${error ? " has-error" : ""}`}>
        <h1 className="nex-auth-title">Вітаємо в NEXYLVA</h1>
        <p className="nex-auth-subtitle">
          Увійдіть в особистий кабінет, щоб продовжити навчання
        </p>

        {error && (
          <div className="nex-auth-error-box" role="alert">
            {error}
          </div>
        )}

        <form className="nex-auth-form" onSubmit={handleSubmit}>
          <div className="nex-auth-field nex-auth-field-inline">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              autoComplete="email"
              name="email"
              type="email"
              className="nex-auth-input"
              placeholder="name@email.com"
              required
            />
          </div>

          <PasswordField name="password" label="Пароль" placeholder="Введіть пароль" autoComplete="current-password" inlineLabel />

          <div className="nex-auth-options">
            <label className="nex-auth-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Запам’ятати мене
            </label>
            <Link to="/forgot-password" className="nex-auth-forgot">
              Забули пароль?
            </Link>
          </div>

          <button
            type="submit"
            className="nex-auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Вхід..." : "Увійти / Реєстрація"}
          </button>
        </form>

        <div className="nex-auth-divider">— або —</div>

        <div className="nex-auth-socials">
          <button type="button" className="nex-auth-social-btn" disabled title="Вхід через Apple поки недоступний">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.47c.63-.78 1.07-1.85.95-2.93-.93.04-2.04.62-2.7 1.39-.58.67-1.1 1.76-.96 2.82 1.03.08 2.08-.52 2.71-1.28z"></path>
            </svg>
            Apple — недоступно
          </button>

          <GoogleSignInButton onCredential={handleGoogleCredential} onError={handleGoogleError} />
        </div>

        <div className="nex-auth-bottom-switch">
          Ще не зареєстровані?
          <Link to="/registration">Створити акаунт</Link>
        </div>
      </div>
    </div>
  );
}
