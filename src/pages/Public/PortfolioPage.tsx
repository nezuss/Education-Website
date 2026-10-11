import UiIcon from "../../components/ui/Icon/UiIcon";
import DataUnavailable from "../shared/DataUnavailable";
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/PortfolioPage.css';







export const PortfolioPage: React.FC = () => {
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
              <span className="port-stat-num">—</span>
              <span className="port-stat-label">авторів</span>
            </div>
            <div className="port-stat-card">
              <span className="port-stat-num">—</span>
              <span className="port-stat-label">проєктів</span>
            </div>
            <div className="port-stat-card">
              <span className="port-stat-num">—</span>
              <span className="port-stat-label">відзнак</span>
            </div>
          </div>

          <button type="button" onClick={scrollToGallery} className="port-explore-btn">
            <span>Переглянути роботи <UiIcon name="arrow" /></span>
          </button>
        </div>

        <div className="port-hero-art">
          <img
            src="/portfolio/port_hero_student.webp"
            alt="Студентка місяця Марія Коваль"
          />
        </div>
      </section>

      <section className="port-featured-student-section"><h2 className="port-featured-title">Портфоліо місяця</h2><div className="port-featured-grid"><DataUnavailable title="Портфоліо поки недоступне" /><DataUnavailable title="Інформація про автора поки недоступна" /></div></section>

      <section className="port-works-section" id="gallery"><h2 className="port-works-title">Роботи студентів</h2><DataUnavailable title="Роботи поки недоступні" /></section>

      <hr className="port-section-divider" />

      <section className="port-story-section"><h2>Історії студентів</h2><DataUnavailable /></section>

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

          <div className="port-process-arrow" aria-hidden="true"><UiIcon name="arrow" /></div>

          <div className="port-process-step-card">
            <span className="port-step-num">02</span>
            <h4 className="port-step-title">Експеримент</h4>
            <p className="port-step-desc">
              Ескізи, прототипи, тестування форми та матеріалу.
            </p>
          </div>

          <div className="port-process-arrow" aria-hidden="true"><UiIcon name="arrow" /></div>

          <div className="port-process-step-card">
            <span className="port-step-num">03</span>
            <h4 className="port-step-title">Рішення</h4>
            <p className="port-step-desc">
              Фінальна концепція, система та аргументація вибору.
            </p>
          </div>

          <div className="port-process-arrow" aria-hidden="true"><UiIcon name="arrow" /></div>

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
            <span>Почати навчання <UiIcon name="arrow" /></span>
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
