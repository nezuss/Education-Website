import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSubmissionStatus, type SubmissionStatus } from "../../services/learningService";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";
export default function AssignmentPage() {
    const { assignmentId } = useParams();
    const [status, setStatus] = useState<SubmissionStatus>();
    const [error, setError] = useState("");
    useEffect(() => { if (assignmentId) getSubmissionStatus(assignmentId).then(setStatus).catch((reason: Error) => setError(reason.message)); }, [assignmentId]);
    return <><PageHeader title="Практичне завдання" action={assignmentId ? <Link className="button-link" to={`/student/upload/${assignmentId}`}>Завантажити проєкт</Link> : undefined} /><div className="two-column"><Panel><h2>Виконання</h2><p>Завантажте файл виконаної роботи для перевірки.</p></Panel><Panel><h2>Статус роботи</h2>{error ? <p role="alert">Не вдалося отримати статус: {error}</p> : <p>{status?.isSubmitted ? "Роботу надіслано" : "Роботу ще не надіслано"}</p>}</Panel></div></>;
}
