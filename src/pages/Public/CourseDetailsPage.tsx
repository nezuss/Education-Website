import { Link, useParams } from "react-router-dom";
import { activeCourse, courses } from "../../data/mockData";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function CourseDetailsPage() {
    const { courseId } = useParams();
    const course = courses.find((item) => item.id === courseId) ?? activeCourse;

    return (
        <>
            <PageHeader
                title={course.title}
                description={course.description}
                action={<Link className="button-link" to={`/checkout/${course.id}`}>Записатися — {course.price.toLocaleString("uk-UA")} грн</Link>}
            />
            <div className="two-column">
                <Panel><h2>Програма курсу</h2><ol className="list">{course.modules.map((module, index) => <li key={module}>Модуль {index + 1}: {module}</li>)}</ol></Panel>
                <Panel><h2>Про курс</h2><p>Ментор: {course.mentor}</p><p>Формат: відеоуроки, матеріали та практичні завдання.</p></Panel>
            </div>
        </>
    );
}
