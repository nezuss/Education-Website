import UiIcon from "../../components/ui/Icon/UiIcon";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses, createCourse, updateCourse, deleteCourse } from "../../services/courseService";
import { getModules } from "../../services/learningService";
import type { Course } from "../../types/course";
import CourseModulesEditor from "../shared/CourseModulesEditor";
import CourseTeacherEditor from "../shared/CourseTeacherEditor";
import RequestError from "../shared/RequestError";
import DataUnavailable from "../shared/DataUnavailable";
import "../../styles/AdminPortal.css";

type CourseRow = Course & { modulesCount: number; lessonsCount?: number };

export default function CoursesManagePage() {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("api");
  const [editor, setEditor] = useState<{ course?: CourseRow }>();
  useEffect(() => {
    let active = true;
    getCourses().then(async data => {
      const rows = await Promise.all(data.map(async course => {
        try {
          const modules = await getModules(course.id);
          return { ...course, modulesCount: modules.length, lessonsCount: modules.every(module => Array.isArray(module.lessonsId)) ? modules.reduce((sum, module) => sum + module.lessonsId!.length, 0) : undefined };
        } catch { return { ...course, modulesCount: course.modules?.length ?? 0 }; }
      }));
      if (active) { setCourses(rows); setLoading(false); setError(""); }
    }).catch((reason: Error) => { if (active) { setCourses([]); setError(reason.message); setLoading(false); } });
    return () => { active = false; };
  }, [attempt]);
  function refresh() { setLoading(true); setError(""); setAttempt(value => value + 1); }
  const filtered = courses.filter(course => [course.title, course.mentor, course.direction].some(value => value?.toLocaleLowerCase("uk-UA").includes(search.trim().toLocaleLowerCase("uk-UA"))));
  if (sort === "title") filtered.sort((a, b) => a.title.localeCompare(b.title, "uk-UA"));
  if (sort === "price-up") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-down") filtered.sort((a, b) => b.price - a.price);
  if (sort === "rating") filtered.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));

  if (editor) return <CourseEditor key={editor.course?.id || "new"} course={editor.course} onClose={() => setEditor(undefined)} onChanged={refresh} onSaved={message => { setEditor(undefined); setNotice(message); refresh(); }} />;
  return <div className="admin-container admin-courses-page">
    <nav className="admin-breadcrumbs" aria-label="Навігація"><Link to="/admin">Головна</Link><span>›</span><span>Курси</span></nav>
    <header className="admin-header"><div><h1 className="admin-header-title">Керування курсами</h1><p className="admin-header-sub">Створюйте та редагуйте курси, модулі, уроки й навчальні матеріали.</p></div><button type="button" className="admin-btn-primary" onClick={() => setEditor({})}>+ Додати курс</button></header>
    {notice && <p role="status" className="curriculum-notice">{notice}</p>}
    {error && <RequestError message={error} retry={refresh} />}
    <section className="admin-stats-row"><div className="admin-overview-card"><span className="admin-tag">[ ОГЛЯД ]</span><h2 className="admin-overview-title">Курси NEXYLVA</h2><p className="admin-overview-sub">Бібліотека курсів і навчальних програм платформи.</p></div>
      {[{ value: loading || error ? "—" : courses.length, label: "Усього курсів", detail: "У бібліотеці" }, { value: "—", label: "Чернетки", detail: "Статус не надано" }, { value: "—", label: "На модерації", detail: "Статус не надано" }, { value: "—", label: "Архів", detail: "Статус не надано" }].map(stat => <div key={stat.label} className="admin-stat-card"><div className="admin-stat-val">{stat.value}</div><div className="admin-stat-label">{stat.label}</div><div className="admin-stat-change">{stat.detail}</div></div>)}
    </section>
    <div className="admin-toolbar"><div className="admin-filter-pills"><button type="button" className="admin-pill active">Усі</button>{["Активні", "Чернетки", "На модерації", "Архів"].map(label => <button key={label} type="button" className="admin-pill" disabled title="Статуси курсів поки недоступні">{label}</button>)}</div><div className="admin-controls-group"><input aria-label="Пошук курсу або ментора" placeholder="Пошук курсу або ментора…" className="mentor-search-input" value={search} onChange={event => setSearch(event.target.value)} /><select className="mentor-select" aria-label="Сортування курсів" value={sort} onChange={event => setSort(event.target.value)}><option value="api">Порядок платформи</option><option value="title">За назвою</option><option value="price-up">Ціна: від меншої</option><option value="price-down">Ціна: від більшої</option><option value="rating">За рейтингом</option></select></div></div>
    <div className="admin-courses-grid" aria-busy={loading}>
      {loading ? <p role="status">Завантаження курсів…</p> : !error && filtered.length === 0 ? <div className="admin-course-empty"><h2>{courses.length ? "За вашим запитом курсів не знайдено" : "Курсів ще немає"}</h2>{courses.length ? <button type="button" className="admin-btn-secondary" onClick={() => setSearch("")}>Очистити пошук</button> : <button type="button" className="admin-btn-primary" onClick={() => setEditor({})}>+ Створити курс</button>}</div> : !error && filtered.map(course => <article key={course.id} className="admin-course-manage-card">
        <div className="admin-course-header-banner"><span className="admin-course-status-pill">Статус не надано</span><div className="admin-course-cat">{course.direction || "Без категорії"}</div><h2 className="admin-course-name">{course.title}</h2></div>
        <div className="admin-course-body"><div className="admin-course-meta-row"><span>{course.modulesCount} модулів · {course.lessonsCount ?? "—"} уроків</span><span>{course.studentsCount ?? "—"} студентів</span></div>
          <div className="admin-course-mentor-row"><span className="admin-mentor-initial" aria-hidden="true">{course.mentor && course.assignedTeacherId ? course.mentor.charAt(0) : "—"}</span><div><strong>{course.mentor || "Не призначено"}</strong><p>Ментор курсу</p></div></div>
          <div className="admin-course-stats-boxes">{[{ value: "—", label: "завершення" }, { value: course.rating?.toLocaleString("uk-UA") ?? "—", label: "оцінка" }, { value: "—", label: "наповнення" }].map(stat => <div className="admin-course-stat-mini" key={stat.label}><div className="admin-course-stat-mini-val">{stat.value}</div><div className="admin-course-stat-mini-lbl">{stat.label}</div></div>)}</div>
          <p className="admin-course-readiness">Готовність контенту <span>Не надано</span></p><button type="button" className="admin-btn-primary admin-course-open" onClick={() => setEditor({ course })}>Керувати курсом <span><UiIcon name="arrow" /></span></button>
        </div>
      </article>)}
    </div>
    <div className="admin-grid-layout admin-course-support"><section className="admin-chart-card"><span className="admin-tag">[ АКТИВНІСТЬ ]</span><h2 className="admin-chart-title">Активність студентів за останні 7 днів</h2><DataUnavailable title="Історія активності поки недоступна" /></section><aside className="admin-events-card"><span className="admin-tag">[ ПОТРЕБУЄ УВАГИ ]</span><h2 className="admin-events-title">Модерація курсів</h2><DataUnavailable title="Статуси публікації поки недоступні" /></aside></div>
  </div>;
}

