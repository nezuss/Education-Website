import { Link } from "react-router-dom";
import { getStudentSubmissions, submissionDate, submissionFileUrl, submissionState } from "../../services/submissionService";
import useRemoteData from "../shared/useRemoteData";
import RequestError from "../shared/RequestError";
import "../../styles/StudentDashboard.css";
import "../../styles/Submissions.css";

export default function SubmissionsPage() {
  const { data, loading, error, reload } = useRemoteData(getStudentSubmissions);
  return <div className="std-dash"><h1>Мої роботи</h1><p>Надіслані роботи, оцінки та коментарі ментора.</p><button type="button" disabled={loading} onClick={reload}>Оновити</button>
    {loading && <p role="status">Завантаження робіт…</p>}{error && <RequestError message={error} retry={reload} />}
    {data?.length === 0 && <p role="status">Ви ще не надсилали роботи. <Link to="/student/courses">Перейти до курсів</Link></p>}
    <div className="student-submission-list">{data?.map(item => {
      const file = submissionFileUrl(item.fileUrl);
      return <article key={item.id} className="student-submission-card"><h2>{item.type === "Test" ? "Тест" : "Практична робота"}</h2><small>ID роботи: {item.id}</small><p>{submissionState(item).label} · Оцінка: {item.rate > 0 ? `${item.rate} / 12` : "Ще не виставлено"}</p><p>Надіслано: {submissionDate(item.createdAt)}</p>
        {item.feedback && <><h3>Коментар ментора</h3><p className="submission-text">{item.feedback}</p></>}
        {item.revisionMessage && <><h3>Причина повернення</h3><p className="submission-text">{item.revisionMessage}</p></>}
        {file && <p><a href={file} target="_blank" rel="noreferrer">Переглянути файл</a></p>}
        <p><Link to={`/student/submissions/${encodeURIComponent(item.id)}`}>Деталі роботи та результат перевірки</Link></p>
        {item.type === "Assignment" ? <Link to={`/student/assignments/${encodeURIComponent(item.relatedMaterialId)}`}>Перейти до завдання</Link> : <Link to="/student/courses">До матеріалів курсу</Link>}
      </article>;
    })}</div>
  </div>;
}
