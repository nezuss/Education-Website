import { useEffect, useState } from "react";
import { getUsersStats, type UsersByRole } from "../../services/statsService";
import DataUnavailable from "../shared/DataUnavailable";
import "../../styles/AdminPortal.css";
export default function AnalyticsPage() {
  const [roles, setRoles] = useState<UsersByRole[]>(); const [error, setError] = useState(""); const [attempt, setAttempt] = useState(0);
  useEffect(() => { let active = true; getUsersStats().then(data => { if (active) setRoles(data); }).catch((e: Error) => { if (active) setError(e.message); }); return () => { active = false; }; }, [attempt]);
  return <div className="admin-container"><header className="admin-header"><div><h1 className="admin-header-title">Аналітика платформи</h1><p className="admin-header-sub">Ключові показники навчання, користувачів та фінансової активності NEXYLVA.</p></div><button className="admin-btn-secondary" disabled>Експорт звіту ⤓</button></header>
    {error && <div role="alert" className="data-unavailable">{error} <button onClick={() => { setError(""); setAttempt(attempt + 1); }}>Спробувати ще раз</button></div>}
    <section className="unavailable-stat-grid">{roles?.map(role => <div className="admin-stat-card" key={role.roleName}><div className="admin-stat-val">{role.userCount}</div><div className="admin-stat-label">{role.roleName === "User" ? "Користувачі" : role.roleName === "Teacher" ? "Ментори" : role.roleName}</div></div>)}</section>
    <div className="admin-analytics-grid"><section className="admin-chart-card"><span className="admin-tag">[ ДИНАМІКА ]</span><h2 className="admin-chart-title">Активність користувачів</h2><DataUnavailable /></section><section className="admin-chart-card"><span className="admin-tag">[ НАВЧАННЯ ]</span><h2 className="admin-chart-title">Завершення курсів</h2><DataUnavailable /></section><section className="admin-chart-card"><span className="admin-tag">[ ФІНАНСИ ]</span><h2 className="admin-chart-title">Фінансова аналітика</h2><DataUnavailable /></section></div>
  </div>;
}
