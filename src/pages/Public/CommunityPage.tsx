import UiIcon from "../../components/ui/Icon/UiIcon";
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/CommunityPage.css';
export const CommunityPage: React.FC = () => {
  return (
    <div className="community-page">
      <div className="community-content-pad">
        <nav className="comm-breadcrumbs" aria-label="breadcrumb">
          <Link to="/">Головна</Link>
          <span>&gt;</span>
          <span className="active">Спільнота</span>
        </nav>

        <section className="comm-hero-grid">
          <div className="comm-hero-left">
            <span className="comm-tag-badge">[ COMMUNITY / СПІЛЬНОТА ]</span>
            <h1 className="comm-hero-title">
              Ідеї стають сильнішими, коли ними діляться.
            </h1>
            <p className="comm-hero-desc">
              Як природна сировина перетворюється на матеріал для нового покоління продуктів — і яку роль у цьому відіграє дизайнер.
            </p>

            <div className="comm-hero-actions-row">
              <a href="#explore" className="comm-explore-btn">
                <span>Переглянути проєкти</span>
                <span><UiIcon name="arrow" /></span>
              </a>

            </div>
          </div>

          <div className="comm-hero-art">
            <img
              src="/community/community_hero_art.webp"
              alt="Community Showcase"
            />
          </div>
        </section>
      </div>

      <div className="community-content-pad" id="explore">
        <section className="comm-works-section" aria-labelledby="comm-works-heading">
          <h2 id="comm-works-heading" className="comm-works-title">Роботи спільноти</h2>
          <div className="comm-empty-gallery" role="status">
            <p>Проєкти спільноти з’являться тут.</p>
          </div>
          <Link to="/portfolio" className="comm-all-works-link">Портфоліо студентів <UiIcon name="arrow" /></Link>
        </section>

        <section className="comm-cta-banner">
          <div className="comm-cta-text-col">
            <span className="comm-tag-badge" style={{ background: 'rgba(232, 222, 213, 0.2)', color: '#E8DED5', border: '1px solid rgba(232, 222, 213, 0.3)', width: 'fit-content', padding: '4px 10px', borderRadius: '4px', marginBottom: '8px' }}>
              [ СПІЛЬНОТА NEXYLVA ]
            </span>
            <h2 className="comm-cta-title">Навчайся. Створюй. Ділись ідеями.</h2>
            <p className="comm-cta-desc">
              Приєднуйся до дизайнерів, які створюють нові рішення для більш відповідального майбутнього.
            </p>
          </div>
          <Link to="/courses" className="comm-cta-btn">
            <span>Приєднатися до спільноти <UiIcon name="arrow" /></span>
          </Link>
          <img
            src="/community/community_banner_girl.webp"
            alt="Community character"
            className="comm-cta-girl"
          />
        </section>
      </div>
    </div>
  );
};

export default CommunityPage;
