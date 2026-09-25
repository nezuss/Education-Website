import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourses } from "../../services/courseService";
import { getModules } from "../../services/learningService";
import "../../styles/CourseDetailsPage.css";

const MODULES_CURRICULUM = [
    {
        num: "01",
        title: "Вступ до LCA та екологічних стандартів",
        content: "Методологія Life Cycle Assessment, міжнародні стандарти ISO 14040/44, визначення меж системи та вибір функціональної одиниці."
    },
    {
        num: "02",
        title: "Матеріали та екологічний вплив",
        content: "Аналіз вуглецевого сліду полімерів, металів, біокомпозитів та переробленої сировини. Розрахунок embodied energy."
    },
    {
        num: "03",
        title: "Циркулярні стратегії в дизайні",
        content: "Design for Disassembly, модульність, відновлюваність матеріалів та замкнені цикли (Cradle-to-Cradle)."
    },
    {
        num: "04",
        title: "Підбір еко-сировини",
        content: "Бази даних екологічних матеріалів, критерії сертифікації постачальників, підбір сталих альтернатив традиційним пластикам."
    },
    {
        num: "05",
        title: "Прототипування та тестування",
        content: "Швидке макетування з вторинних матеріалів, лабораторні випробування міцності, біодеградації та зносостійкості."
    },
    {
        num: "06",
        title: "3D-моделювання та параметрика",
        content: "Оптимізація геометрії у Rhino/Grasshopper для мінімізації витрати матеріалу без втрати несучої здатності."
    },
    {
        num: "07",
        title: "Розрахунок вуглецевого сліду виробу",
        content: "Практична робота з програмним забезпеченням LCA: введення інвентарних даних, моделювання стадії використання та утилізації."
    },
    {
        num: "08",
        title: "Екологічна сертифікація та маркування",
        content: "Підготовка екологічної декларації продукту (EPD), знаки маркування та правила комунікації сталості без грінвошингу."
    },
    {
        num: "09",
        title: "Підготовка фінального кейсу",
        content: "Оформлення технічного паспорта виробу, візуалізація та розробка переконливої презентації для інвесторів чи клієнтів."
    },
    {
        num: "10",
        title: "Захист проєкту перед ментором",
        content: "Презентація власного курсового проєкту, індивідуальний детальний фідбек від куратора та отримання верифікованого сертифіката."
    }
];

const FAQS_DATA = [
    {
        q: "Скільки часу потрібно приділяти навчанню?",
        a: "Програма розрахована на 6–8 годин на тиждень: 2 години на перегляд лекцій та 4–6 годин на виконання практичних завдань у власному темпі."
    },
    {
        q: "Як відбувається перевірка домашніх завдань?",
        a: "Кожне завдання перевіряє особистий ментор-експерт із письмовим або відео-розбором вашої моделі/розрахунків протягом 24 годин."
    },
    {
        q: "Чи підійде курс, якщо я початківець у 3ds Max / CAD?",
        a: "Так, на курсі є підготовчий ввідний модуль з базових інструментів моделювання та надаються готові параметричні шаблони."
    }
];

