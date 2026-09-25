import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LandingHeader() {
    const navigate = useNavigate();
    const hasToken = Boolean(localStorage.getItem("token"));
    const [lang, setLang] = useState<"UA" | "EN">("UA");
    const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);

    return (
        <header className="landing-header">
            <div className="landing-header-inner">
                {/* Brand Logo */}
                <Link to="/" className="landing-logo" aria-label="NEXYLVA Homepage">
                    <img src="/logo.svg" alt="NEXYLVA" className="landing-logo-img" />
                </Link>

                {/* Navigation */}
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
                                <a href="#directions" className="dropdown-link">Sustainable Design</a>
                                <a href="#directions" className="dropdown-link">Eco Branding</a>
                                <a href="#directions" className="dropdown-link">Creative Upcycling</a>
                            </div>
                        )}
                    </div>

                    <Link to="/journal" className="landing-nav-link">Еко-журнал</Link>
                    <Link to="/community" className="landing-nav-link">Спільнота</Link>
                    <Link to="/portfolio" className="landing-nav-link">Портфоліо</Link>
                    <Link to="/about" className="landing-nav-link">Про нас</Link>
                    <Link to="/contacts" className="landing-nav-link">Контакти</Link>
                </nav>

                {/* Right Utilities */}
                <div className="landing-header-actions">
                    {/* Language Switch */}
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

                    {/* Cart Icon */}
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

                    {/* Auth / Account CTA */}
                    {hasToken ? (
                        <Link to="/student" className="landing-auth-btn">Кабінет</Link>
                    ) : (
                        <Link to="/login" className="landing-auth-btn">Увійти / Реєстрація</Link>
                    )}
                </div>
            </div>
        </header>
    );
}
