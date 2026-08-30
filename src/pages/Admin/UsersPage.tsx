import { useEffect, useState } from "react";
import { getProfile, type UserProfile } from "../../services/profileService";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";
export default function UsersPage() {
     const [profile, setProfile] = useState<UserProfile>(); 
     const [error, setError] = useState(""); useEffect(() => 
        { getProfile().then(setProfile).catch((reason: Error) => setError(reason.message)); },
      []); return <><PageHeader title="Користувачі" description="Поточний обліковий запис." /><Panel>{error ? <p role="alert">{error}</p> : !profile ? <p>Завантаження…</p> : <p>{profile.username ?? profile.name ?? "—"} · {profile.email ?? "—"} · {profile.role ?? "—"}</p>}<p className="meta">API не надає ендпоінта для переліку всіх користувачів.</p></Panel></>; }
