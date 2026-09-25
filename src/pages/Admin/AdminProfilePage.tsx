import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/AdminPortal.css";

export default function AdminProfilePage() {
  const [twoFa, setTwoFa] = useState(true);
  const [editing, setEditing] = useState(false);

  return (
    <div className="admin-container">
      
      <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
        <Link to="/admin" style={{ color: "inherit", textDecoration: "none" }}>Головна</Link>
        {" > "}
        <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>Профіль адміністратора</span>
      </div>

      <header className="admin-header">
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-warm)", letterSpacing: "0.05em", marginBottom: "4px" }}>
            [ ADMIN PROFILE / ПРОФІЛЬ АДМІНІСТРАТОРА ]
          </div>
          <h1 className="admin-header-title">
            Профіль адміністратора
          </h1>
          <p className="admin-header-sub">
            Особисті дані, права доступу та активність адміністративного акаунта.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Зберегти профіль ✓" : "Редагувати профіль &rarr;"}
        </button>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "28px", marginBottom: "32px" }}>
        
        <div style={{ background: "#0A2D1B", color: "#FFFFFF", borderRadius: "var(--radius-lg)", padding: "36px", display: "flex", gap: "28px", alignItems: "center" }}>
          <img
            src="/admin/admin_avatar.webp"
            alt="Андрій Бондарчук"
            style={{ width: "240px", height: "160px", borderRadius: "16px", objectFit: "cover", flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <div className="admin-tag" style={{ color: "#C2D1C9" }}>[ ACCOUNT / АКАУНТ ]</div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 700, margin: "6px 0" }}>
              Андрій Бондарчук
            </h2>
            <div style={{ fontSize: "14px", color: "#AABDB3", marginBottom: "16px" }}>
              Головний адміністратор платформи NEXYLVA
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <span className="mentor-status-pill reviewed" style={{ background: "#1F2923" }}>Super Admin</span>
              <span className="mentor-status-pill new">Активний акаунт</span>
            </div>
            <div style={{ fontSize: "12px", color: "#C2D1C9", borderTop: "1px solid rgba(255, 255, 255, 0.15)", paddingTop: "12px" }}>
              Активний сеанс: 1 пристрій &bull; Chrome • Windows &bull; <span style={{ color: "#77DDAA", fontWeight: 600 }}>🟢 Зараз онлайн</span>
            </div>
          </div>
        </div>

        <div style={{ background: "#F5EFEB", borderRadius: "var(--radius-lg)", padding: "32px", border: "1px solid #D8C7B9", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div className="admin-tag" style={{ color: "var(--accent-primary)" }}>[ SECURITY / БЕЗПЕКА ]</div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, color: "var(--accent-primary)", margin: "4px 0 20px 0" }}>
              Безпека акаунта
            </h3>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid #D8C7B9", marginBottom: "16px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>Двофакторна автентифікація</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>SMS або застосунок автентифікатора</div>
              </div>
              <button
                type="button"
                onClick={() => setTwoFa(!twoFa)}
                style={{
                  width: "48px",
                  height: "26px",
                  borderRadius: "13px",
                  background: twoFa ? "#0A2D1B" : "#DDD8D1",
                  position: "relative",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: twoFa ? "25px" : "3px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#FFFFFF",
                    transition: "left 0.2s"
                  }}
                ></span>
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #D8C7B9", marginBottom: "12px", fontSize: "14px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Пароль оновлено:</span>
              <span style={{ fontWeight: 600 }}>02.09.2026</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Останній успішний вхід:</span>
              <span style={{ fontWeight: 600 }}>18.09.2026 • 18:24</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-btn-secondary"
            style={{ marginTop: "16px", alignSelf: "flex-start" }}
            onClick={() => alert("Посилання для зміни пароля надіслано на email")}
          >
            Змінити пароль
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "28px" }}>
        
        <div style={{ background: "#476252", color: "#FFFFFF", borderRadius: "var(--radius-lg)", padding: "32px" }}>
          <div className="admin-tag" style={{ color: "#C2D1C9" }}>[ PERSONAL DATA / ОСОБИСТІ ДАНІ ]</div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, margin: "6px 0 20px 0" }}>
            Контактна інформація
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div style={{ background: "#FAF8F5", borderRadius: "12px", padding: "14px 18px", color: "var(--text-primary)" }}>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Ім'я та прізвище</div>
              <div style={{ fontSize: "15px", fontWeight: 700 }}>Андрій Бондарчук</div>
            </div>
            <div style={{ background: "#FAF8F5", borderRadius: "12px", padding: "14px 18px", color: "var(--text-primary)" }}>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Email</div>
              <div style={{ fontSize: "15px", fontWeight: 700 }}>admin@nexylva.ua</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ background: "#FAF8F5", borderRadius: "12px", padding: "14px 18px", color: "var(--text-primary)" }}>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Телефон</div>
              <div style={{ fontSize: "15px", fontWeight: 700 }}>+380 67 245 18 90</div>
            </div>
            <div style={{ background: "#FAF8F5", borderRadius: "12px", padding: "14px 18px", color: "var(--text-primary)" }}>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Мова</div>
              <div style={{ fontSize: "15px", fontWeight: 700 }}>Українська / Англійська</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#B6C7BC", borderRadius: "var(--radius-lg)", padding: "32px" }}>
          <div className="admin-tag" style={{ color: "var(--accent-primary)" }}>[ ACTIVITY / АКТИВНІСТЬ ]</div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, color: "var(--accent-primary)", margin: "4px 0 20px 0" }}>
            Останні дії
          </h3>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid rgba(0,0,0,0.08)", marginBottom: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Опубліковано новий курс</span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Сьогодні, 14:20</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid rgba(0,0,0,0.08)", marginBottom: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Підтверджено акаунт ментора</span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Сьогодні, 12:45</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid rgba(0,0,0,0.08)", marginBottom: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Переглянуто звіт з оплат</span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Вчора, 17:30</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Оновлено параметри курсу</span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Вчора, 15:10</span>
          </div>
        </div>
      </div>
    </div>
  );
}
