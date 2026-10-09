import { useState } from "react";
import { Link } from "react-router-dom";
import UiIcon from "../../components/ui/Icon/UiIcon";
import { assignmentDate as dateOf, assignmentDaysLeft, getStudentAssignments, type StudentAssignment } from "../../services/assignmentService";
import RequestError from "../shared/RequestError";
import useRemoteData from "../shared/useRemoteData";
import "../../styles/AssignmentFlow.css";
import "../../styles/AssignmentsList.css";

type AssignmentFilter = "all" | "todo" | "review" | "reviewed";
type AssignmentState = { key?: Exclude<AssignmentFilter, "all">; label: string; overdue?: boolean };

function dateLabel(value?: string) {
  const date = dateOf(value);
  return date?.toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });
}

function stateOf(item: StudentAssignment): AssignmentState {
  const status = item.status;
  if (item.statusError || !status || typeof status.isSubmitted !== "boolean") return { label: "Дані поки недоступні" };
  if (status.needsRevision || status.canResubmit || status.submission?.status === "NeedsRevision") return { key: "todo", label: "На доопрацюванні" };
  if (!status.isSubmitted) {
    const daysLeft = assignmentDaysLeft(item.deadline);
    const overdue = daysLeft !== undefined && daysLeft < 0;
    return { key: "todo", label: overdue ? "Прострочено" : "До виконання", overdue };
  }
  const submission = status.submission;
  if (submission?.status === "Reviewed" || typeof submission?.rate === "number" && submission.rate > 0) return { key: "reviewed", label: "Перевірено" };
  if (!submission?.status || ["Submitted", "InReview"].includes(submission.status)) return { key: "review", label: "На перевірці" };
  return { label: "Дані поки недоступні" };
}

function assignmentTitle(item: StudentAssignment) {
  return item.title?.trim() || "Практичне завдання";
}

const filters: { key: AssignmentFilter; label: string }[] = [
  { key: "all", label: "Усі" },
  { key: "todo", label: "До виконання" },
  { key: "review", label: "На перевірці" },
  { key: "reviewed", label: "Перевірено" },
];

