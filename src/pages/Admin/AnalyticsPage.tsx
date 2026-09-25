import { Link } from "react-router-dom";
import "../../styles/AdminPortal.css";

export default function AnalyticsPage() {
  return (
    <div className="admin-container">
      
      <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
        <Link to="/admin" style={{ color: "inherit", textDecoration: "none" }}>Головна</Link>
        {" > "}
        <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>Аналітика платформи</span>
      </div>

      <header className="admin-header">
        <div>
          <h1 className="admin-header-title">
            Аналітика платформи
          </h1>
          <p className="admin-header-sub">
            Ключові показники навчання, користувачів та фінансової активності NEXYLVA.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => alert("Експорт звіту сформовано")}
          >
            Експорт звіту ⤓
          </button>
          <select className="mentor-select" aria-label="Період аналітики">
            <option>Останні 30 днів</option>
            <option>Останні 90 днів</option>
            <option>Цей рік</option>
          </select>
        </div>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
        <div className="admin-stat-card">
          <div className="admin-tag">[ КОРИСТУВАЧІ ]</div>
          <div className="admin-stat-val">1 284</div>
          <div className="admin-stat-label">Усього користувачів</div>
          <div className="admin-stat-change">+36 за останні 30 днів</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-tag">[ АКТИВНІСТЬ ]</div>
          <div className="admin-stat-val">174</div>
          <div className="admin-stat-label">Активні студенти</div>
          <div className="admin-stat-change" style={{ color: "#215A36", fontWeight: 600 }}>+8,4% до минулого періоду</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-tag">[ НАВЧАННЯ ]</div>
          <div className="admin-stat-val">71%</div>
          <div className="admin-stat-label">Завершення курсів</div>
          <div className="admin-stat-change" style={{ color: "#215A36", fontWeight: 600 }}>+4,2% за 30 днів</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-tag">[ ФІНАНСИ ]</div>
          <div className="admin-stat-val">₴ 481 400</div>
          <div className="admin-stat-label">Дохід за серпень</div>
          <div className="admin-stat-change" style={{ color: "#215A36", fontWeight: 600 }}>+12% до минулого місяця</div>
        </div>
      </section>

      <div className="admin-analytics-grid">
        
        <section className="admin-chart-card">
          <div className="admin-tag">[ ДИНАМІКА ]</div>
          <h2 className="admin-chart-title">Активність користувачів</h2>
          <p className="admin-chart-sub">Динаміка активних користувачів за останні 7 днів.</p>

          <svg className="admin-chart-svg" viewBox="0 0 700 240" fill="none">
            
            <line x1="40" y1="30" x2="680" y2="30" stroke="#E8E2DA" strokeDasharray="3 3" />
            <line x1="40" y1="80" x2="680" y2="80" stroke="#E8E2DA" strokeDasharray="3 3" />
            <line x1="40" y1="130" x2="680" y2="130" stroke="#E8E2DA" strokeDasharray="3 3" />
            <line x1="40" y1="180" x2="680" y2="180" stroke="#E8E2DA" strokeDasharray="3 3" />
            <line x1="40" y1="210" x2="680" y2="210" stroke="#557061" strokeWidth="1.5" />

            <text x="10" y="34" fontSize="10" fill="#88968E">200</text>
            <text x="10" y="84" fontSize="10" fill="#88968E">150</text>
            <text x="10" y="134" fontSize="10" fill="#88968E">100</text>
            <text x="10" y="184" fontSize="10" fill="#88968E">50</text>
            <text x="10" y="214" fontSize="10" fill="#88968E">0</text>

            <polygon
              points="70,195 160,115 250,150 340,95 430,65 520,130 610,35 610,210 70,210"
              fill="rgba(85, 112, 97, 0.08)"
            />

            <path
              d="M 70 195 L 160 115 L 250 150 L 340 95 L 430 65 L 520 130 L 610 35"
              stroke="#557061"
              strokeWidth="2.5"
              fill="none"
            />

            <circle cx="70" cy="195" r="7" fill="#476252" />
            <text x="62" y="180" fontSize="11" fontWeight="700" fill="#1F2923">14</text>
            <text x="64" y="226" fontSize="11" fill="#526359">11</text>

            <circle cx="160" cy="115" r="7" fill="#B6C7BC" />
            <text x="150" y="100" fontSize="11" fontWeight="700" fill="#1F2923">101</text>
            <text x="154" y="226" fontSize="11" fill="#526359">12</text>

            <circle cx="250" cy="150" r="7" fill="#476252" />
            <text x="242" y="135" fontSize="11" fontWeight="700" fill="#1F2923">62</text>
            <text x="244" y="226" fontSize="11" fill="#526359">13</text>

            <circle cx="340" cy="95" r="7" fill="#C07C54" />
            <text x="330" y="80" fontSize="11" fontWeight="700" fill="#1F2923">118</text>
            <text x="334" y="226" fontSize="11" fill="#526359">14</text>

            <circle cx="430" cy="65" r="7" fill="#476252" />
            <text x="420" y="50" fontSize="11" fontWeight="700" fill="#1F2923">155</text>
            <text x="424" y="226" fontSize="11" fill="#526359">15</text>

            <circle cx="520" cy="130" r="7" fill="#B6C7BC" />
            <text x="512" y="115" fontSize="11" fontWeight="700" fill="#1F2923">87</text>
            <text x="514" y="226" fontSize="11" fill="#526359">16</text>

            <circle cx="610" cy="35" r="7" fill="#C07C54" />
            <text x="600" y="20" fontSize="11" fontWeight="700" fill="#1F2923">185</text>
            <text x="604" y="226" fontSize="11" fill="#526359">17</text>

            <text x="315" y="240" fontSize="10" fontWeight="600" fill="#88968E">Серпень 2026</text>
          </svg>
        </section>

        <aside style={{ background: "#0A2D1B", color: "#FFFFFF", borderRadius: "var(--radius-lg)", padding: "32px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#C2D1C9", letterSpacing: "0.05em" }}>
            [ СТРУКТУРА ]
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "24px", fontWeight: 700, margin: "6px 0 4px 0" }}>
            Користувачі за ролями
          </h2>
          <p style={{ fontSize: "13px", color: "#AABDB3", margin: "0 0 24px 0" }}>
            Поточний розподіл облікових записів.
          </p>

          <div className="admin-donut-wrap">
            <div className="admin-donut-chart">
              <div className="admin-donut-center">
                <span>1 284</span>
              </div>
            </div>

            <div className="admin-donut-labels">
              <div className="admin-donut-label-row">
                <span style={{ width: "12px", height: "12px", background: "#476252", borderRadius: "3px" }}></span>
                <span>Студенти 1 146 • 89%</span>
              </div>
              <div className="admin-donut-label-row">
                <span style={{ width: "12px", height: "12px", background: "#C2D1C9", borderRadius: "3px" }}></span>
                <span>Ментори 126 • 9,8%</span>
              </div>
              <div className="admin-donut-label-row">
                <span style={{ width: "12px", height: "12px", background: "#C07C54", borderRadius: "3px" }}></span>
                <span>Адміністратори 12 • 0,9%</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "32px" }}>
        
        <section style={{ background: "#E8EFEA", borderRadius: "var(--radius-lg)", padding: "32px", border: "1px solid #C2D1C9" }}>
          <div className="admin-tag" style={{ color: "var(--accent-primary)" }}>[ КУРСИ ]</div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, color: "var(--accent-primary)", margin: "4px 0 20px 0" }}>
            Ефективність активних курсів
          </h3>

          <div style={{ background: "#FFFFFF", borderRadius: "14px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>LCA & Еко-проєктування</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>286 студентів • Рейтинг 4.9 / 5</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 700, color: "var(--accent-warm)" }}>82%</div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>завершення</div>
            </div>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: "14px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Zero-Waste Пакування</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>198 студентів • Рейтинг 4.7 / 5</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 700, color: "var(--accent-warm)" }}>68%</div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>завершення</div>
            </div>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: "14px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Циркулярний брендинг</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>174 студенти • Рейтинг 4.8 / 5</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 700, color: "var(--accent-warm)" }}>74%</div>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>завершення</div>
            </div>
          </div>
        </section>

        <section style={{ background: "#476252", color: "#FFFFFF", borderRadius: "var(--radius-lg)", padding: "32px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#C2D1C9", letterSpacing: "0.05em" }}>
            [ НАВЧАЛЬНІ ПОКАЗНИКИ ]
          </div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, margin: "4px 0 20px 0" }}>
            Навчальна ефективність
          </h3>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "13px", color: "#C2D1C9", marginBottom: "4px" }}>Середній час перевірки робіт</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 700 }}>34 хвилини</div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "13px", color: "#C2D1C9", marginBottom: "4px" }}>Рівень задоволеності менторами</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 700 }}>96%</div>
          </div>

          <div>
            <div style={{ fontSize: "13px", color: "#C2D1C9", marginBottom: "4px" }}>Складання з першої спроби</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 700 }}>84%</div>
          </div>
        </section>
      </div>
    </div>
  );
}
