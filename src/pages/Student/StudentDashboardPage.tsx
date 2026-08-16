import { Link } from "react-router-dom";
import { activeCourse } from "../../data/mockData";
import { PageHeader, Panel, Stat } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function StudentDashboardPage() {
    return <><PageHeader title="Кабінет студента" description="Ваш навчальний прогрес і найближчі дії." action={<Link className="button-link" to="/student/courses">Мої курси</Link>} /><section className="grid grid-3"><Stat value="1" label="Активний курс" /><Stat value="42%" label="Завершено" /><Stat value="20 серпня" label="Наступний дедлайн" /></section><section className="section"><Panel><h2>Поточний курс</h2><h3>{activeCourse.title}</h3><p>Прогрес: 42%. Наступний урок: «Життєвий цикл продукту».</p><Link className="button-link" to={`/student/learning/${activeCourse.id}`}>Продовжити навчання</Link></Panel></section></>;
}