export default function AssignmentsPage() {
  const remote = useRemoteData(getStudentAssignments);
  const [filter, setFilter] = useState<AssignmentFilter>("all");
  const [sort, setSort] = useState("default");
  const items = remote.data?.items ?? [];
  const warnings = remote.data?.warnings ?? [];
  const states = new Map(items.map(item => [item.id, stateOf(item)]));
  const complete = !!remote.data && !warnings.length && items.every(item => !!states.get(item.id)?.key);
  const counts = {
    todo: items.filter(item => states.get(item.id)?.key === "todo").length,
    review: items.filter(item => states.get(item.id)?.key === "review").length,
    reviewed: items.filter(item => states.get(item.id)?.key === "reviewed").length,
  };
  const progress = complete && items.length ? Math.round(counts.reviewed / items.length * 100) : undefined;
  const nextAssignment = items.filter(item => {
    const status = item.status;
    return !item.statusError && states.get(item.id)?.key === "todo" && !!status && !!dateOf(item.deadline);
  }).sort((a, b) => dateOf(a.deadline)!.getTime() - dateOf(b.deadline)!.getTime())[0];
  const deadlinesUnavailable = !complete || items.some(item => states.get(item.id)?.key === "todo" && !dateOf(item.deadline));
  const visible = items.filter(item => filter === "all" || states.get(item.id)?.key === filter).sort((a, b) => {
    if (sort === "title") return assignmentTitle(a).localeCompare(assignmentTitle(b), "uk");
    if (sort === "deadline") return (dateOf(a.deadline)?.getTime() ?? Infinity) - (dateOf(b.deadline)?.getTime() ?? Infinity);
    return 0;
  });

  return <div className="assignments-list-page">
    <nav className="al-breadcrumbs" aria-label="Навігаційний шлях"><Link to="/student">Головна</Link><UiIcon name="chevron" /><span>Завдання</span></nav>
    <header className="al-heading"><time dateTime={new Date().toISOString()}>{new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}</time><h1>Завдання</h1><p>Усі практичні роботи з ваших курсів — дедлайни, статуси та результати перевірки.</p></header>
    <div className="al-controls"><div className="al-filters" role="group" aria-label="Статус завдання">{filters.map(item => <button key={item.key} type="button" aria-pressed={filter === item.key} onClick={() => setFilter(item.key)}>{item.label}</button>)}</div><label className="al-sort"><span className="al-sr-only">Сортувати завдання</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="default">Сортувати</option><option value="deadline">За дедлайном</option><option value="title">За назвою</option></select></label></div>
    {remote.loading && <p className="al-notice" role="status">Завантаження завдань…</p>}
    {remote.error && <div className="al-error"><h2>Дані поки недоступні</h2><RequestError message={remote.error} retry={remote.reload} /></div>}
    {!!warnings.length && <div className="al-error"><h2>Дані поки недоступні</h2><p>Частину завдань або їхніх статусів не вдалося отримати. Показано доступні дані.</p><RequestError message={warnings.join(" ")} retry={remote.reload} /></div>}
    <section className="al-stats" aria-label="Статистика завдань"><article className="al-summary"><div><h2>Завдання</h2><p>Усі практичні роботи з ваших курсів — дедлайни, статуси та результати перевірки.</p></div>{progress === undefined ? <div className="al-progress-unavailable"><UiIcon name="assignment" size={32} /><span>Дані поки недоступні</span></div> : <div className="al-progress" role="img" aria-label={`Перевірено ${progress}% завдань`}><svg viewBox="0 0 100 100" aria-hidden="true"><circle className="al-ring-base" cx="50" cy="50" r="43" /><circle className="al-ring-value" cx="50" cy="50" r="43" pathLength="100" strokeDasharray={`${progress} 100`} /></svg><strong>{progress}%</strong></div>}</article>{(["todo", "review", "reviewed"] as const).map(key => <article className="al-stat" key={key}>{complete ? <strong>{counts[key]}</strong> : <span className="al-stat-unavailable">Дані поки недоступні</span>}<h2>{key === "todo" ? "до виконання" : key === "review" ? "на перевірці" : "перевірено"}</h2></article>)}</section>
    {remote.data && <section className={`al-featured${nextAssignment ? "" : " al-featured-empty"}`} aria-label="Найближчий дедлайн"><div className="al-featured-copy"><span className="al-tag">Найближчий дедлайн</span><h2>{nextAssignment ? assignmentTitle(nextAssignment) : deadlinesUnavailable ? "Дані поки недоступні" : "Немає найближчих дедлайнів"}</h2>{nextAssignment ? <><span className="al-course-tag">{nextAssignment.courseTitle}</span>{nextAssignment.description && <p>{nextAssignment.description}</p>}<div className="al-featured-actions"><div className="al-deadline"><strong>Дедлайн:</strong><time dateTime={nextAssignment.deadline}>{dateLabel(nextAssignment.deadline)}</time></div><Link className="al-button" to={`/student/assignments/${encodeURIComponent(nextAssignment.id)}`} state={nextAssignment}>Перейти до завдання<UiIcon name="arrow" /></Link></div></> : <p>{deadlinesUnavailable ? "Інформація про найближчий дедлайн поки недоступна. Завдання, які вдалося отримати, показані нижче." : "Для доступних завдань немає дедлайну, до якого потрібно здати нову роботу."}</p>}</div>{nextAssignment && <aside className="al-featured-meta"><UiIcon name="assignment" size={48} /><span>Завдання курсу</span><h3>{nextAssignment.courseTitle}</h3><p>{nextAssignment.moduleTitle}</p><p>{nextAssignment.lessonTitle}</p></aside>}</section>}
    {remote.data && <section className="al-list"><h2>{filter === "all" ? "Усі завдання" : filters.find(item => item.key === filter)?.label}</h2>{visible.length ? <ol className="al-rows">{visible.map(item => {
      const state = states.get(item.id)!;
      const submission = item.status?.submission;
      const updatedDate = state.key === "reviewed" ? dateLabel(submission?.updatedAt) : undefined;
      const submittedDate = state.key === "review" ? dateLabel(submission?.createdAt) : undefined;
      const resultPath = (state.key === "reviewed" || state.key === "review") && submission?.id ? `/student/submissions/${encodeURIComponent(submission.id)}` : `/student/assignments/${encodeURIComponent(item.id)}`;
      return <li className="al-row" key={item.id}><span className="al-number" aria-label={`Позиція ${items.indexOf(item) + 1}`}>{String(items.indexOf(item) + 1).padStart(2, "0")}</span><div className="al-assignment-copy"><h3>{assignmentTitle(item)}</h3><p>{item.lessonTitle}</p>{updatedDate ? <p>Оновлено {updatedDate}</p> : submittedDate ? <p>Надіслано {submittedDate}</p> : dateOf(item.deadline) && <p>Дедлайн: <time dateTime={item.deadline}>{dateLabel(item.deadline)}</time></p>}</div><div className="al-course-copy"><Link to={`/student/learning/${encodeURIComponent(item.courseId)}`}>{item.courseTitle}</Link><p>{item.moduleTitle}</p></div><span className={`al-status al-status-${state.key ?? "unknown"}`}>{state.label}</span><Link className={`al-row-action${state.overdue ? " al-row-action-overdue" : ""}${state.key === "reviewed" ? " al-row-action-reviewed" : ""}`} to={resultPath}>{state.key === "reviewed" ? "Відгук ментора" : state.key === "review" ? "Переглянути" : state.overdue ? "Здати роботу" : "Відкрити"}<UiIcon name="arrow" /></Link></li>;
    })}</ol> : <div className="al-empty" role="status"><UiIcon name="assignment" size={40} /><h3>{warnings.length ? "Дані поки недоступні" : !items.length ? "Завдань поки немає" : "Завдань із цим статусом не знайдено"}</h3><p>{warnings.length ? "Спробуйте оновити дані трохи пізніше." : !items.length ? "Завдання з ваших курсів з’являться тут, коли їх додадуть." : !complete ? "Частина статусів поки недоступна. Перегляньте вкладку «Усі»." : "Перегляньте іншу вкладку, щоб побачити решту завдань."}</p>{items.length > 0 && filter !== "all" && <button className="al-button" type="button" onClick={() => setFilter("all")}>Усі завдання<UiIcon name="arrow" /></button>}</div>}</section>}
    <aside className="al-tip"><strong>Порада:</strong><p>Для завдань зі статусом «На перевірці» результат і коментар ментора з’являться після перевірки роботи.</p></aside>
  </div>;
}
