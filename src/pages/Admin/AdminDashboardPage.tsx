import { Link } from "react-router-dom";
import { submissions } from "../../data/mockData";
import { PageHeader, Panel, Stat } from "../shared/PageComponents";
import SubmissionsTable from "../shared/SubmissionsTable";
import "../PlatformPages.css";
export default function AdminDashboardPage() { return <><PageHeader title="Адміністрування" description="Коротка аналітика навчальної платформи." action={<Link className="button-link" to="/admin/users">Користувачі</Link>} /><section className="grid grid-3"><Stat value="148" label="Користувачів" /><Stat value="37" label="Активних курсів" /><Stat value="18" label="Нових реєстрацій" /></section><section className="section"><Panel><h2>Остання активність</h2><SubmissionsTable rows={submissions} /></Panel></section></>; }
