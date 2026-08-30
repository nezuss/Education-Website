import { useEffect, useState } from "react";
import { getProfile, type UserProfile } from "../../services/profileService";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";
export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile>(); 
    const [error, setError] = useState("");
    useEffect(() => { getProfile().then(setProfile).catch((reason: Error) => setError(reason.message)); }, []);
    return <><PageHeader title="Профіль" /><section className="form-panel"><Panel>{error ? 
    <p role="alert">Не вдалося завантажити профіль: {error}</p> : !profile ? <p>Завантаження…</p>
     : <dl className="profile-list"><dt>Ім’я</dt><dd>{profile.username ?? profile.name ?? "—"}</dd><dt>Email</dt><dd>{profile.email ?? "—"}</dd><dt>Роль</dt><dd>{profile.role ?? "—"}</dd></dl>}<p className="meta">API наразі не містить ендпоінта для редагування профілю.</p></Panel></section></>;
}
