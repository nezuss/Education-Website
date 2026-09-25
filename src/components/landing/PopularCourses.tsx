import { Link } from "react-router-dom";

interface CourseItem {
    id: string;
    tag: string;
    duration: string;
    title: string;
    description: string;
    image: string;
    modules: number;
    hasCertificate: boolean;
    rating: number;
    reviewsCount: number;
}

const COURSES_DATA: CourseItem[] = [
    {
        id: "lca-eco-design",
        tag: "LCA",
        duration: "8 ТИЖНІВ",
        title: "LCA & Еко-проєктування",
        description: "Практичне проектування об'єктів із розрахунком вуглецевого сліду та вибором еко-матеріалів.",
        image: "/landing/course-lca.webp",
        modules: 10,
        hasCertificate: true,
        rating: 4.9,
        reviewsCount: 500
    },
    {
        id: "zero-waste-packaging",
        tag: "PACKAGING",
        duration: "6 ТИЖНІВ",
        title: "Zero-Waste Пакування",
        description: "Створення концептів пакування з біоматеріалів та розробка систем повторного використання.",
        image: "/landing/course-packaging.webp",
        modules: 8,
        hasCertificate: true,
        rating: 4.9,
        reviewsCount: 185
    },
    {
        id: "3d-parametrica-eco-print",
        tag: "3D DESIGN",
        duration: "12 ТИЖНІВ",
        title: "3D-Параметрика & Еко-друк",
        description: "Генеративне моделювання складних форм у Grasshopper для виробництва з вторинного пластику.",
        image: "/landing/course-3d.webp",
        modules: 14,
        hasCertificate: true,
        rating: 5.0,
        reviewsCount: 375
    },
    {
        id: "polymers-recycling",
        tag: "MATERIALS",
        duration: "8 ТИЖНІВ",
        title: "Рециклінг полімерів",
        description: "Лабораторія дослідження та підготовки вторинної пластикової сировини для великоформатного 3D-друку",
        image: "/landing/course-materials.webp",
        modules: 12,
        hasCertificate: true,
        rating: 4.8,
        reviewsCount: 120
    }
];

export default function PopularCourses() {
    return (
        <section className="landing-section" id="courses">
            <div className="section-header-row">
                <h2 className="section-title">Популярні курси</h2>
            </div>

            <div className="courses-cards-grid">
                {COURSES_DATA.map((course) => (
                    <article key={course.id} className="landing-course-card">
                        <Link to={`/courses/${course.id}`} className="course-card-link">
                            {/* Photo and Badge */}
                            <div className="course-card-photo-box">
                                <span className="course-card-tag">[ {course.tag} ]</span>
                                <span className="course-card-duration">[ {course.duration} ]</span>
                                <img 
                                    src={course.image} 
                                    alt={course.title} 
                                    className="course-card-photo"
                                    loading="lazy"
                                />
                            </div>

                            {/* Card Content */}
                            <div className="course-card-content">
                                <h3 className="course-card-title">{course.title}</h3>
                                <p className="course-card-desc">{course.description}</p>

                                {/* Card Meta & Rating */}
                                <div className="course-card-footer">
                                    <div className="course-card-meta">
                                        <span>{course.modules} модулів</span>
                                        {course.hasCertificate && (
                                            <>
                                                <span className="meta-bullet">•</span>
                                                <span>Сертифікат</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="course-card-rating">
                                        <svg className="star-icon" width="14" height="14" viewBox="0 0 24 24" fill="#0A2D1B" stroke="none">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                        </svg>
                                        <span className="rating-val">{course.rating.toString().replace(".", ",")}</span>
                                        <span className="rating-count">({course.reviewsCount})</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    );
}