function CourseEditor({ course, onClose, onSaved, onChanged }: { course?: CourseRow; onClose: () => void; onSaved: (message: string) => void; onChanged: () => void }) {
  const [form, setForm] = useState({ title: course?.title || "", description: course?.description || "", price: String(course?.price ?? 0), weeks: String(course?.totalLearningPeriodWeeks ?? 0), projects: String(course?.projectsReadyForPortfolio ?? 0), bannerUrl: course?.bannerUrl || "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [busyItems, setBusyItems] = useState<Record<string, boolean>>({});
  const onBusyChange = useCallback((key: string, busy: boolean) => setBusyItems(previous => previous[key] === busy ? previous : { ...previous, [key]: busy }), []);
  const curriculumBusy = Object.values(busyItems).some(Boolean);
  const change = (key: keyof typeof form, value: string) => { setForm({ ...form, [key]: value }); setDirty(true); };
  async function save() {
    setSaving(true); setError("");
    try {
      const price = Number(form.price.replace(/\s/g, "").replace(",", "."));
      const weeks = Number(form.weeks), projects = Number(form.projects);
      if (!form.title.trim() || !form.description.trim() || !form.bannerUrl.trim()) throw new Error("Вкажіть назву, опис та адресу обкладинки.");
      const banner = new URL(form.bannerUrl);
      if (!["https:", "http:"].includes(banner.protocol)) throw new Error("Вкажіть адресу зображення http:// або https://.");
      if (!Number.isFinite(price) || price < 0 || !Number.isInteger(weeks) || weeks < 0 || !Number.isInteger(projects) || projects < 0) throw new Error("Перевірте ціну, тривалість та кількість проєктів.");
      const data = { title: form.title.trim(), description: form.description.trim(), price, totalLearningPeriodWeeks: weeks, projectsReadyForPortfolio: projects, bannerUrl: form.bannerUrl.trim() };
      if (course) await updateCourse({ id: course.id, ...data }); else await createCourse(data);
      onSaved("Курс збережено на сервері.");
    } catch (reason) { setError((reason as Error).message); }
    finally { setSaving(false); }
  }
  async function remove() {
    if (!course) return;
    setSaving(true); setError("");
    try { await deleteCourse(course.id); onSaved("Курс видалено на сервері."); }
    catch (reason) { setError((reason as Error).message); }
    finally { setSaving(false); }
  }
  return <div className="admin-container admin-course-editor" aria-busy={saving}>
    <nav className="admin-breadcrumbs" aria-label="Навігація"><Link to="/admin">Головна</Link><span>›</span><button type="button" disabled={saving || curriculumBusy} onClick={onClose}>Курси</button><span>›</span><span>{course?.title || "Новий курс"}</span></nav>
    <span className="admin-tag">[ ROLES / РОЛІ ]</span><header className="admin-header"><div><h1 className="admin-header-title">{course ? "Редагування курсу" : "Створення курсу"}</h1><p className="admin-header-sub">Оновіть основну інформацію та програму курсу.</p></div><div className="curriculum-actions">{dirty && <span>Є незбережені зміни</span>}<button type="button" className="admin-row-btn" disabled={saving || curriculumBusy} onClick={onClose}>До курсів</button><button type="button" className="admin-btn-primary" disabled={saving || curriculumBusy} onClick={save}>{saving ? "Збереження…" : "Зберегти зміни"}</button></div></header>
    {error && <p role="alert" className="request-error">{error}</p>}
    <div className="admin-modal-form-grid"><div><section className="admin-box-basic"><span className="admin-tag">[ BASIC INFO / ОСНОВНА ІНФОРМАЦІЯ ]</span><h2>Основні дані</h2><fieldset disabled={saving} className="admin-editor-fields"><label>Назва курсу<input className="admin-modal-input" value={form.title} onChange={event => change("title", event.target.value)} /></label><div className="admin-editor-pair"><label>Напрям<input className="admin-modal-input" disabled value={course?.direction || "Без категорії"} /></label><label>Ментор<input className="admin-modal-input" disabled value={course?.mentor || "Не призначено"} /></label></div><p>Вибір напряму поки недоступний.</p><label>Короткий опис<textarea rows={4} className="admin-modal-textarea" value={form.description} onChange={event => change("description", event.target.value)} /></label></fieldset></section>
      {course && <CourseTeacherEditor courseId={course.id} assignedTeacherId={course.assignedTeacherId} disabled={saving || curriculumBusy} onChanged={onChanged} onBusyChange={onBusyChange} />}
      <section className="admin-box-modules"><span className="admin-tag">[ MODULES / МОДУЛІ ]</span><h2>Програма курсу</h2>{course ? <CourseModulesEditor courseId={course.id} onChange={onChanged} busyItems={busyItems} onBusyChange={onBusyChange} /> : <p>Збережіть курс, щоб додати модулі.</p>}</section></div>
      <div><section className="admin-box-params"><span className="admin-tag">[ PUBLISHING / ПУБЛІКАЦІЯ ]</span><h2>Параметри курсу</h2><div className="admin-editor-param"><span>Статус</span><strong>Не надано</strong></div><div className="admin-editor-param"><span>Мова</span><strong>Не надано</strong></div><fieldset disabled={saving} className="admin-editor-fields"><label>Тривалість (тижнів)<input type="number" min="0" className="admin-modal-input" value={form.weeks} onChange={event => change("weeks", event.target.value)} /></label><label>Ціна<input inputMode="decimal" className="admin-modal-input" value={form.price} onChange={event => change("price", event.target.value)} /></label><label>Проєктів для портфоліо<input type="number" min="0" className="admin-modal-input" value={form.projects} onChange={event => change("projects", event.target.value)} /></label></fieldset></section>
      <section className="admin-box-cover"><span className="admin-tag">[ ОБКЛАДИНКА ]</span><img src={form.bannerUrl || "/course-placeholder.svg"} alt="Обкладинка курсу" /><label>Адреса зображення<input type="url" className="admin-modal-input" disabled={saving} value={form.bannerUrl} onChange={event => change("bannerUrl", event.target.value)} /></label><p>Завантаження обкладинки поки недоступне. Вкажіть адресу готового зображення.</p></section>
      <section className="admin-events-card admin-course-access"><span className="admin-tag">[ ACCESS / ДОСТУП ]</span><h2>Доступність</h2><DataUnavailable title="Параметри доступності поки недоступні">Нові реєстрації, публікація та сертифікати потребують оновлення платформи.</DataUnavailable></section>
      {course && <div className="admin-course-delete">{deleteConfirm ? <><p>Видалити курс «{course.title}»? Цю дію неможливо скасувати.</p><button type="button" disabled={saving || curriculumBusy} onClick={remove}>Підтвердити видалення</button><button type="button" disabled={saving} onClick={() => setDeleteConfirm(false)}>Скасувати</button></> : <button type="button" disabled={saving || curriculumBusy} onClick={() => setDeleteConfirm(true)}>Видалити курс</button>}</div>}
      </div></div>
  </div>;
}
