import { useState } from "react";
import { submissions } from "../../data/mockData";
import { PageHeader, Panel } from "../shared/PageComponents";
import SubmissionsTable from "../shared/SubmissionsTable";
import "../PlatformPages.css";
export default function MentorSubmissionsPage() { const [status, setStatus] = useState("Усі"); const rows = status === "Усі" ? submissions : submissions.filter((submission) => submission.status === status); return <><PageHeader title="Роботи студентів" description="Черга на перевірку та статуси фідбеку." /><Panel className="filters"><label>Статус<select value={status} onChange={(event) => setStatus(event.target.value)}><option>Усі</option><option>Нове</option><option>На перевірці</option><option>Потребує доопрацювання</option></select></label></Panel><SubmissionsTable rows={rows} /></>; }
