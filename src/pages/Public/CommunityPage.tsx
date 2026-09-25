import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/CommunityPage.css';

const CATEGORIES = [
  'Усі',
  'Circular Design',
  'Eco Branding',
  'Creative Upcycling',
  'Materials',
  'Fashion'
];

interface CommunityWork {
  id: string;
  title: string;
  image: string;
  category: string;
  theme: 'sage' | 'beige';
  isLarge?: boolean;
}

const ALL_COMMUNITY_WORKS: CommunityWork[] = [
  {
    id: '1',
    title: 'Fragments / Світильник із переробленого скла',
    image: '/community/work_lamp.webp',
    category: 'Circular Design',
    theme: 'sage',
    isLarge: true
  },
  {
    id: '2',
    title: 'Re:Pack / Переосмислення пакування',
    image: '/community/work_repack.webp',
    category: 'Eco Branding',
    theme: 'beige'
  },
  {
    id: '3',
    title: 'Biocomposite Surface / Біокомпозитна поверхня',
    image: '/community/work_biocomposite.webp',
    category: 'Materials',
    theme: 'beige'
  },
  {
    id: '4',
    title: 'Denim Reconstructed / Друге життя текстилю',
    image: '/community/work_denim.webp',
    category: 'Creative Upcycling',
    theme: 'sage'
  }
];

