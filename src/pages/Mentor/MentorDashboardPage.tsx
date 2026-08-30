import { useEffect, useState } from "react";
import { getProfile, type UserProfile } from "../../services/profileService";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";
export default function MentorDashboardPage() { const [profile, setProfile] = useState<UserProfile>(); const [error, setError] = useState(""); useEffect(() => { getProfile().then(setProfile).catch((reason: Error) => setError(reason.message)); }, []); return <><PageHeader title="Кабінет ментора" /><Panel>{error ? <p role="alert">Не вдалося завантажити профіль: {error}</p> : <p>Ви увійшли як {profile?.username ?? profile?.email ?? "користувач"}.</p>}<p>У специфікації API немає ендпоінтів для черги робіт ментора або надсилання фідбеку.</p></Panel></>; }
