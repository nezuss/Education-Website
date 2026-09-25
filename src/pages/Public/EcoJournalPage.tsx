import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "../../styles/EcoJournalPage.css";

interface JournalArticle {
    id: string;
    slug: string;
    title: string;
    category: "LCA" | "Матеріали" | "Архітектура" | "Трендбуки" | "AI + Eco";
    readTime: string;
    tag: string;
    image: string;
    description: string;
}

const ALL_ARTICLES: JournalArticle[] = [
    {
        id: "1",
        slug: "lca-ui-ux",
        title: "Як оцінка життєвого циклу (LCA) змінює сучасний UI/UX та промдизайн",
        category: "LCA",
        readTime: "8 хв. читання • LCA",
        tag: "Дослідження NEXYLVA",
        image: "/journal/article-lca-ui.webp",
        description: "Методологія оцінки впливу на довкілля в цифрових та фізичних продуктах."
    },
    {
        id: "2",
        slug: "eco-trends",
        title: "Екологічні тренди в дизайні цифрових продуктів",
        category: "Трендбуки",
        readTime: "8 хв. читання • 2026",
        tag: "Трендбук",
        image: "/journal/article-eco-trends.webp",
        description: "Аналіз провідних напрямків екологічного та усвідомленого дизайну на 2026 рік."
    },
    {
        id: "3",
        slug: "algae-bioplastics",
        title: "Біопластик з водоростей: майбутнє екологічного пакування",
        category: "Матеріали",
        readTime: "4 хв. читання • 2026",
        tag: "Екопакування",
        image: "/journal/article-algae-bioplastic.webp",
        description: "Як відновлювана морська сировина стає основою для біополімерів."
    },
    {
        id: "4",
        slug: "materials-next-gen",
        title: "Матеріали нового покоління: від міцелію до біополімерів",
        category: "Матеріали",
        readTime: "6 хв. читання • Матеріали",
        tag: "Дослідження",
        image: "/article/art_rel_1.webp",
        description: "Використання живих мікроорганізмів для вирощування предметів інтер'єру."
    },
    {
        id: "5",
        slug: "zero-waste-packaging",
        title: "Zero-Waste пакування: принципи замкнених циклів",
        category: "Архітектура",
        readTime: "5 хв. читання • Практика",
        tag: "Практика",
        image: "/article/art_rel_2.webp",
        description: "Розробка модульної упаковки, що розкладається без сліду у ґрунті."
    },
    {
        id: "6",
        slug: "ai-eco-design",
        title: "Штучний інтелект у генеративному еко-дизайні",
        category: "AI + Eco",
        readTime: "7 хв. читання • AI",
        tag: "Інновації",
        image: "/article/art_rel_3.webp",
        description: "Оптимізація витрати матеріалів за допомогою нейромережевих алгоритмів."
    }
];

const JOURNAL_CATEGORIES = ["Усі", "LCA", "Матеріали", "Архітектура", "Трендбуки", "AI + Eco"] as const;

const TOPICS = [
    { name: "Circular Design", variant: "outline", cat: "LCA" },
    { name: "Biomaterials", variant: "sage", cat: "Матеріали" },
    { name: "AI + Eco Design", variant: "dark", cat: "AI + Eco" },
    { name: "Upcycling", variant: "outline", cat: "Матеріали" },
    { name: "Sustainable Architecture", variant: "sage", cat: "Архітектура" },
    { name: "Zero-Waste Packaging", variant: "sage", cat: "Архітектура" },
    { name: "LCA", variant: "dark", cat: "LCA" },
    { name: "Eco Branding", variant: "outline", cat: "Трендбуки" }
];