export const CommunityPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Усі');

  const filteredWorks = ALL_COMMUNITY_WORKS.filter((w) => {
    if (activeCategory === 'Усі') return true;
    if (activeCategory === 'Fashion') return w.category === 'Creative Upcycling' || w.id === '4';
    return w.category === activeCategory;
  });

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
                <span>&rarr;</span>
              </a>

              <div className="comm-hero-stats">
                <div className="comm-hero-stat-item">
                  <span className="comm-hero-stat-num">428</span>
                  <span className="comm-hero-stat-label">проєктів</span>
                </div>
                <div className="comm-hero-stat-item">
                  <span className="comm-hero-stat-num">186</span>
                  <span className="comm-hero-stat-label">авторів</span>
                </div>
                <div className="comm-hero-stat-item">
                  <span className="comm-hero-stat-num">24</span>
                  <span className="comm-hero-stat-label">ментори</span>
                </div>
              </div>
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

      <section className="comm-featured-section">
        <span className="comm-tag-badge" style={{ color: '#B29074' }}>[ FEATURED / ОБРАНЕ ]</span>
        <div className="comm-featured-top">
          <h2 className="comm-featured-title">Проєкт тижня</h2>
          <div className="comm-tags-flow">
            <span className="comm-tag-pill">МАТЕРІАЛ &rarr;</span>
            <span className="comm-tag-pill-outline">Дерево, денім, метал</span>
            <span className="comm-tag-pill">ТЕХНІКА &rarr;</span>
            <span className="comm-tag-pill-outline">Апсайклінг</span>
            <span className="comm-tag-pill">РІК &rarr;</span>
            <span className="comm-tag-pill-outline">2026</span>
            <span className="comm-tag-pill">НАПРЯМ &rarr;</span>
            <span className="comm-tag-pill-outline">Circular Design</span>
          </div>
        </div>

        <div className="comm-featured-grid">
          <div className="comm-featured-card">
            <img
              src="/community/featured_chair.webp"
              alt="Second Life Chair"
              className="comm-featured-img"
            />
            <div className="comm-featured-card-body">
              <h3 className="comm-featured-card-title">Second Life Chair</h3>
              <p className="comm-featured-card-desc">
                Крісло, створене зі старих дерев'яних меблів, деніму та повторно використаних металевих деталей.
              </p>
            </div>
          </div>

          <div className="comm-featured-desc-col">
            <p className="comm-featured-intro">
              Щотижня ментори NEXYLVA обирають роботу, яка демонструє сильну ідею, відповідальне використання матеріалів і новий погляд на дизайн.
            </p>

            <div className="comm-featured-num">01</div>
            <h3 className="comm-featured-takeaway">Матеріал має пам'ять</h3>
            <p className="comm-featured-takeaway-p">
              Автор зберіг видимі сліди попереднього життя матеріалів замість того, щоб приховати їх.
            </p>

            <div className="comm-author-box">
              <div className="comm-author-badge">АВТОР</div>
              <div className="comm-author-name">Марія Коваль</div>
              <div className="comm-author-role">Студентка напрямку Sustainable &amp; Circular Design.</div>
            </div>
          </div>
        </div>
      </section>

      <div className="community-content-pad" id="explore">
        <section className="comm-works-section">
          <span className="comm-tag-badge">[ EXPLORE COMMUNITY ]</span>
          <div className="comm-works-header">
            <h2 className="comm-works-title">Роботи спільноти</h2>
            <div className="comm-works-sub">
              Реальні навчальні проєкти студентів NEXYLVA: від експериментів із матеріалами до готових предметів, брендів та інтер'єрних рішень.
            </div>
          </div>

          <div className="comm-filter-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`comm-pill-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {activeCategory === 'Усі' ? (
            <div className="comm-masonry-grid">
              <div className="comm-work-card-large">
                <img
                  src="/community/work_lamp.webp"
                  alt="Fragments recycled glass lamp"
                />
                <div className="comm-work-card-bottom sage">
                  <h3>Fragments / Світильник із переробленого скла</h3>
                </div>
              </div>

              <div className="comm-works-col-right">
                <div className="comm-works-row-two">
                  <div className="comm-work-small-card">
                    <img
                      src="/community/work_repack.webp"
                      alt="Re:Pack Eco Branding"
                    />
                    <div className="comm-work-card-bottom beige">
                      <h4>Re:Pack / Переосмислення пакування</h4>
                    </div>
                  </div>

                  <div className="comm-work-small-card">
                    <img
                      src="/community/work_biocomposite.webp"
                      alt="Biocomposite surface"
                    />
                    <div className="comm-work-card-bottom beige">
                      <h4>Biocomposite Surface / Біокомпозитна поверхня</h4>
                    </div>
                  </div>
                </div>

                <div className="comm-work-wide-card">
                  <img
                    src="/community/work_denim.webp"
                    alt="Denim Reconstructed"
                  />
                  <div className="comm-work-card-bottom sage">
                    <h4>Denim Reconstructed / Друге життя текстилю</h4>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="comm-masonry-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {filteredWorks.map((work) => (
                <div key={work.id} className="comm-work-small-card" style={{ height: '340px' }}>
                  <img src={work.image} alt={work.title} style={{ height: '240px', objectFit: 'cover' }} />
                  <div className={`comm-work-card-bottom ${work.theme}`}>
                    <h4>{work.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="comm-all-works-row">
            <Link to="/portfolio" className="comm-all-works-link">
              <span>Переглянути всі проєкти &rarr;</span>
            </Link>
          </div>
        </section>

        <section className="comm-story-section">
          <div className="comm-story-content">
            <span className="comm-tag-badge">[ ІСТОРІЯ СПІЛЬНОТИ ]</span>
            <h2>Не відходи. Матеріал.</h2>
            <p>
              У NEXYLVA ми вчимо дивитися на старі речі не як на сміття, а як на ресурс для нового дизайнерського рішення.
              Старі меблі, текстиль, скло, дерево, папір та пластик можуть отримати нову функцію, форму й цінність.
            </p>
            <Link to="/journal/algae-bioplastics" className="comm-story-link">
              <span>Читати статтю &rarr;</span>
            </Link>
          </div>

          <div className="comm-story-slides">
            <img
              src="/community/comm_slide1.webp"
              alt="Material Research"
              className="comm-story-slide-img"
            />
            <img
              src="/community/comm_slide2.webp"
              alt="Material New Life"
              className="comm-story-slide-img"
            />
          </div>
        </section>

        <section className="comm-quote-section">
          <div className="comm-quote-card-art">
            <img
              src="/community/mentor_choice.webp"
              alt="Mentor choice"
            />
          </div>

          <div className="comm-quote-content">
            <span className="comm-tag-badge">[ ЦИТАТА МЕНТОРА ]</span>
            <div className="comm-quote-title-row">
              <h2 className="comm-quote-title">Дизайн починається не з форми, а з питання.</h2>
              <span className="comm-quote-mark" aria-hidden="true">““</span>
            </div>
            <div className="comm-quote-bubble">
              <p>
                «Чи можемо ми використати те, що вже існує, замість того щоб створювати ще більше?»
              </p>
            </div>
            <div className="comm-quote-author">
              <img src="/community/mentor_irina.webp" alt="Ірина Шевченко" className="comm-quote-avatar" />
              <div className="comm-quote-author-info">
                <div className="comm-quote-author-name">Ірина Шевченко</div>
                <div className="comm-quote-author-role">Ментор курсу</div>
              </div>
            </div>
          </div>
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
            <span>Приєднатися до спільноти &rarr;</span>
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
