import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/EcoJournalPage.css";

const JOURNAL_CATEGORIES = ["Усі", "LCA", "Матеріали", "Архітектура", "Трендбуки", "AI + Eco"] as const;

const TOPICS = [
    { name: "Circular Design", variant: "outline" },
    { name: "Biomaterials", variant: "sage" },
    { name: "AI + Eco Design", variant: "dark" },
    { name: "Upcycling", variant: "outline" },
    { name: "Sustainable Architecture", variant: "sage" },
    { name: "Zero-Waste Packaging", variant: "sage" },
    { name: "LCA", variant: "dark" },
    { name: "Eco Branding", variant: "outline" }
];

export default function EcoJournalPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("Усі");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="journal-page-container">
            {/* Breadcrumbs */}
            <nav className="catalog-breadcrumbs" aria-label="Хлібні крихти">
                <Link to="/" className="breadcrumb-link">Головна</Link>
                <span className="breadcrumb-sep">&gt;</span>
                <span className="breadcrumb-current">Еко-журнал</span>
            </nav>

            {/* Header Row */}
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
                    <div className="catalog-sort-box">
                        <span>Сортувати</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Category Filter Pills */}
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

            {/* 1. Featured Articles Grid */}
            <div className="journal-top-grid">
                {/* Article 1 */}
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

                {/* Article 2 */}
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

            {/* 2. Middle Row: 38% Stat + Algae Bioplastic */}
            <div className="journal-middle-grid">
                {/* Stat Box */}
                <div className="journal-stat-box">
                    <span className="stat-box-tag" style={{ visibility: "hidden" }}>[ ДАТА / 03 ]</span>
                    <div className="stat-big-number" style={{ visibility: "hidden" }}>38 %</div>
                    <p className="stat-box-desc" style={{ visibility: "hidden" }}>
                        менше первинної сировини можна використовувати в окремих сценаріях завдяки циркулярному підходу до проєктування.
                    </p>
                </div>

                {/* Wide Article */}
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

            {/* 3. Section "Актуальні теми" */}
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
                            onClick={() => setSelectedCategory("Усі")}
                        >
                            {t.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* 4. Bottom Banner */}
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
