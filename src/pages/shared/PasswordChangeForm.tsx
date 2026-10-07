import { useState, type FormEvent } from "react";
import { updateAccountPassword } from "../../services/authService";
import "./PasswordChangeForm.css";

export default function PasswordChangeForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const oldPassword = String(data.get("oldPassword") || "");
    const newPassword = String(data.get("newPassword") || "");
    setError(""); setComplete(false);
    if (newPassword !== data.get("confirmPassword")) { setError("Паролі не збігаються."); return; }
    setBusy(true);
    try { await updateAccountPassword(oldPassword, newPassword); form.reset(); setComplete(true); }
    catch (reason) { setError((reason as Error).message); }
    finally { setBusy(false); }
  }
  return <section className="student-profile-personal"><h2>Змінити пароль</h2>
    {error && <p role="alert" className="request-error">{error}</p>}
    {complete && <p role="status">Пароль успішно змінено.</p>}
    <form className="password-change-form" onSubmit={save}><fieldset disabled={busy}>
      <label>Поточний пароль<input className="admin-modal-input" type="password" name="oldPassword" autoComplete="current-password" required /></label>
      <label>Новий пароль<input className="admin-modal-input" type="password" name="newPassword" autoComplete="new-password" required /></label>
      <label>Повторіть новий пароль<input className="admin-modal-input" type="password" name="confirmPassword" autoComplete="new-password" required /></label>
      <button className="std-continue-btn" type="submit">{busy ? "Збереження…" : "Змінити пароль"}</button>
    </fieldset></form>
  </section>;
}
