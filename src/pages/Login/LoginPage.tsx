import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../../services/authService";
import "../PlatformPages.css";

export default function LoginPage() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
            navigate("/student");
        } catch (e) {
            setError((e as Error)?.message ?? "Не вдалося увійти");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="form-panel panel">
                <h1>Вхід</h1>
                <p>Увійдіть до свого облікового запису.</p>
                <form onSubmit={handleSubmit}>
                    <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
                    <label>Пароль<input name="password" type="password" required /></label>
                    {error && <p role="alert">{error}</p>}
                    <button type="submit" disabled={isLoading}>{isLoading ? "Вхід..." : "Увійти"}</button>
                </form>
                <p><Link to="/registration">Створити новий акаунт</Link></p>
            </section>
        </main>
    );
}
