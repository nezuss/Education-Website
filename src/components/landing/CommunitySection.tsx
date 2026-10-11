import UiIcon from "../ui/Icon/UiIcon";
import DataUnavailable from "../../pages/shared/DataUnavailable";
import { Link } from "react-router-dom";

export default function CommunitySection() {
    return (
        <section className="landing-section" id="community">
            <div className="community-three-cols-grid">
                
                <div className="community-stats-card">
                    <div className="comm-top-content">
                        <h3 className="comm-card-heading">
                            Ми створюємо<br />майбутнє разом
                        </h3>

                        <div className="comm-metrics-grid">
                            <div className="comm-metric-item">
                                <span className="metric-val">—</span>
                                <span className="metric-lbl">експертів</span>
                            </div>
                            <div className="comm-metric-item">
                                <span className="metric-val">—</span>
                                <span className="metric-lbl">студентів</span>
                            </div>
                            <div className="comm-metric-item">
                                <span className="metric-val">—</span>
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
                            <UiIcon name="arrow" size={16} />
                        </Link>
                    </div>
                </div>

                <div className="eco-journal-card" id="journal">
                    <div className="journal-header-row">
                        <h3 className="journal-title">Еко-журнал</h3>
                        <a href="/journal" className="journal-all-link">
                            <span>Всі статті</span>
                            <UiIcon name="arrow" size={14} />
                        </a>
                    </div>

                    <div className="journal-articles-list"><DataUnavailable title="Статті поки недоступні" /></div>
                </div>
            </div>
        </section>
    );
}
