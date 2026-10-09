import UiIcon from "../../components/ui/Icon/UiIcon";
import { type FormEvent, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { submitAssignment, type SubmissionDetail } from "../../services/learningService";
import { assignmentDate, assignmentDaysLeft, canSubmitAssignment } from "../../services/assignmentService";
import { submissionFileUrl } from "../../services/submissionService";
import DataUnavailable from "../shared/DataUnavailable";
import RequestError from "../shared/RequestError";
import useAssignmentContext from "../shared/useAssignmentContext";
import "../../styles/AssignmentFlow.css";

export default function UploadProjectPage() {
  const { assignmentId } = useParams();
  return <ProjectUpload key={assignmentId ?? "missing"} assignmentId={assignmentId} />;
}

function ProjectUpload({ assignmentId }: { assignmentId?: string }) {
  const assignment = useAssignmentContext(assignmentId);
  const { context, status } = assignment;
  const [file, setFile] = useState<File | null>(null);
  const [posted, setPosted] = useState(false);
  const [receipt, setReceipt] = useState<SubmissionDetail>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const sending = useRef(false);
  const confirmed = Boolean(receipt || posted && status?.isSubmitted);
  const selectable = Boolean(context && canSubmitAssignment(status) && !busy && !posted);
  const deadline = assignmentDate(context?.deadline);
  const daysLeft = assignmentDaysLeft(context?.deadline);
  const title = context?.assignmentTitle || "Практичне завдання";
  const detailsPath = assignmentId ? `/student/assignments/${encodeURIComponent(assignmentId)}` : "/student/assignments";
  const fileUrl = submissionFileUrl(receipt?.fileUrl || status?.submission?.fileUrl);
  function chooseFile(files: FileList | null) {
    if (!selectable || !files?.length) return;
    if (files.length !== 1) { setError("Для цього завдання оберіть один підсумковий файл."); return; }
    if (!files[0].size) { setError("Обраний файл порожній. Додайте файл із виконаною роботою."); return; }
    setFile(files[0]); setError("");
  }
  function removeFile() {
    if (busy || posted) return;
    setFile(null); setError("");
    if (fileInput.current) fileInput.current.value = "";
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assignmentId || !context || !file || !selectable || sending.current) return;
    sending.current = true; setBusy(true); setError("");
    try {
      const response = await submitAssignment(assignmentId, file);
      setPosted(true);
      if (response && typeof response.id === "string" && response.id && response.relatedMaterialId === assignmentId) setReceipt(response);
      assignment.reload();
    } catch (reason) {
      const responseStatus = (reason as { status?: number })?.status;
      if (responseStatus && responseStatus >= 200 && responseStatus < 300) { setPosted(true); assignment.reload(); }
      else setError(reason instanceof Error ? reason.message : "Не вдалося надіслати роботу. Обраний файл збережено для повторної спроби.");
    }
    finally { sending.current = false; setBusy(false); }
  }
  return <div className="project-upload-page af-page">
    <nav className="af-breadcrumbs" aria-label="Навігаційний шлях"><Link to="/student">Головна</Link><UiIcon name="chevron" /><Link to="/student/assignments">Завдання</Link><UiIcon name="chevron" /><Link to={detailsPath}>{title}</Link><UiIcon name="chevron" /><span>Завантаження проєкту</span></nav>
    {context && <p className="af-lesson-meta">{context.courseTitle}<span> · </span>{context.moduleTitle}<span> · </span>{context.lessonTitle}</p>}
    {assignment.loading && <p role="status" className="af-loading">Завантаження даних завдання…</p>}
    {assignment.error && <RequestError message={assignment.error} retry={assignment.reload} />}
    <form onSubmit={handleSubmit} className="pu-grid" aria-label="Надсилання роботи">
      <div className="pu-main"><header className="pu-hero af-card"><span className="af-tag">Завантаження проєкту</span><h1>Надішліть виконане завдання</h1><p>Завантажте підсумковий файл до завдання «{title}».</p>{context && <div className="af-chips"><span>{context.moduleTitle}</span><span>Один файл</span></div>}</header>
        <section aria-labelledby="project-files"><h2 id="project-files" className="af-section-title">Файл проєкту</h2><p className="pu-intro">Надішліть один файл із виконаною роботою.</p>
          {confirmed ? <div className="pu-success af-card" role="status"><UiIcon name="check-circle" size={32} /><h2>Роботу надіслано</h2><p>Результат перевірки буде доступний у картці завдання.</p>{fileUrl && <a href={fileUrl} target="_blank" rel="noreferrer" className="af-outline">Переглянути надісланий файл<UiIcon name="external" /></a>}<Link to={detailsPath} className="af-button">Повернутися до завдання<UiIcon name="arrow" /></Link></div> : posted ? <div className="af-card" role="status"><h2>Перевіряємо надсилання</h2><p>Запит прийнято сервером. Підтвердження роботи поки недоступне.</p><button type="button" className="af-button" disabled={assignment.loading} onClick={assignment.reload}>Оновити статус<UiIcon name="arrow" /></button></div> : <div className={`pu-dropzone${dragging ? " is-dragging" : ""}${!selectable ? " is-disabled" : ""}`} onDragOver={event => { event.preventDefault(); }} onDragEnter={event => { event.preventDefault(); if (selectable) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files); }}>
            <UiIcon name="download" size={32} /><h3>Перетягніть файл сюди</h3><p>або оберіть матеріал на своєму пристрої</p><input ref={fileInput} id="project-file" aria-label="Файл проєкту" type="file" className="pu-file-input" disabled={!selectable} onChange={event => chooseFile(event.target.files)} /><button type="button" className="af-button" disabled={!selectable} onClick={() => fileInput.current?.click()}>Обрати файл</button><p className="af-note">Обмеження типу та розміру файлу поки недоступні.</p>
          </div>}
          {file && !confirmed && <div className="pu-file-row af-card"><UiIcon name="file" size={32} /><div><strong>{file.name}</strong><span>{file.size >= 1048576 ? `${(file.size / 1048576).toLocaleString("uk-UA", { maximumFractionDigits: 1 })} МБ` : `${Math.ceil(file.size / 1024)} КБ`} · {busy ? "Надсилаємо…" : posted ? "Запит надіслано" : "Обрано на пристрої"}</span></div><button type="button" aria-label="Прибрати обраний файл" disabled={busy || posted} onClick={removeFile}><UiIcon name="close" /></button></div>}
          {error && <div role="alert" className="pu-error"><p>{error}</p></div>}
          {busy && <p role="status">Надсилання роботи. Дочекайтеся відповіді сервера.</p>}
          {!assignment.loading && context && status && !canSubmitAssignment(status) && !posted && <div className="pu-existing af-card"><h3>Роботу вже надіслано</h3><p>Повторне надсилання стане доступним, якщо ментор поверне роботу на доопрацювання.</p><Link to={detailsPath} className="af-outline">Переглянути статус<UiIcon name="arrow" /></Link></div>}
        </section>
        <section className="af-card pu-comment"><h3>Коментар до роботи</h3><DataUnavailable title="Дані поки недоступні">Коментар студента до роботи поки недоступний.</DataUnavailable><label htmlFor="project-comment">Коротке пояснення для ментора</label><textarea id="project-comment" placeholder="Коротко опишіть ваше рішення…" disabled /><button type="button" className="af-outline" disabled>Відправити коментар<UiIcon name="arrow" /></button></section>
      </div>
      <aside className="pu-aside" aria-label="Статус надсилання"><section className="pu-status af-card"><span className="af-tag">Статус</span><h2>{confirmed ? "Роботу надіслано" : busy ? "Надсилання файлу" : assignment.loading ? "Завантаження даних…" : !context || !status ? "Дані поки недоступні" : !canSubmitAssignment(status) ? "Роботу вже надіслано" : "Підготовка файлу"}</h2>{busy ? <progress aria-label="Надсилання роботи" /> : <div className="pu-readiness" aria-label={file ? "Файл обрано" : "Файл не обрано"}><span className={file ? "has-file" : ""} /></div>}<p>{confirmed ? "Сервер підтвердив надсилання." : busy || assignment.loading ? "Дочекайтеся відповіді сервера." : !context || !status ? "Надсилання поки недоступне." : !canSubmitAssignment(status) ? "Перегляньте статус у картці завдання." : file ? "Файл обрано. Він ще не надісланий." : "Оберіть файл, щоб продовжити."}</p>{assignment.statusError && <RequestError message={assignment.statusError} retry={assignment.reload} />}<div className="af-status-grid"><Metric label="Дедлайн" value={deadline?.toLocaleDateString("uk-UA", { day: "numeric", month: "long" })} /><Metric label="Залишилось" value={daysLeft === undefined ? undefined : daysLeft < 0 ? "Дедлайн минув" : daysLeft === 0 ? "Сьогодні" : `${daysLeft} ${new Intl.PluralRules("uk-UA").select(daysLeft) === "one" ? "день" : new Intl.PluralRules("uk-UA").select(daysLeft) === "few" ? "дні" : "днів"}`} /><Metric label="Надісланих робіт" value={assignment.attempts} /><Metric label="Формат надсилання" value={context ? "Один файл" : undefined} /></div><hr /><h3>Перед надсиланням</h3><DataUnavailable title="Дані поки недоступні">Перелік обов’язкових матеріалів поки недоступний.</DataUnavailable></section>
        <section className="pu-hint af-card"><span className="af-tag">Підказка</span><h3>Рекомендації до роботи</h3><DataUnavailable title="Дані поки недоступні">Додаткові рекомендації до завдання поки недоступні.</DataUnavailable></section>
        <section className="pu-final af-card"><span className="af-tag">Фінальний крок</span><h2>Надіслати роботу ментору?</h2><p>{confirmed ? "Роботу вже надіслано на перевірку." : posted ? "Оновіть статус, щоб отримати підтвердження роботи." : selectable ? "Кнопка стане активною після вибору файлу." : "Надсилання поки недоступне. Перевірте дані та статус завдання."}</p><div className="pu-final-actions"><Link to={detailsPath} className="af-outline"><UiIcon name="left" />Повернутися</Link><button type="submit" className="af-button" disabled={!file || !selectable}>{busy ? "Надсилання…" : "Надіслати роботу"}<UiIcon name="arrow" /></button></div></section>
      </aside>
    </form>
  </div>;
}

function Metric({ label, value }: { label: string; value?: string | number }) {
  return <div><span>{label}</span><strong className={value === undefined ? "af-unknown" : ""}>{value ?? "Дані поки недоступні"}</strong></div>;
}
