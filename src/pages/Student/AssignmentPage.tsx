import UiIcon from "../../components/ui/Icon/UiIcon";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getSubmissionStatus, type SubmissionStatus } from "../../services/learningService";
import "../../styles/StudentDashboard.css";
import DataUnavailable from "../shared/DataUnavailable";
import RequestError from "../shared/RequestError";
import useAssignmentContext from "../shared/useAssignmentContext";

type LocationState = { courseId?: string; courseTitle?: string; assignmentTitle?: string; deadline?: string; description?: string };


export default function AssignmentPage() {
  const { assignmentId } = useParams();
  const location = useLocation();
  const assignment = useAssignmentContext(assignmentId);
  const state = assignment.context || (location.state as LocationState) || {};
  const [status, setStatus] = useState<SubmissionStatus>();
  const [error, setError] = useState("");
  useEffect(() => { if (assignmentId) getSubmissionStatus(assignmentId).then(setStatus).catch((reason: Error) => setError(reason.message)); }, [assignmentId]);

  const isSubmitted = status?.isSubmitted;
  const submission = status?.submission;
  const isRated = Boolean(submission && submission.rate > 0);
  const courseTitle = state.courseTitle || "Курс";
  const assignmentTitle = state.assignmentTitle || "Практичне завдання";
  const description = state.description || "Підготуйте роботу відповідно до матеріалів уроку та надішліть підсумковий файл на перевірку ментору.";
  const steps = [description];
  const deadline = state.deadline ? new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long" }).format(new Date(state.deadline)) : "Не вказано";

  return <div className="std-dash assignment-page">
    {error && <RequestError message={error} />}
    {assignment.error && <RequestError message={assignment.error} />}
    {assignment.loading && <p role="status">Завантаження завдання…</p>}
    <nav className="learn-breadcrumbs" aria-label="breadcrumb"><Link to="/student">Головна</Link><span>›</span>{state.courseId ? <Link to={`/student/learning/${state.courseId}`}>{courseTitle}</Link> : <span>{courseTitle}</span>}<span>›</span><span className="active">{assignmentTitle}</span></nav>
    <div className="assignment-overview-grid">
      <section className="assignment-hero-panel"><span className="std-badge-tag">[ ПРАКТИЧНЕ ЗАВДАННЯ ]</span><h1 className="assignment-title">{assignmentTitle}</h1><p className="assignment-desc">{description}</p><div className="assignment-meta-chips"><span>Навчальний курс</span><span>{courseTitle}</span><span>1 файл</span></div><img src="/student/tree_circuits.webp" alt="" className="assignment-hero-illustration" /></section>
      <aside className="assignment-status-panel"><span className="std-badge-tag">[ СТАТУС ]</span><h2>{!status ? "Статус недоступний" : isSubmitted ? (isRated ? "Перевірено" : "На перевірці") : "Не розпочато"}</h2><div className="assignment-status-grid"><div><small>Дедлайн</small><strong>{deadline}</strong></div><div><small>Формат</small><strong>1 файл</strong></div><div><small>Спроб</small><strong>—</strong></div><div><small>Статус</small><strong>{!status ? "—" : isSubmitted ? "Надіслано" : "Відкрито"}</strong></div></div>{isSubmitted ? <div className="assignment-status-action">{isRated ? `Оцінка: ${submission?.rate} / 12` : "Ментор перевіряє роботу"}</div> : assignmentId && status ? <Link to={`/student/upload/${assignmentId}`} state={state} className="std-continue-btn assignment-status-action">Розпочати завдання <span><UiIcon name="arrow" /></span></Link> : <div className="nex-auth-error-box">Завдання не знайдено.</div>}</aside>
    </div>
    <div className="assignment-work-grid"><section><div className="assignment-section-heading"><h2>Що потрібно зробити</h2></div><div className="assignment-steps-list">{steps.map((step, index) => <div className="assignment-step" key={step}><span className="assignment-step-number">0{index + 1}</span><div><h3>{step}</h3><p>{index === 0 ? description : "Працюйте послідовно, спираючись на матеріали уроку та власне дослідження."}</p></div><span className={isSubmitted ? "assignment-step-done" : "assignment-step-state"}>{isSubmitted ? <UiIcon name="check" size={18} /> : index === 0 ? "Почніть" : ""}</span></div>)}</div><section className="assignment-rubric"><span className="std-badge-tag">[ ОЦІНЮВАННЯ ]</span><h3>Критерії оцінювання</h3><DataUnavailable title="Детальні критерії поки недоступні" /></section></section>
      <aside className="assignment-side-stack"><section className="assignment-requirements"><span className="std-badge-tag">[ ВИМОГИ ]</span><h3>Вимоги до роботи</h3><ul><li>Один підсумковий файл</li><li>Виконайте всі кроки завдання</li><li>Перевірте матеріали уроку</li><li>Надішліть роботу до дедлайну</li></ul></section><section className="assignment-resources"><span className="std-badge-tag">[ МАТЕРІАЛИ ]</span><h3>Корисні ресурси</h3><p>Усі потрібні файли та посилання доступні в матеріалах уроку.</p>{state.courseId && <Link to={`/student/learning/${state.courseId}`} className="assignment-outline-link">До матеріалів курсу <span><UiIcon name="arrow" /></span></Link>}</section>{isSubmitted && submission?.fileUrl && <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="assignment-outline-link">Переглянути надісланий файл <span><UiIcon name="external" /></span></a>}</aside>
    </div>
  </div>;
}
