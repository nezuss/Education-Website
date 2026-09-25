import { Link } from "react-router-dom";

export default function PopularDirections() {
    return (
        <section className="landing-section" id="directions">
            <div className="section-header-row">
                <h2 className="section-title">Популярні напрями</h2>
                <Link to="/courses" className="section-view-all">
                    <span>Всі напрями</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                    </svg>
                </Link>
            </div>

            <div className="directions-grid">
                {/* Direction Card 1 */}
                <article className="direction-card">
                    <div className="direction-photo-wrapper">
                        <img 
                            src="/landing/dir-sustainable.webp" 
                            alt="Sustainable Design" 
                            className="direction-photo"
                            loading="lazy"
                        />
                    </div>
                    <div className="direction-info">
                        <h3 className="direction-title">Sustainable Design</h3>
                        <p className="direction-desc">
                            Проєктування продуктів із розрахунком екологічного сліду (LCA).
                        </p>
                    </div>
                    <Link to="/courses" className="direction-arrow-btn" aria-label="Перейти до Sustainable Design">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                        </svg>
                    </Link>
                </article>

                {/* Direction Card 2 */}
                <article className="direction-card">
                    <div className="direction-photo-wrapper">
                        <img 
                            src="/landing/dir-branding.webp" 
                            alt="Eco Branding" 
                            className="direction-photo"
                            loading="lazy"
                        />
                    </div>
                    <div className="direction-info">
                        <h3 className="direction-title">Eco Branding</h3>
                        <p className="direction-desc">
                            Розробка брендингу за принципами Zero-Waste та сталого друку.
                        </p>
                    </div>
                    <Link to="/courses" className="direction-arrow-btn" aria-label="Перейти до Eco Branding">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                        </svg>
                    </Link>
                </article>

                {/* Direction Card 3 */}
                <article className="direction-card">
                    <div className="direction-photo-wrapper">
                        <img 
                            src="/landing/dir-upcycling.webp" 
                            alt="Creative Upcycling" 
                            className="direction-photo"
                            loading="lazy"
                        />
                    </div>
                    <div className="direction-info">
                        <h3 className="direction-title">Creative Upcycling</h3>
                        <p className="direction-desc">
                            Вторинне використання промислових відходів у нових продуктах.
                        </p>
                    </div>
                    <Link to="/courses" className="direction-arrow-btn" aria-label="Перейти до Creative Upcycling">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                        </svg>
                    </Link>
                </article>

                {/* Why NEXYLVA Card */}
                <div className="why-nexylva-card">
                    <h3 className="why-title">Чому NEXYLVA ?</h3>
                    <div className="why-items-list">
                        <div className="why-item">
                            <div className="why-icon-box">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 16v-4"/>
                                    <path d="M12 8h.01"/>
                                </svg>
                            </div>
                            <div className="why-text-content">
                                <h4 className="why-item-heading">Сучасні знання</h4>
                                <p className="why-item-desc">Від експертів індустрії</p>
                            </div>
                            <svg className="why-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </div>

                        <div className="why-item">
                            <div className="why-icon-box">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/>
                                    <path d="M17.64 15 22 10.64"/>
                                    <path d="m20.91 3.26-6.17 6.17a2.5 2.5 0 0 0 0 3.54l1.29 1.29a2.5 2.5 0 0 0 3.54 0l6.17-6.17a1.5 1.5 0 0 0 0-2.12l-2.71-2.71a1.5 1.5 0 0 0-2.12 0z"/>
                                </svg>
                            </div>
                            <div className="why-text-content">
                                <h4 className="why-item-heading">Практичні проєкти</h4>
                                <p className="why-item-desc">Реальні кейси та завдання</p>
                            </div>
                            <svg className="why-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </div>

                        <div className="why-item">
                            <div className="why-icon-box">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                            </div>
                            <div className="why-text-content">
                                <h4 className="why-item-heading">Спільнота однодумців</h4>
                                <p className="why-item-desc">Обмін досвіду та підтримка</p>
                            </div>
                            <svg className="why-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </div>

                        <div className="why-item">
                            <div className="why-icon-box">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                                </svg>
                            </div>
                            <div className="why-text-content">
                                <h4 className="why-item-heading">Кар'єрний розвиток</h4>
                                <p className="why-item-desc">Можливості після навчання</p>
                            </div>
                            <svg className="why-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
