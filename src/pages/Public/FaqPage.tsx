import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/FaqPage.css';

interface TopicItem {
  id: string;
  num: string;
  name: string;
  desc: string;
}

const FAQ_TOPICS: TopicItem[] = [
  { id: 'study', num: '01', name: 'Навчання та курси', desc: 'Програма, модулі, дедлайни, ментори та сертифікати' },
  { id: 'payment', num: '02', name: 'Оплата', desc: 'Способи оплати, підтвердження платежу та повернення.' },
  { id: 'profile', num: '03', name: 'Профіль та акаунт', desc: 'Вхід, пароль, налаштування профілю та особисті дані.' },
  { id: 'tech', num: '04', name: 'Технічні питання', desc: 'Відео, завантаження файлів, помилки та робота кабінету.' },
];

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_QUESTIONS: FaqItem[] = [
  {
    id: '1',
    category: 'payment',
    question: 'Як почати навчання після оплати?',
    answer: 'Після успішної оплати курс автоматично з’явиться у розділі «Мої курси». Якщо цього не сталося протягом кількох хвилин, онови сторінку або перевір статус платежу.'
  },
  {
    id: '2',
    category: 'study',
    question: 'Чи можна проходити курс у власному темпі?',
    answer: 'Так, усі лекційні матеріали доступні 24/7. Ви можете навчатися за зручним графіком, враховуючи лише дедлайни здачі практичних робіт на перевірку ментору.'
  },
  {
    id: '3',
    category: 'study',
    question: 'Як працює фідбек від ментора?',
    answer: 'Після виконання домашнього завдання завантажте матеріали в кабінеті студента. Ментор залишить детальний відео- чи текстовий розбір протягом 48 годин.'
  },
  {
    id: '4',
    category: 'profile',
    question: 'Де завантажити сертифікат?',
    answer: 'Після завершення всіх модулів та успішного захисту фінального проєкту ваш іменний сертифікат генерується автоматично у вкладці «Профіль» у форматі PDF.'
  },
  {
    id: '5',
    category: 'tech',
    question: 'Що робити, якщо не відкривається відео?',
    answer: 'Перевірте швидкість інтернет-з’єднання та вимкніть сторонні блокувальники реклами для платформи. Якщо проблема не зникає, очистіть кеш браузера або зверніться до підтримки.'
  },
  {
    id: '6',
    category: 'payment',
    question: 'Чи можна повернути оплату за курс?',
    answer: 'Повернення коштів можливе протягом 14 календарних днів з моменту придбання за умови, що ви пройшли не більше 20% матеріалів курсу.'
  },
  {
    id: '7',
    category: 'profile',
    question: 'Як змінити пароль або контактний email?',
    answer: 'Перейдіть у розділ «Особистий кабінет» -> «Профіль». У вкладці безпеки ви можете оновити пароль або зв\'язати акаунт з новою електронною поштою.'
  },
  {
    id: '8',
    category: 'tech',
    question: 'Які технічні вимоги до пристрою для проходження курсів?',
    answer: 'Достатньо будь-якого сучасного комп’ютера чи планшета з оновленим браузером (Chrome, Safari, Firefox або Edge) та стабільним підключенням до Інтернету.'
  }
];

