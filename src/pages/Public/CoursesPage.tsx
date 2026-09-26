import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/courseService";
import "../../styles/CoursesPage.css";

export interface CatalogCourse {
    id: string;
    level: "JUNIOR" | "MIDDLE" | "ADVANCED";
    duration: string;
    category: string;
    title: string;
    description: string;
    modulesCount: number;
    image: string;
}

export default function CoursesPage() {
    const [coursesList, setCoursesList] = useState<CatalogCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("Усі");
    const [sortBy, setSortBy] = useState<"default" | "modules" | "title">("default");
    const [isExpanded, setIsExpanded] = useState(false);
    const [consultationModalOpen, setConsultationModalOpen] = useState(false);
    const [consultationEmail, setConsultationEmail] = useState("");
    const [consultationSent, setConsultationSent] = useState(false);

    useEffect(() => {
        setLoading(true);
        getCourses()
            .then((backendCourses) => {
                const mapped: CatalogCourse[] = (backendCourses ?? []).map((c) => ({
                    id: c.id,
                    level: "MIDDLE" as const,
                    duration: c.totalLearningPeriodWeeks
                        ? `${c.totalLearningPeriodWeeks} ТИЖНІВ`
                        : "—",
                    category: c.direction || "Design",
                    title: c.title,
                    description: c.description,
                    modulesCount: c.modules?.length || 0,
                    image: c.bannerUrl || "",
                }));
                setCoursesList(mapped);
            })
            .catch(() => {
                setCoursesList([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const categories = useMemo(() => {
        const cats = new Set(coursesList.map((c) => c.category));
        return ["Усі", ...Array.from(cats)];
    }, [coursesList]);

    const filteredCourses = useMemo(() => {
        let result = [...coursesList].filter((course) => {
            const matchesCategory = selectedCategory === "Усі" || course.category === selectedCategory;
            const matchesQuery = 
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesQuery;
        });

        if (sortBy === "modules") {
            result.sort((a, b) => b.modulesCount - a.modulesCount);
        } else if (sortBy === "title") {
            result.sort((a, b) => a.title.localeCompare(b.title));
        }

        return result;
    }, [coursesList, searchQuery, selectedCategory, sortBy]);

    const displayedCourses = useMemo(() => {
        if (isExpanded) {
            return filteredCourses;
        }
        return filteredCourses.slice(0, 6);
    }, [filteredCourses, isExpanded]);

    function handleConsultationSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (consultationEmail.trim()) {
            setConsultationSent(true);
        }
    }

    return (
        <div className="catalog-page-container">
            
            <nav className="catalog-breadcrumbs" aria-label="Хлібні крихти">
                <Link to="/" className="breadcrumb-link">Головна</Link>
                <span className="breadcrumb-sep">&gt;</span>
                <Link to="/courses" className="breadcrumb-link">Курси</Link>
                <span className="breadcrumb-sep">&gt;</span>
                <span className="breadcrumb-current">Каталог навчальних програм</span>
            </nav>

            <div className="catalog-top-row">
                <div className="catalog-title-group">
                    <h1 className="catalog-main-title">Каталог навчальних програм</h1>
                    <p className="catalog-subtitle">Обирайте напрям та опановуйте сталий дизайн</p>
                </div>

                <div className="catalog-controls-group">
                    
                    <div className="catalog-search-box">
                        <svg className="catalog-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#557061" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input 
                            type="text" 
                            className="catalog-search-input"
                            placeholder="Пошук курсу..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="catalog-sort-select-wrapper">
                        <label htmlFor="course-sort" className="catalog-sort-label">Сортувати</label>
                        <select 
                            id="course-sort"
                            className="catalog-sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                        >
                            <option value="default">за замовчуванням</option>
                            <option value="modules">за модулями</option>
                            <option value="title">за назвою</option>
                        </select>
                        <svg className="catalog-sort-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A2D1B" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="catalog-filter-pills-row">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        className={`filter-pill-btn ${selectedCategory === cat ? "active" : ""}`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="catalog-courses-grid">
                    {[1, 2, 3].map((i) => (
                        <article key={i} className="catalog-card catalog-card--skeleton">
                            <div className="catalog-card-image-box" style={{ background: "var(--color-bg-card, #f1ebe0)", minHeight: 200 }} />
                            <div className="catalog-card-body">
                                <div style={{ height: 20, width: "70%", background: "rgba(0,0,0,0.08)", borderRadius: 6, marginBottom: 8 }} />
                                <div style={{ height: 14, width: "100%", background: "rgba(0,0,0,0.05)", borderRadius: 4, marginBottom: 6 }} />
                                <div style={{ height: 14, width: "60%", background: "rgba(0,0,0,0.05)", borderRadius: 4 }} />
                            </div>
                        </article>
                    ))}
                </div>
            ) : coursesList.length === 0 ? (
                <div style={{ textAlign: "center", padding: "64px 24px", color: "var(--color-brand-soft, #557061)" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 16, opacity: 0.5 }}>
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    <h3 style={{ fontSize: 20, marginBottom: 8 }}>Курси поки не додані</h3>
                    <p>Адміністратор ще не створив жодного курсу.</p>
                </div>
            ) : (
                <>
                    <div className="catalog-courses-grid">
                        {displayedCourses.map((course) => (
                            <article key={course.id} className="catalog-card">
                                <Link to={`/courses/${course.id}`} className="catalog-card-image-box">
                                    <span className="badge-level">[ {course.level} ]</span>
                                    <span className="badge-duration">[ {course.duration} ]</span>
                                    <img 
                                        src={course.image} 
                                        alt={course.title} 
                                        className="catalog-card-img"
                                        loading="lazy"
                                    />
                                </Link>

                                <div className="catalog-card-body">
                                    <h2 className="catalog-card-title">
                                        <Link to={`/courses/${course.id}`}>{course.title}</Link>
                                    </h2>
                                    <p className="catalog-card-desc">{course.description}</p>

                                    <div className="catalog-card-footer">
                                        <span className="catalog-card-modules">• {course.modulesCount} модулів</span>
                                        <Link to={`/courses/${course.id}`} className="catalog-card-detail-link">
                                            <span>Читати детальніше</span>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="5" y1="12" x2="19" y2="12"/>
                                                <polyline points="12 5 19 12 12 19"/>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {filteredCourses.length > 6 && (
                        <div className="catalog-more-row">
                            <button 
                                type="button" 
                                className="catalog-more-btn"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                <span>{isExpanded ? "Скрити додаткові курси" : "Показати ще курси"}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                    <polyline points="12 5 19 12 12 19"/>
                                </svg>
                            </button>
                        </div>
                    )}
                </>
            )}

            <section className="consultation-banner">
                <div className="consultation-left">
                    <h3 className="consultation-title">Не знаєте, який напрям обрати?</h3>
                    <p className="consultation-desc">
                        Пройдіть короткий тест за 2 хвилини або отримайте персональну консультацію від нашого куратора.
                    </p>
                </div>

                <button 
                    type="button" 
                    className="consultation-btn"
                    onClick={() => setConsultationModalOpen(true)}
                >
                    <span>Отримати консультацію</span>
                    <span className="consultation-btn-arrow-circle">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                        </svg>
                    </span>
                </button>

                <div className="consultation-character-box">
                    <img 
                        src="/courses/curator-character.webp" 
                        alt="Куратор NEXYLVA" 
                        className="consultation-character-img"
                    />
                </div>
            </section>

            {consultationModalOpen && (
                <div className="landing-modal-overlay" onClick={() => setConsultationModalOpen(false)}>
                    <div className="landing-modal-content" style={{ maxWidth: "480px", padding: "36px 32px", background: "#FFFFFF", color: "#0A2D1B" }} onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="modal-close-btn" 
                            style={{ color: "#0A2D1B", background: "rgba(10, 45, 27, 0.08)" }}
                            onClick={() => setConsultationModalOpen(false)}
                        >
                            &times;
                        </button>
                        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", marginBottom: "8px" }}>
                            Консультація куратора
                        </h3>
                        <p style={{ fontSize: "14px", color: "var(--color-brand-soft)", marginBottom: "24px" }}>
                            Залиште контактні дані, і наш провідний ментор допоможе підібрати ідеальну програму навчання.
                        </p>
                        {consultationSent ? (
                            <div style={{ padding: "16px", background: "rgba(19, 73, 44, 0.1)", borderRadius: "8px", color: "#0A2D1B", fontWeight: 600 }}>
                                ✓ Дякуємо! Куратор зв'яжеться з вами протягом 15 хвилин.
                            </div>
                        ) : (
                            <form onSubmit={handleConsultationSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="Ваш Email" 
                                    value={consultationEmail}
                                    onChange={(e) => setConsultationEmail(e.target.value)}
                                    style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid rgba(85, 112, 97, 0.3)", fontSize: "14px" }}
                                />
                                <button 
                                    type="submit" 
                                    style={{ background: "#0A2D1B", color: "#fff", padding: "14px", borderRadius: "9999px", border: "none", fontWeight: 600, cursor: "pointer" }}
                                >
                                    Надіслати запит
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