export default function EcoJournalPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("Усі");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"date" | "title">("date");

    const filteredArticles = useMemo(() => {
        return ALL_ARTICLES.filter((article) => {
            const matchesCategory = selectedCategory === "Усі" || article.category === selectedCategory;
            const matchesQuery = 
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.tag.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesQuery;
        }).sort((a, b) => {
            if (sortBy === "title") return a.title.localeCompare(b.title);
            return 0;
        });
    }, [selectedCategory, searchQuery, sortBy]);

    const isDefaultView = selectedCategory === "Усі" && !searchQuery.trim();

    return (
        <div className="journal-page-container">
            <nav className="catalog-breadcrumbs" aria-label="Хлібні крихти">
                <Link to="/" className="breadcrumb-link">Головна</Link>
                <span className="breadcrumb-sep">&gt;</span>
                <span className="breadcrumb-current">Еко-журнал</span>
            </nav>

            <div className="catalog-top-row">
                <div className="catalog-title-group">
                    <span className="journal-header-badge">[ NEXYLVA / ECO JOURNAL ]</span>
                    <h1 className="catalog-main-title">Еко-журнал</h1>
                    <p className="catalog-subtitle">
                        Статті, дослідження та тренди сталого дизайну — від біоматеріалів до цифрових продуктів і циркулярної архітектури.
                    </p>
                </div>

                <div className="catalog-controls-group">
                    <div className="catalog-search-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input 
                            type="text" 
                            className="catalog-search-input"
                            placeholder="Знайти статтю..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="catalog-sort-box" onClick={() => setSortBy(sortBy === "date" ? "title" : "date")} style={{ cursor: "pointer" }}>
                        <span>{sortBy === "title" ? "За назвою" : "За датою"}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="catalog-filter-pills-row" style={{ marginBottom: "32px" }}>
                {JOURNAL_CATEGORIES.map((cat) => (
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

            {isDefaultView ? (
                <>
                    <div className="journal-top-grid">
                        <article className="featured-article-card">
                            <div className="article-visual-box">
                                <img 
                                    src="/journal/article-lca-ui.webp" 
                                    alt="Як оцінка життєвого циклу LCA змінює дизайн" 
                                    className="article-visual-img"
                                />
                            </div>
                            <div className="article-card-info">
                                <div className="article-meta-row">8 хв. читання • LCA</div>
                                <h2 className="article-main-title">
                                    Як оцінка життєвого циклу (LCA) змінює сучасний UI/UX та промдизайн
                                </h2>
                                <div className="article-card-footer">
                                    <span>Дослідження NEXYLVA</span>
                                    <Link to="/journal/lca-ui-ux" className="article-read-btn">
                                        <span>Читати статтю</span>
                                        <span>→</span>
                                    </Link>
                                </div>
                            </div>
                        </article>

                        <article className="featured-article-card">
                            <div className="article-visual-box">
                                <img 
                                    src="/journal/article-eco-trends.webp" 
                                    alt="Екологічні тренди в дизайні цифрових продуктів" 
                                    className="article-visual-img"
                                />
                            </div>
                            <div className="article-card-info">
                                <div className="article-meta-row">8 хв. читання • 2026</div>
                                <h2 className="article-main-title">
                                    Екологічні тренди в дизайні цифрових продуктів
                                </h2>
                                <div className="article-card-footer">
                                    <span>Трендбук</span>
                                    <Link to="/journal/eco-trends" className="article-read-btn">
                                        <span>Читати статтю</span>
                                        <span>→</span>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    </div>

                    <div className="journal-middle-grid">
                        <div className="journal-stat-box">
                            <span className="stat-box-tag">[ ДАТА / 03 ]</span>
                            <div className="stat-big-number">38 %</div>
                            <p className="stat-box-desc">
                                менше первинної сировини можна використовувати в окремих сценаріях завдяки циркулярному підходу до проєктування.
                            </p>
                        </div>

                        <article className="journal-wide-article-card">
                            <div className="wide-article-visual-box">
                                <img 
                                    src="/journal/article-algae-bioplastic.webp" 
                                    alt="Біопластик з водоростей" 
                                    className="article-visual-img"
                                />
                            </div>
                            <div className="article-card-info">
                                <div className="article-meta-row">4 хв. читання • 2026</div>
                                <h2 className="article-main-title">
                                    Біопластик з водоростей: майбутнє екологічного пакування
                                </h2>
                                <div className="article-card-footer">
                                    <span>Екопакування</span>
                                    <Link to="/journal/algae-bioplastics" className="article-read-btn">
                                        <span>Читати статтю</span>
                                        <span>→</span>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    </div>
                </>
            ) : (
                <div className="journal-search-results-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "28px", marginBottom: "56px" }}>
                    {filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => (
                            <article key={article.id} className="featured-article-card">
                                <div className="article-visual-box" style={{ height: "240px" }}>
                                    <img 
                                        src={article.image} 
                                        alt={article.title} 
                                        className="article-visual-img"
                                    />
                                </div>
                                <div className="article-card-info">
                                    <div className="article-meta-row">{article.readTime}</div>
                                    <h2 className="article-main-title" style={{ fontSize: "20px" }}>
                                        {article.title}
                                    </h2>
                                    <p style={{ fontSize: "14px", color: "#557061", lineHeight: 1.5, margin: "8px 0 16px" }}>
                                        {article.description}
                                    </p>
                                    <div className="article-card-footer">
                                        <span>{article.tag}</span>
                                        <Link to={`/journal/${article.slug}`} className="article-read-btn">
                                            <span>Читати статтю</span>
                                            <span>→</span>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", background: "#FFFFFF", borderRadius: "20px" }}>
                            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔍</div>
                            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#0A2D1B", marginBottom: "8px" }}>Статей не знайдено</h3>
                            <p style={{ color: "#557061", fontSize: "14px" }}>Спробуйте змінити пошуковий запит або обрати іншу категорію.</p>
                            <button
                                type="button"
                                className="filter-pill-btn active"
                                onClick={() => { setSelectedCategory("Усі"); setSearchQuery(""); }}
                                style={{ marginTop: "16px" }}
                            >
                                Скинути фільтри
                            </button>
                        </div>
                    )}
                </div>
            )}

            <section className="journal-topics-section">
                <div className="topics-header-row">
                    <div>
                        <div className="curriculum-tag">[ ТЕМИ СТАТЕЙ ]</div>
                        <h3 className="topics-title">Актуальні теми</h3>
                    </div>
                    <Link to="/courses" className="section-view-all">
                        <span>Обрати напрям</span>
                        <span>→</span>
                    </Link>
                </div>
                <div className="topics-pill-tags-row">
                    {TOPICS.map((t) => (
                        <button 
                            key={t.name} 
                            type="button" 
                            className={`topic-tag-chip ${t.variant}`} 
                            onClick={() => setSelectedCategory(t.cat)}
                        >
                            {t.name}
                        </button>
                    ))}
                </div>
            </section>

            <section className="journal-bottom-banner">
                <div className="banner-left-text">
                    <h3 className="banner-title">Читайте. Досліджуйте. Застосовуйте.</h3>
                    <p className="banner-desc">
                        Статті NEXYLVA пов'язують дослідження з реальними курсами та практичними дизайнерськими рішеннями.
                    </p>
                </div>
                <img 
                    src="/journal/journal-banner-graphic.webp" 
                    alt="Руки природи та технологій" 
                    className="banner-hands-img"
                />
                <Link to="/courses" className="banner-choose-course-btn">
                    <span>Обрати курс</span>
                    <span>→</span>
                </Link>
            </section>
        </div>
    );
}
