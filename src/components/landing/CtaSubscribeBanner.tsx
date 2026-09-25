import { useState } from "react";
import { Link } from "react-router-dom";

export default function CtaSubscribeBanner() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail("");
        }
    }

    return (
        <section className="landing-cta-banner-wrapper">
            <div className="landing-cta-banner">
                
                <div className="cta-nature-photo-box">
                    <img 
                        src="/landing/banner-moss.webp" 
                        alt="Еко-матеріали та рослинність" 
                        className="cta-nature-img"
                        loading="lazy"
                    />
                </div>

                <div className="cta-main-content">
                    <span className="cta-eyebrow">ГОТОВИЙ ЗРОБИТИ КРОК?</span>
                    <h3 className="cta-headline">
                        Почни свій шлях у сфері екологічного дизайну
                    </h3>

                    <div className="cta-actions-row">
                        <Link to="/courses" className="cta-choose-course-btn">
                            <span>Обрати курс</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </Link>

                        <div className="cta-students-tag">
                            <img 
                                src="/landing/avatars-banner.webp" 
                                alt="Студенти" 
                                className="cta-avatars-img"
                            />
                            <span className="cta-students-count">+5 к студентів з нами</span>
                        </div>
                    </div>
                </div>

                <div className="cta-newsletter-box">
                    <h4 className="newsletter-title">Підписуйся на новини</h4>
                    <p className="newsletter-desc">Отримуй корисні матеріали та новини про курси</p>

                    {subscribed ? (
                        <div className="newsletter-success">
                            ✓ Дякуємо за підписку!
                        </div>
                    ) : (
                        <form className="newsletter-form" onSubmit={handleSubmit}>
                            <input 
                                type="email" 
                                className="newsletter-input" 
                                placeholder="Твій Email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="newsletter-submit-btn" aria-label="Підписатися">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                    <polyline points="12 5 19 12 12 19"/>
                                </svg>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
