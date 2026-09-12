import type { FormEvent } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signUp } from "../../services/authService";
import "../PlatformPages.css";

export default function RegistrationPage() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const password = String(formData.get("password"));

        if (password !== String(formData.get("confirmPassword"))) {
            setError("Паролі не збігаються");
            return;
        }

        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            await signUp({
                username: String(formData.get("username")),
                email: String(formData.get("email")),
                password,
            });
            setSuccess("Акаунт створено. Перевірте пошту та підтвердьте email.");
            event.currentTarget.reset();
        } catch (e) {
            setError((e as Error)?.message ?? "Не вдалося зареєструватися. Спробуйте інший email.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="form-panel panel">
                <h1>Реєстрація</h1>
                <p>Створіть обліковий запис, щоб записатися на курс.</p>
                {success ? (
                    <div style={{ margin: "20px 0", textAlign: "center" }}>
                        <p style={{ color: "#2e7d32", fontWeight: 600, fontSize: "16px" }}>{success}</p>
                        <p style={{ margin: "12px 0", color: "#555" }}>
                            Введіть 6-значний код підтвердження, який було надіслано на вашу пошту.
                        </p>
                        <Link className="button-link" to="/confirm-email" style={{ display: "inline-block", marginTop: "12px" }}>
                            Ввести код підтвердження →
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label>
                            Ім’я
                            <input name="username" required placeholder="ivan_dev" />
                        </label>
                        <label>
                            Email
                            <input name="email" type="email" required placeholder="you@example.com" />
                        </label>
                        <label>
                            Пароль
                            <input name="password" type="password" required />
                        </label>
                        <label>
                            Підтвердьте пароль
                            <input name="confirmPassword" type="password" required />
                        </label>
                        {error && <p role="alert" style={{ color: "#d32f2f" }}>{error}</p>}
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "Реєстрація..." : "Створити акаунт"}
                        </button>
                    </form>
                )}
                <p style={{ marginTop: "16px" }}>
                    <Link to="/login">Вже є акаунт? Увійти</Link>
                </p>
            </section>
        </main>
    );
}
