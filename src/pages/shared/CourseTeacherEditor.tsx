import { useEffect, useState } from "react";
import { getAdminUsers, type AdminUser } from "../../services/adminUsersService";
import { assignTeacherToCourse, unassignTeacherFromCourse } from "../../services/adminService";

export default function CourseTeacherEditor({ courseId, assignedTeacherId, disabled, onChanged, onBusyChange }: { courseId: string; assignedTeacherId?: string; disabled?: boolean; onChanged: () => void; onBusyChange?: (key: string, busy: boolean) => void }) {
  const [teachers, setTeachers] = useState<AdminUser[]>([]), [selected, setSelected] = useState(assignedTeacherId || "");
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [notice, setNotice] = useState("");
  const [current, setCurrent] = useState(assignedTeacherId || "");
  useEffect(() => { onBusyChange?.("teacher", busy); return () => onBusyChange?.("teacher", false); }, [busy, onBusyChange]);
  useEffect(() => { let active = true; getAdminUsers().then(users => { if (active) setTeachers(users.filter(user => user.roleName === "Teacher")); }).catch((reason: Error) => { if (active) setError(reason.message); }); return () => { active = false; }; }, []);
  async function save(remove = false) {
    setBusy(true); setError(""); setNotice("");
    try {
      if (remove) await unassignTeacherFromCourse({ courceId: courseId, teacherId: current });
      else await assignTeacherToCourse({ courceId: courseId, teacherId: selected.trim() });
      setCurrent(remove ? "" : selected.trim()); setNotice(remove ? "Ментора від’єднано." : "Ментора призначено."); onChanged();
    } catch (reason) { setError((reason as Error).message); } finally { setBusy(false); }
  }
  return <section className="admin-box-basic"><h2>Ментор курсу</h2>{error && <p role="alert" className="request-error">{error}</p>}{notice && <p role="status">{notice}</p>}
    <form className="curriculum-form" onSubmit={event => { event.preventDefault(); void save(); }}><fieldset disabled={busy || disabled}>
      <label>Ментор<select className="admin-modal-select" value={selected} onChange={event => setSelected(event.target.value)}><option value="">Оберіть ментора</option>{current && !teachers.some(user => user.id === current) && <option value={current}>Призначений ментор</option>}{teachers.map(user => <option key={user.id} value={user.id}>{user.username || user.email}</option>)}</select></label>
      <label>ID ментора<input className="admin-modal-input" required value={selected} onChange={event => setSelected(event.target.value)} /></label>
      <div className="curriculum-actions"><button type="submit" disabled={!selected.trim()}>{busy ? "Збереження…" : "Призначити"}</button><button type="button" disabled={!current} onClick={() => void save(true)}>Прибрати ментора</button></div>
    </fieldset></form>
  </section>;
}
