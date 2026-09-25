import { Link } from "react-router-dom";

export default function CommunitySection() {
    return (
        <section className="landing-section" id="community">
            <div className="community-three-cols-grid">
                {/* Box 1: Community Stats Card */}
                <div className="community-stats-card">
                    <div className="comm-top-content">
                        <h3 className="comm-card-heading">
                            Ми створюємо<br />майбутнє разом
                        </h3>

                        <div className="comm-metrics-grid">
                            <div className="comm-metric-item">
                                <span className="metric-val">120+</span>
                                <span className="metric-lbl">експертів</span>
                            </div>
                            <div className="comm-metric-item">
                                <span className="metric-val">5000+</span>
                                <span className="metric-lbl">студентів</span>
                            </div>
                            <div className="comm-metric-item">
                                <span className="metric-val">35</span>
                                <span className="metric-lbl">Країн</span>
                            </div>
                        </div>
                    </div>

                    <div className="comm-bottom-content">
                        <a href="#community" className="comm-join-link">
                            Приєднуйся до спільноти
                        </a>
                        <div className="comm-avatars-row">
                            <img 
                                src="/landing/avatars-community.webp" 
                                alt="Учасники спільноти" 
                                className="comm-avatars-img"
                            />
                        </div>
                    </div>
                </div>

                {/* Box 2: Center Movement Banner */}
                <div className="movement-banner-card">
                    <div className="movement-banner-photo">
                        <img 
                            src="/landing/community-future.webp" 
                            alt="Футуристична еко-архітектура" 
                            className="movement-img"
                            loading="lazy"
                        />
                    </div>
                    <div className="movement-banner-panel">
                        <h3 className="movement-panel-title">
                            Освіта сьогодні - стійке майбутнє завтра.
                        </h3>
                        <p className="movement-panel-desc">
                            NEXYLVA - це більше ніж курси. Це рух. Приєднуйся!
                        </p>
                        <Link to="/courses" className="movement-cta-btn">
                            <span>Обрати курс</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Box 3: Eco-Journal Card */}
                <div className="eco-journal-card" id="journal">
                    <div className="journal-header-row">
                        <h3 className="journal-title">Еко-журнал</h3>
                        <a href="#journal" className="journal-all-link">
                            <span>Всі статті</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </a>
                    </div>

                    <div className="journal-articles-list">
                        {/* Article 1 */}
                        <article className="journal-article-item">
                            <div className="article-photo-box">
                                <img 
                                    src="/landing/article-biomaterials.webp" 
                                    alt="Біоматеріали: революція в дизайні" 
                                    className="article-photo"
                                    loading="lazy"
                                />
                            </div>
                            <h4 className="article-title">Біоматеріали: революція в дизайні</h4>
                            <a href="#journal" className="article-read-link">
                                <span>Читати статтю</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                    <polyline points="12 5 19 12 12 19"/>
                                </svg>
                            </a>
                        </article>

                        {/* Article 2 */}
                        <article className="journal-article-item">
                            <div className="article-photo-box">
                                <img 
                                    src="/landing/article-trends.webp" 
                                    alt="Тренди сталого дизайну 2026" 
                                    className="article-photo"
                                    loading="lazy"
                                />
                            </div>
                            <h4 className="article-title">Тренди сталого дизайну 2026</h4>
                            <a href="#journal" className="article-read-link">
                                <span>Читати статтю</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                    <polyline points="12 5 19 12 12 19"/>
                                </svg>
                            </a>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    );
}
