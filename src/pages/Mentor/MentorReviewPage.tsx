import { useState } from "react";
import { useParams } from "react-router-dom";
import { submissions } from "../../data/mockData";
import { PageHeader, Panel, Success } from "../shared/PageComponents";
import "../PlatformPages.css";
export default function MentorReviewPage() { const { submissionId } = useParams(); const submission = submissions.find((item) => item.id === submissionId) ?? submissions[0]; const [sent, setSent] = useState(false); return <><PageHeader title="Перевірка роботи" description={`${submission.student} · ${submission.assignment}`} /><div className="two-column"><Panel><h2>Файли студента</h2><a href="#project">project-presentation.pdf</a></Panel><Panel>{sent ? <Success title="Фідбек надіслано" text="Студент отримає повідомлення в кабінеті." to="/mentor/submissions" label="До списку робіт" /> : <form onSubmit={(event) => { event.preventDefault(); setSent(true); }}><label>Коментар<textarea rows={7} required /></label><label>Оцінка<input type="number" min="0" max="100" /></label><button type="submit">Надіслати фідбек</button></form>}</Panel></div></>; }
