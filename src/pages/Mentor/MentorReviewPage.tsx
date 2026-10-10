import { useCallback, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { rateSubmission, requestSubmissionRevision, saveSubmissionFeedback } from "../../services/mentorService";
import { getProfile, getProfileById } from "../../services/profileService";
import { getSubmissionDetails, submissionFileUrl, submissionGrade, type Submission } from "../../services/submissionService";
import { assignmentDate } from "../../services/assignmentService";
import { currentFeedbackState, getFeedbackComment, getFeedbackReviewer } from "../../services/studentFeedbackPresentation";
import { getMentorReviewContext } from "../../services/mentorReviewContextService";
import DataUnavailable from "../shared/DataUnavailable";
import useRemoteData from "../shared/useRemoteData";
import RequestError from "../shared/RequestError";
import UiIcon from "../../components/ui/Icon/UiIcon";
import "../../styles/MentorDashboard.css";
import "../../styles/MentorReview.css";

export default function MentorReviewPage() {
  const { submissionId } = useParams();
  return submissionId ? <Review key={submissionId} submissionId={submissionId} /> : <p role="alert">Роботу не знайдено.</p>;
}

function Review({ submissionId }: { submissionId: string }) {
  const load = useCallback(() => getSubmissionDetails(submissionId), [submissionId]);
  const list = useRemoteData(load);
  const loadStudent = useCallback(async () => list.data ? getProfileById(list.data.userId) : null, [list.data]);
  const student = useRemoteData(loadStudent);
  const profile = useRemoteData(getProfile);
  const [saved, setSaved] = useState<Submission>();
  const item = saved ?? list.data;
  const [rate, setRate] = useState("");
  const [feedback, setFeedback] = useState<string>();
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [pendingGrade, setPendingGrade] = useState<number>();
  const loadContext = useCallback(() => item && profile.data
    ? getMentorReviewContext(item, profile.data) : Promise.resolve(undefined), [item, profile.data]);
  const learning = useRemoteData(loadContext);
  const context = learning.data?.context;
  const fileUrl = submissionFileUrl(item?.fileUrl);
  const studentName = student.data?.username?.trim() || "Дані поки недоступні";
  const fileName = fileUrl ? decodeFileName(fileUrl) : "";
  const state = currentFeedbackState(item);
  const comments = item ? getFeedbackComment(item) : {};
  const reviewer = getFeedbackReviewer(item);
  const grade = submissionGrade(item?.rate);
  const submittedAt = assignmentDate(item?.submittedAt ?? undefined);
  const updatedAt = assignmentDate(item?.updatedAt);
  const reviewedAt = assignmentDate(item?.reviewerAt ?? undefined);
  const deadline = assignmentDate(learning.data?.deadline);
  const materialLabel = item?.type === "Test" ? "Тестування" : item?.type === "Assignment" ? "Практична робота" : "Навчальна робота";
  const materialTitle = learning.data?.materialTitle || materialLabel;
  // Current profile responses omit permissions; the server still authorizes every mutation.
  const permits = (permission: string) => !!profile.data && (!Array.isArray(profile.data.permissions) || profile.data.permissions.includes(permission));
  const canFeedback = !!item && permits("submission.send.feedback");
  const canRevise = !!item && permits("submission.request.revision") && item.status !== "Reviewed";
  const canGrade = !!item && item.rate === -1 && profile.data?.role === "Teacher"
    && !!profile.data.id && learning.data?.courseTeacherId === profile.data.id && !needsRefresh;

  async function refreshResult() {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const result = await load();
      setSaved(result);
      if (pendingGrade !== undefined && (result.rate !== pendingGrade || result.status !== "Reviewed")) {
        throw new Error("Сервер поки не підтвердив результат оцінювання. Оновіть дані роботи.");
      }
      setNeedsRefresh(false); setPendingGrade(undefined); setRate("");
      setNotice("Дані роботи оновлено.");
    } catch (failure) { setError((failure as Error).message); }
    finally { setBusy(false); }
  }

  async function save(event: FormEvent, action: "rate" | "feedback" | "revision") {
    event.preventDefault();
    if (!item || busy || needsRefresh) return;
    const value = Number(rate);
    const comment = (feedback ?? item.feedback ?? "").trim();
    if (action === "rate" && (!canGrade || !Number.isInteger(value) || value < 1 || value > 12)) return;
    if (action === "feedback" && (!canFeedback || !comment) || action === "revision" && (!canRevise || !reason.trim())) return;
    if (action === "rate" && !window.confirm(`Зберегти оцінку ${value}/12? Змінити цю оцінку буде неможливо.`)) return;
    setBusy(true); setNeedsRefresh(true); setError(""); setNotice("");
    try {
      if (action === "rate") {
        await rateSubmission({ submissionId, rate: value });
        setPendingGrade(value); setRate("");
        const result = await load();
        setSaved(result);
        if (result.rate !== value || result.status !== "Reviewed") throw new Error("Сервер поки не підтвердив результат оцінювання. Оновіть дані роботи.");
        setNeedsRefresh(false); setPendingGrade(undefined);
        setNotice("Оцінку збережено.");
      } else {
        const result = action === "feedback" ? await saveSubmissionFeedback(submissionId, comment) : await requestSubmissionRevision(submissionId, reason.trim());
        if (!result || result.id !== submissionId || result.relatedMaterialId !== item.relatedMaterialId || result.userId !== item.userId
          || typeof result.rate !== "number" || (action === "feedback" ? result.feedback !== comment : result.status !== "NeedsRevision" || result.revisionMessage !== reason.trim())) {
          throw new Error("Сервер не повернув підтверджений результат. Оновіть дані роботи перед наступною дією.");
        }
        setSaved(result); setNeedsRefresh(false);
        setNotice(action === "feedback" ? "Коментар збережено." : "Роботу повернено на доопрацювання.");
        if (action === "revision") setReason("");
      }
    } catch (failure) { setError((failure as Error).message); }
    finally { setBusy(false); }
  }

  return <div className="mentor-review">
    <nav className="mr-breadcrumbs" aria-label="Навігаційний шлях"><Link to="/mentor">Головна</Link><UiIcon name="chevron" /><Link to="/mentor/submissions">На перевірці</Link><UiIcon name="chevron" /><span>Перевірка роботи</span></nav>
    <header className="mr-header"><div><span className="mr-tag">{item ? state.label : "Перевірка роботи"}</span><h1>Перевірка роботи студента</h1><p>Перегляньте матеріали, оцініть роботу та залиште зворотний зв’язок.</p></div>{submittedAt && <time className="mr-header-date" dateTime={item!.submittedAt!}>{submittedAt.toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}</time>}</header>
    {list.loading && <p role="status">Завантаження роботи…</p>}
    {list.error && <RequestError message={list.error} retry={list.reload} />}
    {profile.error && <RequestError message={profile.error} retry={profile.reload} />}
    {student.error && <RequestError message={student.error} retry={student.reload} />}
    {item && <>
      <section className="mr-student" aria-label="Відомості про роботу">
        <div className="mr-person"><span className="mr-avatar" aria-hidden="true"><UiIcon name="person" size={32} /></span><div><strong>{student.loading ? "Завантаження студента…" : studentName}</strong><p>{context?.courseTitle || "Дані поки недоступні"}</p></div></div>
        <div><strong>{materialTitle}</strong><p>{context ? `${context.moduleTitle} · ${context.lessonTitle}` : "Дані поки недоступні"}</p></div>
        <div><strong>Надіслано</strong><p>{submittedAt ? <time dateTime={item.submittedAt!}>{submittedAt.toLocaleString("uk-UA", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</time> : "Дані поки недоступні"}</p></div>
        <span className={`mr-status mr-status-${state.key}`}>{state.label}</span>
      </section>
      {error && <p role="alert" className="mr-message mr-error">{error}</p>}{notice && <p role="status" className="mr-message">{notice}</p>}
      {needsRefresh && <div className="mr-message mr-refresh-result"><p>Результат останньої дії поки не підтверджено. Оновіть дані роботи перед наступним збереженням.</p><button type="button" className="mr-button" disabled={busy} onClick={() => void refreshResult()}>Оновити дані роботи<UiIcon name="loading" /></button></div>}
      <div className="mr-grid"><div className="mr-main">
        <section className="mr-card mr-task">
          <span className="mr-tag">Завдання</span><h2>{materialTitle}</h2>
          {learning.data?.description ? <p className="mr-task-description">{learning.data.description}</p> : <DataUnavailable>{learning.loading ? "Завантаження навчальних матеріалів…" : "Опис завдання поки недоступний."}</DataUnavailable>}
          {!context && !learning.loading && <div><p className="mr-help">Курс, модуль і урок поки недоступні.</p><button type="button" className="mr-button" onClick={learning.reload}>Оновити навчальні матеріали<UiIcon name="loading" /></button></div>}
          {learning.error && <RequestError message={learning.error} retry={learning.reload} />}
          {learning.data?.materialError && <RequestError message={learning.data.materialError} retry={learning.reload} />}
          <div className="mr-chips">{context && <span>{context.moduleTitle}</span>}<span>Максимальна оцінка: 12</span><span>{deadline ? <>Дедлайн: <time dateTime={learning.data!.deadline!}>{deadline.toLocaleDateString("uk-UA", { day: "numeric", month: "long" })}</time></> : "Дедлайн: Дані поки недоступні"}</span></div>
        </section>
        <section className="mr-card mr-files"><span className="mr-tag">Матеріали студента</span><h2>Файли роботи</h2>{fileUrl ? <div className="mr-file"><UiIcon name="file" size={36} /><div><strong>{fileName}</strong><p>Надісланий файл</p></div><a className="mr-button" href={fileUrl} target="_blank" rel="noreferrer">Відкрити <UiIcon name="external" /></a></div> : <DataUnavailable>{item.type === "Test" ? "Для тестової роботи файли не передбачені." : "Файл роботи поки недоступний."}</DataUnavailable>}</section>
        <section className="mr-card mr-preview"><span className="mr-tag">Прев’ю</span><h2>Швидкий перегляд роботи</h2><DataUnavailable>Попередній перегляд поки недоступний.</DataUnavailable>{fileUrl && <a className="mr-file-link" href={fileUrl} target="_blank" rel="noreferrer">Відкрити {fileName}<UiIcon name="external" /></a>}</section>
        <section className="mr-card mr-feedback"><span className="mr-tag">Зворотний зв’язок</span><h2>Коментар студенту</h2><form onSubmit={event => void save(event, "feedback")}><fieldset disabled={busy || needsRefresh || !canFeedback}><label htmlFor="mentor-feedback">Коментар ментора</label><textarea id="mentor-feedback" required placeholder="Що вдалося та що варто покращити…" value={feedback ?? item.feedback ?? ""} onChange={event => setFeedback(event.target.value)} /><p className="mr-help">Студент побачить збережений коментар у результаті своєї роботи.</p><button className="mr-button" disabled={!(feedback ?? item.feedback ?? "").trim()} type="submit">Зберегти коментар <UiIcon name="arrow" /></button></fieldset></form></section>
        <section className="mr-card mr-notes"><span className="mr-tag">Нотатки</span><h2>Нотатки ментора</h2><DataUnavailable>Особисті нотатки поки недоступні.</DataUnavailable><button className="mr-button" type="button" disabled>Зберегти нотатку</button></section>
      </div><aside className="mr-aside" aria-label="Оцінювання та рішення">
        <section className="mr-card mr-status-card"><span className="mr-tag">Статус</span><h2>{state.label}</h2><p>Перевірте всі матеріали перед фінальним рішенням.</p><dl className="mr-facts"><div><dt>Дедлайн</dt><dd className={deadline ? "" : "mr-fact-unavailable"}>{deadline ? <time dateTime={learning.data!.deadline!}>{deadline.toLocaleDateString("uk-UA", { day: "numeric", month: "long" })}</time> : "Дані поки недоступні"}</dd></div><div><dt>Спроба</dt><dd className="mr-fact-unavailable">Дані поки недоступні</dd></div><div><dt>Файл</dt><dd className="mr-fact-unavailable">{fileUrl ? "Доступний" : "Дані поки недоступні"}</dd></div><div><dt>Макс. бал</dt><dd>12</dd></div></dl></section>
        <section className="mr-card mr-grading"><span className="mr-tag">Оцінка</span><h2>Оцінювання</h2><p>Оцініть роботу за шкалою від 1 до 12.</p><p className="mr-help">Оцінки за окремими критеріями: Дані поки недоступні.</p>{item.rate === -1 ? <form id="mentor-grade" onSubmit={event => void save(event, "rate")}><fieldset disabled={busy || !canGrade}><legend>Оцінка (1–12)</legend><div className="mr-grade-options">{Array.from({ length: 12 }, (_, index) => index + 1).map(value => <label key={value}><input type="radio" name="grade" required value={value} checked={rate === String(value)} onChange={event => setRate(event.target.value)} /><span>{value}</span></label>)}</div></fieldset></form> : <p className="mr-help">Повторне оцінювання цієї роботи недоступне.</p>}{item.rate === -1 && !canGrade && !needsRefresh && <p className="mr-help">Виставити оцінку може призначений ментор курсу після перевірки доступу.</p>}<p className="mr-total">{state.key === "returned" && grade !== undefined ? "Попередня оцінка: " : "Оцінка: "}<strong>{needsRefresh ? "Результат поки не підтверджено" : grade !== undefined ? `${grade} / 12` : canGrade && rate ? `${rate} / 12 (не збережено)` : item.rate === -1 ? "Ще не виставлено" : "Дані поки недоступні"}</strong></p></section>
        <section className="mr-card mr-decision"><span className="mr-tag">Фінальне рішення</span><h2>Завершити перевірку?</h2><p>Збережіть оцінку або поверніть роботу з поясненням.</p><button className="mr-button" type="submit" form="mentor-grade" disabled={busy || !canGrade || !rate}>Зберегти оцінку <UiIcon name="arrow" /></button><form onSubmit={event => void save(event, "revision")}><fieldset disabled={busy || needsRefresh || !canRevise}><label htmlFor="mentor-revision">Що потрібно виправити</label><textarea id="mentor-revision" required placeholder="Поясніть причину повернення…" value={reason} onChange={event => setReason(event.target.value)} /><button className="mr-button mr-return" disabled={!reason.trim()} type="submit">{item.status === "NeedsRevision" ? "Оновити причину повернення" : "Повернути на доопрацювання"}<UiIcon name="arrow" /></button></fieldset></form><p className="mr-help">{item.status === "Reviewed" ? "Повернення вже перевіреної роботи недоступне." : "Студент побачить збережений результат у своїй роботі."}</p></section>
      </aside></div>
      <section className="mr-card mr-history"><span className="mr-tag">Історія</span><h2>Історія роботи</h2><dl><div><dt>Роботу надіслано</dt><dd>{submittedAt ? <time dateTime={item.submittedAt!}>{submittedAt.toLocaleString("uk-UA")}</time> : "Дані поки недоступні"}</dd></div><div><dt>Останнє оновлення</dt><dd>{updatedAt ? <time dateTime={item.updatedAt}>{updatedAt.toLocaleString("uk-UA")}</time> : "Дані поки недоступні"}</dd></div><div><dt>Поточний статус</dt><dd>{state.label}</dd></div><div><dt>{reviewer.automatic ? "Автоматична перевірка" : "Перевіряючий"}</dt><dd>{reviewer.name || "Дані поки недоступні"}</dd></div><div><dt>Дата перевірки</dt><dd>{reviewedAt ? <time dateTime={item.reviewerAt!}>{reviewedAt.toLocaleString("uk-UA")}</time> : "Дані поки недоступні"}</dd></div></dl>{comments.revision && <div className="mr-revision-message"><h3>Причина повернення</h3><p>{comments.revision}</p></div>}<p className="mr-help">Детальна історія подій: Дані поки недоступні.</p></section>
    </>}
  </div>;
}

function decodeFileName(url: string) {
  const name = new URL(url).pathname.split("/").pop() || "Файл роботи";
  try { return decodeURIComponent(name); } catch { return name; }
}
