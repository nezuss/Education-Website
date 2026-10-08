import UiIcon from "../../components/ui/Icon/UiIcon";
import { useEffect, useRef, useState, type FormEvent, type ClipboardEvent, type KeyboardEvent } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { confirmEmail, resendVerification } from "../../services/authService";
import "../../styles/AuthPages.css";

export default function ConfirmationPage() {
  const { code: routeCode } = useParams<{ code?: string }>();
  const location = useLocation();
  const registeredEmail = (location.state as { email?: string } | undefined)?.email;
  const validRouteCode = !!routeCode && /^\d{6}$/.test(routeCode);
  const [digits, setDigits] = useState(() => Array.from({ length: 6 }, (_, index) => validRouteCode ? routeCode[index] : ""));
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(validRouteCode ? "loading" : "idle");
  const [error, setError] = useState(routeCode && !validRouteCode ? "Невірний формат коду. Введіть шість цифр із листа." : "");
  const [email, setEmail] = useState(registeredEmail || "");
  const [showEmail, setShowEmail] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const fields = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!validRouteCode) return;
    let active = true;
    confirmEmail(routeCode).then(() => { if (active) setState("success"); }).catch((reason: Error) => { if (active) { setError(reason.message); setState("error"); } });
    return () => { active = false; };
  }, [routeCode, validRouteCode]);

  function enter(index: number, value: string) {
    const numbers = value.replace(/\D/g, "").slice(0, 6);
    const next = [...digits];
    if (!numbers) next[index] = "";
    else for (let offset = 0; offset < numbers.length && index + offset < 6; offset++) next[index + offset] = numbers[offset];
    setDigits(next);
    if (numbers) fields.current[Math.min(index + numbers.length, 5)]?.focus();
  }
  function paste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const text = event.clipboardData.getData("text").replace(/\D/g, "");
    enter(text.length >= 6 ? 0 : index, text);
  }
  function navigateDigit(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) { event.preventDefault(); enter(index - 1, ""); fields.current[index - 1]?.focus(); }
    if (event.key === "ArrowLeft" && index > 0) { event.preventDefault(); fields.current[index - 1]?.focus(); }
    if (event.key === "ArrowRight" && index < 5) { event.preventDefault(); fields.current[index + 1]?.focus(); }
  }
  async function confirm(event: FormEvent) {
    event.preventDefault();
    if (digits.some(digit => !digit) || state === "loading") return;
    setError(""); setState("loading");
    try { await confirmEmail(digits.join("")); setState("success"); }
    catch (reason) { setError((reason as Error).message || "Невірний або застарілий код підтвердження"); setState("error"); }
  }
  async function resend(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) { setShowEmail(true); return; }
    setResending(true); setError(""); setResendMessage("");
    try { await resendVerification(email.trim()); setResendMessage("Код підтвердження надіслано."); setShowEmail(false); }
    catch (reason) { setError((reason as Error).message); }
    finally { setResending(false); }
  }

  return <div className="nex-auth-wrapper nex-auth-verification">
    <div className={`nex-auth-card${error ? " has-error" : ""}`}>
      <div className="nex-auth-steps" aria-label="Підтвердження email"><span className="nex-auth-step-bar" /><span className="nex-auth-step-bar active" /><span className="nex-auth-step-bar" /></div>
      <h1 className="nex-auth-title">{state === "success" ? "Email підтверджено" : "Підтвердьте Email"}</h1>
      {error && <div className="nex-auth-error-box" role="alert">{error}</div>}
      {state === "success" ? <div className="nex-auth-success" role="status">
        <UiIcon name="check-circle" size={44} /><p>Акаунт успішно активовано. Тепер ви можете увійти до свого кабінету.</p>
        <Link to="/login" className="nex-auth-submit-btn">Увійти в кабінет</Link>
      </div> : <>
        <form className="nex-auth-form" onSubmit={confirm}>
          <div className="nex-auth-code" role="group" aria-label="Шестизначний код із листа">
            {digits.map((digit, index) => <input key={index} ref={element => { fields.current[index] = element; }} aria-label={`Цифра ${index + 1}`} className="nex-auth-input" type="text" inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} pattern="[0-9]" value={digit} onChange={event => enter(index, event.target.value)} onPaste={event => paste(index, event)} onKeyDown={event => navigateDigit(index, event)} onFocus={event => event.target.select()} disabled={state === "loading" || resending} required />)}
          </div>
          <button className="nex-auth-submit-btn" type="submit" disabled={state === "loading" || resending || digits.some(digit => !digit)}>{state === "loading" ? "Перевірка…" : "Підтвердіть email"}</button>
        </form>
        <form className="nex-auth-resend" onSubmit={resend}>
          {showEmail ? <div className="nex-auth-field"><label htmlFor="verification-email">Email для повторного надсилання</label><input id="verification-email" type="email" className="nex-auth-input" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required disabled={resending} /></div> : <span>Не отримали код?</span>}
          <button className="nex-auth-text-button" type="submit" disabled={resending || state === "loading"}>{resending ? "Надсилання…" : "Надіслати ще раз"}</button>
        </form>
        {resendMessage && <p className="nex-auth-notice" role="status">{resendMessage}</p>}
        <button className="nex-auth-text-button nex-auth-change-email" type="button" disabled={resending || state === "loading"} onClick={() => setShowEmail(value => !value)}>{showEmail ? "Скасувати" : "Змінити email"}</button>
      </>}
    </div>
  </div>;
}
