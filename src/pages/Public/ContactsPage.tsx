import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ContactsPage.css';

interface TopicOption {
  id: string;
  title: string;
  desc: string;
}

const TOPICS: TopicOption[] = [
  { id: 'study', title: 'Навчання', desc: 'Курси, програма, ментори, сертифікати.' },
  { id: 'payment', title: 'Оплата', desc: 'Платежі, рахунки та підтвердження.' },
  { id: 'partnership', title: 'Партнерство', desc: 'Спільні проєкти та освітні ініціативи.' },
  { id: 'tech', title: 'Технічна підтримка', desc: 'Вхід, профіль, завантаження та помилки.' },
];

export const ContactsPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('study');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
    }, 2500);
  };

  return (
    <div className="contacts-page">
      <nav className="contacts-breadcrumbs" aria-label="breadcrumb">
        <Link to="/">Головна</Link>
        <span>&gt;</span>
        <span className="active">Контакти</span>
      </nav>

      <section className="contacts-hero-grid">
        <div className="contacts-hero-left">
          <div className="contacts-tag-badge">[ CONTACT NEXYLVA / КОНТАКТИ ]</div>
          <h1 className="contacts-hero-title">
            Є питання?<br />Ми на зв’язку.
          </h1>
          <p className="contacts-hero-desc">
            Напишіть нам про навчання, партнерство, оплату або роботу платформи. Команда NEXYLVA допоможе знайти потрібну відповідь або скерує до відповідного фахівця.
          </p>

          <div className="contacts-hero-stats">
            <div className="contacts-stat-card">
              <span className="contacts-stat-label">EMAIL</span>
              <a href="mailto:support@nexylva.com" className="contacts-stat-val">support@nexylva.com</a>
            </div>
            <div className="contacts-stat-card">
              <span className="contacts-stat-label">ТЕЛЕФОН</span>
              <a href="tel:+3805550121" className="contacts-stat-val">(+380) 555-01-21</a>
            </div>
            <div className="contacts-stat-card">
              <span className="contacts-stat-label">ВІДПОВІДЬ</span>
              <span className="contacts-stat-val">до 24 годин</span>
            </div>
          </div>
        </div>

        <div className="contacts-hero-art-card">
          <img
            src="/contacts/contacts_hero_art.webp"
            alt="NEXYLVA Support Team"
            className="contacts-hero-art-img"
          />
        </div>
      </section>

      <section className="contacts-form-section">
        <div className="contacts-form-grid">
          <div className="contacts-form-info">
            <div className="contacts-tag-badge">[ SEND A MESSAGE / НАПИСАТИ НАМ ]</div>
            <h2>Розкажіть, з чим потрібна допомога.</h2>
            <p>
              Оберіть тему звернення і залиште повідомлення. Так ми швидше передамо запит тій людині, яка зможе фахово допомогти.
            </p>

            <div className="contacts-topic-grid">
              {TOPICS.map((topic) => (
                <button
                  type="button"
                  key={topic.id}
                  className={`contacts-topic-card ${selectedTopic === topic.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <span className="contacts-topic-title">{topic.title}</span>
                  <span className="contacts-topic-desc">{topic.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="contacts-form-container">
            {submitted ? (
              <div className="contacts-success-banner" style={{ padding: '24px', background: '#97AE9F', color: '#0A2D1B', borderRadius: '8px', fontWeight: 500 }}>
                ✓ Дякуємо за звернення! Ми отримали ваше повідомлення і відповімо протягом найближчого робочого дня.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="contacts-form-row">
                  <div className="contacts-form-group">
                    <label className="contacts-form-label">Ім’я*</label>
                    <input
                      type="text"
                      className="contacts-input"
                      placeholder="Ваше ім’я"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="contacts-form-group">
                    <label className="contacts-form-label">Email*</label>
                    <input
                      type="email"
                      className="contacts-input"
                      placeholder="name@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="contacts-form-group" style={{ marginTop: '20px' }}>
                  <label className="contacts-form-label">Повідомлення*</label>
                  <textarea
                    className="contacts-input contacts-textarea"
                    placeholder="Опишіть ваше питання або ситуацію..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <div className="contacts-form-footer">
                  <label className="contacts-privacy-label">
                    <input
                      type="checkbox"
                      className="contacts-privacy-checkbox"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      required
                    />
                    Погоджуюсь з умовами та політикою конфіденційності
                  </label>

                  <button type="submit" className="contacts-submit-btn">
                    <span>Надіслати повідомлення</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="contacts-channels-section">
        <div className="contacts-tag-badge">[ CONTACT OPTIONS / ЯК НАС ЗНАЙТИ ]</div>
        <div className="contacts-channels-header">
          <h2>Оберіть зручний спосіб</h2>
          <div className="contacts-channels-subtext">
            Для різних питань — зручні канали. Так відповідь приходить швидше, а запит не губиться між командами.
          </div>
        </div>

        <div className="contacts-channels-grid">
          <div className="contacts-channel-card">
            <span className="contacts-channel-title">Email</span>
            <a href="mailto:support@nexylva.com" className="contacts-channel-contact">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>support@nexylva.com</span>
            </a>
            <span className="contacts-channel-desc">Загальні питання та підтримка.</span>
          </div>

          <div className="contacts-channel-card">
            <span className="contacts-channel-title">Телефон</span>
            <a href="tel:+3805550121" className="contacts-channel-contact">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>(+380) 555-01-21</span>
            </a>
            <span className="contacts-channel-desc">Пн–Пт, 09:00–18:00.</span>
          </div>

          <div className="contacts-channel-card">
            <span className="contacts-channel-title">Соціальні мережі</span>
            <div className="contacts-social-links">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <a href="https://instagram.com/nexylva" target="_blank" rel="noreferrer">Instagram</a>
              <span>•</span>
              <a href="https://behance.net/nexylva" target="_blank" rel="noreferrer">Behance</a>
              <span>•</span>
              <a href="https://linkedin.com/company/nexylva" target="_blank" rel="noreferrer">LinkedIn</a>
              <span>•</span>
              <a href="https://youtube.com/@nexylva" target="_blank" rel="noreferrer">YouTube</a>
            </div>
            <span className="contacts-channel-desc">Новини, проєкти та життя спільноти.</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactsPage;
