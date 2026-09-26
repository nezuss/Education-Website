import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { confirmEmail } from "../../services/authService";
import "../../styles/AuthPages.css";

export default function ConfirmationPage() {
  const { code: routeCode } = useParams<{ code?: string }>();
  const location = useLocation();
  const registeredEmail = (location.state as { email?: string } | undefined)?.email;

  const [code, setCode] = useState(routeCode ?? "");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleConfirm = useCallback(async (codeToVerify?: string) => {
    const finalCode = (codeToVerify ?? code).trim();
    if (!finalCode) return;

    setError("");
    setState("loading");

    try {
      await confirmEmail(finalCode);
      setState("success");
    } catch (reason) {
      setError((reason as Error)?.message || "Невірний або застарілий код підтвердження");
      setState("error");
    }
  }, [code]);

  useEffect(() => {
    if (routeCode && routeCode.trim().length >= 4) {
      handleConfirm(routeCode.trim());
    }
  }, [routeCode, handleConfirm]);

  return (
    <div className="nex-auth-wrapper">
      <div className="nex-auth-card">
        <h1 className="nex-auth-title">Підтвердження Email</h1>
        <p className="nex-auth-subtitle">
          {registeredEmail
            ? `Ми надіслали 6-значний код на ${registeredEmail}. Введіть його для активації акаунту.`
            : "Введіть 6-значний код підтвердження, отриманий на вашу електронну пошту."}
        </p>

        {error && (
          <div className="nex-auth-error-box" role="alert">
            {error}
          </div>
        )}

        {state === "success" ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(19, 73, 44, 0.1)",
                color: "var(--color-brand-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: "28px",
              }}
            >
              ✓
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-brand-dark)", marginBottom: "8px" }}>
              Акаунт успішно активовано!
            </h3>
            <p style={{ color: "var(--color-brand-soft)", fontSize: "14px", marginBottom: "24px" }}>
              Тепер ви можете увійти до свого особистого кабінету.
            </p>
            <Link to="/login" className="nex-auth-submit-btn" style={{ display: "block", textDecoration: "none" }}>
              Увійти в кабінет
            </Link>
          </div>
        ) : (
          <form
            className="nex-auth-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
          >
            <div className="nex-auth-input-wrap">
              <input
                type="text"
                className="nex-auth-input"
                placeholder="6-значний код: 123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                maxLength={6}
                style={{ textAlign: "center", letterSpacing: "4px", fontSize: "20px", fontWeight: 700 }}
                required
              />
            </div>

            <button
              type="submit"
              className="nex-auth-submit-btn"
              disabled={state === "loading" || !code.trim()}
            >
              {state === "loading" ? "Перевірка..." : "Підтвердити Email"}
            </button>
          </form>
        )}

        <div className="nex-auth-bottom-switch">
          Вже маєте доступ? <Link to="/login">Перейти до входу</Link>
        </div>
      </div>
    </div>
  );
}
