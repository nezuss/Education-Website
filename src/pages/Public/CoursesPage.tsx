import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/courseService";
import "../../styles/CoursesPage.css";

export interface CatalogCourse {
    id: string;
    level: "JUNIOR" | "MIDDLE" | "ADVANCED";
    duration: string;
    category: "Design" | "Branding";
    title: string;
    description: string;
    modulesCount: number;
    image: string;
    rating: number;
    reviewsCount: number;
}

export const CATALOG_DATA: CatalogCourse[] = [
    {
        id: "lca-eco-design",
        level: "JUNIOR",
        duration: "8 ТИЖНІВ",
        category: "Design",
        title: "LCA & Еко-проєктування",
        description: "Практичне проектування об'єктів із розрахунком вуглецевого сліду та вибором еко-матеріалів.",
        modulesCount: 10,
        image: "/courses/catalog-lca.webp",
        rating: 4.9,
        reviewsCount: 500
    },
    {
        id: "zero-waste-packaging",
        level: "MIDDLE",
        duration: "6 ТИЖНІВ",
        category: "Branding",
        title: "Zero-Waste Пакування",
        description: "Створення концептів пакування з біоматеріалів та розробка систем повторного використання.",
        modulesCount: 8,
        image: "/courses/catalog-packaging.webp",
        rating: 4.9,
        reviewsCount: 185
    },
    {
        id: "3d-parametrica-eco-print",
        level: "ADVANCED",
        duration: "12 ТИЖНІВ",
        category: "Design",
        title: "3D-Параметрика & Еко-друк",
        description: "Генеративне моделювання складних форм у Grasshopper для виробництва з вторинного пластику.",
        modulesCount: 14,
        image: "/courses/catalog-3d.webp",
        rating: 5.0,
        reviewsCount: 375
    },
    {
        id: "biomaterials-in-product",
        level: "JUNIOR",
        duration: "4 ТИЖНЯ",
        category: "Design",
        title: "Біоматеріали у Продукті",
        description: "Дослідження міцелію, комбучі та біопластику для створення нових текстур та об'єктів.",
        modulesCount: 6,
        image: "/courses/catalog-biomaterials.webp",
        rating: 4.8,
        reviewsCount: 140
    },
    {
        id: "circular-branding",
        level: "MIDDLE",
        duration: "8 ТИЖНІВ",
        category: "Branding",
        title: "Циркулярний Брендінг",
        description: "Стратегія та айдентика для брендів із закритим циклом виробництва та засадами сталості.",
        modulesCount: 12,
        image: "/courses/catalog-branding.webp",
        rating: 4.9,
        reviewsCount: 210
    },
    {
        id: "algorithmic-architecture",
        level: "ADVANCED",
        duration: "10 ТИЖНІВ",
        category: "Design",
        title: "Алгоритмічна Архітектура",
        description: "Проєктування енергоефективних об'єктів та адаптивних фасадів із застосуванням штучного інтелекту.",
        modulesCount: 16,
        image: "/courses/catalog-architecture.webp",
        rating: 4.9,
        reviewsCount: 310
    },
    {
        id: "eco-textiles-fashion",
        level: "JUNIOR",
        duration: "6 ТИЖНІВ",
        category: "Design",
        title: "Еко-текстиль & Мода",
        description: "Дослідження натуральних барвників, тканини з рецикльованих волокон та цифровий крій.",
        modulesCount: 8,
        image: "/courses/catalog-eco-textile.webp",
        rating: 4.8,
        reviewsCount: 120
    },
    {
        id: "green-urbanism",
        level: "MIDDLE",
        duration: "10 ТИЖНІВ",
        category: "Design",
        title: "Зелена Урбаністика",
        description: "Проєктування міських еко-систем, вертикальних садів та інтеграція біотопів у дизайн.",
        modulesCount: 14,
        image: "/courses/catalog-green-urbanism.webp",
        rating: 4.9,
        reviewsCount: 165
    },
    {
        id: "generative-eco-art",
        level: "ADVANCED",
        duration: "8 ТИЖНІВ",
        category: "Design",
        title: "Генеративний Еко-арт",
        description: "Створення процедурних 3D-артів та інсталяцій з візуалізацією даних про довкілля.",
        modulesCount: 10,
        image: "/courses/catalog-generative-art.webp",
        rating: 4.9,
        reviewsCount: 140
    },
    {
        id: "energy-efficient-lighting",
        level: "JUNIOR",
        duration: "4 ТИЖНЯ",
        category: "Design",
        title: "Енергоефективне Освітлення",
        description: "Проєктування світлових сценаріїв із мінімальним споживанням електроенергії.",
        modulesCount: 6,
        image: "/courses/catalog-lighting.webp",
        rating: 4.7,
        reviewsCount: 95
    },
    {
        id: "sustainable-furniture",
        level: "MIDDLE",
        duration: "12 ТИЖНІВ",
        category: "Design",
        title: "Сталий Меблевий Дизайн",
        description: "Конструювання меблів без клею та розбірних з'єднань для легкої переробки.",
        modulesCount: 15,
        image: "/courses/catalog-furniture.webp",
        rating: 4.9,
        reviewsCount: 190
    },
    {
        id: "neural-networks-eco-design",
        level: "ADVANCED",
        duration: "6 ТИЖНІВ",
        category: "Branding",
        title: "Нейромережі в Еко-проєктуванні",
        description: "Використання штучного інтелекту для генерації сталевої естетики та оптимізації форм.",
        modulesCount: 9,
        image: "/courses/catalog-neural-networks.webp",
        rating: 4.8,
        reviewsCount: 135
    }
];

