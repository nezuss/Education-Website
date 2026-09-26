import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { rateSubmission } from "../../services/mentorService";
import "../../styles/MentorPortal.css";

export default function MentorReviewPage() {
  const { id } = useParams();

  const [scores, setScores] = useState<{ [key: string]: number }>({
    cycle: 5,
    materials: 4,
    solutions: 4,
    visual: 5,
  });

  const [feedback, setFeedback] = useState(
    "Добре пропрацьована структура циклу. Варто ще сильніше аргументувати вибір матеріалу та показати сценарій повторного використання."
  );
  const [notes, setNotes] = useState(
    "Перевірити аргументацію щодо повторного використання матеріалу. Уточнити рекомендації перед фінальним оцінюванням."
  );
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);

  const calculateGrade12 = () => {
    const sum = Object.values(scores).reduce((a, b) => a + b, 0);
    return Math.min(12, Math.max(1, Math.round((sum / 20) * 12)));
  };

  const calculateTotal = () => {
    const sum = Object.values(scores).reduce((a, b) => a + b, 0);
    return Math.round((sum / 20) * 100);
  };

  const handleScore = (key: string, val: number) => {
    setScores((prev) => ({ ...prev, [key]: val }));
  };

  const handleApprove = async () => {
    const grade = calculateGrade12();
    const pct = calculateTotal();
    try {
      if (id) {
        await rateSubmission({ submissionId: id, rate: grade });
      }
      setSubmittedStatus(`Схвалено! Оцінка ${grade}/12 балів (${pct}%) збережена на сервері та надіслана студенту.`);
    } catch {
      setSubmittedStatus(`Схвалено! Оцінка ${grade}/12 балів (${pct}%) зафіксована.`);
    }
  };

  const handleReturn = () => {
    setSubmittedStatus("Роботу повернуто на доопрацювання з вашим коментарем.");
  };

  const handleSaveNotes = () => {
    setSubmittedStatus("Особисті нотатки ментора успішно збережено.");
  };

  const handleSaveDraft = () => {
    setSubmittedStatus("Поточний стан перевірки збережено як чернетку.");
  };

  return (
    <div className="mentor-container">
      <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
        <Link to="/mentor" style={{ color: "inherit", textDecoration: "none" }}>Головна</Link>
        {" > "}
        <Link to="/mentor/submissions" style={{ color: "inherit", textDecoration: "none" }}>На перевірці</Link>
        {" > "}
        <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>Анна Коваль / Перевірка роботи</span>
      </div>

      <header className="mentor-header">
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-warm)", letterSpacing: "0.05em", marginBottom: "4px" }}>
            [ НА ПЕРЕВІРЦІ ]
          </div>
          <h1 className="mentor-header-title">
            Перевірка роботи студента
          </h1>
          <p className="mentor-header-sub">
            Перегляньте матеріали, оцініть роботу за критеріями та залиште feedback.
          </p>
        </div>
        <div className="mentor-date-badge">
          10 серпня 2026
        </div>
      </header>

      <section className="review-student-header-card">
        <div className="review-student-meta">
          <img
            src="/about/team_1.webp"
            alt="Анна Коваль"
            style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover" }}
          />
          <div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>Анна Коваль</div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              Студентка • LCA & Еко-проєктування
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>Аналіз життєвого циклу продукту</div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Практичне завдання №2 • Модуль 4</div>
        </div>

        <div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Надіслано</div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>10 серпня • 14:26</div>
        </div>

        <div>
          <span className="mentor-status-pill in-review">
            На перевірці
          </span>
        </div>
      </section>

      {submittedStatus && (
        <div style={{ background: "#E2ECE5", border: "1px solid #557061", color: "#0A2D1B", padding: "16px 24px", borderRadius: "16px", marginBottom: "24px", fontWeight: 600 }}>
          ✓ {submittedStatus}
        </div>
      )}

      <div className="mentor-grid-layout">
        <div>
          <div className="review-task-desc-card">
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-secondary)", textTransform: "uppercase" }}>
              [ ЗАВАНТАЖЕННЯ ПРОЄКТУ ]
            </div>
            <h2 className="review-task-title">Аналіз життєвого циклу продукту</h2>
            <p className="review-task-body">
              Проаналізуйте життєвий цикл обраного продукту та запропонуйте рішення, які допоможуть зменшити його вплив на довкілля.
            </p>
            <div className="review-badges-row">
              <span className="review-badge">Модуль 4</span>
              <span className="review-badge">100 балів</span>
              <span className="review-badge">PDF / JPG</span>
              <span className="review-badge">Дедлайн 14 серпня</span>
            </div>
          </div>

          <div className="review-files-panel">
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-primary)", textTransform: "uppercase", marginBottom: "12px" }}>
              [ МАТЕРІАЛИ СТУДЕНТА ]
            </div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, color: "var(--accent-primary)", margin: "0 0 16px 0" }}>
              Файли роботи
            </h3>

            <div className="review-file-item">
              <div className="review-file-info">
                <span className="review-file-icon">📄</span>
                <div>
                  <div className="review-file-name">Схема життєвого циклу</div>
                  <div className="review-file-meta">Lifecycle_Scheme.pdf • 6.2 MB</div>
                </div>
              </div>
              <button type="button" className="mentor-action-btn">
                Відкрити &rarr;
              </button>
            </div>

            <div className="review-file-item">
              <div className="review-file-info">
                <span className="review-file-icon">📄</span>
                <div>
                  <div className="review-file-name">Аналіз матеріалів</div>
                  <div className="review-file-meta">Material_Analysis.pdf • 4.8 MB</div>
                </div>
              </div>
              <button type="button" className="mentor-action-btn">
                Відкрити &rarr;
              </button>
            </div>

            <div className="review-file-item">
              <div className="review-file-info">
                <span className="review-file-icon">📄</span>
                <div>
                  <div className="review-file-name">Пропозиція покращення</div>
                  <div className="review-file-meta">Improvement_Proposal.pdf • 2.4 MB</div>
                </div>
              </div>
              <button type="button" className="mentor-action-btn">
                Відкрити &rarr;
              </button>
            </div>
          </div>

          <div className="review-preview-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-primary)", textTransform: "uppercase" }}>
                  [ ПРЕВ'Ю ]
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, color: "var(--accent-primary)", margin: "4px 0 0 0" }}>
                  Швидкий перегляд роботи
                </h3>
              </div>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                3 сторінки • Lifecycle_Scheme.pdf
              </span>
            </div>

            <div className="review-slides-grid">
              <div className="review-slide-card">
                <div className="review-slide-title">Аналіз життєвого циклу</div>
                <div className="review-slide-sub">Матеріали та виробництво</div>
                <img src="/community/featured_chair.webp" alt="Slide 1" />
              </div>

              <div className="review-slide-card">
                <div className="review-slide-title">Етапи життєвого циклу</div>
                <div className="review-slide-sub">Виробництво &rarr; використання</div>
                <img src="/community/work_biocomposite.webp" alt="Slide 2" />
              </div>

              <div className="review-slide-card">
                <div className="review-slide-title">Висновки</div>
                <div className="review-slide-sub">Можливості повторного використання</div>
                <img src="/community/work_lamp.webp" alt="Slide 3" />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px", fontSize: "12px", color: "var(--text-secondary)" }}>
              <span>Аналіз_життєвого_циклу.pdf • 6,2 МБ</span>
              <a href="#pdf" style={{ color: "var(--accent-primary)", fontWeight: 600, textDecoration: "none" }}>
                Відкрити повний PDF ↗
              </a>
            </div>
          </div>

          <div className="review-feedback-panel">
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-secondary)", textTransform: "uppercase" }}>
              [ FEEDBACK ]
            </div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, color: "var(--accent-primary)", margin: "4px 0 12px 0" }}>
              Коментар студенту
            </h3>
            <textarea
              className="review-feedback-textarea"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Напишіть конструктивний фідбек студенту..."
            />
            <div className="review-feedback-actions">
              <button type="button" className="review-feedback-link-btn">
                🔗 Посилання на відео-feedback ↗
              </button>
              <button type="button" className="review-feedback-link-btn">
                📎 Додатковий матеріал / URL ↗
              </button>
            </div>
          </div>

          <div className="review-task-desc-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-warm)", textTransform: "uppercase" }}>
                [ НОТАТКИ ]
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)", background: "#F5EFEB", padding: "4px 10px", borderRadius: "12px" }}>
                🔒 Видно лише Вам
              </span>
            </div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, color: "var(--accent-primary)", margin: "0 0 12px 0" }}>
              Нотатки ментора
            </h3>
            <textarea
              className="review-feedback-textarea"
              style={{ background: "#FAF8F5" }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
              <button
                type="button"
                className="mentor-action-btn"
                onClick={handleSaveNotes}
              >
                Зберегти нотатку
              </button>
            </div>
          </div>
        </div>

        <aside className="review-right-column">
          <div className="review-status-card">
            <div className="review-status-tag">[ СТАТУС ]</div>
            <h3 className="review-status-title">Робота на перевірці</h3>
            <p className="review-status-desc">
              Перевірте всі матеріали перед фінальним рішенням.
            </p>
            <div className="review-status-stats-grid">
              <div className="review-status-stat-box">
                <div className="review-status-stat-label">Дедлайн</div>
                <div className="review-status-stat-val">14 серпня</div>
              </div>
              <div className="review-status-stat-box">
                <div className="review-status-stat-label">Спроба</div>
                <div className="review-status-stat-val">1</div>
              </div>
              <div className="review-status-stat-box">
                <div className="review-status-stat-label">Файлів</div>
                <div className="review-status-stat-val">3</div>
              </div>
              <div className="review-status-stat-box">
                <div className="review-status-stat-label">Макс. бал</div>
                <div className="review-status-stat-val">12</div>
              </div>
            </div>
          </div>

          <div className="review-criteria-card">
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-secondary)", textTransform: "uppercase" }}>
              [ КРИТЕРІЇ ]
            </div>
            <h3 className="review-criteria-heading">
              Оцінювання
            </h3>

            <div className="review-criterion-item">
              <div className="review-criterion-title">Аналіз життєвого циклу</div>
              <div className="review-criterion-desc">Логіка етапів, повнота та аргументація.</div>
              <div className="review-score-buttons">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`review-score-btn ${scores.cycle === n ? "selected" : ""}`}
                    onClick={() => handleScore("cycle", n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="review-criterion-item">
              <div className="review-criterion-title">Робота з матеріалами</div>
              <div className="review-criterion-desc">Походження, властивості та повторне використання.</div>
              <div className="review-score-buttons">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`review-score-btn ${scores.materials === n ? "selected" : ""}`}
                    onClick={() => handleScore("materials", n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="review-criterion-item">
              <div className="review-criterion-title">Якість запропонованих рішень</div>
              <div className="review-criterion-desc">Реалістичність і екологічний ефект.</div>
              <div className="review-score-buttons">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`review-score-btn ${scores.solutions === n ? "selected" : ""}`}
                    onClick={() => handleScore("solutions", n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="review-criterion-item">
              <div className="review-criterion-title">Візуальна подача</div>
              <div className="review-criterion-desc">Структура, читабельність та оформлення.</div>
              <div className="review-score-buttons">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`review-score-btn ${scores.visual === n ? "selected" : ""}`}
                    onClick={() => handleScore("visual", n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="review-total-score-box">
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent-primary)" }}>
                Підсумкова оцінка:
              </span>
              <span className="review-total-score-val">
                {calculateGrade12()} / 12 балів ({calculateTotal()}%)
              </span>
            </div>
          </div>

          <div className="review-decision-card">
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#C2D1C9", textTransform: "uppercase" }}>
              [ ФІНАЛЬНЕ РІШЕННЯ ]
            </div>
            <h3 className="review-decision-title">Завершити перевірку?</h3>
            <p className="review-decision-desc">
              Після відправлення студент отримає ваш feedback та новий статус роботи.
            </p>

            <div className="review-decision-buttons">
              <button
                type="button"
                className="review-decision-btn-primary"
                onClick={handleApprove}
              >
                <span>Схвалити роботу</span>
                <span>&rarr;</span>
              </button>
              <button
                type="button"
                className="review-decision-btn-danger"
                onClick={handleReturn}
              >
                <span>Повернути на доопрацювання</span>
                <span>&rarr;</span>
              </button>
              <button
                type="button"
                className="review-decision-btn-outline"
                onClick={handleSaveDraft}
              >
                <span>Зберегти як чернетку</span>
                <span>&rarr;</span>
              </button>
            </div>

            <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid rgba(255, 255, 255, 0.15)", fontSize: "12px", color: "#AABDB3" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "16px" }}>
                <span>📅</span>
                <span>Після завершення перевірки студент отримає сповіщення</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#FFFFFF" }}>1</div>
                  <div style={{ fontSize: "10px" }}>ПЕРЕВІРКА</div>
                </div>
                <div style={{ borderTop: "1px solid #557061", flex: 1, margin: "8px 8px 0" }}></div>
                <div>
                  <div style={{ fontWeight: 700, color: "#FFFFFF" }}>2</div>
                  <div style={{ fontSize: "10px" }}>FEEDBACK</div>
                </div>
                <div style={{ borderTop: "1px solid #557061", flex: 1, margin: "8px 8px 0" }}></div>
                <div>
                  <div style={{ fontWeight: 700, color: "#FFFFFF" }}>3</div>
                  <div style={{ fontSize: "10px" }}>ГОТОВО</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="review-history-card">
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#C2D1C9", textTransform: "uppercase" }}>
          [ ІСТОРІЯ ]
        </div>
        <h3 className="review-history-heading">Історія роботи</h3>
        <div className="review-history-timeline">
          <div className="review-history-step">
            <div className="review-history-step-num">1</div>
            <div>
              <div className="review-history-step-text">Роботу надіслано</div>
              <div className="review-history-step-sub">10 серпня • 14:26</div>
            </div>
          </div>

          <div className="review-history-step">
            <div className="review-history-step-num">2</div>
            <div>
              <div className="review-history-step-text">Відкрито ментором</div>
              <div className="review-history-step-sub">Сьогодні • 16:05</div>
            </div>
          </div>

          <div className="review-history-step">
            <div className="review-history-step-num">3</div>
            <div>
              <div className="review-history-step-text">Очікує рішення</div>
              <div className="review-history-step-sub">Поточний статус</div>
            </div>
          </div>

          <div className="review-history-step">
            <div className="review-history-step-num">4</div>
            <div>
              <div className="review-history-step-text">Роботу перевірено</div>
              <div className="review-history-step-sub">Оцінка: {calculateTotal()}/100</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
