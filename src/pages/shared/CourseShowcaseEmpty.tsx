import { Link } from "react-router-dom";
import CourseSymbol from "./CourseSymbol";

export default function CourseShowcaseEmpty({ checkoutUrl }: { checkoutUrl: string }) {
    return <section className="course-showcase" aria-labelledby="course-showcase-heading">
        <div className="course-section-header course-section-header-line"><h2 id="course-showcase-heading" className="course-section-title">Роботи наших студентів</h2><span aria-hidden="true" /></div>
        <div className="course-showcase-grid">
            <div className="course-showcase-art" aria-hidden="true">
                <span className="course-showcase-art-ring" />
                <div className="course-showcase-paper"><CourseSymbol name="leaf" /><span /><span /><span /></div>
                <div className="course-showcase-art-badge"><CourseSymbol name="project" /></div>
                <span className="course-showcase-art-label">Ідеї, що стають проєктами</span>
            </div>
            <div className="course-showcase-message"><span className="course-section-tag">[ СТУДЕНТСЬКІ ПРОЄКТИ ]</span>
                <h3>Місце для нових ідей</h3><p>Тут з’являться роботи студентів цього курсу. Поки галерея недоступна, познайомтеся з програмою та почніть власну історію.</p>
                <a href="#course-program" className="course-text-link">Переглянути програму <CourseSymbol name="arrow" /></a>
            </div>
            <aside className="course-showcase-cta"><CourseSymbol name="leaf" /><h3>Хочеш так само?</h3>
                <p>Перший крок до власного проєкту — нові знання.</p>
                <Link to={checkoutUrl} className="course-action">Розпочати навчання <CourseSymbol name="arrow" /></Link>
            </aside>
        </div>
    </section>;
}
