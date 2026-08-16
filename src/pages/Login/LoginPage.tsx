import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../PlatformPages.css";

export default function LoginPage() {
    const navigate = useNavigate();
    return <main className="auth-page"><section className="form-panel panel"><h1>Вхід</h1><p>Увійдіть до свого облікового запису.</p><form onSubmit={(event: FormEvent) => { event.preventDefault(); navigate("/student"); }}><label>Email<input type="email" required placeholder="you@example.com" /></label><label>Пароль<input type="password" required placeholder="Ваш пароль" /></label><button type="submit">Увійти</button></form><p><Link to="/registration">Створити новий акаунт</Link></p></section></main>;
}
