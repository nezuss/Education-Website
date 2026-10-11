import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourseProgram, type ProgramModule } from "../../services/courseProgramService";
import type { Course } from "../../types/course";
import CourseSymbol from "./CourseSymbol";

export default function CourseProgram({ course }: { course: Course }) {
    return <Program key={course.id} course={course} />;
}

function Program({ course }: { course: Course }) {
    const [modules, setModules] = useState<ProgramModule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [attempt, setAttempt] = useState(0);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        let active = true;
        const modulesRequest = getCourseProgram(course.id, course.modules);
        modulesRequest.then(value => {
            if (!active) return;
            setModules(value);
        }).catch((reason: Error & { status?: number }) => {
            if (!active) return;
            setError(reason.message);
        })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [course.id, course.modules, attempt]);

    const status = loading ? "Завантажуємо програму курсу…" : error ? "Не вдалося завантажити програму курсу. Спробуйте ще раз."
        : "Програму цього курсу ще не опубліковано.";
    const visibleModules = showAll ? modules : modules.slice(0, 5);

    return <>
        <section className="course-learn-section" aria-labelledby="course-learn-heading">
            <h2 id="course-learn-heading" className="course-section-title">Чого навчають на курсі</h2>
            <div className="course-learn-layout">
                {modules.length > 0 ? <div className="course-learn-cards">
                    {modules.slice(0, 4).map((module, index) => <article className="course-learn-card" key={module.id}>
                        <CourseSymbol name={index % 2 ? "project" : "leaf"} />
                        <div><h3>{module.title}</h3><p>{module.description || "Опис модуля ще не додано."}</p></div>
                        <span className="course-module-badge">Модуль<strong>{String(index + 1).padStart(2, "0")}</strong></span>
                    </article>)}
                </div> : <div className="course-program-empty" role="status">
                    <CourseSymbol name="book" /><span className="course-section-tag">[ ЗНАННЯ ТА НАВИЧКИ ]</span>
                    <h3>{loading ? "Готуємо програму" : "Знайомство з курсом"}</h3><p>{status}</p>
                    {error && <button type="button" className="course-text-link" onClick={() => { setError(""); setLoading(true); setAttempt(value => value + 1); }}>Спробувати ще раз <CourseSymbol name="arrow" /></button>}
                </div>}
                <aside className="course-practice-card">
                    <span className="course-section-tag">[ ВІД ЗНАНЬ ДО ПРАКТИКИ ]</span><h3>Ваш наступний крок</h3>
                    <p>Знайомтеся з програмою та обирайте курс, який відповідає вашим цілям.</p>
                    <ul><li><CourseSymbol name="check" />Навчання онлайн</li><li><CourseSymbol name="check" />Матеріали курсу в кабінеті</li><li><CourseSymbol name="check" />Програма за модулями</li></ul>
                    <Link to={`/checkout/${course.id}`} className="course-action course-action-light">Обрати курс <CourseSymbol name="arrow" /></Link>
                </aside>
            </div>
        </section>

        <section id="course-program" className="course-curriculum-section" aria-labelledby="course-program-heading">
            <div className="course-section-header"><div><span className="course-section-tag">[ ПРОГРАМА НАВЧАННЯ ]</span>
                <h2 id="course-program-heading" className="course-section-title">Програма курсу</h2></div>
                {modules.length > 5 && <button type="button" className="course-text-link" aria-expanded={showAll} aria-controls="course-module-list" onClick={() => setShowAll(value => !value)}>{showAll ? "Показати менше" : "Показати всі модулі"} <CourseSymbol name="arrow" /></button>}
            </div>
            {modules.length > 0 ? <div id="course-module-list" className="course-curriculum-grid">
                {visibleModules.map((module, index) => <details className="course-module" key={module.id}>
                    <summary><span className="course-module-number">{String(index + 1).padStart(2, "0")}</span><span>{module.title}</span><span className="course-module-chevron"><CourseSymbol name="chevron" /></span></summary>
                    <div className="course-module-content"><p>{module.description || "Опис модуля ще не додано."}</p>
                        {module.lessonsError ? <p role="alert">Не вдалося завантажити уроки. <button type="button" className="course-text-link" onClick={() => setAttempt(value => value + 1)}>Спробувати ще раз</button></p> : module.lessons.length ? <ol className="course-program-lessons">{module.lessons.map(lesson => <li key={lesson.id}>{lesson.title}</li>)}</ol> : <p>Уроки ще не опубліковано.</p>}
                    </div>
                </details>)}
                {!showAll && modules.length > 5 && <button type="button" className="course-module-more" aria-controls="course-module-list" onClick={() => setShowAll(true)}>… <span>Подивитись ще {modules.length - 5} модулів</span><CourseSymbol name="arrow" /></button>}
            </div> : <p className="course-curriculum-status" role="status">{status}</p>}
        </section>
    </>;
}
