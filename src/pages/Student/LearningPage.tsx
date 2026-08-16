import { Link, useParams } from "react-router-dom";
import { activeCourse } from "../../data/mockData";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";
export default function LearningPage() { const { lessonId } = useParams(); return <><PageHeader title={lessonId ? "Урок: Життєвий цикл продукту" : activeCourse.title} /><div className="two-column"><Panel><h2>Модулі</h2><ol className="list">{activeCourse.modules.map((module, index) => <li key={module}><Link to={`/student/lesson/${index + 1}`}>{index + 1}. {module}</Link></li>)}</ol></Panel><Panel><div className="video-placeholder">Відеоурок</div><h2>Життєвий цикл продукту</h2><Link className="button-link" to="/student/assignments/packaging-project">До завдання</Link></Panel></div></>; }
