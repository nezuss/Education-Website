import PasswordField from "../../components/auth/PasswordField";
import type { FormEvent } from "react";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import { signInWithGoogle, signUp } from "../../services/authService";
import { parseJwtPayload } from "../../services/profileService";
import "../../styles/AuthPages.css";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"details" | "password">("details");
  const [details, setDetails] = useState({ username: "", email: "" });
  const [consent, setConsent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (step === "details") {
      setError("");
      setStep("password");
      return;
    }
    const password = String(formData.get("password"));
    const confirmPassword = String(formData.get("confirmPassword"));

    if (password !== confirmPassword) {
      setError("Паролі не збігаються");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const result = await signUp({
        username: details.username.trim(),
        email: details.email.trim(),
        password,
      });
      navigate("/confirm-email", { state: { email: result?.email || details.email.trim() } });
    } catch (e) {
      setError((e as Error)?.message ?? "Не вдалося зареєструватися. Спробуйте інший email.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleCredential = useCallback(async (idToken: string) => {
    setError("");
    setIsLoading(true);

    try {
      const token = await signInWithGoogle(idToken);
      const parsed = parseJwtPayload(token);
      navigate(parsed?.role === "Admin" ? "/admin" : parsed?.role === "Teacher" ? "/mentor" : "/student", { replace: true });
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleGoogleError = useCallback((message: string) => {
    setError(message);
    setIsLoading(false);
  }, []);

  return <div className="nex-auth-wrapper nex-auth-registration">
    <div className={`nex-auth-card${error ? " has-error" : ""}`}>
      <div className="nex-auth-steps" aria-label="Створення акаунту"><span className="nex-auth-step-bar active" /><span className="nex-auth-step-bar" /><span className="nex-auth-step-bar" /></div>
      <h1 className="nex-auth-title">{step === "details" ? "Створіть акаунт" : "Створіть пароль"}</h1>
      <p className="nex-auth-subtitle">{step === "details" ? "Почніть навчання та зберігайте прогрес у своєму профілі" : "Захистіть свій акаунт на платформі NEXYLVA"}</p>
      {error && <div className="nex-auth-error-box" role="alert">{error}</div>}
      <form id="registration-form" className="nex-auth-form" onSubmit={handleSubmit}>
        {step === "details" ? <>
          <div className="nex-auth-field"><label htmlFor="registration-name">Ім’я та прізвище</label><input id="registration-name" name="username" className="nex-auth-input" autoComplete="name" placeholder="Ваше ім’я та прізвище" value={details.username} onChange={event => setDetails({ ...details, username: event.target.value })} required /></div>
          <div className="nex-auth-field"><label htmlFor="registration-email">Email</label><input id="registration-email" name="email" type="email" className="nex-auth-input" autoComplete="email" placeholder="name@email.com" value={details.email} onChange={event => setDetails({ ...details, email: event.target.value })} required /></div>
        </> : <>
          <PasswordField name="password" label="Пароль" placeholder="Створіть пароль" />
          <PasswordField name="confirmPassword" label="Повторіть пароль" placeholder="Повторіть пароль" />
          <p className="nex-auth-password-hint">Рекомендуємо щонайменше 8 символів, велику літеру та цифру.</p>
        </>}
        <button type="submit" className="nex-auth-submit-btn" disabled={isLoading}>{isLoading ? "Створення…" : step === "details" ? "Продовжити" : "Створити акаунт"}</button>
        {step === "password" && <button type="button" className="nex-auth-text-button" disabled={isLoading} onClick={() => { setError(""); setStep("details"); }}>Змінити ім’я або email</button>}
      </form>
      {step === "details" && <>
        <div className="nex-auth-divider">— або —</div>
        <div className="nex-auth-socials">
          <button type="button" className="nex-auth-social-btn" disabled title="Вхід через Apple поки недоступний">Apple — недоступно</button>
          <GoogleSignInButton text="continue_with" onCredential={handleGoogleCredential} onError={handleGoogleError} />
        </div>
        <label className="nex-auth-remember nex-auth-consent"><input type="checkbox" form="registration-form" name="consent" required checked={consent} onChange={event => setConsent(event.target.checked)} />Погоджуюсь з умовами та політикою конфіденційності</label>
      </>}
      <div className="nex-auth-bottom-switch">Вже маєте акаунт? <Link to="/login">Увійти</Link></div>
    </div>
  </div>;
}
