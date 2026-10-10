import { useCallback, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import UiIcon from "../../components/ui/Icon/UiIcon";
import { getMentorSubmissions, type MentorSubmission } from "../../services/mentorService";
import { submissionGrade } from "../../services/submissionService";
import { currentFeedbackState } from "../../services/studentFeedbackPresentation";
import { assignmentDate } from "../../services/assignmentService";
import { getProfile } from "../../services/profileService";
import { getMentorQueueContexts } from "../../services/mentorQueueContextService";
import useRemoteData from "../shared/useRemoteData";
import RequestError from "../shared/RequestError";
import "../../styles/MentorDashboard.css";
import "../../styles/MentorQueue.css";

const filters = [["all", "Усі"], ["new", "Нові"], ["in-review", "На перевірці"], ["returned", "Повернено"], ["reviewed", "Перевірені"]];
const pageSize = 10;

export default function MentorSubmissionsPage() {
  const { data, loading, error, reload } = useRemoteData(getMentorSubmissions);
  const profile = useRemoteData(getProfile);
  const loadContext = useCallback(() => data?.length && profile.data
    ? getMentorQueueContexts(data, profile.data) : Promise.resolve(undefined), [data, profile.data]);
  const learning = useRemoteData(loadContext);
  const contexts = learning.data?.contexts;
  const contextLoading = !!data?.length && (profile.loading || learning.loading);
  const contextUnavailable = !!data?.length && !contextLoading && (learning.error || learning.data?.unavailable || !learning.data);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const unknownCount = data?.filter(item => currentFeedbackState(item).key === "unknown").length;
  const count = (key: string) => data && unknownCount === 0 ? data.filter(item => currentFeedbackState(item).key === key).length : undefined;
  const newCount = count("new"), inReviewCount = count("in-review"), reviewedCount = count("reviewed"), returnedCount = count("returned");
  const pendingCount = newCount !== undefined && inReviewCount !== undefined ? newCount + inReviewCount : undefined;
  const reviewedPercent = data?.length && reviewedCount !== undefined ? Math.round(reviewedCount / data.length * 100) : undefined;
  const returnedPercent = data?.length && returnedCount !== undefined ? Math.round(returnedCount / data.length * 100) : undefined;
  const courses = Array.from(new Map(Array.from(contexts?.values() ?? [], context => [context.courseId, context.courseTitle])).entries())
    .sort((a, b) => a[1].localeCompare(b[1], "uk"));
  const hasUnknownCourse = !!data?.some(item => !contexts?.has(item.relatedMaterialId.trim()));
  const selectedCourse = course === "all" || (course === "unavailable" && hasUnknownCourse) || courses.some(([id]) => id === course) ? course : "all";
  const filtered = (data ?? []).filter(item => {
    const context = contexts?.get(item.relatedMaterialId.trim());
    return (filter === "all" || currentFeedbackState(item).key === filter)
      && (selectedCourse === "all" || (selectedCourse === "unavailable" ? !context : context?.courseId === selectedCourse))
      && [item.student.username, item.student.email, item.id, item.relatedMaterialId, materialLabel(item), context?.materialTitle, context?.courseTitle, context?.moduleTitle, context?.lessonTitle]
        .filter(Boolean).join(" ").toLowerCase().includes(search.trim().toLowerCase());
  }).sort((a, b) => sort === "student" ? studentName(a).localeCompare(studentName(b), "uk") || a.id.localeCompare(b.id) : compareSubmitted(a, b, sort === "oldest"));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const metrics = [{ value: pendingCount, label: "очікують перевірки" }, { value: newCount, label: "нові роботи" }, { value: inReviewCount, label: "у роботі" }];

  return <div className="mentor-queue">
    <nav className="mq-breadcrumbs" aria-label="Хлібні крихти"><Link to="/mentor">Головна</Link><UiIcon name="chevron" size={14} /><span>На перевірці</span></nav>
    <header className="mq-header"><div><h1>Завдання на перевірці</h1><p>Перевіряйте роботи студентів, залишайте feedback та відстежуйте статуси перевірки.</p></div><time dateTime={new Date().toISOString()}>{new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}</time></header>
    <section className="mq-overview" aria-label="Огляд черги">
      <div className="mq-overview-intro"><span className="mq-tag">[ ОГЛЯД ]</span><h2>Черга перевірки</h2><p>Усі роботи, які зараз потребують вашої уваги.</p></div>
      <dl className="mq-metrics">{metrics.map(({ value, label }) => <div key={label}><dt>{label}</dt><dd className={value === undefined ? "mq-unavailable" : ""}>{value ?? "Дані поки недоступні"}</dd></div>)}</dl>
    </section>
    <div className="mq-toolbar"><div className="mq-filters" aria-label="Статус роботи">{filters.map(([key, label]) => <button key={key} type="button" aria-pressed={filter === key} onClick={() => { setFilter(key); setPage(1); }}>{label}</button>)}</div>
      <div className="mq-controls"><label className="mq-search"><input aria-label="Пошук за студентом, роботою або курсом" placeholder="Знайти роботу…" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} /><UiIcon name="search" size={22} /></label>
        <select aria-label="Фільтр за курсом" disabled={!data?.length || contextLoading} value={selectedCourse} onChange={event => { setCourse(event.target.value); setPage(1); }}><option value="all">Усі курси</option>{courses.map(([id, title]) => <option key={id} value={id}>{title}</option>)}{hasUnknownCourse && !contextLoading && <option value="unavailable">Курс недоступний</option>}</select>
        <select aria-label="Сортування робіт" value={sort} onChange={event => { setSort(event.target.value); setPage(1); }}><option value="newest">Спочатку нові</option><option value="oldest">Спочатку давні</option><option value="student">За студентом</option></select>
        <button type="button" className="mq-refresh" disabled={loading} onClick={reload} aria-label="Оновити роботи" title="Оновити роботи"><UiIcon name="loading" size={20} /></button>
      </div>
    </div>
    {error && <RequestError message={error} retry={reload} />}
    <div className="mq-table-wrap" aria-busy={loading}><table className="mq-table"><caption className="mq-sr-only">Роботи студентів{data ? `: ${filtered.length}` : ""}</caption><thead><tr><th scope="col">№</th><th scope="col">Студент</th><th scope="col">Робота</th><th scope="col">Курс / модуль / надіслано</th><th scope="col">Статус</th><th scope="col">Дія</th></tr></thead><tbody>
      {filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, index) => {
        const state = currentFeedbackState(item);
        const name = studentName(item);
        const context = contexts?.get(item.relatedMaterialId.trim());
        const title = context?.materialTitle || materialLabel(item);
        const date = assignmentDate(item.submittedAt ?? undefined);
        const grade = submissionGrade(item.rate);
        const action = state.key === "reviewed" ? "Переглянути" : state.key === "new" ? "Перевірити" : state.key === "in-review" ? "Продовжити" : "Відкрити";
        return <tr key={item.id}>
          <td className="mq-row-number">{(currentPage - 1) * pageSize + index + 1}</td>
          <td><div className="mq-student"><span className="mq-avatar" aria-hidden="true"><UiIcon name="person" size={28} /></span><div><strong>{name}</strong><small>{item.student.email || "Студент"}</small></div></div></td>
          <td data-label="Робота"><strong>{title}</strong><small>{context?.lessonTitle || (contextLoading ? "Завантаження даних…" : "Дані поки недоступні")}</small></td>
          <td data-label="Курс / модуль / надіслано">{context ? <><strong>{context.courseTitle}</strong><small>{context.moduleTitle}</small></> : <span className="mq-muted">{contextLoading ? "Завантаження даних…" : "Дані поки недоступні"}</span>}<small>{date ? <time dateTime={item.submittedAt!}>{date.toLocaleString("uk-UA", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</time> : "Надіслано: Дані поки недоступні"}</small></td>
          <td data-label="Статус"><span className={`mq-status ${state.key}`}>{state.key === "new" ? "Нова робота" : state.key === "returned" ? "Повернено" : state.label}</span>{grade !== undefined ? <small>{state.key === "returned" ? "Попередня оцінка: " : "Оцінка: "}{grade} / 12</small> : item.rate !== -1 && <small>Оцінка: Дані поки недоступні</small>}</td>
          <td><Link to={`/mentor/review/${encodeURIComponent(item.id)}`} className={`mq-action ${state.key}`} aria-label={`${action}: ${name}, ${title}`}>{action}<UiIcon name="arrow" size={18} /></Link></td>
        </tr>;
      })}
      {!filtered.length && <tr><td colSpan={6} className="mq-empty"><p role="status">{loading ? "Завантаження робіт…" : error ? "Не вдалося завантажити роботи." : contextLoading && search.trim() ? "Завантаження даних курсів…" : data?.length ? "За вибраними умовами робіт немає." : "Надісланих робіт ще немає."}</p></td></tr>}
    </tbody></table></div>
    {!!unknownCount && <p className="mq-note" role="status">У {unknownCount} робіт статус поки недоступний. Вони відображаються у вкладці «Усі». Показники за статусами: Дані поки недоступні.</p>}
    {contextUnavailable && <div className="mq-note"><p>Частина даних про курси або назви робіт: Дані поки недоступні.</p><button type="button" onClick={profile.error ? profile.reload : learning.reload}>Оновити дані курсів</button></div>}
    {pageCount > 1 && <nav className="mq-pagination" aria-label="Сторінки робіт"><button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Назад</button><span>{currentPage} / {pageCount}</span><button disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Далі</button></nav>}
    <section className="mq-bottom" aria-label="Стан перевірок">
      <aside className="mq-tip"><h2>Підказка</h2><p>Роботи зі статусом «Нова робота» варто перевірити першими. «Повернено» означає, що студент отримав коментар і має оновити матеріали.</p></aside>
      <section className="mq-summary"><h2>Швидкий огляд</h2><p>{pendingCount === undefined ? "Робіт, що очікують перевірки: Дані поки недоступні." : `Робіт, що очікують перевірки: ${pendingCount}.`}</p><p>Почніть із нових надсилань або продовжте розпочаті перевірки.</p><div className="mq-summary-tags">{data && <span>{data.length} усього</span>}{newCount !== undefined && <span>{newCount} нових</span>}{inReviewCount !== undefined && <span>{inReviewCount} у роботі</span>}</div></section>
      <section className="mq-review-stats"><h2>Статус перевірок</h2><div className="mq-review-stats-body"><div className={`mq-ring${reviewedPercent === undefined ? " is-unavailable" : ""}`} style={reviewedPercent === undefined ? undefined : { "--reviewed": `${reviewedPercent}%` } as CSSProperties} aria-label={reviewedPercent === undefined ? "Частка перевірених робіт недоступна" : `Перевірено ${reviewedPercent}% робіт`}><span>{reviewedPercent === undefined ? "Дані поки недоступні" : `${reviewedPercent}%`}</span></div><ul><li>Очікують: {pendingCount ?? "Дані поки недоступні"}</li><li>Повернено: {returnedCount ?? "Дані поки недоступні"}</li><li>Перевірено: {reviewedCount ?? "Дані поки недоступні"}</li></ul><dl><div><dt>Середній час перевірки</dt><dd className="mq-unavailable">Дані поки недоступні</dd></div><div><dt>Повернено студентам</dt><dd className={returnedPercent === undefined ? "mq-unavailable" : ""}>{returnedPercent === undefined ? "Дані поки недоступні" : `${returnedPercent}%`}</dd></div></dl></div></section>
    </section>
    <section className="mq-deadlines"><h2><UiIcon name="assignment" size={32} />Найближчі дедлайни</h2><p>Дані поки недоступні. Тут з’являться терміни здачі робіт ваших курсів.</p></section>
  </div>;
}

function materialLabel(item: MentorSubmission) {
  return item.type === "Test" ? "Тестування" : item.type === "Assignment" ? "Практична робота" : "Навчальна робота";
}

function studentName(item: MentorSubmission) {
  const name = item.student.username?.trim();
  return name && name !== "Unknown" ? name : "Дані поки недоступні";
}

function compareSubmitted(left: MentorSubmission, right: MentorSubmission, oldest: boolean) {
  const a = assignmentDate(left.submittedAt ?? undefined)?.getTime();
  const b = assignmentDate(right.submittedAt ?? undefined)?.getTime();
  if (a === undefined || b === undefined) return a === b ? left.id.localeCompare(right.id) : a === undefined ? 1 : -1;
  return (oldest ? a - b : b - a) || left.id.localeCompare(right.id);
}
