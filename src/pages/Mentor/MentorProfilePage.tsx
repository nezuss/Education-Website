import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/MentorPortal.css";

export default function MentorProfilePage() {
  const [editing, setEditing] = useState(false);

  return (
    <div className="mentor-container">
      
      <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
        <Link to="/mentor" style={{ color: "inherit", textDecoration: "none" }}>Головна</Link>
        {" > "}
        <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>Профіль ментора</span>
      </div>

      <header className="mentor-header">
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-warm)", letterSpacing: "0.05em", marginBottom: "4px" }}>
            [ НА ПЕРЕВІРЦІ ]
          </div>
          <h1 className="mentor-header-title">
            Профіль ментора
          </h1>
          <p className="mentor-header-sub">
            Керуй професійною інформацією, експертизою та переглядай свій внесок у розвиток студентів.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Зберегти зміни ✓" : "Редагувати профіль &rarr;"}
        </button>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "28px", marginBottom: "32px" }}>
        <div style={{ background: "#0A2D1B", color: "#FFFFFF", borderRadius: "var(--radius-lg)", padding: "36px", display: "flex", gap: "28px", alignItems: "center" }}>
          <img
            src="/student/mentor_mazur.webp"
            alt="Андрій Мельник"
            style={{ width: "160px", height: "160px", borderRadius: "20px", objectFit: "cover", flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#C2D1C9", letterSpacing: "0.05em", marginBottom: "6px" }}>
              [ MENTOR PROFILE / ПРОФІЛЬ ]
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 700, margin: "0 0 6px 0" }}>
              Андрій Мельник
            </h2>
            <div style={{ fontSize: "14px", color: "#AABDB3", marginBottom: "14px" }}>
              Ментор Sustainable & Circular Design
            </div>
            <p style={{ fontSize: "13px", color: "#E2ECE5", lineHeight: "1.5", margin: "0 0 20px 0" }}>
              Предметний дизайнер і дослідник circular design. Працює з повторним використанням матеріалів, біокомпозитами та дизайн-системами.
            </p>
            <div style={{ display: "flex", gap: "28px" }}>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "24px", fontWeight: 700 }}>6</div>
                <div style={{ fontSize: "12px", color: "#C2D1C9" }}>років досвіду</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "24px", fontWeight: 700 }}>124</div>
                <div style={{ fontSize: "12px", color: "#C2D1C9" }}>перевірені роботи</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "24px", fontWeight: 700 }}>4.8</div>
                <div style={{ fontSize: "12px", color: "#C2D1C9" }}>оцінка студентів</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: "#E8EFEA", border: "1px solid #C2D1C9", borderRadius: "var(--radius-lg)", padding: "36px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-secondary)", letterSpacing: "0.05em", marginBottom: "8px" }}>
              [ EXPERTISE / ЕКСПЕРТИЗА ]
            </div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, color: "var(--accent-primary)", margin: "0 0 10px 0" }}>
              Професійний фокус
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6", margin: "0 0 18px 0" }}>
              Допомагаю перетворювати дослідження матеріалів на функціональні дизайн-рішення та вчитися аргументувати кожен етап проєкту.
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span className="review-badge" style={{ background: "#FFFFFF" }}>Circular Design</span>
              <span className="review-badge" style={{ background: "#FFFFFF" }}>Biomaterials</span>
              <span className="review-badge" style={{ background: "#FFFFFF" }}>Product Design</span>
              <span className="review-badge" style={{ background: "#FFFFFF" }}>Upcycling</span>
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", borderTop: "1px solid #C2D1C9", paddingTop: "12px" }}>
            Сертифікований ментор платформи NEXYLVA з 2024 року
          </div>
        </div>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "36px" }}>
        <div className="mentor-metric-card">
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "4px" }}>
            СТУДЕНТІВ ЗАРАЗ
          </div>
          <div className="mentor-metric-value">32</div>
          <div className="mentor-metric-label">у 3 активних курсах</div>
        </div>

        <div className="mentor-metric-card">
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "4px" }}>
            СЕРЕДНЯ ОЦІНКА
          </div>
          <div className="mentor-metric-value">4.8 / 5</div>
          <div className="mentor-metric-label">за відгуками студентів</div>
        </div>

        <div className="mentor-metric-card">
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "4px" }}>
            FEEDBACK ЦЬОГО МІСЯЦЯ
          </div>
          <div className="mentor-metric-value">38</div>
          <div className="mentor-metric-label">завершених перевірок</div>
        </div>

        <div className="mentor-metric-card">
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "4px" }}>
            СЕРЕДНІЙ ЧАС
          </div>
          <div className="mentor-metric-value">34 хв</div>
          <div className="mentor-metric-label">на одну перевірку</div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "28px" }}>
        
        <div style={{ background: "#E8EFEA", borderRadius: "var(--radius-lg)", padding: "32px", border: "1px solid #C2D1C9" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, color: "var(--accent-primary)", margin: "0 0 24px 0" }}>
            Менторський шлях
          </h3>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "18px", borderBottom: "1px solid #C2D1C9", marginBottom: "18px" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent-warm)" }}>2026 — зараз</div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", margin: "2px 0" }}>
                NEXYLVA • Провідний ментор
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Сталий і циркулярний дизайн</div>
            </div>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent-primary)" }}>124 робіт</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "18px", borderBottom: "1px solid #C2D1C9", marginBottom: "18px" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent-warm)" }}>2024 — 2026</div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", margin: "2px 0" }}>
                Лабораторія циркулярних матеріалів
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Продуктовий дизайнер / Дослідник</div>
            </div>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent-primary)" }}>2 роки</span>
          </div>
        </div>

        <div style={{ background: "#F5EFEB", borderRadius: "var(--radius-lg)", padding: "32px", border: "1px solid #D8C7B9" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, color: "var(--accent-primary)", margin: "0 0 24px 0" }}>
            Напрями менторства
          </h3>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>
              <span>Циркулярний дизайн</span>
              <span style={{ color: "var(--accent-warm)" }}>експертний</span>
            </div>
            <div className="admin-course-progress-bar">
              <div className="admin-course-progress-fill" style={{ width: "95%" }}></div>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>
              <span>Матеріали та біокомпозити</span>
              <span style={{ color: "var(--accent-warm)" }}>експертний</span>
            </div>
            <div className="admin-course-progress-bar">
              <div className="admin-course-progress-fill" style={{ width: "90%" }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>
              <span>Продуктовий дизайн</span>
              <span style={{ color: "var(--accent-secondary)" }}>просунутий</span>
            </div>
            <div className="admin-course-progress-bar">
              <div className="admin-course-progress-fill" style={{ width: "80%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
