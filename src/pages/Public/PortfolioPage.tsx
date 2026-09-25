import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/PortfolioPage.css';

interface WorkItem {
  id: string;
  title: string;
  category: string;
  tag: string;
  img: string;
  author?: string;
  variant: 'sage' | 'beige';
}

const ALL_WORKS: WorkItem[] = [
  {
    id: 'w1',
    title: 'Fragments / Світильник із переробленого скла',
    category: 'Creative Upcycling',
    tag: '[ CREATIVE UPCYCLING ]',
    img: '/community/work_lamp.webp',
    variant: 'sage'
  },
  {
    id: 'w2',
    title: 'Re:Pack / Переосмислення пакування',
    category: 'Eco Branding',
    tag: '[ ECO BRANDING ]',
    img: '/community/work_repack.webp',
    variant: 'beige'
  },
  {
    id: 'w3',
    title: 'Biocomposite Surface / Біокомпозитна плитка',
    category: 'Materials',
    tag: '[ MATERIALS ]',
    img: '/community/work_biocomposite.webp',
    variant: 'sage'
  },
  {
    id: 'w4',
    title: 'Denim Reconstructed / Друге життя текстилю',
    category: 'Fashion',
    tag: '[ SUSTAINABLE FASHION ]',
    img: '/community/work_denim.webp',
    variant: 'sage'
  },
  {
    id: 'w5',
    title: 'Re:Pack / Переосмислення міських меблів',
    category: 'Eco Branding',
    tag: '[ ECO BRANDING ]',
    img: '/portfolio/port_bench.webp',
    variant: 'beige'
  },
  {
    id: 'w6',
    title: 'Refill System — Система повторного наповнення',
    category: 'Eco Branding',
    tag: '[ ECO BRANDING ]',
    img: '/portfolio/port_refill.webp',
    author: 'Олена Бойко • 82 збереження',
    variant: 'beige'
  },
  {
    id: 'w7',
    title: 'Mushroom Light — Світильник з біокомпозиту',
    category: 'Circular Design',
    tag: '[ CIRCULAR DESIGN ]',
    img: '/portfolio/port_mushroom.webp',
    author: 'Наталія Бондар • 116 збережень',
    variant: 'sage'
  }
];

const CATEGORIES = [
  'Усі',
  'Circular Design',
  'Eco Branding',
  'Creative Upcycling',
  'Materials',
  'Fashion'
];

