import SubmissionDownload from "../shared/SubmissionDownload";
import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UiIcon from "../../components/ui/Icon/UiIcon";
import { assignmentDate } from "../../services/assignmentService";
import { getSubmissionDetails, submissionFileUrl, submissionGrade } from "../../services/submissionService";
import { getSubmissionLearningContext } from "../../services/submissionResultService";
import { currentFeedbackState, getFeedbackComment, getFeedbackReviewer } from "../../services/studentFeedbackPresentation";
import DataUnavailable from "../shared/DataUnavailable";
import RequestError from "../shared/RequestError";
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
  const materialId = typeof data?.relatedMaterialId === "string" ? data.relatedMaterialId.trim() || undefined : undefined;
  const materialType = data?.type;
  const { courseId, courseTitle, lessonId, lessonTitle } = data || {};
  const loadContext = useCallback(() => materialId
    ? getSubmissionLearningContext({ relatedMaterialId: materialId, type: materialType, courseId, courseTitle, lessonId, lessonTitle })
    : Promise.resolve(undefined), [materialId, materialType, courseId, courseTitle, lessonId, lessonTitle]);
  const learning = useRemoteData(loadContext);
  const context = learning.data;
  const assignmentId = materialType === "Assignment" ? materialId : undefined;
  const grade = submissionGrade(data?.rate, data?.type);
  const state = data ? currentFeedbackState(data) : undefined;
  const comments = data ? getFeedbackComment(data) : {};
  const file = submissionFileUrl(data?.fileUrl);
  const reviewer = getFeedbackReviewer(data);
  const reviewerAvatar = submissionFileUrl(reviewer.avatarUrl);
  const [failedAvatar, setFailedAvatar] = useState<string>();
  const reviewedAt = assignmentDate(data?.reviewerAt ?? undefined);
  const submittedAt = assignmentDate(data?.submittedAt ?? undefined);
  const reviewLabel = reviewer.automatic ? "Автоматична перевірка" : "Відгук ментора";
  const updatedAt = assignmentDate(data?.updatedAt);
  const assignmentPath = assignmentId ? `/student/assignments/${encodeURIComponent(assignmentId)}` : undefined;
  const coursePath = context ? `/student/learning/${encodeURIComponent(context.courseId)}` : "/student/courses";
  const materialLabel = data?.type === "Test" ? "Тест" : data?.type === "Assignment" ? "Практична робота" : "Навчальна робота";
  const title = context?.materialTitle || materialLabel;
  const stateLabel = state?.label || (remote.loading ? "Завантаження…" : "Дані поки недоступні");
  const summaryTitle = state?.key === "returned" ? "Роботу повернули на доопрацювання" : state?.key === "reviewed" ? "Роботу перевірено" : state?.key === "in-review" ? "Робота на перевірці" : state?.key === "new" ? "Роботу надіслано" : "Результат роботи";
  const lessonPath = context ? `${coursePath}/lesson/${encodeURIComponent(context.lessonId)}` : undefined;
  const resultPath = assignmentPath || lessonPath || coursePath;
  const returnLabel = assignmentPath ? "До завдання" : lessonPath ? "До уроку" : "До моїх курсів";
  const revisionNextStep = assignmentPath ? "Перейдіть до завдання, щоб перевірити актуальний статус і можливість повторного надсилання." : lessonPath ? "Перейдіть до уроку, щоб перевірити актуальний статус роботи та можливість повторного надсилання." : "Перейдіть до матеріалів курсу, щоб перевірити актуальний статус роботи та можливість повторного надсилання.";

  return <div className="submission-result-page af-page">
    <nav className="af-breadcrumbs" aria-label="Навігаційний шлях"><Link to="/student">Головна</Link><UiIcon name="chevron" /><Link to="/student/submissions">Мої роботи</Link><UiIcon name="chevron" /><span>Результат перевірки</span></nav>
    <header className="sr-heading"><div><span className="af-tag">{reviewLabel}</span><h1>Результат перевірки</h1><p>Перегляньте оцінку, коментар і доступні результати перевірки вашої роботи.</p></div>{data ? <Link className="af-button" to={resultPath}>{returnLabel}<UiIcon name="arrow" /></Link> : <button type="button" className="af-button" disabled>До завдання<UiIcon name="arrow" /></button>}</header>
    {remote.loading && <p className="af-loading" role="status">Завантаження результату…</p>}
    {remote.error && <div className="sr-load-error"><h2>Дані поки недоступні</h2><RequestError message={remote.error} retry={remote.reload} /></div>}
    <div className="sr-grid">
      <section className="sr-summary af-card" aria-labelledby="submission-summary"><div className="sr-summary-copy"><span className="af-tag">Review result / Результат</span><h2 id="submission-summary">{summaryTitle}</h2><p>{state?.key === "returned" ? "Перегляньте відгук та актуальний статус роботи перед повторним надсиланням." : data ? "Нижче показані доступні результати цієї роботи." : "Дані поки недоступні."}</p><dl className="sr-summary-facts"><div><dt>Статус</dt><dd>{stateLabel}</dd></div><div><dt>Критерії</dt><dd>Дані поки недоступні</dd></div><div><dt>Дата перевірки</dt><dd>{reviewedAt ? <time dateTime={data!.reviewerAt!}>{reviewedAt.toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}</time> : "Дані поки недоступні"}</dd></div></dl></div>{grade !== undefined ? <div className="sr-grade" role="img" aria-label={`${state?.key === "returned" ? "Попередня оцінка" : "Оцінка"} ${grade} з 12`}><svg viewBox="0 0 120 120" aria-hidden="true"><circle className="sr-grade-base" cx="60" cy="60" r="50" />{grade > 0 && <circle className="sr-grade-value" cx="60" cy="60" r="50" pathLength="100" strokeDasharray={`${grade / 12 * 100} 100`} />}</svg><div><strong>{grade}</strong><span>із 12</span></div>{state?.key === "returned" && <span className="sr-previous-grade">Попередня оцінка</span>}</div> : <div className="sr-grade-unavailable"><UiIcon name="assignment" size={36} /><span>{data?.rate === -1 ? "Оцінку ще не виставлено" : "Дані поки недоступні"}</span></div>}</section>
      <aside className="sr-mentor af-card" aria-label="Відгук перевіряючого"><span className="af-tag">{reviewLabel}</span><div className="sr-reviewer"><span className="sr-reviewer-icon">{reviewerAvatar && failedAvatar !== reviewerAvatar ? <img src={reviewerAvatar} alt="" onError={() => setFailedAvatar(reviewerAvatar)} /> : <UiIcon name={reviewer.automatic ? "assignment" : "person"} size={28} />}</span><div><h2>{reviewer.name || "Перевіряючий"}</h2><p>{reviewer.automatic ? "Перевірка тесту" : reviewer.name ? "Перевіряючий роботи" : "Дані поки недоступні"}</p></div></div><span className={`sr-state sr-state-${state?.key || "unknown"}`}>{stateLabel}</span>{comments.feedback ? <blockquote>{comments.feedback}</blockquote> : <DataUnavailable>{state?.key === "new" || state?.key === "in-review" ? "Коментар з’явиться після перевірки роботи." : "Коментар перевіряючого поки недоступний."}</DataUnavailable>}</aside>
      <section className="sr-criteria af-card" aria-labelledby="submission-criteria"><h2 id="submission-criteria">Оцінка за критеріями</h2><DataUnavailable>Оцінки за окремі критерії та їхня вага поки недоступні.</DataUnavailable><p className="af-note">Загальна оцінка роботи використовує шкалу від {data?.type === "Test" ? 0 : 1} до 12.</p></section>
      <section className="sr-feedback af-card" aria-labelledby="submission-feedback"><div className="sr-feedback-heading"><h2 id="submission-feedback">{reviewer.automatic ? "Коментар до перевірки" : "Коментар ментора"}</h2>{reviewedAt && <time dateTime={data!.reviewerAt!}>{reviewedAt.toLocaleString("uk-UA", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</time>}</div>{comments.feedback ? <p className="sr-feedback-text">{comments.feedback}</p> : <DataUnavailable>Коментар до роботи поки недоступний.</DataUnavailable>}{comments.revision && <div className="sr-revision"><span className="af-tag">Доопрацювання</span><h3>Причина повернення</h3><p>{comments.revision}</p></div>}<div className="sr-corrections"><h2>{reviewer.automatic ? "Правки до роботи" : "Правки ментора"}</h2><DataUnavailable>Матеріали з правками та коментарі до окремих файлів поки недоступні.</DataUnavailable></div></section>
      <section className="sr-project af-card" aria-labelledby="submitted-project"><div className="sr-card-heading"><h2 id="submitted-project">Надіслана робота</h2>{file && <SubmissionDownload id={data!.id}>Завантажити роботу<UiIcon name="download" /></SubmissionDownload>}</div><div className="sr-project-content"><div className="sr-project-preview"><UiIcon name={data?.type === "Test" ? "assignment" : "file"} size={32} /><span>{data?.type === "Test" ? "Тестова робота" : "Попередній перегляд поки недоступний"}</span></div><div className="sr-project-copy"><span className="af-tag">{materialLabel}</span><h3>{title}</h3>{context ? <><Link to={coursePath}>{context.courseTitle}</Link><p>{context.moduleTitle || "Дані поки недоступні"} · {context.lessonTitle}</p>{context.description && <p className="sr-project-description">{context.description}</p>}</> : <DataUnavailable>{materialId && learning.loading ? "Завантаження навчальних матеріалів…" : "Назва курсу та навчальні матеріали поки недоступні."}</DataUnavailable>}{materialId && learning.error && <RequestError message={learning.error} retry={learning.reload} />}{context?.materialError && <RequestError message={context.materialError} retry={learning.reload} />}<dl className="sr-project-dates"><div><dt>Надіслано</dt><dd>{submittedAt ? <time dateTime={data!.submittedAt!}>{submittedAt.toLocaleString("uk-UA")}</time> : "Дані поки недоступні"}</dd></div><div><dt>Останнє оновлення</dt><dd>{updatedAt ? <time dateTime={data!.updatedAt}>{updatedAt.toLocaleString("uk-UA")}</time> : "Дані поки недоступні"}</dd></div></dl>{file ? <SubmissionDownload id={data!.id} className="sr-file-link"><UiIcon name="file" />Надісланий файл<UiIcon name="download" /></SubmissionDownload> : data?.type !== "Test" && <p className="af-note">Посилання на надісланий файл поки недоступне.</p>}</div></div></section>
      <section className="sr-recommendations af-card" aria-labelledby="submission-recommendations"><h2 id="submission-recommendations">Що покращити далі</h2><DataUnavailable>Рекомендації щодо наступних кроків поки недоступні.</DataUnavailable></section>
    </div>
    <section className="sr-final"><div><h2>{state?.key === "returned" ? "Готові доопрацювати роботу?" : "Перегляньте наступний крок"}</h2><p>{state?.key === "returned" ? revisionNextStep : "Поверніться до навчальних матеріалів або перегляньте інші свої роботи."}</p></div><div className="sr-final-actions">{data ? <Link className="af-outline" to={resultPath}>{state?.key === "returned" && assignmentPath ? "Внести правки" : returnLabel}<UiIcon name="arrow" /></Link> : <button type="button" className="af-outline" disabled>До завдання<UiIcon name="arrow" /></button>}<button type="button" className="af-outline" disabled title="Публікація роботи поки недоступна">Додати до портфоліо<UiIcon name="arrow" /></button></div><p className="sr-portfolio-note">Публікація роботи в портфоліо поки недоступна.</p></section>
  </div>;
}
