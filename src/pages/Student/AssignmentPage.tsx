import UiIcon from "../../components/ui/Icon/UiIcon";
import { Link, useParams } from "react-router-dom";
import { assignmentDate, assignmentDaysLeft, canSubmitAssignment } from "../../services/assignmentService";
import { submissionFileUrl, submissionGrade, submissionState } from "../../services/submissionService";
import type { Material } from "../../services/learningService";
import DataUnavailable from "../shared/DataUnavailable";
import RequestError from "../shared/RequestError";
import useAssignmentContext from "../shared/useAssignmentContext";
import "../../styles/AssignmentFlow.css";

export default function AssignmentPage() {
  const { assignmentId } = useParams();
  return <AssignmentDetails key={assignmentId ?? "missing"} assignmentId={assignmentId} />;
}

function AssignmentDetails({ assignmentId }: { assignmentId?: string }) {
  const assignment = useAssignmentContext(assignmentId);
  const { context, status } = assignment;
  const submission = status?.submission;
  const grade = submissionGrade(submission?.rate);
  const ready = Boolean(context && canSubmitAssignment(status));
  const title = context?.assignmentTitle || "Практичне завдання";
  const deadline = assignmentDate(context?.deadline);
  const daysLeft = assignmentDaysLeft(context?.deadline);
  const file = submissionFileUrl(submission?.fileUrl);
  const resources = context?.materials.filter(material => ["File", "Link", "Photo"].includes(material.type));
  const uploadPath = assignmentId ? `/student/upload/${encodeURIComponent(assignmentId)}` : "/student/assignments";
  const resultPath = submission?.id ? `/student/submissions/${encodeURIComponent(submission.id)}` : "/student/submissions";
  const lessonPath = context ? `/student/learning/${encodeURIComponent(context.courseId)}/lesson/${encodeURIComponent(context.lessonId)}` : undefined;
  const statusLabel = assignment.loading ? "Завантаження…" : !status ? "Дані поки недоступні" : status.needsRevision || status.canResubmit ? "На доопрацюванні" : submission ? submissionState(submission).label : status.isSubmitted ? "Надіслано" : "Не розпочато";
  const actionLabel = status?.needsRevision || status?.canResubmit ? "Доопрацювати завдання" : "Розпочати завдання";
  return <div className="assignment-details-page af-page">
    <nav className="af-breadcrumbs" aria-label="Навігаційний шлях"><Link to="/student">Головна</Link><UiIcon name="chevron" /><Link to="/student/assignments">Завдання</Link>{context && <><UiIcon name="chevron" /><span>{context.moduleTitle}</span></>}</nav>
    {context && <p className="af-lesson-meta">{context.lessonTitle}<span> · </span><Link to={`/student/learning/${encodeURIComponent(context.courseId)}`}>{context.courseTitle}</Link></p>}
    {assignment.loading && <p role="status" className="af-loading">Завантаження завдання…</p>}
    {assignment.error && <RequestError message={assignment.error} retry={assignment.reload} />}
    <div className="ad-overview">
      <header className="ad-hero af-card"><span className="af-tag">Практичне завдання</span><h1>{title}</h1>{context?.description ? <p className="af-description">{context.description}</p> : <DataUnavailable title="Дані поки недоступні">Опис завдання поки недоступний.</DataUnavailable>}{context && <div className="af-chips"><span>{context.moduleTitle}</span><span>{context.courseTitle}</span></div>}<img src="/student/tree_circuits.webp" alt="" className="ad-hero-art" /></header>
      <aside className="ad-status af-card"><span className="af-tag">Статус</span><h2>{statusLabel}</h2>{assignment.statusError && <RequestError message={assignment.statusError} retry={assignment.reload} />}<div className="af-status-grid"><Metric label="Дедлайн" value={deadline?.toLocaleDateString("uk-UA", { day: "numeric", month: "long" })} /><Metric label="Залишилось" value={daysLeft === undefined ? undefined : daysLeft < 0 ? "Дедлайн минув" : daysLeft === 0 ? "Сьогодні" : `${daysLeft} ${new Intl.PluralRules("uk-UA").select(daysLeft) === "one" ? "день" : new Intl.PluralRules("uk-UA").select(daysLeft) === "few" ? "дні" : "днів"}`} /><Metric label="Надісланих робіт" value={assignment.attempts} /><Metric label="Формат надсилання" value={context ? "Один файл" : undefined} /></div>
        {ready ? <Link to={uploadPath} className="af-button">{actionLabel}<UiIcon name="arrow" /></Link> : submission?.id ? <Link to={`/student/submissions/${encodeURIComponent(submission.id)}`} className="af-button">Результат перевірки<UiIcon name="arrow" /></Link> : <button type="button" className="af-button" disabled>{status?.isSubmitted ? "Роботу надіслано" : actionLabel}<UiIcon name="arrow" /></button>}
        {submission && <p className="ad-grade">Оцінка: {grade !== undefined ? `${grade} / 12` : submission.rate === -1 ? "Ще не виставлено" : "Дані поки недоступні"}</p>}
      </aside>
    </div>
    <section className="ad-work" aria-labelledby="assignment-steps"><h2 id="assignment-steps" className="af-section-title">Що потрібно зробити</h2><div className="ad-work-grid"><div className="ad-work-main"><div className="ad-steps-empty"><DataUnavailable title="Дані поки недоступні">Детальні кроки та їхній прогрес поки недоступні.</DataUnavailable></div><section className="ad-rubric af-card"><span className="af-tag">Оцінювання</span><h3>Критерії оцінювання</h3><DataUnavailable title="Дані поки недоступні">Критерії та бали за окремі частини роботи поки недоступні.</DataUnavailable></section></div><aside className="ad-requirements af-card"><span className="af-tag">Вимоги</span><h3>Вимоги до роботи</h3><DataUnavailable title="Дані поки недоступні">Вимоги до змісту, типу та розміру файлу поки недоступні.</DataUnavailable></aside></div></section>
    <section className="ad-deliverables" aria-labelledby="assignment-deliverables"><h2 id="assignment-deliverables" className="af-section-title">Що потрібно здати</h2><div className="ad-deliverables-grid"><div className="ad-work-main"><div className="af-card"><DataUnavailable title="Дані поки недоступні">Перелік результатів роботи поки недоступний.</DataUnavailable></div><section className="af-card ad-feedback"><span className="af-tag">Зворотний зв’язок</span><h3>Коментар ментора</h3>{submission?.id && <Link to={resultPath} className="af-outline">Результат перевірки<UiIcon name="arrow" /></Link>}{submission?.feedback ? <p>{submission.feedback}</p> : <DataUnavailable title="Дані поки недоступні">Коментар ментора ще не отримано.</DataUnavailable>}{submission?.revisionMessage && <><h3>Причина повернення</h3><p>{submission.revisionMessage}</p></>}{submission && <>{file ? <a href={file} target="_blank" rel="noreferrer" className="af-outline">Переглянути надісланий файл<UiIcon name="external" /></a> : <p className="af-note">Посилання на надісланий файл поки недоступне.</p>}</>}</section></div><div className="ad-work-main"><section className="af-card ad-resources"><span className="af-tag">Матеріали уроку</span><h2>Корисні ресурси</h2>{resources?.length ? <ul>{resources.map(material => <AssignmentResource key={material.id} material={material} />)}</ul> : <DataUnavailable title="Дані поки недоступні">Файли та посилання до уроку поки недоступні.</DataUnavailable>}{lessonPath && <Link to={lessonPath} className="af-outline">До матеріалів уроку<UiIcon name="arrow" /></Link>}</section><section className="ad-ready af-card"><div><h2>{ready ? "Готові здати роботу?" : "Робота та результати"}</h2><p>{ready ? "Підготуйте файл і перейдіть до завантаження." : status?.isSubmitted ? "Переглядайте результат перевірки у своїх роботах." : "Дані поки недоступні."}</p></div>{ready ? <Link to={uploadPath} className="af-button">Завантажити проєкт<UiIcon name="arrow" /></Link> : <Link to={resultPath} className="af-button">{submission?.id ? "Результат перевірки" : "Мої роботи"}<UiIcon name="arrow" /></Link>}</section></div></div></section>
  </div>;
}

function Metric({ label, value }: { label: string; value?: string | number }) {
  return <div><span>{label}</span><strong className={value === undefined ? "af-unknown" : ""}>{value ?? "Дані поки недоступні"}</strong></div>;
}

function AssignmentResource({ material }: { material: Material }) {
  const url = submissionFileUrl(material.type === "File" ? material.fileUrl : material.type === "Photo" ? material.photoUrl : material.linkUrl || material.url);
  const label = material.title || (material.type === "File" ? "Файл уроку" : material.type === "Photo" ? "Зображення уроку" : "Посилання уроку");
  const content = <><UiIcon name={material.type === "Link" ? "external" : "file"} size={28} /><span><strong>{label}</strong>{material.description && <span>{material.description}</span>}{!url && <span>Посилання поки недоступне.</span>}</span><UiIcon name={material.type === "File" ? "download" : "external"} /></>;
  return <li>{url ? <a href={url} target="_blank" rel="noreferrer">{content}</a> : <div>{content}</div>}</li>;
}