const CATEGORIES = ["Усі", "Design", "Branding"] as const;

export default function CoursesPage() {
    const [coursesList, setCoursesList] = useState<CatalogCourse[]>(CATALOG_DATA);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("Усі");
    const [sortBy, setSortBy] = useState<"default" | "popularity" | "modules" | "title">("default");
    const [isExpanded, setIsExpanded] = useState(false);
    const [consultationModalOpen, setConsultationModalOpen] = useState(false);
    const [consultationEmail, setConsultationEmail] = useState("");
    const [consultationSent, setConsultationSent] = useState(false);

    useEffect(() => {
        getCourses()
            .then((backendCourses) => {
                if (backendCourses && backendCourses.length > 0) {
                    const mapped: CatalogCourse[] = backendCourses.map((c) => ({
                        id: c.id,
                        level: "MIDDLE",
                        duration: `${c.totalLearningPeriodWeeks || 8} ТИЖНІВ`,
                        category: "Design",
                        title: c.title,
                        description: c.description,
                        modulesCount: c.modules?.length || 10,
                        image: c.bannerUrl || "/courses/catalog-lca.webp",
                        rating: 4.9,
                        reviewsCount: 150
                    }));
                    const existingIds = new Set(mapped.map((m) => m.id));
                    const merged = [...mapped, ...CATALOG_DATA.filter((c) => !existingIds.has(c.id))];
                    setCoursesList(merged);
                }
            })
            .catch(() => {
            });
    }, []);

    const filteredCourses = useMemo(() => {
        let result = [...coursesList].filter((course) => {
            const matchesCategory = selectedCategory === "Усі" || course.category === selectedCategory;
            const matchesQuery = 
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesQuery;
        });

        if (sortBy === "popularity") {
            result.sort((a, b) => b.rating * b.reviewsCount - a.rating * a.reviewsCount);
        } else if (sortBy === "modules") {
            result.sort((a, b) => b.modulesCount - a.modulesCount);
        } else if (sortBy === "title") {
            result.sort((a, b) => a.title.localeCompare(b.title));
        }

        return result;
    }, [searchQuery, selectedCategory, sortBy]);

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
                            <option value="popularity">за популярністю</option>
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
                {CATEGORIES.map((cat) => (
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
