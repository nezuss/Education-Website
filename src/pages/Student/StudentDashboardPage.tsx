import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEnrolledCourses } from "../../services/courseService";
import type { Course } from "../../types/course";
import { PageHeader, Panel, Stat } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function StudentDashboardPage() {
    const [courses, setCourses] = useState<Course[]>([]); const [error, setError] = useState("");
    useEffect(() => { getEnrolledCourses().then(setCourses).catch((reason: Error) => setError(reason.message)); }, []);
    const activeCourse = courses[0];
    return <><PageHeader title="Кабінет студента" description="Ваші активні курси." action={<Link className="button-link" to="/student/courses">Мої курси</Link>} /><section className="grid grid-3"><Stat value={String(courses.length)} label="Активних курсів" /></section>{error && <p role="alert">Не вдалося завантажити дані: {error}</p>}<section className="section"><Panel>{activeCourse ? <><h2>Поточний курс</h2><h3>{activeCourse.title}</h3><Link className="button-link" to={`/student/learning/${activeCourse.id}`}>Відкрити навчання</Link></> : <p>Ви ще не записалися на курс.</p>}</Panel></section></>;
}
