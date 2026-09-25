import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ArticleDetailsPage.css';

export const ArticleDetailsPage: React.FC = () => {
  return (
    <div className="article-page">
      {/* Breadcrumbs */}
      <nav className="article-breadcrumbs" aria-label="breadcrumb">
        <Link to="/">Головна</Link>
        <span>&gt;</span>
        <Link to="/journal">Еко-журнал</Link>
        <span>&gt;</span>
        <span>Матеріали</span>
        <span>&gt;</span>
        <span className="active">Біопластик з водоростей</span>
      </nav>

      {/* Top Meta */}
      <div className="article-top-meta">
        <span className="article-tag-badge">[ 03 / МАТЕРІАЛИ ]</span>
        <span className="article-read-time">8 хв. читання • LCA</span>
      </div>

      {/* Section 1: Hero */}
      <section className="article-hero-grid">
        <div className="article-hero-content">
          <h1 className="article-hero-title">
            Біопластик з водоростей: майбутнє екологічного пакування
          </h1>
          <p className="article-hero-desc">
            Як природна сировина перетворюється на матеріал для нового покоління продуктів — і яку роль у цьому відіграє дизайнер.
          </p>
          <div className="article-pub-info">
            <span>12 серпня 2026</span>
            <span>•</span>
            <span>Дослідження NEXYLVA</span>
            <span>•</span>
            <span>Матеріали</span>
          </div>
        </div>

        <div className="article-hero-media">
          <img
            src="/article/article_hero_art.webp"
            alt="Algae bioplastic packaging concept"
            className="article-hero-img"
          />
        </div>
      </section>

      {/* Section 2: Intro / Dropcap */}
      <section className="article-intro-grid">
        <div className="article-dropcap-block">
          <div className="article-dropcap">Д</div>
          <div className="article-dropcap-text">
            <p>
              изайн майбутнього починається не з форми, а з питання: з чого ця форма буде створена? Біоматеріали змінюють підхід до пакування, предметного дизайну та виробництва, дозволяючи розглядати матеріал як частину життєвого циклу продукту.
            </p>
            <p>
              Водорості цікаві дизайнерам як відновлювана сировина. У дослідницьких проєктах їх використовують для створення біополімерних матеріалів, плівок і формованих об'єктів.
            </p>
          </div>
        </div>

        <div className="article-sidebar-summary">
          <h3 className="article-sidebar-title">Коротко про матеріал</h3>
          <p className="article-sidebar-desc">
            Відновлювана сировина, нові сценарії пакування, прототипування та оцінка життєвого циклу.
          </p>
        </div>
      </section>

      {/* Section 3: Process Steps */}
      <section className="article-process-section">
        <div className="article-tag-badge">[ ПРОЦЕС / 04 ]</div>
        <div className="article-process-header">
          <h2 className="article-process-title">Від сировини до нового продукту</h2>
          <div className="article-process-sub">
            Схема замінює довгий текст і додає сторінці технічний ритм, не перетворюючи її на каталог однакових карток.
          </div>
        </div>

        <div className="article-process-steps-card">
          <div className="article-step-col">
            <div className="article-step-num">01</div>
            <div className="article-step-name">Сировина</div>
            <div className="article-step-desc">Вирощування та збір біологічної сировини.</div>
          </div>
          <div className="article-step-col">
            <div className="article-step-num">02</div>
            <div className="article-step-name">Обробка</div>
            <div className="article-step-desc">Підготовка компонентів майбутнього матеріалу.</div>
          </div>
          <div className="article-step-col">
            <div className="article-step-num">03</div>
            <div className="article-step-name">Матеріал</div>
            <div className="article-step-desc">Формування плівок, листів або об'ємних форм.</div>
          </div>
          <div className="article-step-col">
            <div className="article-step-num">04</div>
            <div className="article-step-name">Продукт</div>
            <div className="article-step-desc">Прототипування пакування та дизайнерських об'єктів.</div>
          </div>
        </div>
      </section>

      {/* Section 4: Key Takeaway & Quote */}
      <section className="article-key-quote-row">
        <div className="article-keynote-box">
          <div className="article-keynote-tag">
            КЛЮЧОВА<br />ДУМКА
          </div>
          <div className="article-keynote-text">
            Матеріал — це вже не просто оболонка продукту.<br />
            У сталому дизайні він стає частиною системи:<br />
            <strong>походження &rarr; виробництво &rarr; використання &rarr; наступний цикл</strong>
          </div>
        </div>

        <div className="article-quote-box">
          <blockquote>
            «Хороший матеріал не закінчує життя продукту — він відкриває наступний цикл.»
          </blockquote>
          <span className="article-quote-author">NEXYLVA / Sustainable Design Notes</span>
        </div>
      </section>

      {/* Section 5: Lab / Designer Workflow */}
      <section className="article-designer-grid">
        <div className="article-designer-media">
          <img
            src="/article/article_lab_art.webp"
            alt="Eco design lab materials"
            className="article-designer-img"
          />
        </div>

        <div className="article-designer-content">
          <div className="article-tag-badge">[ ПРОЦЕС / 04 ]</div>
          <h2>Що це змінює для дизайнера?</h2>
          <p>
            Дизайнер працює не лише з естетикою. Він оцінює походження матеріалу, сценарій використання, можливість повторного циклу та спосіб виробництва.
          </p>
          <p>
            Матеріалознавство, LCA та прототипування стають частиною сучасного sustainable design workflow.
          </p>

          <div className="article-flow-bar">
            <span>ДИЗАЙНЕР АНАЛІЗУЄ:</span>
            <div className="article-flow-icons">
              <div className="article-flow-step-circle">🌱</div>
              <span>&rarr;</span>
              <div className="article-flow-step-circle">🏭</div>
              <span>&rarr;</span>
              <div className="article-flow-step-circle">📦</div>
              <span>&rarr;</span>
              <div className="article-flow-step-circle">♻️</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Related Articles */}
      <section className="article-related-section">
        <div className="article-related-header">
          <h2>Пов’язані матеріали</h2>
          <Link to="/journal" className="article-all-link">
            <span>Усі статті</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="article-related-grid">
          <Link to="/journal/algae-bioplastics" className="article-related-card">
            <img
              src="/article/art_rel_1.webp"
              alt="Next Gen Materials"
              className="article-related-thumb"
            />
            <div className="article-related-body">
              <h3 className="article-related-card-title">Матеріали нового покоління</h3>
              <div className="article-related-card-footer">
                <span>Матеріали • 6 хв. читання</span>
                <span>★ 4,9 (150)</span>
              </div>
            </div>
          </Link>

          <Link to="/journal/algae-bioplastics" className="article-related-card">
            <img
              src="/article/art_rel_2.webp"
              alt="Zero-Waste packaging"
              className="article-related-thumb"
            />
            <div className="article-related-body">
              <h3 className="article-related-card-title">Zero-Waste пакування</h3>
              <div className="article-related-card-footer">
                <span>Практика • 5 хв. читання</span>
                <span>★ 4,6 (298)</span>
              </div>
            </div>
          </Link>

          <Link to="/journal/algae-bioplastics" className="article-related-card">
            <img
              src="/article/art_rel_3.webp"
              alt="Circular product design"
              className="article-related-thumb"
            />
            <div className="article-related-body">
              <h3 className="article-related-card-title">Циркулярний дизайн продуктів</h3>
              <div className="article-related-card-footer">
                <span>LCA • 8 хв. читання</span>
                <span>★ 5 (632)</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Section 7: Bottom CTA Banner */}
      <section className="article-cta-banner">
        <div>
          <h2 className="article-cta-title">Хочете працювати з біоматеріалами?</h2>
          <p className="article-cta-desc">
            Перейдіть від дослідження до практики у навчальних програмах NEXYLVA.
          </p>
        </div>
        <div className="article-cta-right">
          <div className="article-cta-avatars-cluster">
            <img
              src="/article/art_banner_avatars.webp"
              alt="Студенти NEXYLVA"
              className="article-avatars-img"
            />
            <span className="article-cta-students-tag">+5000 студентів з нами</span>
          </div>
          <Link to="/courses" className="article-cta-btn">
            <span>Переглянути курси</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
export default ArticleDetailsPage;
