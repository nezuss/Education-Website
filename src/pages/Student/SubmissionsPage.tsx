import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UiIcon from "../../components/ui/Icon/UiIcon";
import { assignmentDate } from "../../services/assignmentService";
import { getStudentSubmissions, submissionFileUrl, submissionGrade, type Submission } from "../../services/submissionService";
import { getStudentFeedbackContexts, type FeedbackContext } from "../../services/studentFeedbackContextService";
import { currentFeedbackState, getFeedbackComment, getFeedbackCounts, groupStudentFeedback, matchesFeedbackFilter, type FeedbackFilter, type FeedbackGroup } from "../../services/studentFeedbackPresentation";
import useRemoteData from "../shared/useRemoteData";
import RequestError from "../shared/RequestError";
import "../../styles/AssignmentFlow.css";
import "../../styles/StudentFeedback.css";

async function loadStudentFeedback() {
  return groupStudentFeedback(await getStudentSubmissions());
}

const filters: { key: FeedbackFilter; label: string }[] = [
  { key: "all", label: "Усі" },
  { key: "pending", label: "На перевірці" },
  { key: "reviewed", label: "Перевірено" },
  { key: "returned", label: "На доопрацюванні" },
];

export default function SubmissionsPage() {
  const remote = useRemoteData(loadStudentFeedback);
  const [filter, setFilter] = useState<FeedbackFilter>("all");
  const [oldestFirst, setOldestFirst] = useState(false);
  const [contextResult, setContextResult] = useState<{ groups: FeedbackGroup[]; contexts: Map<string, FeedbackContext>; unavailable: boolean }>();

  useEffect(() => {
    const groups = remote.data;
    if (!groups) return;
    let active = true;
    const materialIds = groups.flatMap(group => group.materialId ? [group.materialId] : []);
    getStudentFeedbackContexts(materialIds)
      .then(result => { if (active) setContextResult({ groups, ...result }); })
      .catch(() => { if (active) setContextResult({ groups, contexts: new Map(), unavailable: true }); });
    return () => { active = false; };
  }, [remote.data]);

  const context = contextResult?.groups === remote.data ? contextResult : undefined;
  const counts = remote.data ? getFeedbackCounts(remote.data) : undefined;
  const hasUnknownStatus = remote.data?.some(group => currentFeedbackState(group.current).key === "unknown");
  const visible = remote.data?.filter(group => matchesFeedbackFilter(group, filter));
  const ordered = oldestFirst ? [...(visible || [])].reverse() : visible;

  return <div className="sfl-page af-page">
    <nav className="af-breadcrumbs" aria-label="Навігаційний шлях"><Link to="/student">Головна</Link><UiIcon name="chevron" /><span>Відгуки ментора</span></nav>
    <header className="sfl-heading"><div><span className="af-tag">Відгуки ментора</span><h1>Мої роботи</h1><p>Надіслані роботи, оцінки та коментарі до ваших результатів.</p></div><button type="button" className="af-outline" disabled={remote.loading} onClick={remote.reload}><UiIcon name={remote.loading ? "loading" : "recycle"} />Оновити</button></header>
    <section className="sfl-stats" aria-label="Підсумок актуальних робіт">
      <div className="sfl-overview"><h2>Ваші результати</h2><p>Навчальних робіт: <strong>{remote.data?.length ?? "—"}</strong></p><p>Підсумок за актуальною спробою кожної роботи.</p></div>
      {[{ label: "на перевірці", value: counts?.pending }, { label: "перевірено", value: counts?.reviewed }, { label: "на доопрацюванні", value: counts?.returned }].map(stat => <div className="sfl-stat" key={stat.label}><strong className="sfl-stat-value">{stat.value ?? "—"}</strong><span>{stat.label}</span></div>)}
    </section>
    <div className="sfl-toolbar"><div className="sfl-filters" role="group" aria-label="Фільтр робіт за статусом">{filters.map(item => <button key={item.key} type="button" aria-pressed={filter === item.key} disabled={remote.loading || !!remote.error} onClick={() => setFilter(item.key)}>{item.label}</button>)}</div><label className="sfl-sort">Сортувати<select aria-label="Сортування робіт" value={oldestFirst ? "oldest" : "latest"} disabled={remote.loading || !!remote.error} onChange={event => setOldestFirst(event.target.value === "oldest")}><option value="latest">Спочатку нові</option><option value="oldest">Спочатку давні</option></select></label></div>
    {remote.loading && <div className="sfl-message" role="status"><UiIcon name="loading" size={32} /><div><h2>Завантаження робіт…</h2><p>Отримуємо ваші результати та коментарі.</p></div></div>}
    {remote.error && <div className="sfl-message sfl-error"><UiIcon name="warning" size={32} /><div><h2>Дані робіт поки недоступні</h2><RequestError message={remote.error} retry={remote.reload} /></div></div>}
    {remote.data?.length === 0 && <div className="sfl-message" role="status"><UiIcon name="assignment" size={48} /><div><h2>Ви ще не надсилали роботи</h2><p>Після надсилання тут з’являться статуси, оцінки та доступні коментарі.</p><Link className="af-button" to="/student/courses">До моїх курсів<UiIcon name="arrow" /></Link></div></div>}
    {!!remote.data?.length && <>
      {context?.unavailable && <p className="sfl-data-note" role="status">Частина даних курсів та уроків поки недоступна. Результати робіт доступні нижче.</p>}
      {filter !== "all" && hasUnknownStatus && <p className="sfl-data-note" role="status">Статус частини робіт поки недоступний. Вони залишаються у списку «Усі».</p>}
      <section aria-labelledby="feedback-list-heading"><div className="sfl-list-heading"><h2 id="feedback-list-heading">{filter === "all" ? "Усі роботи" : filters.find(item => item.key === filter)!.label}</h2><span>Робіт: {visible?.length ?? 0}</span></div>
        {ordered?.length === 0 ? <div className="sfl-message" role="status"><UiIcon name="feedback" size={32} /><div><h3>{hasUnknownStatus ? "Немає робіт із відомим статусом у цьому фільтрі" : "За цим статусом робіт немає"}</h3><p>Оберіть інший фільтр, щоб переглянути решту результатів.</p><button type="button" className="af-outline" onClick={() => setFilter("all")}>Показати всі роботи</button></div></div> : <div className="sfl-list">{ordered?.map(group => <FeedbackCard key={group.current?.id || group.history[0].id} group={group} context={group.materialId ? context?.contexts.get(group.materialId) : undefined} contextLoading={!context} />)}</div>}
      </section>
      <p className="sfl-note"><UiIcon name="feedback" />Попередні спроби збережені в історії кожної роботи. Оцінка використовує шкалу від 1 до 12.</p>
    </>}
  </div>;
}

