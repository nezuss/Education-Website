import { Link } from "react-router-dom";
import { submissions } from "../../data/mockData";
import { PageHeader, Panel, Stat } from "../shared/PageComponents";
import SubmissionsTable from "../shared/SubmissionsTable";
import "../PlatformPages.css";
export default function MentorDashboardPage() { return <><PageHeader title="Кабінет ментора" action={<Link className="button-link" to="/mentor/submissions">Відкрити чергу</Link>} /><section className="grid grid-3"><Stat value="3" label="Нові роботи" /><Stat value="5" label="На перевірці" /><Stat value="2" label="На доопрацюванні" /></section><section className="section"><Panel><h2>Найближчі перевірки</h2><SubmissionsTable rows={submissions.slice(0, 2)} /></Panel></section></>; }
