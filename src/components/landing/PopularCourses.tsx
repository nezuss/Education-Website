import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/courseService";
import type { Course } from "../../types/course";

export default function PopularCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCourses()
            .then((data) => setCourses(data.slice(0, 4)))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="landing-section" id="courses">
                <div className="section-header-row">
                    <h2 className="section-title">Популярні курси</h2>
                </div>
                <div className="courses-cards-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="landing-course-card" style={{ minHeight: "320px", background: "rgba(19,73,44,0.04)", borderRadius: "16px", animation: "pulse 1.5s ease-in-out infinite" }} />
                    ))}
                </div>
            </section>
        );
    }

    if (courses.length === 0) {
        return null;
    }

    return (
        <section className="landing-section" id="courses">
            <div className="section-header-row">
                <h2 className="section-title">Популярні курси</h2>
            </div>

            <div className="courses-cards-grid">
                {courses.map((course) => (
                    <article key={course.id} className="landing-course-card">
                        <Link to={`/courses/${course.id}`} className="course-card-link">
                            
                            <div className="course-card-photo-box">
                                <span className="course-card-tag">[ {course.direction || "DESIGN"} ]</span>
                                <span className="course-card-duration">[ {course.totalLearningPeriodWeeks ? `${course.totalLearningPeriodWeeks} ТИЖНІВ` : "ОНЛАЙН"} ]</span>
                                {course.bannerUrl ? (
                                    <img 
                                        src={course.bannerUrl} 
                                        alt={course.title} 
                                        className="course-card-photo"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="course-card-photo" style={{ background: "linear-gradient(135deg, #0A2D1B 0%, #13492C 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "32px", fontWeight: 700, fontFamily: "var(--font-heading)" }}>
                                        {course.title.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="course-card-content">
                                <h3 className="course-card-title">{course.title}</h3>
                                <p className="course-card-desc">{course.description}</p>

                                <div className="course-card-footer">
                                    <div className="course-card-meta">
                                        <span>{course.modules?.length || 0} модулів</span>
                                        {course.projectsReadyForPortfolio && course.projectsReadyForPortfolio > 0 && (
                                            <>
                                                <span className="meta-bullet">•</span>
                                                <span>{course.projectsReadyForPortfolio} проєкти</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="course-card-rating">
                                        <span className="rating-val" style={{ fontSize: "13px", color: "var(--color-brand-soft)" }}>
                                            {course.price > 0 ? `${course.price.toLocaleString("uk-UA")} грн` : "Безкоштовно"}
                                        </span>
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
