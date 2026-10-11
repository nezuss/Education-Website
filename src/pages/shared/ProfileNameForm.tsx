import { useState, type FormEvent } from "react";
import { getProfile, updateProfile, type UserProfile } from "../../services/profileService";
import "./ProfileNameForm.css";

type ProfileNameFormProps = {
  username?: string;
  disabled?: boolean;
  onSaved?: (profile: UserProfile) => void;
};

export default function ProfileNameForm({ username, disabled = false, onSaved }: ProfileNameFormProps) {
  const [draft, setDraft] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [requestedName, setRequestedName] = useState<string>();
  const needsConfirmation = requestedName !== undefined;
  const [error, setError] = useState("");
  const [confirmedName, setConfirmedName] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled || busy) return;
    setBusy(true); setError(""); setConfirmedName("");
    try {
      let expectedName = requestedName;
      if (expectedName === undefined) {
        expectedName = (draft ?? username ?? "").trim();
        await updateProfile({ username: expectedName });
        setRequestedName(expectedName);
      }
      const freshProfile = await getProfile();
      if (typeof freshProfile.username !== "string" || !freshProfile.username.trim()) {
        throw new Error("Не вдалося перевірити збережене ім’я. Спробуйте ще раз.");
      }
      if (expectedName && freshProfile.username !== expectedName) {
        throw new Error("Збереження нового імені ще не підтверджено. Спробуйте перевірити ще раз.");
      }
      setDraft(freshProfile.username);
      setRequestedName(undefined);
      onSaved?.(freshProfile);
      setConfirmedName(freshProfile.username);
      if (typeof window !== "undefined") window.dispatchEvent(new Event("profile:updated"));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не вдалося зберегти ім’я. Спробуйте ще раз.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="profile-name-section" id="profile-name-editor">
    <h2>Ім’я профілю</h2>
    <p className="profile-name-description">Тут можна змінити ім’я та прізвище. Порожнє поле залишає поточне ім’я без змін.</p>
    {error && <p className="profile-name-error" role="alert">{error}</p>}
    {confirmedName && <p className="profile-name-success" role="status">Збережено. Поточне ім’я: {confirmedName}</p>}
    <form className="profile-name-form" onSubmit={save}>
      <fieldset disabled={disabled || busy}>
        <label>Ім’я та прізвище<input name="username" autoComplete="name" value={draft ?? username ?? ""} onChange={event => { setDraft(event.target.value); setRequestedName(undefined); setError(""); setConfirmedName(""); }} /></label>
        <button type="submit">{busy ? "Збереження…" : needsConfirmation ? "Перевірити збереження" : "Зберегти ім’я"}</button>
      </fieldset>
    </form>
  </section>;
}
