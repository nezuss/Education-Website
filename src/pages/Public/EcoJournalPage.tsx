import UiIcon from "../../components/ui/Icon/UiIcon";
import DataUnavailable from "../shared/DataUnavailable";
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

const ALL_ARTICLES: JournalArticle[] = [];

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


    return (
        <div className="journal-page-container">
<p className="journal-result-count">Доступних статей: {filteredArticles.length}</p>
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
                        <UiIcon name="search" size={18} />
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
                        <UiIcon name="chevron" size={14} />
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

<div className="journal-top-grid"><DataUnavailable title="Статті поки недоступні" /><DataUnavailable title="Обрані матеріали поки недоступні" /></div>
            <section className="journal-topics-section">
                <div className="topics-header-row">
                    <div>
                        <div className="curriculum-tag">[ ТЕМИ СТАТЕЙ ]</div>
                        <h3 className="topics-title">Актуальні теми</h3>
                    </div>
                    <Link to="/courses" className="section-view-all">
                        <span>Обрати напрям</span>
                        <span><UiIcon name="arrow" /></span>
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
                    <span><UiIcon name="arrow" /></span>
                </Link>
            </section>
        </div>
    );
}
