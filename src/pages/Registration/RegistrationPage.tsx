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
        } catch {
            setError("Не вдалося зареєструватися. Спробуйте інший email.");
        } finally {
            setIsLoading(false);
        }
    }

    return <main className="auth-page"><section className="form-panel panel"><h1>Реєстрація</h1><p>Створіть обліковий запис, щоб записатися на курс.</p><form onSubmit={handleSubmit}><label>Ім’я<input name="username" required /></label><label>Email<input name="email" type="email" required /></label><label>Пароль<input name="password" type="password" required /></label><label>Підтвердьте пароль<input name="confirmPassword" type="password" required /></label>{error && <p role="alert">{error}</p>}{success && <p>{success}</p>}<button type="submit" disabled={isLoading}>{isLoading ? "Реєстрація..." : "Створити акаунт"}</button></form><p><Link to="/login">Вже є акаунт? Увійти</Link></p></section></main>;
}
