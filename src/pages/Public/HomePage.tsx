import { Link } from "react-router-dom";
import { useCourses } from "../../hooks/useCourses";
import { CourseCard, PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";

const directions = ["Sustainable design", "Circular design", "Eco branding"];

export default function HomePage() {
    const { courses, error } = useCourses();
    return (
        <>
            <PageHeader
                title="Освіта для сталого майбутнього"
                description="Онлайн-платформа NEXYLVA для навчання"
                action={<Link className="button-link" to="/courses">Переглянути курси</Link>}
            />

            <section className="section">
                <h2>Напрями навчання</h2>
                <div className="grid grid-3">
                    {directions.map((direction) => (
                        <Panel key={direction}>
                            <h3>{direction}</h3>
                            <p>Практичні курси, робота з ментором і фінальний проєкт.</p>
                        </Panel>
                    ))}
                </div>
            </section>

            <section className="section">
                <h2>Популярні курси</h2>
                <div className="grid grid-3">
                    {courses.map((course) => <CourseCard key={course.id} course={course} />)}
                </div>
                {error && <p role="alert">Не вдалося завантажити курси: {error}</p>}
            </section>
        </>
    );
}