export const FaqPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('study');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ '2': true, '3': true });

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleTopicClick = (topicId: string) => {
    if (selectedTopic === topicId) {
      setSelectedTopic('');
    } else {
      setSelectedTopic(topicId);
    }
  };

  const filteredQuestions = FAQ_QUESTIONS.filter((item) => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (searchQuery.trim().length > 0) {
      return matchesSearch;
    }

    if (!selectedTopic) return true;
    return item.category === selectedTopic;
  });

  return (
    <div className="faq-page">
      <div className="faq-container">
        <nav className="faq-breadcrumbs" aria-label="breadcrumb">
          <Link to="/">Головна</Link>
          <span>&gt;</span>
          <span className="active">FAQ / Підтримка</span>
        </nav>

        <section className="faq-hero-grid">
          <div className="faq-hero-left">
            <div className="faq-tag-badge">[ FAQ & SUPPORT / FAQ ТА ПІДТРИМКА ]</div>
            <h1 className="faq-hero-title">
              Знайди відповідь без зайвого очікування.
            </h1>
            <p className="faq-hero-desc">
              Зібрали найчастіші питання про навчання, оплату, профіль, сертифікати та роботу платформи. Почни з пошуку або обери потрібну тему.
            </p>

            <form
              className="faq-search-wrapper"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                type="text"
                className="faq-search-input"
                placeholder="Пошук за питанням або словом..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="faq-search-btn" aria-label="Пошук">
                <span>Знайти</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>
          </div>

          <div className="faq-hero-art">
            <img
              src="/faq/faq_hero_art.webp"
              alt="NEXYLVA Knowledge Base"
              className="faq-hero-img"
            />
          </div>
        </section>

        <section className="faq-topics-section">
          <div className="faq-tag-badge">[ SUPPORT TOPICS / ТЕМИ ПІДТРИМКИ ]</div>
          <div className="faq-topics-header">
            <h2 className="faq-topics-title">З чим допомогти?</h2>
            <div className="faq-topics-subtitle">
              Натисніть на категорію нижче, щоб відфільтрувати часті запитання або скористайтеся рядком пошуку вгорі.
            </div>
          </div>

          <div className="faq-topics-grid">
            {FAQ_TOPICS.map((topic) => (
              <button
                type="button"
                key={topic.id}
                className={`faq-topic-card ${selectedTopic === topic.id ? 'active' : ''}`}
                onClick={() => handleTopicClick(topic.id)}
              >
                <div className="faq-topic-number">{topic.num}</div>
                <div className="faq-topic-name">{topic.name}</div>
                <div className="faq-topic-desc">{topic.desc}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="faq-questions-section">
          <div className="faq-tag-badge">[ POPULAR QUESTIONS / ПОПУЛЯРНІ ПИТАННЯ ]</div>
          <div className="faq-questions-grid">
            <div className="faq-questions-intro">
              <h2>Найчастіше запитують</h2>
              <p>
                Не знайшли потрібної відповіді? Нижче є прямий зв’язок із нашою підтримкою — ми відповідаємо оперативно.
              </p>
              <img
                src="/faq/faq_assistant.webp"
                alt="Assistant with Questions"
                className="faq-questions-assistant-img"
              />
            </div>

            <div className="faq-accordion-list">
              {filteredQuestions.length === 0 ? (
                <div style={{ padding: '24px', background: '#F4ECE4', borderRadius: '8px', color: '#6A7D71' }}>
                  За вашим запитом нічого не знайдено. Спробуйте змінити фільтр або пошуковий термін.
                </div>
              ) : (
                filteredQuestions.map((q) => {
                  const isOpen = !!openIds[q.id];
                  return (
                    <div key={q.id} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                      <button
                        type="button"
                        className="faq-accordion-trigger"
                        onClick={() => toggleAccordion(q.id)}
                      >
                        <span>{q.question}</span>
                        <svg
                          className="faq-accordion-icon"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="faq-accordion-body">
                          {q.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <section className="faq-unresolved-card">
          <div className="faq-unresolved-img-wrap">
            <img
              src="/faq/faq_notebook.webp"
              alt="Still life study note"
              className="faq-unresolved-img"
            />
          </div>

          <div className="faq-unresolved-content">
            <div className="faq-tag-badge">[ CONTACT SUPPORT / ЗВ'ЯЗАТИСЯ З ПІДТРИМКОЮ ]</div>
            <h2>Не знайшли своєї відповіді?</h2>
            <p>
              Напишіть команді NEXYLVA. Опишіть питання коротко й додайте деталі, якщо вони важливі — так ми швидше допоможемо вирішити його.
            </p>

            <div className="faq-unresolved-metrics">
              <div className="faq-unresolved-metric-pill">
                <span className="faq-unresolved-metric-label">Email</span>
                <span className="faq-unresolved-metric-val">Загальні питання та підтримка.</span>
              </div>
              <div className="faq-unresolved-metric-pill">
                <span className="faq-unresolved-metric-label">Час відповіді</span>
                <span className="faq-unresolved-metric-val">до 24 годин у робочі дні</span>
              </div>
            </div>

            <Link to="/contacts" className="faq-write-support-btn">
              <span>Написати в підтримку</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </section>

        <section className="faq-resources-section">
          <div className="faq-tag-badge" style={{ color: '#E0D3C7' }}>[ USEFUL RESOURCES / КОРИСНІ МАТЕРІАЛИ ]</div>
          <div className="faq-resources-header">
            <h2 className="faq-resources-title">Можливо, це теж допоможе</h2>
            <div className="faq-resources-subtitle">
              Короткі інструкції та довідкові сторінки для типових ситуацій під час навчання.
            </div>
          </div>

          <div className="faq-resources-grid">
            <Link to="/student" className="faq-resource-card">
              <span className="faq-resource-badge">01 / GUIDE</span>
              <h3>Як працює особистий кабінет</h3>
              <p>Основні розділи, прогрес, завдання та повідомлення.</p>
            </Link>

            <Link to="/student/courses" className="faq-resource-card">
              <span className="faq-resource-badge">02 / GUIDE</span>
              <h3>Завантаження проєкту</h3>
              <p>Формати файлів, обмеження та правила подачі роботи.</p>
            </Link>

            <Link to="/courses" className="faq-resource-card">
              <span className="faq-resource-badge">03 / POLICY</span>
              <h3>Оплата та повернення</h3>
              <p>Умови платежів, підтвердження та повернення коштів.</p>
            </Link>
          </div>
        </section>

        <section className="faq-bottom-banner">
          <div className="faq-bottom-banner-text">
            <div className="faq-tag-badge">[ NEXYLVA SUPPORT / ПІДТРИМКА NEXYLVA ]</div>
            <h2 className="faq-bottom-banner-title">
              Ми поруч, коли потрібна допомога.
            </h2>
            <p className="faq-bottom-banner-desc">
              Якщо відповідь не знайшлася у FAQ, звертайтеся напряму — команда підтримки допоможе розібратися.
            </p>
          </div>

          <Link to="/contacts" className="faq-bottom-contact-btn">
            <span>Зв'язатися з нами</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>

          <img
            src="/faq/faq_banner_girl.webp"
            alt="Support character"
            className="faq-bottom-banner-art"
          />
        </section>
      </div>
    </div>
  );
};

export default FaqPage;
