import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsersStats, type UsersByRole } from "../../services/statsService";
import { getCourses } from "../../services/courseService";
import DataUnavailable from "../shared/DataUnavailable";
import "../../styles/AdminPortal.css";

export default function AdminDashboardPage() {
  const [roles, setRoles] = useState<UsersByRole[]>();
  const [coursesCount, setCoursesCount] = useState<number>();
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    Promise.allSettled([getUsersStats(), getCourses()]).then(([users, courses]) => {
      if (!active) return;
      if (users.status === "fulfilled") setRoles(users.value); else setError(users.reason.message);
      if (courses.status === "fulfilled") setCoursesCount(courses.value.length); else setError(courses.reason.message);
    });
    return () => { active = false; };
  }, [attempt]);
  const total = roles?.reduce((sum, role) => sum + role.userCount, 0);
  return <div className="admin-container">
    <header className="admin-header"><div><h1 className="admin-header-title">Головна панель адміністратора</h1><p className="admin-header-sub">Контролюйте користувачів, курси, оплати та ключові показники платформи.</p></div><span className="admin-date-badge">{new Intl.DateTimeFormat("uk-UA", { dateStyle: "long" }).format(new Date())}</span></header>
    {error && <div className="data-unavailable" role="alert">{error} <button onClick={() => { setError(""); setAttempt(attempt + 1); }}>Спробувати ще раз</button></div>}
    <section className="admin-stats-row"><div className="admin-overview-card"><span className="admin-tag">[ ОГЛЯД ]</span><h2 className="admin-overview-title">Стан NEXYLVA сьогодні</h2><p className="admin-overview-sub">{roles ? roles.map(r => (r.roleName === "User" ? "Користувачі" : r.roleName) + ": " + r.userCount).join(" · ") || "Користувачів ще немає" : error ? "Показники недоступні" : "Завантаження…"}</p></div>
      <Stat value={total} label="Користувачі" /><Stat value={coursesCount} label="Курси" /><Stat label="Оплати за місяць" /><Stat label="Стабільність" />
    </section>
    <div className="admin-grid-layout"><section className="admin-chart-card"><span className="admin-tag">[ АКТИВНІСТЬ ]</span><h2 className="admin-chart-title">Динаміка платформи</h2><DataUnavailable title="Історія активності поки недоступна" /></section><aside className="admin-events-card"><h2 className="admin-events-title">Системні події</h2><DataUnavailable title="Події поки недоступні" /><div className="admin-events-links"><Link to="/admin/users" className="admin-event-link-btn">Користувачі →</Link><Link to="/admin/orders" className="admin-event-link-btn">Оплати →</Link><Link to="/admin/courses" className="admin-event-link-btn">Керування курсами →</Link></div></aside></div>
  </div>;
}
function Stat({ value, label }: { value?: number; label: string }) { return <div className="admin-stat-card"><div className="admin-stat-val">{value == null ? "—" : value.toLocaleString("uk-UA")}</div><div className="admin-stat-label">{label}</div></div>; }