export const PortfolioPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Усі');

  const filteredWorks = useMemo(() => {
    if (activeCategory === 'Усі') return ALL_WORKS;
    return ALL_WORKS.filter((w) => w.category === activeCategory);
  }, [activeCategory]);

  const scrollToGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="portfolio-page">
      <nav className="port-breadcrumbs" aria-label="breadcrumb">
        <Link to="/">Головна</Link>
        <span>&gt;</span>
        <span className="active">Портфоліо студентів</span>
      </nav>

      <section className="port-hero-grid">
        <div className="port-hero-left">
          <span className="port-tag-badge">[ STUDENT PORTFOLIO / ПОРТФОЛІО СТУДЕНТІВ ]</span>
          <h1 className="port-hero-title">
            Ідеї, що стають реальними проєктами.
          </h1>
          <p className="port-hero-desc">
            Дивись, як студенти NEXYLVA перетворюють навчання на реальні дизайнерські рішення — від матеріальних експериментів до завершених концепцій.
          </p>

          <div className="port-hero-stats">
            <div className="port-stat-card">
              <span className="port-stat-num">186</span>
              <span className="port-stat-label">авторів</span>
            </div>
            <div className="port-stat-card">
              <span className="port-stat-num">428</span>
              <span className="port-stat-label">проєктів</span>
            </div>
            <div className="port-stat-card">
              <span className="port-stat-num">12</span>
              <span className="port-stat-label">відзнак</span>
            </div>
          </div>

          <button type="button" onClick={scrollToGallery} className="port-explore-btn">
            <span>Переглянути роботи &rarr;</span>
          </button>
        </div>

        <div className="port-hero-art">
          <img
            src="/portfolio/port_hero_student.webp"
            alt="Студентка місяця Марія Коваль"
          />
        </div>
      </section>

      <section className="port-featured-student-section">
        <span className="port-tag-badge">[ FEATURED STUDENT / СТУДЕНТКА МІСЯЦЯ ]</span>
        <div className="port-featured-grid">
          <div className="port-featured-media">
            <img
              src="/portfolio/port_featured_maria.webp"
              alt="Марія Коваль"
            />
          </div>

          <div className="port-featured-info">
            <span className="port-pill-badge">[ 01 / ПОРТФОЛІО МІСЯЦЯ ]</span>
            <h2 className="port-featured-name">Марія Коваль</h2>
            <p className="port-featured-desc">
              Марія працює з повторним використанням дерева, текстилю та металу. Її проєкти поєднують ремесло, експеримент і сучасну візуальну мову.
            </p>

            <div className="port-featured-quote">
              <blockquote>
                «Я не хочу приховувати минуле матеріалу — я хочу зробити його частиною дизайну.»
              </blockquote>
            </div>

            <div className="port-featured-author">
              <img
                src="/portfolio/port_maria_avatar.webp"
                alt="Марія Коваль"
                className="port-author-avatar"
              />
              <div className="port-author-meta">
                <span className="port-author-name">Марія Коваль</span>
                <span className="port-author-role">Студентка Sustainable &amp; Circular Design</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="port-works-section" id="gallery">
        <span className="port-tag-badge">[ STUDENT WORKS / РОБОТИ СТУДЕНТІВ ]</span>
        <div className="port-works-header">
          <h2 className="port-works-title">Портфоліо студентів</h2>
          <div className="port-works-sub">
            Добірка курсових і власних проєктів студентів NEXYLVA — різні напрями, матеріали, підходи та рівні досвіду.
          </div>
        </div>

        <div className="port-filter-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`port-pill-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {activeCategory === 'Усі' ? (
          <>
            <div className="port-masonry-row">
              <div className="port-work-card port-work-card-large">
                <div className="port-work-img-wrap">
                  <img src="/community/work_lamp.webp" alt="Fragments / Світильник" />
                  <span className="port-card-tag-pill">[ CREATIVE UPCYCLING ]</span>
                </div>
                <div className="port-work-bottom sage">
                  <h3>Fragments / Світильник із переробленого скла</h3>
                </div>
              </div>

              <div className="port-masonry-right-col">
                <div className="port-masonry-sub-row">
                  <div className="port-work-card">
                    <div className="port-work-img-wrap">
                      <img src="/community/work_repack.webp" alt="Re:Pack" />
                      <span className="port-card-tag-pill">[ ECO BRANDING ]</span>
                    </div>
                    <div className="port-work-bottom beige">
                      <h3>Re:Pack / Переосмислення пакування</h3>
                    </div>
                  </div>

                  <div className="port-work-card">
                    <div className="port-work-img-wrap">
                      <img src="/community/work_biocomposite.webp" alt="Biocomposite" />
                      <span className="port-card-tag-pill">[ MATERIALS ]</span>
                    </div>
                    <div className="port-work-bottom sage">
                      <h3>Biocomposite Surface / Біокомпозитна плитка</h3>
                    </div>
                  </div>
                </div>

                <div className="port-work-card port-work-card-wide">
                  <div className="port-work-img-wrap">
                    <img src="/community/work_denim.webp" alt="Denim Reconstructed" />
                    <span className="port-card-tag-pill">[ SUSTAINABLE FASHION ]</span>
                  </div>
                  <div className="port-work-bottom sage">
                    <h3>Denim Reconstructed / Друге життя текстилю</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="port-cards-row2">
              <div className="port-card-standard">
                <div className="port-card-img-wrap">
                  <img src="/portfolio/port_bench.webp" alt="Re:Pack Лавка" />
                  <span className="port-card-tag-pill">[ ECO BRANDING ]</span>
                </div>
                <div className="port-card-standard-body">
                  <h3 className="port-card-title">Re:Pack / Переосмислення пакування</h3>
                </div>
              </div>

              <div className="port-card-standard">
                <div className="port-card-img-wrap">
                  <img src="/portfolio/port_refill.webp" alt="Refill System" />
                  <span className="port-card-tag-pill">[ ECO BRANDING ]</span>
                </div>
                <div className="port-card-standard-body">
                  <h3 className="port-card-title">Refill System — Система повторного наповнення</h3>
                  <div className="port-card-meta">Олена Бойко • 82 збереження</div>
                </div>
              </div>

              <div className="port-card-standard">
                <div className="port-card-img-wrap">
                  <img src="/portfolio/port_mushroom.webp" alt="Mushroom Light" />
                  <span className="port-card-tag-pill">[ CIRCULAR DESIGN ]</span>
                </div>
                <div className="port-card-standard-body">
                  <h3 className="port-card-title">Mushroom Light — Світильник з біокомпозиту</h3>
                  <div className="port-card-meta">Наталія Бондар • 116 збережень</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {filteredWorks.map((work) => (
              <div key={work.id} className="port-card-standard">
                <div className="port-card-img-wrap">
                  <img src={work.img} alt={work.title} />
                  <span className="port-card-tag-pill">{work.tag}</span>
                </div>
                <div className="port-card-standard-body">
                  <h3 className="port-card-title">{work.title}</h3>
                  {work.author && <div className="port-card-meta">{work.author}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="port-all-projects-link-row">
          <button type="button" onClick={() => setActiveCategory('Усі')} className="port-view-all-link">
            <span>Переглянути всі проєкти &rarr;</span>
          </button>
        </div>
      </section>

      <hr className="port-section-divider" />

      <section className="port-story-section">
        <div className="port-story-media">
          <img
            src="/portfolio/port_story_workspace.webp"
            alt="Процес дизайну"
          />
        </div>

        <div className="port-story-content">
          <span className="port-tag-badge">[ STUDENT STORY / ІСТОРІЯ СТУДЕНТА ]</span>
          <h2 className="port-story-title">Від першого ескізу до власного стилю.</h2>
          <p className="port-story-desc">
            Портфоліо — це не тільки фінальні роботи. Це шлях: спроби, невдалі рішення, пошук матеріалу, зміни та поступове формування власної дизайнерської мови.
          </p>

          <div className="port-story-quote">
            <blockquote>
              «Найважливіше, що я навчилася пояснювати, чому саме це рішення має сенс.»
            </blockquote>
          </div>

          <Link to="/journal/algae-bioplastics" className="port-story-action-link">
            <span>Дивитися історію студентки &rarr;</span>
          </Link>
        </div>
      </section>

      <section className="port-process-section">
        <div className="port-process-header">
          <div>
            <span className="port-tag-badge">
              [ FROM LEARNING TO PORTFOLIO / ВІД НАВЧАННЯ ДО ПОРТФОЛІО ]
            </span>
            <h2 className="port-process-title">Як народжується робота</h2>
          </div>
          <div className="port-process-sub">
            Проєкт проходить кілька етапів — від дослідження проблеми до презентації готового рішення в студентському портфоліо.
          </div>
        </div>

        <div className="port-process-steps-row">
          <div className="port-process-step-card">
            <span className="port-step-num">01</span>
            <h4 className="port-step-title">Дослідження</h4>
            <p className="port-step-desc">
              Проблема, контекст, матеріали, користувач і обмеження
            </p>
          </div>

          <div className="port-process-arrow" aria-hidden="true">&rarr;</div>

          <div className="port-process-step-card">
            <span className="port-step-num">02</span>
            <h4 className="port-step-title">Експеримент</h4>
            <p className="port-step-desc">
              Ескізи, прототипи, тестування форми та матеріалу.
            </p>
          </div>

          <div className="port-process-arrow" aria-hidden="true">&rarr;</div>

          <div className="port-process-step-card">
            <span className="port-step-num">03</span>
            <h4 className="port-step-title">Рішення</h4>
            <p className="port-step-desc">
              Фінальна концепція, система та аргументація вибору.
            </p>
          </div>

          <div className="port-process-arrow" aria-hidden="true">&rarr;</div>

          <div className="port-process-step-card">
            <span className="port-step-num">04</span>
            <h4 className="port-step-title">Портфоліо</h4>
            <p className="port-step-desc">
              Візуальна історія проєкту, результат і висновки.
            </p>
          </div>
        </div>
      </section>

      <section className="port-cta-banner">
        <div className="port-cta-content">
          <span className="port-cta-badge">[ СПІЛЬНОТА NEXYLVA ]</span>
          <h2 className="port-cta-title">Створюй роботу, яку хочеться показати.</h2>
          <p className="port-cta-sub">
            Навчайся, експериментуй і створюй власне портфоліо разом із менторами та спільнотою NEXYLVA.
          </p>
        </div>

        <div className="port-cta-btn-wrap">
          <Link to="/courses" className="port-cta-btn">
            <span>Почати навчання &rarr;</span>
          </Link>
        </div>

        <div className="port-cta-visual">
          <img
            src="/portfolio/port_banner_girl.webp"
            alt="NEXYLVA Student Character"
            className="port-cta-character"
          />
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;
