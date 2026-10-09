import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import UiIcon from "../../components/ui/Icon/UiIcon";
import { assignmentDate } from "../../services/assignmentService";
import { getSubmissionDetails, submissionFileUrl, submissionGrade, submissionState } from "../../services/submissionService";
import DataUnavailable from "../shared/DataUnavailable";
import RequestError from "../shared/RequestError";
import useAssignmentContext from "../shared/useAssignmentContext";
import useRemoteData from "../shared/useRemoteData";
import "../../styles/AssignmentFlow.css";
import "../../styles/SubmissionResult.css";

export default function SubmissionDetailsPage() {
  const { submissionId } = useParams();
  return <SubmissionResult key={submissionId ?? "missing"} id={submissionId} />;
}

function SubmissionResult({ id }: { id?: string }) {
  const load = useCallback(() => id ? getSubmissionDetails(id) : Promise.reject(new Error("Роботу не знайдено.")), [id]);
  const remote = useRemoteData(load);
  const { data } = remote;
  const assignmentId = data?.type === "Assignment" && typeof data.relatedMaterialId === "string" && data.relatedMaterialId.trim() ? data.relatedMaterialId : undefined;
  const assignment = useAssignmentContext(assignmentId);
  const context = assignment.context;
  const grade = submissionGrade(data?.rate);
  const state = data ? submissionState({ ...data, rate: grade ?? -1 }) : undefined;
  const file = submissionFileUrl(data?.fileUrl);
  const createdAt = assignmentDate(data?.createdAt);
  const updatedAt = assignmentDate(data?.updatedAt);
  const assignmentPath = assignmentId ? `/student/assignments/${encodeURIComponent(assignmentId)}` : undefined;
  const coursePath = context ? `/student/learning/${encodeURIComponent(context.courseId)}` : "/student/courses";
  const materialLabel = data?.type === "Test" ? "Тест" : data?.type === "Assignment" ? "Практична робота" : "Навчальна робота";
  const title = context?.assignmentTitle || materialLabel;
  const stateLabel = state?.label || (remote.loading ? "Завантаження…" : "Дані поки недоступні");
  const summaryTitle = state?.key === "returned" ? "Роботу повернули на доопрацювання" : state?.key === "reviewed" ? "Роботу перевірено" : state?.key === "in-review" ? "Робота на перевірці" : state?.key === "new" ? "Роботу надіслано" : "Результат роботи";
  const resultPath = assignmentPath || coursePath;
  const revisionNextStep = assignmentPath ? "Перейдіть до завдання, щоб перевірити актуальний статус і можливість повторного надсилання." : "Перейдіть до матеріалів курсу, щоб перевірити актуальний статус роботи та можливість повторного надсилання.";

  return <div className="submission-result-page af-page">
    <nav className="af-breadcrumbs" aria-label="Навігаційний шлях"><Link to="/student">Головна</Link><UiIcon name="chevron" /><Link to="/student/submissions">Мої роботи</Link><UiIcon name="chevron" /><span>Результат перевірки</span></nav>
    <header className="sr-heading"><div><span className="af-tag">Відгук ментора</span><h1>Результат перевірки</h1><p>Перегляньте оцінку, коментар і доступні результати перевірки вашої роботи.</p></div>{data ? <Link className="af-button" to={resultPath}>{assignmentPath ? "До завдання" : "До моїх курсів"}<UiIcon name="arrow" /></Link> : <button type="button" className="af-button" disabled>До завдання<UiIcon name="arrow" /></button>}</header>
    {remote.loading && <p className="af-loading" role="status">Завантаження результату…</p>}
    {remote.error && <div className="sr-load-error"><h2>Дані поки недоступні</h2><RequestError message={remote.error} retry={remote.reload} /></div>}
    <div className="sr-grid">
      <section className="sr-summary af-card" aria-labelledby="submission-summary"><div className="sr-summary-copy"><span className="af-tag">Review result / Результат</span><h2 id="submission-summary">{summaryTitle}</h2><p>{state?.key === "returned" ? "Перегляньте відгук та актуальний статус роботи перед повторним надсиланням." : data ? "Нижче показані доступні результати цієї роботи." : "Дані поки недоступні."}</p><dl className="sr-summary-facts"><div><dt>Статус</dt><dd>{stateLabel}</dd></div><div><dt>Критерії</dt><dd>Дані поки недоступні</dd></div><div><dt>Дата перевірки</dt><dd>Дані поки недоступні</dd></div></dl></div>{grade !== undefined ? <div className="sr-grade" role="img" aria-label={`${state?.key === "returned" ? "Попередня оцінка" : "Оцінка"} ${grade} з 12`}><svg viewBox="0 0 120 120" aria-hidden="true"><circle className="sr-grade-base" cx="60" cy="60" r="50" /><circle className="sr-grade-value" cx="60" cy="60" r="50" pathLength="100" strokeDasharray={`${grade / 12 * 100} 100`} /></svg><div><strong>{grade}</strong><span>із 12</span></div>{state?.key === "returned" && <span className="sr-previous-grade">Попередня оцінка</span>}</div> : <div className="sr-grade-unavailable"><UiIcon name="assignment" size={36} /><span>{data?.rate === -1 ? "Оцінку ще не виставлено" : "Дані поки недоступні"}</span></div>}</section>
      <aside className="sr-mentor af-card" aria-label="Відгук перевіряючого"><span className="af-tag">Відгук ментора</span><div className="sr-reviewer"><span className="sr-reviewer-icon"><UiIcon name="person" size={28} /></span><div><h2>Перевіряючий</h2><p>Дані поки недоступні</p></div></div><span className={`sr-state sr-state-${state?.key || "unknown"}`}>{stateLabel}</span>{data?.feedback ? <blockquote>{data.feedback}</blockquote> : <DataUnavailable>{state?.key === "new" || state?.key === "in-review" ? "Коментар з’явиться після перевірки роботи." : "Коментар перевіряючого поки недоступний."}</DataUnavailable>}</aside>
      <section className="sr-criteria af-card" aria-labelledby="submission-criteria"><h2 id="submission-criteria">Оцінка за критеріями</h2><DataUnavailable>Оцінки за окремі критерії та їхня вага поки недоступні.</DataUnavailable><p className="af-note">Загальна оцінка роботи використовує шкалу від 1 до 12.</p></section>
      <section className="sr-feedback af-card" aria-labelledby="submission-feedback"><h2 id="submission-feedback">Коментар ментора</h2>{data?.feedback ? <p className="sr-feedback-text">{data.feedback}</p> : <DataUnavailable>Коментар до роботи поки недоступний.</DataUnavailable>}{data?.revisionMessage && <div className="sr-revision"><span className="af-tag">Доопрацювання</span><h3>Причина повернення</h3><p>{data.revisionMessage}</p></div>}<div className="sr-corrections"><h2>Правки ментора</h2><DataUnavailable>Матеріали з правками та коментарі до окремих файлів поки недоступні.</DataUnavailable></div></section>
      <section className="sr-project af-card" aria-labelledby="submitted-project"><div className="sr-card-heading"><h2 id="submitted-project">Надіслана робота</h2>{file && <a href={file} target="_blank" rel="noreferrer">Відкрити роботу<UiIcon name="external" /></a>}</div><div className="sr-project-content"><div className="sr-project-preview"><UiIcon name={data?.type === "Test" ? "assignment" : "file"} size={48} /><span>{data?.type === "Test" ? "Тестова робота" : "Попередній перегляд поки недоступний"}</span></div><div className="sr-project-copy"><span className="af-tag">{materialLabel}</span><h3>{title}</h3>{context ? <><Link to={coursePath}>{context.courseTitle}</Link><p>{context.moduleTitle} · {context.lessonTitle}</p>{context.description && <p className="sr-project-description">{context.description}</p>}</> : <DataUnavailable>{assignmentId && assignment.loading ? "Завантаження даних завдання…" : "Назва курсу та навчальні матеріали поки недоступні."}</DataUnavailable>}{assignmentId && assignment.error && <RequestError message={assignment.error} retry={assignment.reload} />}<dl className="sr-project-dates"><div><dt>Надіслано</dt><dd>{createdAt ? <time dateTime={data!.createdAt}>{createdAt.toLocaleString("uk-UA")}</time> : "Дані поки недоступні"}</dd></div><div><dt>Останнє оновлення</dt><dd>{updatedAt ? <time dateTime={data!.updatedAt}>{updatedAt.toLocaleString("uk-UA")}</time> : "Дані поки недоступні"}</dd></div></dl>{file ? <a href={file} target="_blank" rel="noreferrer" className="sr-file-link"><UiIcon name="file" />Надісланий файл<UiIcon name="external" /></a> : data?.type !== "Test" && <p className="af-note">Посилання на надісланий файл поки недоступне.</p>}</div></div></section>
      <section className="sr-recommendations af-card" aria-labelledby="submission-recommendations"><h2 id="submission-recommendations">Що покращити далі</h2><DataUnavailable>Рекомендації щодо наступних кроків поки недоступні.</DataUnavailable></section>
    </div>
    <section className="sr-final"><div><h2>{state?.key === "returned" ? "Готові доопрацювати роботу?" : "Перегляньте наступний крок"}</h2><p>{state?.key === "returned" ? revisionNextStep : "Поверніться до навчальних матеріалів або перегляньте інші свої роботи."}</p></div><div className="sr-final-actions">{data ? <Link className="af-outline" to={resultPath}>{state?.key === "returned" && assignmentPath ? "Внести правки" : assignmentPath ? "До завдання" : "Мої курси"}<UiIcon name="arrow" /></Link> : <button type="button" className="af-outline" disabled>До завдання<UiIcon name="arrow" /></button>}<button type="button" className="af-outline" disabled title="Публікація роботи поки недоступна">Додати до портфоліо<UiIcon name="arrow" /></button></div><p className="sr-portfolio-note">Публікація роботи в портфоліо поки недоступна.</p></section>
  </div>;
}