export default function CourseDetailsPage() {
    const { courseId = "lca-eco-design" } = useParams();
    const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    const [modulesList, setModulesList] = useState(MODULES_CURRICULUM);
    const [courseTitle, setCourseTitle] = useState("LCA & Еко-проєктування");
    const [courseDesc, setCourseDesc] = useState(
        "Проєктний підхід до створення продуктів з мінімальним впливом на довкілля на всіх етапах життєвого циклу."
    );

    useEffect(() => {
        if (!courseId) return;

        getCourses()
            .then((courses) => {
                const found = courses.find(
                    (c) => c.id === courseId || c.title.toLowerCase().includes(courseId.toLowerCase())
                );
                if (found) {
                    setCourseTitle(found.title);
                    if (found.description) setCourseDesc(found.description);
                }
            })
            .catch(() => {});

        getModules(courseId)
            .then((mods) => {
                if (mods && mods.length > 0) {
                    setModulesList(
                        mods.map((m, idx) => ({
                            num: String(idx + 1).padStart(2, "0"),
                            title: m.title,
                            content: m.description || "Детальний розбір тем та практичні завдання модуля."
                        }))
                    );
                }
            })
            .catch(() => {});
    }, [courseId]);

    function toggleModule(idx: number) {
        setOpenModuleIndex(openModuleIndex === idx ? null : idx);
    }

    function toggleFaq(idx: number) {
        setOpenFaqIndex(openFaqIndex === idx ? null : idx);
    }

    return (
        <div className="course-details-container">
            <nav className="catalog-breadcrumbs" aria-label="Хлібні крихти">
                <Link to="/" className="breadcrumb-link">Головна</Link>
                <span className="breadcrumb-sep">&gt;</span>
                <Link to="/courses" className="breadcrumb-link">Курси</Link>
                <span className="breadcrumb-sep">&gt;</span>
                <span className="breadcrumb-current">{courseTitle}</span>
            </nav>

            <section className="course-hero-grid">
                <div className="course-hero-left">
                    <span className="course-online-badge">[ ПРАКТИЧНИЙ ОНЛАЙН КУРС ]</span>
                    <h1 className="course-hero-title">
                        {courseTitle}
                    </h1>
                    <p className="course-hero-desc">
                        {courseDesc}
                    </p>

                    <div className="course-hero-actions">
                        <Link to={`/checkout/${courseId}`} className="course-btn-enroll">
                            <span>Обрати курс</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </Link>

                        <button 
                            type="button" 
                            className="course-btn-trailer-link"
                            onClick={() => setIsVideoModalOpen(true)}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"/>
                            </svg>
                            <span>Дивитись трейлер</span>
                        </button>
                    </div>

                    <div className="course-instructor-card">
                        <img 
                            src="/courses/instructor-andriy.webp" 
                            alt="Андрій Мажура" 
                            className="instructor-avatar"
                        />
                        <div className="instructor-info">
                            <span className="instructor-name">Викладач: Андрій Мажура</span>
                            <span className="instructor-role">Еко-дизайнер LCA експерт</span>
                        </div>
                        <a href="#about-instructor" className="instructor-more-link">
                            <span>Детальніше</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="course-hero-visual-frame">
                    <img 
                        src="/courses/catalog-lca.webp" 
                        alt="LCA крісло з перероблених матеріалів" 
                        className="course-hero-img"
                    />
                    <div className="course-level-floating-badge">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="20" x2="18" y2="10"/>
                            <line x1="12" y1="20" x2="12" y2="4"/>
                            <line x1="6" y1="20" x2="6" y2="14"/>
                        </svg>
                        <span className="level-badge-label">Рівень</span>
                        <span className="level-badge-val">Intermediate</span>
                    </div>
                </div>
            </section>

            <section className="course-metrics-bar">
                <div className="metric-col">
                    <span className="metric-number">10</span>
                    <span className="metric-title">модулів</span>
                    <span className="metric-subtitle">Практичні лекції та воркшопи</span>
                </div>
                <div className="metric-col">
                    <span className="metric-number">8</span>
                    <span className="metric-title">тижнів</span>
                    <span className="metric-subtitle">Інтенсивного навчання</span>
                </div>
                <div className="metric-col">
                    <span className="metric-number">2</span>
                    <span className="metric-title">проєкти</span>
                    <span className="metric-subtitle">Готові кейси у портфоліо</span>
                </div>
                <div className="metric-col">
                    <span className="metric-number">Фідбек</span>
                    <span className="metric-title">від ментора</span>
                    <span className="metric-subtitle">Перевірка всіх домашніх завдань</span>
                </div>
            </section>

            <section className="learn-section">
                <h2 className="learn-section-title">Чого навчають на курсі</h2>
                <div className="learn-grid-layout">
                    <div className="learn-cards-2x2">
                        <div className="learn-module-card">
                            <div className="learn-card-header">
                                <span className="learn-card-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                                    </svg>
                                </span>
                                <span className="learn-mod-pill">Модуль 01</span>
                            </div>
                            <h3 className="learn-card-title">Оцінка життєвого циклу (LCA)</h3>
                            <p className="learn-card-desc">Проведення повного LCA-аналізу продукту від сировини до утилізації.</p>
                        </div>

                        <div className="learn-module-card">
                            <div className="learn-card-header">
                                <span className="learn-card-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                                    </svg>
                                </span>
                                <span className="learn-mod-pill">Модуль 02</span>
                            </div>
                            <h3 className="learn-card-title">Підбір еко-сировини</h3>
                            <p className="learn-card-desc">Критерії вибору аналогічних матеріалів та постачальників.</p>
                        </div>

                        <div className="learn-module-card">
                            <div className="learn-card-header">
                                <span className="learn-card-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="2" y1="12" x2="22" y2="12"/>
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                    </svg>
                                </span>
                                <span className="learn-mod-pill">Модуль 03</span>
                            </div>
                            <h3 className="learn-card-title">3D-моделювання для еко-дизайну</h3>
                            <p className="learn-card-desc">Моделювання конструкцій з урахування екологічних процесів.</p>
                        </div>

                        <div className="learn-module-card">
                            <div className="learn-card-header">
                                <span className="learn-card-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <line x1="18" y1="20" x2="18" y2="10"/>
                                        <line x1="12" y1="20" x2="12" y2="4"/>
                                        <line x1="6" y1="20" x2="6" y2="14"/>
                                    </svg>
                                </span>
                                <span className="learn-mod-pill">Модуль 04</span>
                            </div>
                            <h3 className="learn-card-title">Презентація та візуалізація</h3>
                            <p className="learn-card-desc">Професійна подача продуктів та результатів LCA-виробу у портфоліо.</p>
                        </div>
                    </div>

                    <div className="practice-banner-card">
                        <div>
                            <h3 className="practice-title">Практика першого дня</h3>
                            <p className="practice-desc">
                                Реальні кейси, професійні інструменти та підтримка експертів на кожному етапі.
                            </p>
                            <div className="practice-checklist">
                                <div className="practice-check-item">
                                    <span className="practice-check-icon">✓</span>
                                    <span>Практичні завдання</span>
                                </div>
                                <div className="practice-check-item">
                                    <span className="practice-check-icon">✓</span>
                                    <span>Перевірка робіт</span>
                                </div>
                                <div className="practice-check-item">
                                    <span className="practice-check-icon">✓</span>
                                    <span>Сертифікат після курсу</span>
                                </div>
                            </div>
                        </div>

                        <Link to={`/checkout/${courseId}`} className="practice-cta-btn">
                            <span>Обрати курс</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="curriculum-section">
                <div className="curriculum-header-row">
                    <div>
                        <div className="curriculum-tag">[ ПРОГРАМА НАВЧАННЯ ]</div>
                        <h2 className="curriculum-title">10 модулів для занурення в еко-дизайн</h2>
                    </div>
                    <button 
                        type="button" 
                        className="curriculum-toggle-all"
                        onClick={() => setOpenModuleIndex(openModuleIndex !== null ? null : 0)}
                    >
                        <span>{openModuleIndex !== null ? "Згорнути модулі" : "Показати всі модулі"}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </button>
                </div>

                <div className="curriculum-grid">
                    {modulesList.map((mod, idx) => (
                        <div key={mod.num} className="curriculum-item">
                            <button 
                                type="button" 
                                className="curriculum-item-header"
                                onClick={() => toggleModule(idx)}
                            >
                                <span>
                                    <strong className="module-num">{mod.num}</strong>
                                    {mod.title}
                                </span>
                                <svg 
                                    className={`curriculum-chevron ${openModuleIndex === idx ? "open" : ""}`}
                                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                >
                                    <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            </button>
                            {openModuleIndex === idx && (
                                <div className="curriculum-item-body">
                                    {mod.content}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section className="students-showcase-section">
                <h2 className="learn-section-title">Роботи наших студентів</h2>
                
                <div className="showcase-featured-grid">
                    <div className="featured-project-card">
                        <div className="featured-project-photo-box">
                            <span className="best-project-badge">[ КРАЩИЙ ПРОЄКТ ]</span>
                            <img 
                                src="/courses/student-best-project.webp" 
                                alt="Меблі з екоматеріалів" 
                                className="featured-project-img"
                            />
                        </div>
                        <div className="featured-project-info">
                            <div>
                                <h3 className="featured-project-title">Меблі з екоматеріалів</h3>
                                <p className="featured-project-desc">
                                    Концепт крісла з біоматеріалів з урахування повного життєвого циклу
                                </p>
                                <div className="project-tags-row">
                                    <span className="project-tag-pill">LCA</span>
                                    <span className="project-tag-pill">Біоматеріали</span>
                                    <span className="project-tag-pill">3D Design</span>
                                </div>
                            </div>
                            <div>
                                <div className="project-author-row">
                                    <img 
                                        src="/courses/instructor-andriy.webp" 
                                        alt="Марія Іванова" 
                                        className="author-avatar"
                                    />
                                    <div>
                                        <div className="author-name">Марія Іванова</div>
                                        <div className="author-year">Випуск 2024</div>
                                    </div>
                                </div>
                                <button type="button" className="view-project-btn">
                                    <span>Дивитись проект</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                        <polyline points="12 5 19 12 12 19"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="want-same-card">
                        <h3 className="want-same-title">Хочеш так само?</h3>
                        <p className="want-same-desc">
                            Приєднуйся до курсу та створюй проекти майбутнього вже сьогодні.
                        </p>
                        <Link to={`/checkout/${courseId}`} className="want-same-btn">
                            <span>Розпочати навчання</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </Link>
                    </div>
                </div>

                <div className="student-thumbnails-grid">
                    <div className="thumbnail-work-card">
                        <div className="work-photo-box">
                            <img src="/courses/work-packaging.webp" alt="Еко-пакування" className="work-img" />
                            <span className="work-arrow-circle">→</span>
                        </div>
                        <h4 className="work-title">Еко-пакування та Брендінг</h4>
                        <div className="work-tags">
                            <span className="work-tag-badge">Пакування</span>
                            <span className="work-tag-badge">Брендінг</span>
                        </div>
                    </div>

                    <div className="thumbnail-work-card">
                        <div className="work-photo-box">
                            <img src="/courses/work-lighting.webp" alt="Світлодизайн" className="work-img" />
                            <span className="work-arrow-circle">→</span>
                        </div>
                        <h4 className="work-title">Світлодизайн</h4>
                        <div className="work-tags">
                            <span className="work-tag-badge">Інтер'єр</span>
                            <span className="work-tag-badge">Освітлення</span>
                        </div>
                    </div>

                    <div className="thumbnail-work-card">
                        <div className="work-photo-box">
                            <img src="/courses/work-architecture.webp" alt="Параметрична архітектура" className="work-img" />
                            <span className="work-arrow-circle">→</span>
                        </div>
                        <h4 className="work-title">Параметрична архітектура</h4>
                        <div className="work-tags">
                            <span className="work-tag-badge">Архітектура</span>
                            <span className="work-tag-badge">Параметрика</span>
                        </div>
                    </div>

                    <div className="thumbnail-work-card">
                        <div className="work-photo-box">
                            <img src="/courses/work-materials.webp" alt="Екоматеріали у продукті" className="work-img" />
                            <span className="work-arrow-circle">→</span>
                        </div>
                        <h4 className="work-title">Екоматеріали у продукті</h4>
                        <div className="work-tags">
                            <span className="work-tag-badge">Матеріали</span>
                            <span className="work-tag-badge">Інновації</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="testimonial-quote-card">
                <div className="expert-portrait-box">
                    <img 
                        src="/courses/expert-alexander.webp" 
                        alt="Олександр Коваль" 
                        className="expert-img"
                    />
                </div>
                <div className="expert-quote-content">
                    <div className="quote-mark">“</div>
                    <p className="quote-text">
                        Цей курс - про мислення майбутнього дизайнера. Ви навчитеся створювати не лише красиві, а й відповідальні продукти.
                    </p>
                    <div className="expert-name">Олександр Коваль</div>
                    <div className="expert-title">Senior Eco-Designer @ NEXYLVA</div>
                </div>
                <div className="expert-values-list">
                    <div className="val-item">
                        <span className="val-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                            </svg>
                        </span>
                        <div>
                            <div className="val-title">Актуальні знання</div>
                            <div className="val-desc">від практикуючих експертів</div>
                        </div>
                    </div>
                    <div className="val-item">
                        <span className="val-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                            </svg>
                        </span>
                        <div>
                            <div className="val-title">Реальні проєкти</div>
                            <div className="val-desc">у портфоліо</div>
                        </div>
                    </div>
                    <div className="val-item">
                        <span className="val-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                            </svg>
                        </span>
                        <div>
                            <div className="val-title">Спільнота однодумців</div>
                            <div className="val-desc">підтримка та нетворкінг</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pricing-faq-grid">
                <div className="pricing-formats-col">
                    <h2 className="learn-section-title">Обери свій формат навчання</h2>
                    <div className="pricing-cards-3-row">
                        <div className="pricing-plan-card">
                            <div>
                                <h3 className="plan-name">Базовий (Basic)</h3>
                                <p className="plan-desc">Для тих, хто прагне опанувати матеріал у власному темпі без зв'язку з ментором.</p>
                            </div>
                            <div>
                                <div className="plan-price-row">
                                    <div className="plan-price-label">Ціна:</div>
                                    <div className="plan-price-val">11 900 грн.</div>
                                </div>
                                <Link to={`/checkout/${courseId}?plan=basic`} className="plan-choose-btn">
                                    <span>Обрати план</span>
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>

                        <div className="pricing-plan-card featured">
                            <span className="hit-badge">[ ХІТ ПРОДАЖІВ ]</span>
                            <div>
                                <h3 className="plan-name">PRO (Популярний)</h3>
                                <p className="plan-desc">Повноцінне занурення з особистим фідбеком від ментора та кейсом у портфоліо.</p>
                            </div>
                            <div>
                                <div className="plan-price-row">
                                    <div className="plan-price-label">Ціна:</div>
                                    <div className="plan-price-val">19 900 грн.</div>
                                </div>
                                <Link to={`/checkout/${courseId}?plan=pro`} className="plan-choose-btn">
                                    <span>Обрати план</span>
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>

                        <div className="pricing-plan-card">
                            <div>
                                <h3 className="plan-name">Mentorship (VIP)</h3>
                                <p className="plan-desc">Максимальний супровід для швидкого старту та виходу на міжнародний ринок.</p>
                            </div>
                            <div>
                                <div className="plan-price-row">
                                    <div className="plan-price-label">Ціна:</div>
                                    <div className="plan-price-val">34 900 грн.</div>
                                </div>
                                <Link to={`/checkout/${courseId}?plan=vip`} className="plan-choose-btn">
                                    <span>Обрати план</span>
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="faq-widget-col">
                    <span className="faq-badge">[ FAQ ]</span>
                    <h3 className="faq-title">Часті запитання</h3>
                    <div className="faq-accordion-list">
                        {FAQS_DATA.map((faq, idx) => (
                            <div key={idx} className="faq-accordion-item">
                                <button 
                                    type="button" 
                                    className="faq-question-btn"
                                    onClick={() => toggleFaq(idx)}
                                >
                                    <span>{faq.q}</span>
                                    <span>{openFaqIndex === idx ? "—" : "+"}</span>
                                </button>
                                {openFaqIndex === idx && (
                                    <p className="faq-answer-text">{faq.a}</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <Link to="/faq" className="faq-all-btn">
                        <span>Всі питання</span>
                        <span>→</span>
                    </Link>
                </div>
            </section>

            <section className="stream-banner">
                <div>
                    <h3 className="stream-banner-title">Готові створювати дизайн?</h3>
                    <p className="stream-banner-desc">
                        Старт нового потоку - 15 вересня. Обирай свій тариф та приєднуйся до спільноти NEXYLVA.
                    </p>
                    <Link to={`/checkout/${courseId}`} className="stream-banner-btn">
                        <span>Дізнайтеся більше</span>
                        <span>→</span>
                    </Link>
                </div>
                <div className="stream-students-tag">
                    <img 
                        src="/landing/avatars-banner.webp" 
                        alt="Студенти" 
                        className="stream-avatars-img"
                    />
                    <span className="stream-students-text">+5000 студентів з нами</span>
                </div>
            </section>

            {isVideoModalOpen && (
                <div className="landing-modal-overlay" onClick={() => setIsVideoModalOpen(false)}>
                    <div className="landing-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="modal-close-btn" 
                            onClick={() => setIsVideoModalOpen(false)}
                            aria-label="Закрити"
                        >
                            &times;
                        </button>
                        <div className="video-responsive-container">
                            <iframe 
                                src="https://www.youtube-nocookie.com/embed/LXb3EKWsInQ?autoplay=1" 
                                title="Курс LCA &amp; Еко-проєктування — Трейлер" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
