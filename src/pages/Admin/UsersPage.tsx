import UiIcon from "../../components/ui/Icon/UiIcon";
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { getAdminUsers, getAdminUser, createAdminUser, updateAdminUser, deleteAdminUser, type AdminUser } from "../../services/adminUsersService";
import { parseJwtPayload } from "../../services/profileService";
import RequestError from "../shared/RequestError";
import "../../styles/AdminPortal.css";
const roleLabel = (user: AdminUser) => user.roleName === "Admin" ? "Адміністратор" : user.roleName === "Teacher" ? "Ментор" : user.roleName === "None" || user.roleName === "User" ? "Студент" : "Роль не надано";
const date = (value?: string) => value && Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleDateString("uk-UA") : "—";
export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]), [loading, setLoading] = useState(true), [error, setError] = useState(""), [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0), [search, setSearch] = useState(""), [roleFilter, setRoleFilter] = useState("all"), [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<AdminUser>(), [creating, setCreating] = useState(false), [busy, setBusy] = useState(false), [actionError, setActionError] = useState("");
  const [username, setUsername] = useState(""), [email, setEmail] = useState(""), [password, setPassword] = useState("");
  const currentId = parseJwtPayload(localStorage.getItem("token") ?? "")?.id;
  useEffect(() => {
    let active = true;
    getAdminUsers().then(data => { if (active) { setUsers(data); setError(""); } }).catch((reason: Error) => { if (active) setError(reason.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [revision]);
  const filtered = users.filter(user => (!search || `${user.username} ${user.email}`.toLowerCase().includes(search.toLowerCase())) && (roleFilter === "all" || (roleFilter === "None" ? user.roleName === "None" || user.roleName === "User" : user.roleName === roleFilter)) && (statusFilter === "all" || user.isEmailConfirmed === (statusFilter === "confirmed")));
  async function open(id: string) {
    setBusy(true); setActionError("");
    try { const user = await getAdminUser(id); setSelected(user); setUsername(user.username); setEmail(user.email); setPassword(""); } catch (reason) { setError((reason as Error).message); } finally { setBusy(false); }
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setActionError("");
    try {
      if (creating) await createAdminUser({ username: username.trim(), email: email.trim(), password });
      else if (selected) await updateAdminUser({ id: selected.id, username: username.trim(), email: email.trim(), ...(password ? { password } : {}) });
      else return;
      setCreating(false); setSelected(undefined); setPassword(""); setEmail(""); setUsername(""); setNotice("Користувача збережено на сервері."); setRevision(value => value + 1);
    }
    catch (reason) { setActionError((reason as Error).message); } finally { setBusy(false); }
  }
  async function remove() {
    if (!selected || !currentId || selected.id === currentId || !window.confirm(`Видалити акаунт ${selected.email}? Цю дію неможливо скасувати.`)) return;
    setBusy(true); setActionError("");
    try { await deleteAdminUser(selected.id); setSelected(undefined); setNotice("Користувача видалено на сервері."); setRevision(value => value + 1); }
    catch (reason) { setActionError((reason as Error).message); } finally { setBusy(false); }
  }
  return <div className="admin-container">
    <Link to="/admin">Головна</Link><header className="admin-header"><div><h1 className="admin-header-title">Керування користувачами</h1><p className="admin-header-sub">Акаунти та підтвердження електронної пошти.</p></div><button className="admin-btn-primary" disabled={busy} onClick={() => { setCreating(true); setActionError(""); }}>+ Додати користувача</button></header>
    {error && <RequestError message={error} />}{notice && <p role="status">{notice}</p>}
    <section className="admin-stats-row">{[["Усього користувачів", users.length], ["Email підтверджено", users.filter(user => user.isEmailConfirmed === true).length], ["Email не підтверджено", users.filter(user => user.isEmailConfirmed === false).length]].map(([label, count]) => <div className="admin-stat-card" key={label}><div className="admin-stat-val">{loading || error ? "—" : count}</div><div className="admin-stat-label">{label}</div></div>)}</section>
    <div className="admin-toolbar"><div className="admin-controls-group"><input className="mentor-search-input" aria-label="Пошук користувача" placeholder="Ім’я або email" value={search} onChange={event => setSearch(event.target.value)} /><select className="mentor-select" aria-label="Роль" value={roleFilter} disabled={users.some(user => user.roleName === undefined)} onChange={event => setRoleFilter(event.target.value)}><option value="all">Усі ролі</option><option value="None">Студенти</option><option value="Teacher">Ментори</option><option value="Admin">Адміністратори</option></select><select className="mentor-select" aria-label="Email" value={statusFilter} onChange={event => setStatusFilter(event.target.value)}><option value="all">Усі email</option><option value="confirmed">Підтверджені</option><option value="pending">Не підтверджені</option></select><button className="admin-btn-secondary" disabled={busy} onClick={() => setRevision(value => value + 1)}>Оновити</button></div></div>
    {!loading && !error && users.some(user => user.roleName === undefined) && <p>API не повертає назви ролей користувачів. Фільтр за роллю поки недоступний.</p>}
    <div className="admin-table-wrap">{loading ? <p role="status">Завантаження користувачів…</p> : !error && filtered.length === 0 ? <p>Користувачів не знайдено.</p> : null}<div className="admin-table-header"><span>№</span><span>Користувач</span><span>Роль</span><span>Реєстрація</span><span>Останній вхід</span><span>Email</span><span>Курси</span><span>Дія</span></div>{!error && filtered.map((user, index) => <div className="admin-table-row" key={user.id}><span>{index + 1}</span><div><div className="admin-user-name">{user.username || "—"}</div><div className="admin-user-email">{user.email || "—"}</div></div><span>{roleLabel(user)}</span><span>{date(user.createdAt)}</span><span>—</span><span>{user.isEmailConfirmed === undefined ? "—" : user.isEmailConfirmed ? "Підтверджено" : "Не підтверджено"}</span><span>{user.enrolledCourcesId?.length ?? "—"}</span><button className="admin-row-btn" disabled={busy} onClick={() => open(user.id)}>Відкрити <UiIcon name="arrow" /></button></div>)}</div>
    {(creating || selected) && <div className="admin-users-modal" role="dialog" aria-modal="true" aria-label={creating ? "Додати користувача" : "Користувач"}><div className="admin-user-card-view admin-users-dialog">
      <h2>{creating ? "Додати користувача" : selected?.username}</h2>{actionError && <RequestError message={actionError} />}
      <form onSubmit={save}>
        <label>Ім’я користувача<input required value={username} onChange={event => setUsername(event.target.value)} disabled={busy} /></label>
        <label>Email<input required type="email" value={email} onChange={event => setEmail(event.target.value)} disabled={busy} /></label>
        <label>{creating ? "Пароль" : "Новий пароль (необов’язково)"}<input required={creating} type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} disabled={busy} /></label>
        <button className="admin-btn-primary" disabled={busy}>{busy ? "Збереження…" : creating ? "Створити" : "Зберегти"}</button>
      </form>
      {!creating && <><p>Роль: {selected && roleLabel(selected)}</p><p>Курси: {selected?.enrolledCourcesId?.length ?? "—"}</p><p>Зміна ролі та блокування поки недоступні.</p><button className="admin-btn-secondary" disabled={busy || !currentId || selected?.id === currentId} onClick={remove}>Видалити акаунт</button></>}
      <button className="admin-btn-secondary" disabled={busy} onClick={() => { setCreating(false); setSelected(undefined); setPassword(""); setActionError(""); }}>Закрити</button>
    </div></div>}
  </div>;
}
