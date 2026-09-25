import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LandingHeader() {
    const navigate = useNavigate();
    const hasToken = Boolean(localStorage.getItem("token"));
    const [lang, setLang] = useState<"UA" | "EN">("UA");
    const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobile = () => setMobileMenuOpen(false);

    return (
        <header className="landing-header">
            <div className="landing-header-inner">
                <Link to="/" className="landing-logo" aria-label="NEXYLVA Homepage">
                    <img src="/logo.svg" alt="NEXYLVA" className="landing-logo-img" />
                </Link>

                <nav className="landing-nav" aria-label="Головна навігація">
                    <div 
                        className="landing-nav-item has-dropdown"
                        onMouseEnter={() => setCoursesMenuOpen(true)}
                        onMouseLeave={() => setCoursesMenuOpen(false)}
                    >
                        <Link to="/courses" className="landing-nav-link">
                            Курси
                            <svg className={`chevron-icon ${coursesMenuOpen ? "open" : ""}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Link>
                        {coursesMenuOpen && (
                            <div className="landing-dropdown-menu">
                                <Link to="/courses" className="dropdown-link">Усі курси</Link>
                                <Link to="/courses" className="dropdown-link">Sustainable Design</Link>
                                <Link to="/courses" className="dropdown-link">Eco Branding</Link>
                                <Link to="/courses" className="dropdown-link">Creative Upcycling</Link>
                            </div>
                        )}
                    </div>

                    <Link to="/journal" className="landing-nav-link">Еко-журнал</Link>
                    <Link to="/community" className="landing-nav-link">Спільнота</Link>
                    <Link to="/portfolio" className="landing-nav-link">Портфоліо</Link>
                    <Link to="/about" className="landing-nav-link">Про нас</Link>
                    <Link to="/contacts" className="landing-nav-link">Контакти</Link>
                </nav>

                <div className="landing-header-actions">
                    <button 
                        type="button" 
                        className="lang-switcher-btn"
                        onClick={() => setLang(lang === "UA" ? "EN" : "UA")}
                        title="Змінити мову"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="2" y1="12" x2="22" y2="12"/>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                        <span>{lang === "UA" ? "UA / EN" : "EN / UA"}</span>
                    </button>

                    <button 
                        type="button" 
                        className="cart-btn" 
                        title="Кошик"
                        onClick={() => navigate("/courses")}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                    </button>

                    {hasToken ? (
                        <Link to="/student" className="landing-auth-btn">Кабінет</Link>
                    ) : (
                        <Link to="/login" className="landing-auth-btn">Увійти / Реєстрація</Link>
                    )}

                    <button
                        type="button"
                        className="landing-mobile-toggle-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? "Закрити меню" : "Відкрити меню"}
                    >
                        {mobileMenuOpen ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="12" x2="21" y2="12"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <line x1="3" y1="18" x2="21" y2="18"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="landing-mobile-menu-overlay" onClick={closeMobile}>
                    <div className="landing-mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
                        <div className="landing-mobile-menu-links">
                            <Link to="/courses" className="landing-mobile-nav-link" onClick={closeMobile}>Курси</Link>
                            <Link to="/journal" className="landing-mobile-nav-link" onClick={closeMobile}>Еко-журнал</Link>
                            <Link to="/community" className="landing-mobile-nav-link" onClick={closeMobile}>Спільнота</Link>
                            <Link to="/portfolio" className="landing-mobile-nav-link" onClick={closeMobile}>Портфоліо</Link>
                            <Link to="/about" className="landing-mobile-nav-link" onClick={closeMobile}>Про нас</Link>
                            <Link to="/contacts" className="landing-mobile-nav-link" onClick={closeMobile}>Контакти</Link>
                        </div>

                        <div className="landing-mobile-menu-actions">
                            <button 
                                type="button" 
                                className="lang-switcher-btn"
                                onClick={() => setLang(lang === "UA" ? "EN" : "UA")}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="2" y1="12" x2="22" y2="12"/>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                </svg>
                                <span>{lang === "UA" ? "Мова: UA" : "Language: EN"}</span>
                            </button>

                            {hasToken ? (
                                <Link to="/student" className="landing-auth-btn" onClick={closeMobile}>Особистий кабінет</Link>
                            ) : (
                                <Link to="/login" className="landing-auth-btn" onClick={closeMobile}>Увійти / Реєстрація</Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
