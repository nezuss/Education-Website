import React from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../styles/ArticleDetailsPage.css';

interface ArticleData {
  tag: string;
  readTime: string;
  title: string;
  desc: string;
  date: string;
  category: string;
  image: string;
  dropcapLetter: string;
  firstParagraph: string;
  secondParagraph: string;
  sidebarSummary: string;
  step1: { name: string; desc: string };
  step2: { name: string; desc: string };
  step3: { name: string; desc: string };
  step4: { name: string; desc: string };
  keynote: string;
  quote: string;
  designerHeading: string;
  designerP1: string;
  designerP2: string;
}

const ARTICLES_DATABASE: Record<string, ArticleData> = {
  'algae-bioplastics': {
    tag: '[ 03 / МАТЕРІАЛИ ]',
    readTime: '8 хв. читання • LCA',
    title: 'Біопластик з водоростей: майбутнє екологічного пакування',
    desc: 'Як природна сировина перетворюється на матеріал для нового покоління продуктів — і яку роль у цьому відіграє дизайнер.',
    date: '12 серпня 2026',
    category: 'Матеріали',
    image: '/article/article_hero_art.webp',
    dropcapLetter: 'Д',
    firstParagraph: 'изайн майбутнього починається не з форми, а з питання: з чого ця форма буде створена? Біоматеріали змінюють підхід до пакування, предметного дизайну та виробництва, дозволяючи розглядати матеріал як частину життєвого циклу продукту.',
    secondParagraph: 'Водорості цікаві дизайнерам як відновлювана сировина. У дослідницьких проєктах їх використовують для створення біополімерних матеріалів, плівок і формованих об\'єктів.',
    sidebarSummary: 'Відновлювана сировина, нові сценарії пакування, прототипування та оцінка життєвого циклу.',
    step1: { name: 'Сировина', desc: 'Вирощування та збір біологічної сировини.' },
    step2: { name: 'Обробка', desc: 'Підготовка компонентів майбутнього матеріалу.' },
    step3: { name: 'Матеріал', desc: 'Формування плівок, листів або об\'ємних форм.' },
    step4: { name: 'Продукт', desc: 'Прототипування пакування та дизайнерських об\'єктів.' },
    keynote: 'походження → виробництво → використання → наступний цикл',
    quote: '«Хороший матеріал не закінчує життя продукту — він відкриває наступний цикл.»',
    designerHeading: 'Що це змінює для дизайнера?',
    designerP1: 'Дизайнер працює не лише з естетикою. Він оцінює походження матеріалу, сценарій використання, можливість повторного циклу та спосіб виробництва.',
    designerP2: 'Матеріалознавство, LCA та прототипування стають частиною сучасного sustainable design workflow.'
  },
  'lca-ui-ux': {
    tag: '[ 01 / LCA ]',
    readTime: '6 хв. читання • UI/UX',
    title: 'LCA у цифровому дизайні: як зменшити цифровий слід інтерфейсів',
    desc: 'Методологія оцінки життєвого циклу сайтів і мобільних додатків: оптимізація медіа, енергоефективна типографіка та темні теми.',
    date: '18 серпня 2026',
    category: 'LCA',
    image: '/article/art_rel_3.webp',
    dropcapLetter: 'Ц',
    firstParagraph: 'ифрові продукти здаються невагомими, але дата-центри споживають гігавати електроенергії. Кожен важкий скрипт, неоптимізований шрифт або автоплей відео залишає вуглецевий слід у глобальній мережі.',
    secondParagraph: 'LCA у веб-розробці допомагає дизайнерам виміряти викиди грамів CO2 на кожен перегляд сторінки й приймати обґрунтовані рішення щодо архітектури.',
    sidebarSummary: 'Цифрова екологія, зелений хостинг, скорочення трафіку та мінімалістична архітектура.',
    step1: { name: 'Аудит', desc: 'Вимірювання ваги сторінки та кліматичного сліду.' },
    step2: { name: 'Оптимізація', desc: 'Стиснення ассетів, ліниве завантаження та кеш.' },
    step3: { name: 'Архітектура', desc: 'Енергоефективні кольори та SVG-графіка.' },
    step4: { name: 'Валідація', desc: 'Сертифікація за стандартом Sustainable Web Design.' },
    keynote: 'мінімізація байтів → зелений хостинг → висока швидкість → менше енергії',
    quote: '«Найкращий код та інтерфейс — це ті, що передають максимум сенсу при мінімумі витрачених ват.»',
    designerHeading: 'Як розробляти чисті інтерфейси?',
    designerP1: 'Веб-дизайнери нового покоління враховують вплив кожного пікселя та запиту до сервера на загальну енергоємність системи.',
    designerP2: 'Легкі шрифти, оптимізовані палітри та відсутність зайвих анімацій роблять продукти швидшими та доступнішими.'
  },
  'eco-trends': {
    tag: '[ 04 / ТРЕНДБУКИ ]',
    readTime: '10 хв. читання • Тренди',
    title: 'Еко-тренди 2026: від естетики сталого розвитку до реальної циркулярності',
    desc: 'Огляд провідних підходів до сталого дизайну, нових бізнес-моделей та вимог європейської директиви щодо еко-дизайну.',
    date: '25 серпня 2026',
    category: 'Трендбуки',
    image: '/article/art_rel_2.webp',
    dropcapLetter: 'С',
    firstParagraph: 'талий дизайн остаточно виріс із простого грінвошингу й паперових крафтових пакетів. У 2026 році на перший план виходять прозорі ланцюжки постачання, паспорти продуктів і право на ремонт.',
    secondParagraph: 'Світові бренди переходять на принципи циркулярної економіки, де кожен елемент конструкції призначений для легкого демонтажу та повторного використання.',
    sidebarSummary: 'Регуляторні норми ЄС, паспорти матеріалів, модульність та довговічність виробів.',
    step1: { name: 'Концепція', desc: 'Планування ремонтопридатності на стадії ідеї.' },
    step2: { name: 'Матеріали', desc: 'Вибір моно-матеріалів для простоти переробки.' },
    step3: { name: 'Модульність', desc: 'Конструкція без клею зі знімними з\'єднаннями.' },
    step4: { name: 'Сервіс', desc: 'Модель підписки та зворотного викупу (Take-back).' },
    keynote: 'модульність → ремонтопридатність → прозорість → кругообіг',
    quote: '«Справжня екологічність — це коли річ служить десятиліттями або стає ресурсом для нового виробу без деградації якості.»',
    designerHeading: 'Нова роль дизайнера у бізнесі',
    designerP1: 'Дизайнер стає архітектором життєвого циклу, який веде діалог з інженерами, логістами та кінцевими користувачами.',
    designerP2: 'Розуміння циркулярних бізнес-моделей стає ключовою перевагою на міжнародному ринку праці.'
  }
};

