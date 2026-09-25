import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/AboutPage.css';

interface TeamMember {
  id: string;
  badge: string;
  name: string;
  desc: string;
  photo: string;
}

const TEAM: TeamMember[] = [
  {
    id: '1',
    badge: 'CREATIVE DIRECTOR',
    name: 'Ірина Шевченко',
    desc: 'Дизайн-системи та креативна методологія.',
    photo: '/about/team_1.webp'
  },
  {
    id: '2',
    badge: 'EDUCATION LEAD',
    name: 'Марія Коваль',
    desc: 'Навчальні програми та розвиток курсів.',
    photo: '/about/team_2.webp'
  },
  {
    id: '3',
    badge: 'MATERIALS RESEARCH',
    name: 'Олена Бойко',
    desc: 'Матеріали, біокомпозити та експерименти.',
    photo: '/about/team_3.webp'
  },
  {
    id: '4',
    badge: 'COMMUNITY LEAD',
    name: 'Андрій Левченко',
    desc: 'Спільнота, ментори та студентські проєкти.',
    photo: '/about/team_4.webp'
  },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-pad-container">
        
        <nav className="about-breadcrumbs" aria-label="breadcrumb">
          <Link to="/">Головна</Link>
          <span>&gt;</span>
          <span className="active">Про нас</span>
        </nav>

        <section className="about-hero-grid">
          <div className="about-hero-left">
            <span className="about-tag-badge">[ ABOUT NEXYLVA / ПРО NEXYLVA ]</span>
            <h1 className="about-hero-title">
              Навчання, що змінює спосіб створювати.
            </h1>
            <p className="about-hero-desc">
              NEXYLVA — освітня платформа про відповідальний дизайн. Ми поєднуємо творчість, технології та роботу з матеріалами, щоб нові рішення починалися не з надлишку, а з усвідомленого вибору.
            </p>

            <div className="about-hero-actions">
              <a href="#approach" className="about-hero-btn">
                <span>Як проходить навчання &rarr;</span>
              </a>

              <div className="about-hero-stats">
                <div className="about-stat-item">
                  <span className="about-stat-num">3</span>
                  <span className="about-stat-label">напрями навчання</span>
                </div>
                <div className="about-stat-item">
                  <span className="about-stat-num">186+</span>
                  <span className="about-stat-label">студентів</span>
                </div>
                <div className="about-stat-item">
                  <span className="about-stat-num">24</span>
                  <span className="about-stat-label">ментори</span>
                </div>
              </div>
            </div>
          </div>

          <div className="about-hero-art">
            <img
              src="/about/about_hero_art.webp"
              alt="Material Exploration"
            />
          </div>
        </section>
      </div>

      <section className="about-mission-section">
        <div className="about-mission-inner">
          <div className="about-mission-left">
            <span className="about-tag-badge about-tag-badge-light">[ MISSION / МІСІЯ ]</span>
            <h2 className="about-mission-title">Дизайн може починатися інакше.</h2>
            <p className="about-mission-desc">
              Ми віримо, що відповідальний дизайн — це не окрема стилістика, а спосіб мислення. Тому в NEXYLVA студенти вчаться бачити цінність у вже наявних ресурсах, працювати з матеріалами свідомо та створювати рішення, які мають довший життєвий цикл.
            </p>
          </div>
          <div className="about-mission-art-wrap">
            <img
              src="/about/about_mission_art.webp"
              alt="Mission Shapes"
            />
          </div>
        </div>
      </section>

      <div className="about-pad-container">
        
        <section className="about-story-section">
          <div className="about-story-media">
            <img
              src="/about/about_story_art.webp"
              alt="NEXYLVA Story Vase"
            />
          </div>

          <div className="about-story-content">
            <span className="about-tag-badge">[ WHY NEXYLVA / ЧОМУ NEXYLVA ]</span>
            <h2>Від питання до платформи.</h2>
            <p>
              NEXYLVA почалася з простого питання: чому дизайн часто вчить створювати нове, але значно рідше — працювати з тим, що вже є?
            </p>
            <p>
              Ми створили платформу, де сталий підхід стає частиною самого процесу навчання: від першого дослідження до фінального проєкту, презентації та портфоліо.
            </p>
            <div className="about-story-quote">
              <blockquote>
                «Ми не навчаємо робити “еко-дизайн”. Ми навчаємо приймати сильніші дизайнерські рішення.»
              </blockquote>
              <span className="about-quote-mark" aria-hidden="true">““</span>
            </div>
          </div>
        </section>

        <section className="about-approach-section" id="approach">
          <span className="about-tag-badge">[ OUR APPROACH / НАШ ПІДХІД ]</span>
          <div className="about-approach-layout">
            <div className="about-approach-left">
              <h2>Не тільки дивитися.<br />Пробувати.</h2>
              <p>
                Кожен курс побудований так, щоб студент не просто споживав інформацію, а проходив повний шлях дизайнера — від аналізу до власного аргументованого рішення.
              </p>

              <div className="about-approach-metrics">
                <div className="about-app-metric">
                  <span className="num">70%</span>
                  <span className="label">практики</span>
                </div>
                <div className="about-app-metric">
                  <span className="num">4</span>
                  <span className="label">етапи</span>
                </div>
                <div className="about-app-metric">
                  <span className="num">1:1</span>
                  <span className="label">фідбек</span>
                </div>
              </div>
            </div>

            <div className="about-approach-visual">
              <img
                src="/about/about_approach_girl.webp"
                alt="Дослідження матеріалів"
                className="about-approach-girl-img"
              />
            </div>

            <div className="about-steps-list">
              <div className="about-step-card">
                <span className="num">01</span>
                <div>
                  <h4>Дослідження</h4>
                  <p>Проблема, контекст, користувач, матеріал і реальні обмеження.</p>
                </div>
              </div>

              <div className="about-step-card">
                <span className="num">02</span>
                <div>
                  <h4>Робота з ментором</h4>
                  <p>Фідбек не після завершення, а протягом усього процесу створення.</p>
                </div>
              </div>

              <div className="about-step-card">
                <span className="num">03</span>
                <div>
                  <h4>Проєкт замість тесту</h4>
                  <p>Результатом навчання стає робота, яку можна показати в портфоліо.</p>
                </div>
              </div>

              <div className="about-step-card">
                <span className="num">04</span>
                <div>
                  <h4>Обмін досвідом</h4>
                  <p>Студентські роботи стають частиною спільноти та джерелом нових ідей.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="about-team-section">
          <div className="about-team-header">
            <span className="about-tag-badge">[ PEOPLE BEHIND NEXYLVA / КОМАНДА ]</span>
            <div className="about-team-title-row">
              <h2 className="about-team-title">Люди, які створюють NEXYLVA</h2>
              <p className="about-team-sub">
                NEXYLVA створюють дизайнери, викладачі, дослідники матеріалів і фахівці, які працюють на перетині освіти, технологій та сталого розвитку.
              </p>
            </div>
          </div>

          <div className="about-team-grid">
            {TEAM.map((member) => (
              <div key={member.id} className="about-team-card">
                <div className="about-team-photo-wrap">
                  <img src={member.photo} alt={member.name} className="about-team-photo" />
                </div>
                <div className="about-team-info">
                  <span className="about-team-badge">[ {member.badge} ]</span>
                  <div className="about-team-name">{member.name}</div>
                  <div className="about-team-desc">{member.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-numbers-bar">
          <div className="about-bar-col">
            <span className="about-bar-val">186+</span>
            <span className="about-bar-label">активних студентів</span>
          </div>
          <div className="about-bar-col">
            <span className="about-bar-val">428</span>
            <span className="about-bar-label">студентських проєктів</span>
          </div>
          <div className="about-bar-col">
            <span className="about-bar-val">24</span>
            <span className="about-bar-label">ментори та експерти</span>
          </div>
          <div className="about-bar-col">
            <span className="about-bar-val">12</span>
            <span className="about-bar-label">партнерських ініціатив</span>
          </div>
        </section>

        <section className="about-cta-banner">
          <div className="about-cta-text">
            <span className="about-cta-badge">[ NEXYLVA COMMUNITY / СПІЛЬНОТА NEXYLVA ]</span>
            <h2 className="about-cta-title">Навчайся створювати усвідомлено.</h2>
            <p className="about-cta-sub">
              Обирай напрям, працюй із менторами та перетворюй знання на реальні проєкти.
            </p>
          </div>
          <div className="about-cta-btn-wrap">
            <Link to="/courses" className="about-cta-btn">
              <span>Переглянути курси &rarr;</span>
            </Link>
          </div>
          <div className="about-cta-visual">
            <img
              src="/about/about_banner_girl.webp"
              alt="NEXYLVA Community Girl"
              className="about-cta-character"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