function FeedbackCard({ group, context, contextLoading }: { group: FeedbackGroup; context?: FeedbackContext; contextLoading: boolean }) {
  return <article className="sfl-card">
    {group.current ? <FeedbackAttempt item={group.current} context={context} contextLoading={contextLoading} /> : <div className="sfl-uncertain"><UiIcon name="warning" size={32} /><div><h3>Актуальна спроба поки невідома</h3><p>Дат недостатньо, щоб визначити останнє надсилання. Усі доступні спроби збережені нижче.</p></div></div>}
    {!!group.history.length && <details className="sfl-history" open={!group.current}><summary>{group.current ? "Попередні спроби" : "Усі доступні спроби"} ({group.history.length})<UiIcon name="chevron" /></summary><div>{group.history.map(item => <section key={item.id} className="sfl-history-attempt" aria-label="Попередня спроба роботи"><FeedbackAttempt item={item} context={context} contextLoading={contextLoading} historical /></section>)}</div></details>}
  </article>;
}

function FeedbackAttempt({ item, context, contextLoading, historical = false }: { item: Submission; context?: FeedbackContext; contextLoading: boolean; historical?: boolean }) {
  const state = currentFeedbackState(item);
  const comments = getFeedbackComment(item);
  const grade = submissionGrade(item.rate);
  const created = assignmentDate(item.createdAt);
  const updated = assignmentDate(item.updatedAt);
  const file = submissionFileUrl(item.fileUrl);
  const materialId = typeof item.relatedMaterialId === "string" ? item.relatedMaterialId.trim() : undefined;
  const coursePath = context ? `/student/learning/${encodeURIComponent(context.courseId)}` : undefined;
  const materialLabel = item.type === "Test" ? "Тест" : item.type === "Assignment" ? "Практична робота" : "Навчальна робота";
  const Heading = historical ? "h4" : "h3";

  return <>
    <div className="sfl-row">
      <span className="sfl-work-icon"><UiIcon name="assignment" size={24} /></span>
      <div className="sfl-work-copy"><Heading>{materialLabel}</Heading><p>Надіслано: {created ? <time dateTime={item.createdAt}>{created.toLocaleString("uk-UA", { dateStyle: "medium", timeStyle: "short" })}</time> : "Дані поки недоступні"}</p>{updated && created && updated > created && <p className="sfl-updated">Оновлено: <time dateTime={item.updatedAt}>{updated.toLocaleString("uk-UA", { dateStyle: "medium", timeStyle: "short" })}</time></p>}</div>
      <div className="sfl-course-copy">{context ? <><Link to={coursePath!}>{context.courseTitle}</Link><p>{context.moduleTitle} · {context.lessonTitle}</p></> : <p>{contextLoading ? "Завантаження даних курсу…" : "Курс та урок поки недоступні"}</p>}</div>
      <div className="sfl-result"><span className={`sfl-state sfl-state-${state.key}`}>{state.label}</span><p>{state.key === "returned" && grade !== undefined ? "Попередня оцінка" : "Оцінка"}: <strong>{grade !== undefined ? `${grade} / 12` : item.rate === -1 ? "Ще не виставлено" : "Дані поки недоступні"}</strong></p></div>
      <Link className="af-outline sfl-result-link" to={`/student/submissions/${encodeURIComponent(item.id)}`}>Результат перевірки<UiIcon name="arrow" /></Link>
    </div>
    {(comments.feedback || comments.revision) ? <div className="sfl-comment">{comments.feedback && <div><h4>Коментар до роботи</h4><blockquote>{comments.feedback}</blockquote></div>}{comments.revision && <div className="sfl-revision"><h4>Причина повернення</h4><blockquote>{comments.revision}</blockquote></div>}</div> : <p className="sfl-comment-empty">{state.key === "new" || state.key === "in-review" ? "Коментар з’явиться після перевірки роботи." : "Коментар до роботи поки недоступний."}</p>}
    <div className="sfl-secondary-actions">{file && <a href={file} target="_blank" rel="noreferrer"><UiIcon name="file" />Надісланий файл<UiIcon name="external" /></a>}{item.type === "Assignment" && materialId ? <Link to={`/student/assignments/${encodeURIComponent(materialId)}`}>До завдання<UiIcon name="arrow" /></Link> : <Link to={context ? `${coursePath}/lesson/${encodeURIComponent(context.lessonId)}` : "/student/courses"}>{context ? "До матеріалів уроку" : "До моїх курсів"}<UiIcon name="arrow" /></Link>}</div>
  </>;
}
