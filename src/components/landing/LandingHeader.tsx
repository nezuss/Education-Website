import UiIcon from "../ui/Icon/UiIcon";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function LandingHeader() {
    const navigate = useNavigate();
    const hasToken = Boolean(localStorage.getItem("token"));
    const lang = "UA";
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
                            <UiIcon name="chevron" size={12} className={`chevron-icon ${coursesMenuOpen ? "open" : ""}`} />
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

                    <NavLink to="/journal" className="landing-nav-link">Еко-журнал</NavLink>
                    <NavLink to="/community" className="landing-nav-link">Спільнота</NavLink>
                    <NavLink to="/portfolio" className="landing-nav-link">Портфоліо</NavLink>
                    <NavLink to="/about" className="landing-nav-link">Про нас</NavLink>
                    <NavLink to="/contacts" className="landing-nav-link">Контакти</NavLink>
                </nav>

                <div className="landing-header-actions">
                    <button 
                        type="button" 
                        className="lang-switcher-btn"
                        disabled
                        title="Англійська версія поки недоступна"
                    >
                        <UiIcon name="globe" size={18} />
                        <span>{lang === "UA" ? "UA / EN" : "EN / UA"}</span>
                    </button>

                    <button 
                        type="button" 
                        className="cart-btn" 
                        title="Кошик"
                        onClick={() => navigate("/courses")}
                    >
                        <UiIcon name="cart" size={20} />
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
                        aria-expanded={mobileMenuOpen}
                        aria-controls="public-mobile-navigation"
                    >
                        {mobileMenuOpen ? (
                            <UiIcon name="close" size={24} />
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
                    <div className="landing-mobile-menu-drawer" onClick={(e) => e.stopPropagation()} onKeyDown={event => { if (event.key === "Escape") closeMobile(); }}>
                        <nav id="public-mobile-navigation" aria-label="Мобільна навігація" className="landing-mobile-menu-links">
                            <Link to="/courses" className="landing-mobile-nav-link" onClick={closeMobile}>Курси</Link>
                            <Link to="/journal" className="landing-mobile-nav-link" onClick={closeMobile}>Еко-журнал</Link>
                            <Link to="/community" className="landing-mobile-nav-link" onClick={closeMobile}>Спільнота</Link>
                            <Link to="/portfolio" className="landing-mobile-nav-link" onClick={closeMobile}>Портфоліо</Link>
                            <Link to="/about" className="landing-mobile-nav-link" onClick={closeMobile}>Про нас</Link>
                            <Link to="/contacts" className="landing-mobile-nav-link" onClick={closeMobile}>Контакти</Link>
                        </nav>

                        <div className="landing-mobile-menu-actions">
                            <button 
                                type="button" 
                                className="lang-switcher-btn"
                                disabled
                                title="Переклад англійською поки недоступний"
                            >
                                <UiIcon name="globe" size={18} />
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