export const ArticleDetailsPage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const article = (articleId && ARTICLES_DATABASE[articleId]) ? ARTICLES_DATABASE[articleId] : ARTICLES_DATABASE['algae-bioplastics'];

  return (
    <div className="article-page">
      <nav className="article-breadcrumbs" aria-label="breadcrumb">
        <Link to="/">Головна</Link>
        <span>&gt;</span>
        <Link to="/journal">Еко-журнал</Link>
        <span>&gt;</span>
        <span>{article.category}</span>
        <span>&gt;</span>
        <span className="active">{article.title}</span>
      </nav>

      <div className="article-top-meta">
        <span className="article-tag-badge">{article.tag}</span>
        <span className="article-read-time">{article.readTime}</span>
      </div>

      <section className="article-hero-grid">
        <div className="article-hero-content">
          <h1 className="article-hero-title">
            {article.title}
          </h1>
          <p className="article-hero-desc">
            {article.desc}
          </p>
          <div className="article-pub-info">
            <span>{article.date}</span>
            <span>•</span>
            <span>Дослідження NEXYLVA</span>
            <span>•</span>
            <span>{article.category}</span>
          </div>
        </div>

        <div className="article-hero-media">
          <img
            src={article.image}
            alt={article.title}
            className="article-hero-img"
          />
        </div>
      </section>

      <section className="article-intro-grid">
        <div className="article-dropcap-block">
          <div className="article-dropcap">{article.dropcapLetter}</div>
          <div className="article-dropcap-text">
            <p>{article.firstParagraph}</p>
            <p>{article.secondParagraph}</p>
          </div>
        </div>

        <div className="article-sidebar-summary">
          <h3 className="article-sidebar-title">Коротко про тему</h3>
          <p className="article-sidebar-desc">
            {article.sidebarSummary}
          </p>
        </div>
      </section>

      <section className="article-process-section">
        <div className="article-tag-badge">[ ПРОЦЕС / 04 ]</div>
        <div className="article-process-header">
          <h2 className="article-process-title">Від сировини до нового продукту</h2>
          <div className="article-process-sub">
            Покроковий ланцюг створення цінності та замкненого життєвого циклу.
          </div>
        </div>

        <div className="article-process-steps-card">
          <div className="article-step-col">
            <div className="article-step-num">01</div>
            <div className="article-step-name">{article.step1.name}</div>
            <div className="article-step-desc">{article.step1.desc}</div>
          </div>
          <div className="article-step-col">
            <div className="article-step-num">02</div>
            <div className="article-step-name">{article.step2.name}</div>
            <div className="article-step-desc">{article.step2.desc}</div>
          </div>
          <div className="article-step-col">
            <div className="article-step-num">03</div>
            <div className="article-step-name">{article.step3.name}</div>
            <div className="article-step-desc">{article.step3.desc}</div>
          </div>
          <div className="article-step-col">
            <div className="article-step-num">04</div>
            <div className="article-step-name">{article.step4.name}</div>
            <div className="article-step-desc">{article.step4.desc}</div>
          </div>
        </div>
      </section>

      <section className="article-key-quote-row">
        <div className="article-keynote-box">
          <div className="article-keynote-tag">
            КЛЮЧОВА<br />ДУМКА
          </div>
          <div className="article-keynote-text">
            Матеріал — це не просто оболонка продукту.<br />
            У сталому дизайні він стає частиною системи:<br />
            <strong>{article.keynote}</strong>
          </div>
        </div>

        <div className="article-quote-box">
          <blockquote>
            {article.quote}
          </blockquote>
          <span className="article-quote-author">NEXYLVA / Sustainable Design Notes</span>
        </div>
      </section>

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
          <h2>{article.designerHeading}</h2>
          <p>{article.designerP1}</p>
          <p>{article.designerP2}</p>

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
              <h3 className="article-related-card-title">Біопластик з водоростей</h3>
              <div className="article-related-card-footer">
                <span>Матеріали • 8 хв. читання</span>
                <span>★ 4,9 (150)</span>
              </div>
            </div>
          </Link>

          <Link to="/journal/eco-trends" className="article-related-card">
            <img
              src="/article/art_rel_2.webp"
              alt="Zero-Waste packaging"
              className="article-related-thumb"
            />
            <div className="article-related-body">
              <h3 className="article-related-card-title">Еко-тренди 2026: циркулярність</h3>
              <div className="article-related-card-footer">
                <span>Трендбуки • 10 хв. читання</span>
                <span>★ 4,8 (298)</span>
              </div>
            </div>
          </Link>

          <Link to="/journal/lca-ui-ux" className="article-related-card">
            <img
              src="/article/art_rel_3.webp"
              alt="Circular product design"
              className="article-related-thumb"
            />
            <div className="article-related-body">
              <h3 className="article-related-card-title">LCA у цифровому дизайні</h3>
              <div className="article-related-card-footer">
                <span>LCA • 6 хв. читання</span>
                <span>★ 5,0 (632)</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="article-cta-banner">
        <div>
          <h2 className="article-cta-title">Хочете створювати екологічні рішення?</h2>
          <p className="article-cta-desc">
            Перейдіть від досліджень до практики у навчальних програмах NEXYLVA.
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
