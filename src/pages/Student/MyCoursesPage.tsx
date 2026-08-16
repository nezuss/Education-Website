import { Link } from "react-router-dom";
import { activeCourse } from "../../data/mockData";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";
export default function MyCoursesPage() { return <><PageHeader title="Мої курси" /><section className="grid grid-2"><Panel><p className="eyebrow">У процесі · 42%</p><h2>{activeCourse.title}</h2><Link className="button-link" to={`/student/learning/${activeCourse.id}`}>Відкрити курс</Link></Panel><Panel className="muted"><p className="eyebrow">Завершено</p><h2>Вступ до sustainable design</h2></Panel></section></>; }
