import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourse } from "../../services/courseService";
import type { Course } from "../../types/course";
import CourseProgram from "../shared/CourseProgram";
import CourseEnrollment from "../shared/CourseEnrollment";
import CourseShowcaseEmpty from "../shared/CourseShowcaseEmpty";
import CourseReviewsEmpty from "../shared/CourseReviewsEmpty";
import CourseSymbol from "../shared/CourseSymbol";
import "../../styles/CourseDetailsPage.css";

export default function CourseDetailsPage() {
    const { courseId } = useParams();
    return <CourseDetailsContent key={courseId} courseId={courseId} />;
}

function CourseDetailsContent({ courseId }: { courseId?: string }) {
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        if (!courseId) return;
        getCourse(courseId)
            .then(value => { if (active) setCourse(value); })
            .catch((reason: Error) => { if (active) setError(reason.message); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [courseId]);

    if (courseId && loading) return <div className="course-details-container course-page-loading" role="status" aria-label="Завантаження курсу">
        <div className="page-loader"><div className="page-loader-spinner" /></div>
    </div>;

    if (!course) return <div className="course-details-container course-page-error">
        <h1>Курс недоступний</h1>
        <p>{error || "Не вдалося знайти цей курс."}</p>
        <Link to="/courses" className="course-action">Повернутися до каталогу <CourseSymbol name="arrow" /></Link>
    </div>;

    const checkoutUrl = `/checkout/${course.id}`;
    const metrics = [
        { value: course.modules.length, title: "Модулі", text: "Програма навчання" },
        { value: course.totalLearningPeriodWeeks ?? "—", title: "Тижні", text: "Тривалість курсу" },
        { value: course.projectsReadyForPortfolio ?? "—", title: "Проєкти", text: "Для вашого портфоліо" },
        { value: `${course.price.toLocaleString("uk-UA")} ₴`, title: "Вартість", text: "Навчання на курсі" },
    ];

    return <div className="course-details-container">
        <nav className="course-breadcrumbs" aria-label="Хлібні крихти">
            <Link to="/">Головна</Link><CourseSymbol name="chevron" />
            <Link to="/courses">Курси</Link><CourseSymbol name="chevron" />
            <span aria-current="page">{course.title}</span>
        </nav>

        <section className="course-catalog-intro" aria-label="Каталог навчальних програм">
            <div><h2>Каталог навчальних програм</h2><p>Обирайте напрям та опановуйте нові знання</p></div>
            <form action="/courses" role="search" className="course-catalog-search">
                <CourseSymbol name="search" /><input name="q" aria-label="Пошук курсу" placeholder="Пошук курсу…" type="search" />
                <button type="submit" aria-label="Знайти курс"><CourseSymbol name="arrow" /></button>
            </form>
        </section>
        <div className="course-category-row"><Link to="/courses">Усі курси</Link>
            {course.direction && course.direction !== "Без категорії" && <span>{course.direction}</span>}
        </div>

        <section className="course-hero-grid" aria-labelledby="course-heading">
            <div className="course-hero-left">
                <span className="course-section-tag">[ ПРАКТИЧНИЙ ОНЛАЙН КУРС ]</span>
                <h1 id="course-heading" className="course-hero-title">{course.title}</h1>
                <p className="course-hero-desc">{course.description || "Опис курсу ще не додано."}</p>
                <div className="course-hero-actions">
                    <Link to={checkoutUrl} className="course-action">Обрати курс <CourseSymbol name="arrow" /></Link>
                    <a href="#course-program" className="course-action course-action-light">Програма курсу <CourseSymbol name="book" /></a>
                </div>
                <div className="course-instructor-card">
                    <span className="course-instructor-avatar" aria-hidden="true"><CourseSymbol name="person" /></span>
                    <div><span>Викладач</span><strong>{course.mentor || "Викладача ще не призначено"}</strong></div>
                    <span className="course-instructor-label">Ментор курсу</span>
                </div>
            </div>
            <div className="course-hero-visual-frame">
                <img src={course.bannerUrl || "/course-placeholder.svg"} alt={course.title} className="course-hero-img"
                    onError={event => { if (!event.currentTarget.src.endsWith("/course-placeholder.svg")) event.currentTarget.src = "/course-placeholder.svg"; }} />
            </div>
        </section>

        <section className="course-metrics-bar" aria-label="Курс у цифрах">
            {metrics.map(metric => <div className="course-metric" key={metric.title}>
                <strong>{metric.value}</strong><span>{metric.title}</span><small>{metric.text}</small>
            </div>)}
        </section>

        <CourseProgram course={course} />
        <CourseShowcaseEmpty checkoutUrl={checkoutUrl} />
        <CourseReviewsEmpty />
        <CourseEnrollment course={course} />

        <section className="course-stream-banner" aria-labelledby="course-stream-heading">
            <div><h2 id="course-stream-heading">Готові розпочати навчання?</h2>
                <p>Оберіть курс та зробіть наступний крок разом із NEXYLVA.</p>
                <Link to={checkoutUrl} className="course-action course-action-outline">Обрати курс <CourseSymbol name="arrow" /></Link>
            </div>
            <div className="course-stream-brand"><img src="/logo-on-dark.svg" alt="NEXYLVA" />
                {course.studentsCount != null && <span>{course.studentsCount.toLocaleString("uk-UA")} студентів на курсі</span>}
            </div>
        </section>
    </div>;
}
