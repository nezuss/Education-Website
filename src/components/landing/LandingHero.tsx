import { useState } from "react";
import { Link } from "react-router-dom";

export default function LandingHero() {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    return (
        <section className="landing-hero" id="hero">
            <div className="landing-hero-inner">
                {/* Left Column: Text & CTAs */}
                <div className="hero-content">
                    <div className="hero-tag">
                        [ NEXT-GEN ECO-TECH EDUCATION ]
                    </div>

                    <h1 className="hero-title">
                        <span>Навчайся.</span>
                        <span>Створюй.</span>
                        <span>Змінюй майбутнє.</span>
                    </h1>

                    <p className="hero-description">
                        Практичні знання та інструменти для тих хто створює екологічний світ
                    </p>

                    {/* 4 Feature Pills */}
                    <div className="hero-features-grid">
                        <div className="hero-feature-item">
                            <span className="feature-icon-circle">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/>
                                    <path d="M17.64 15 22 10.64"/>
                                    <path d="m20.91 3.26-6.17 6.17a2.5 2.5 0 0 0 0 3.54l1.29 1.29a2.5 2.5 0 0 0 3.54 0l6.17-6.17a1.5 1.5 0 0 0 0-2.12l-2.71-2.71a1.5 1.5 0 0 0-2.12 0z"/>
                                </svg>
                            </span>
                            <span className="feature-text">Практика<br />замість теорії</span>
                        </div>

                        <div className="hero-feature-item">
                            <span className="feature-icon-circle">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                                </svg>
                            </span>
                            <span className="feature-text">Актуальні еко-<br />інструменти</span>
                        </div>

                        <div className="hero-feature-item">
                            <span className="feature-icon-circle">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                            </span>
                            <span className="feature-text">Підтримка<br />спільноти</span>
                        </div>

                        <div className="hero-feature-item">
                            <span className="feature-icon-circle">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="8" r="7"/>
                                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                                </svg>
                            </span>
                            <span className="feature-text">Сертифікат<br />після курсу</span>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="hero-actions">
                        <Link to="/courses" className="hero-btn-primary">
                            <span>Обрати курс</span>
                            <span className="btn-arrow-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                    <polyline points="12 5 19 12 12 19"/>
                                </svg>
                            </span>
                        </Link>

                        <button 
                            type="button" 
                            className="hero-btn-trailer" 
                            onClick={() => setIsVideoModalOpen(true)}
                        >
                            <span className="btn-play-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3"/>
                                </svg>
                            </span>
                            <span className="trailer-text">
                                <strong>Дивитись трейлер</strong>
                                <small>1:25 хв.</small>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Hero Visual Graphic */}
                <div className="hero-visual-wrapper">
                    <div className="hero-visual-frame">
                        <img 
                            src="/landing/hero-visual.webp" 
                            alt="Футуристичний простір сталого дизайну NEXYLVA" 
                            className="hero-visual-img"
                        />
                    </div>
                </div>
            </div>

            {/* Video Trailer Modal */}
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
                                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1" 
                                title="NEXYLVA Platform Trailer" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
