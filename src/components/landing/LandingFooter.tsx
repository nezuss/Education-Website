import { Link } from "react-router-dom";

export default function LandingFooter() {
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <footer className="landing-footer" id="contacts">
            <div className="scroll-top-wrapper">
                <button 
                    type="button" 
                    className="scroll-top-btn" 
                    onClick={scrollToTop}
                    title="Нагору"
                    aria-label="Повернутися нагору"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15"/>
                    </svg>
                </button>
            </div>

            <div className="landing-footer-main">
                <div className="footer-columns-grid">
                    <div className="footer-col brand-col">
                        <Link to="/" className="footer-logo-link">
                            <span className="footer-brand-title">NEXYLVA</span>
                        </Link>
                        <p className="footer-brand-tagline">Sustainable Design Platform</p>
                        <ul className="footer-brand-values">
                            <li>Переосмислюй</li>
                            <li>Навчайся</li>
                            <li>Створюй екологічні тренди</li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-heading">Платформа</h4>
                        <ul className="footer-links-list">
                            <li><Link to="/courses">Курси</Link></li>
                            <li><Link to="/journal">Еко-журнал</Link></li>
                            <li><Link to="/community">Спільнота</Link></li>
                            <li><Link to="/portfolio">Портфоліо</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-heading">Компанія</h4>
                        <ul className="footer-links-list">
                            <li><Link to="/about">Про нас</Link></li>
                            <li><Link to="/journal">Блог</Link></li>
                            <li><Link to="/about">Кар'єра</Link></li>
                            <li><Link to="/about">Партнери</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-heading">Підтримка</h4>
                        <ul className="footer-links-list">
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/contacts">Довідка</Link></li>
                            <li>
                                <span>Оплата</span>
                                <div className="payment-icons-row">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="2" y="5" width="20" height="14" rx="2"/>
                                        <line x1="2" y1="10" x2="22" y2="10"/>
                                    </svg>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M8.5 16.5a5 5 0 0 1 0-9"/>
                                        <path d="M12 19a8.5 8.5 0 0 1 0-14"/>
                                        <path d="M5 14a2 2 0 0 1 0-4"/>
                                    </svg>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-heading">Контакти</h4>
                        <ul className="footer-links-list">
                            <li>
                                <a href="mailto:support@nexylva.com" className="contact-link">
                                    support@nexylva.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:+3805550121" className="contact-link">
                                    (+380) 555-01-21
                                </a>
                            </li>
                        </ul>
                        <div className="footer-socials-row">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Instagram">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                                </svg>
                            </a>
                            <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Behance">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 8h5a3 3 0 0 1 0 6H3V8z"/>
                                    <path d="M3 14h5.5a3.5 3.5 0 0 1 0 7H3v-7z"/>
                                    <path d="M14 13h7a3.5 3.5 0 0 0-7 0v2a3.5 3.5 0 0 0 7 0"/>
                                    <line x1="15" y1="8" x2="20" y2="8"/>
                                </svg>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                    <rect x="2" y="9" width="4" height="12"/>
                                    <circle cx="4" cy="4" r="2"/>
                                </svg>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="YouTube">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="footer-col app-download-col">
                        <h4 className="footer-heading app-title">
                            Все еко-навчання в одному додатку
                        </h4>
                        <p className="app-subtitle">
                            Завантажуйте та навчайтеся в будь-якому місці
                        </p>
                        <div className="app-store-btns">
                            <a href="https://apple.com/app-store" target="_blank" rel="noopener noreferrer" className="app-badge-btn">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.79 1.07-1.89.95-3-.94.04-2.09.64-2.75 1.43-.59.71-1.11 1.84-.97 2.94 1.05.08 2.14-.58 2.77-1.37z"/>
                                </svg>
                                <span>App Store</span>
                            </a>

                            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="app-badge-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.609 1.814L13.792 12 3.61 22.186c-.365-.332-.61-.83-.61-1.428V3.242c0-.598.245-1.096.61-1.428zm11.233 11.233l2.428-2.428-11.83-6.83 9.402 9.258zm2.428-3.094l2.793 1.613c.692.4.692 1.052 0 1.452l-2.793 1.613-2.088-2.339 2.088-2.339zm-3.478 3.754l-9.402 9.258 11.83-6.83-2.428-2.428z"/>
                                </svg>
                                <span>Google Play</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom-bar">
                    <div className="footer-bottom-left">
                        <span className="footer-mini-brand">NEXYLVA</span>
                        <Link to="/about" className="footer-legal-link">Політика конфіденційності</Link>
                        <Link to="/about" className="footer-legal-link">Договір оферти</Link>
                        <Link to="/faq" className="footer-legal-link">FAQ</Link>
                    </div>
                    <div className="footer-bottom-right">
                        <span>© 2026 NEXYLVA. Всі права захищені.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
