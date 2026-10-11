import UiIcon from "../ui/Icon/UiIcon";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function CtaSubscribeBanner() {
    const [email, setEmail] = useState("");
    const subscribed = false;
    const [error, setError] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (email.trim()) {
            setError("Підписка поки недоступна. Спробуйте пізніше.");
        }
    }

    return (
        <section className="landing-cta-banner-wrapper">
            {error && <p role="alert" className="data-unavailable">{error}</p>}
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
                            <UiIcon name="arrow" size={16} />
                        </Link>

                        <div className="cta-students-tag">
                            <img 
                                src="/landing/avatars-banner.webp" 
                                alt="Студенти" 
                                className="cta-avatars-img"
                            />
                            <span className="cta-students-count">NEXYLVA</span>
                        </div>
                    </div>
                </div>

                <div className="cta-newsletter-box">
                    <h4 className="newsletter-title">Підписуйся на новини</h4>
                    <p className="newsletter-desc">Отримуй корисні матеріали та новини про курси</p>

                    {subscribed ? (
                        <div className="newsletter-success">
                            <UiIcon name="check" /> Дякуємо за підписку!
                        </div>
                    ) : (
                        <>
                        <p className="newsletter-unavailable">Підписка поки недоступна.</p>
                        <form className="newsletter-form" onSubmit={handleSubmit}>
                            <input 
                                type="email" 
                                className="newsletter-input" 
                                placeholder="Твій Email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button disabled title="Підписка поки недоступна" type="submit" className="newsletter-submit-btn" aria-label="Підписатися">
                                <UiIcon name="arrow" size={18} />
                            </button>
                        </form>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
