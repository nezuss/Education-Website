import { useEffect, useState } from "react";
import { getProfile, type UserProfile } from "../../services/profileService";
import DataUnavailable from "./DataUnavailable";
import PasswordChangeForm from "./PasswordChangeForm";
import "../../styles/StudentDashboard.css";

export default function AccountProfile({ title }: { title: string }) {
  const [profile, setProfile] = useState<UserProfile>();
  const [error, setError] = useState("");
  useEffect(() => { let active = true; getProfile().then((data) => { if (active) setProfile(data); }).catch((e: Error) => { if (active) setError(e.message); }); return () => { active = false; }; }, []);
  return <div className="std-dash student-profile-page"><section className="student-profile-intro"><div><span className="std-badge-tag">[ ПРОФІЛЬ ]</span><h1>{title}</h1><p>Особиста інформація вашого облікового запису.</p></div></section>
    {error && <p role="alert" className="student-profile-error">{error}</p>}
    <section className="student-profile-overview"><div className="student-profile-main-card"><span className="profile-initial-avatar">{profile?.username?.charAt(0) || "·"}</span><div className="student-profile-identity"><h2>{profile?.username || (error ? "Профіль недоступний" : "Завантаження…")}</h2><p>{profile?.email || "Email не надано"}</p></div></div><aside className="student-profile-about"><span className="std-badge-tag">[ АКАУНТ ]</span><h2>Роль</h2><p>{profile?.role || "—"}</p></aside></section>
    <section className="student-profile-lower-grid"><DataUnavailable title="Редагування профілю поки недоступне" /><PasswordChangeForm /></section>
  </div>;
}
