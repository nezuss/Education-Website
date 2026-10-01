import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { changePassword } from "../../services/authService";
import "../../styles/AuthPages.css";

export default function ChangePasswordPage() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("resetToken") || searchParams.get("token") || "";
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password"));
    const confirmPassword = String(formData.get("confirmPassword"));

    if (!resetToken) {
      setError("Посилання для відновлення неповне або застаріло.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Паролі не збігаються.");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      await changePassword(resetToken, password);
      setIsComplete(true);
    } catch (reason) {
      setError((reason as Error)?.message || "Не вдалося змінити пароль. Запитайте нове посилання.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="nex-auth-wrapper">
      <div className="nex-auth-card">
        <h1 className="nex-auth-title">Новий пароль</h1>
        <p className="nex-auth-subtitle">
          Створіть новий пароль для вашого акаунту NEXYLVA
        </p>

        {error && <div className="nex-auth-error-box" role="alert">{error}</div>}

        {isComplete ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: "44px", marginBottom: "16px" }}>✓</div>
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--color-brand-dark)", marginBottom: "8px" }}>
              Пароль успішно змінено
            </h3>
            <p style={{ fontSize: "14px", color: "var(--color-brand-soft)", lineHeight: 1.5, marginBottom: "24px" }}>
              Тепер ви можете увійти за допомогою нового пароля.
            </p>
            <Link to="/login" className="nex-auth-submit-btn" style={{ display: "block", textDecoration: "none", textAlign: "center" }}>
              Увійти
            </Link>
          </div>
        ) : (
          <form className="nex-auth-form" onSubmit={handleSubmit}>
            <div className="nex-auth-input-wrap">
              <input name="password" type="password" className="nex-auth-input" placeholder="Новий пароль" autoComplete="new-password" required />
            </div>
            <div className="nex-auth-input-wrap">
              <input name="confirmPassword" type="password" className="nex-auth-input" placeholder="Повторіть новий пароль" autoComplete="new-password" required />
            </div>
            <button type="submit" className="nex-auth-submit-btn" disabled={isLoading || !resetToken}>
              {isLoading ? "Збереження..." : "Змінити пароль"}
            </button>
          </form>
        )}

        {!isComplete && (
          <div className="nex-auth-bottom-switch" style={{ marginTop: "24px" }}>
            <Link to="/forgot-password">Надіслати нове посилання</Link>
          </div>
        )}
      </div>
    </div>
  );
}
