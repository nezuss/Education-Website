import { Link } from "react-router-dom";
import type { Course } from "../../types/course";
import CourseSymbol from "./CourseSymbol";

export default function CourseEnrollment({ course }: { course: Course }) {
    const questions = [
        { question: "Як розпочати навчання?", answer: "Натисніть «Обрати курс», увійдіть у свій акаунт та перейдіть до оформлення. Після підтвердження оплати шукайте курс у розділі «Мої курси»." },
        { question: "Де знайти програму та матеріали?", answer: "Програму можна переглянути вище на цій сторінці без реєстрації. Матеріали придбаних курсів знаходяться в особистому кабінеті." },
        { question: "Скільки триває курс?", answer: course.totalLearningPeriodWeeks != null ? `Тривалість цього курсу: ${course.totalLearningPeriodWeeks} тижнів.` : "Тривалість цього курсу ще не вказана. Уточніть деталі перед оформленням у підтримки." },
    ];
    return <section className="course-enrollment-layout" aria-label="Вартість навчання та запитання">
        <div><div className="course-section-header course-section-header-line"><h2 className="course-section-title">Обери своє навчання</h2><span aria-hidden="true" /></div>
            <article className="course-enrollment-card">
                <div className="course-enrollment-info"><span className="course-section-tag">[ ОНЛАЙН НАВЧАННЯ ]</span>
                    <h3>{course.title}</h3><p>{course.description || "Дізнайтеся більше про курс у програмі навчання."}</p>
                    <ul><li><CourseSymbol name="book" />Модулів у програмі: {course.modules.length}</li>
                        {course.totalLearningPeriodWeeks != null && <li><CourseSymbol name="leaf" />Тривалість: {course.totalLearningPeriodWeeks} тижнів</li>}
                        {course.projectsReadyForPortfolio != null && <li><CourseSymbol name="project" />Проєктів для портфоліо: {course.projectsReadyForPortfolio}</li>}
                    </ul>
                </div>
                <div className="course-enrollment-price"><span>Вартість курсу</span><strong>{course.price.toLocaleString("uk-UA")} <small>грн</small></strong>
                    <Link to={`/checkout/${course.id}`} className="course-action">Обрати курс <CourseSymbol name="arrow" /></Link>
                    <p>Деталі замовлення — на наступному кроці</p>
                </div>
            </article>
        </div>
        <aside className="course-faq-widget"><span className="course-section-tag">[ FAQ ]</span><h2 className="course-section-title">Часті запитання</h2>
            <div className="course-faq-list">{questions.map((item, index) => <details key={item.question} open={index === 0}>
                <summary>{item.question}<CourseSymbol name="plus" /></summary><p>{item.answer}</p>
            </details>)}</div>
            <Link to="/faq" className="course-action course-action-light">Всі питання <CourseSymbol name="arrow" /></Link>
        </aside>
    </section>;
}
