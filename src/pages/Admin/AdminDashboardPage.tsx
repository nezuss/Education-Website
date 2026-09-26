import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsersStats, type UsersByRole } from "../../services/statsService";
import { getCourses } from "../../services/courseService";
import "../../styles/AdminPortal.css";

export default function AdminDashboardPage() {
  const [usersCount, setUsersCount] = useState<number>(0);
  const [coursesCount, setCoursesCount] = useState<number>(0);
  const [rolesBreakdown, setRolesBreakdown] = useState<UsersByRole[]>([]);

  useEffect(() => {
    getUsersStats()
      .then((roles) => {
        if (roles && roles.length > 0) {
          setRolesBreakdown(roles);
          const total = roles.reduce((sum, r) => sum + (r.userCount || 0), 0);
          setUsersCount(total);
        }
      })
      .catch(() => {});

    getCourses()
      .then((c) => {
        if (c && c.length > 0) {
          setCoursesCount(c.length);
        }
      })
      .catch(() => {});
  }, []);

  const formattedDate = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
  const studentsCount = rolesBreakdown.find((r) => r.roleName === "None")?.userCount ?? 0;
  const teachersCount = rolesBreakdown.find((r) => r.roleName === "Teacher")?.userCount ?? 0;
  const adminsCount = rolesBreakdown.find((r) => r.roleName === "Admin")?.userCount ?? 0;

  return (
    <div className="admin-container">
      
      <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
        <Link to="/admin" style={{ color: "inherit", textDecoration: "none" }}>Головна</Link>
        {" > "}
        <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>Головна панель адміністратора</span>
      </div>

      <header className="admin-header">
        <div>
          <h1 className="admin-header-title">
            Головна панель адміністратора
          </h1>
          <p className="admin-header-sub">
            Контролюйте користувачів, курси, оплати та ключові показники платформи.
          </p>
        </div>
        <div className="admin-date-badge">
          {formattedDate}
        </div>
      </header>

      <section className="admin-stats-row">
        <div className="admin-overview-card">
          <div className="admin-tag">[ ОГЛЯД ]</div>
          <h2 className="admin-overview-title">Стан NEXYLVA сьогодні</h2>
          <p className="admin-overview-sub">
            {rolesBreakdown.length > 0
              ? `Студентів: ${studentsCount} • Викладачів: ${teachersCount} • Адмінів: ${adminsCount}`
              : "Огляд найважливіших показників платформи за поточний день."}
          </p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-val">{usersCount.toLocaleString()}</div>
          <div className="admin-stat-label">Користувачі</div>
          <div className="admin-stat-change">{studentsCount > 0 ? `${studentsCount} активних студентів` : "За даними системи"}</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-val">{coursesCount}</div>
          <div className="admin-stat-label">Активні курси</div>
          <div className="admin-stat-change">Оновлено з бекенду</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-val">₴ 481 400</div>
          <div className="admin-stat-label">Оплати за місяць</div>
          <div className="admin-stat-change" style={{ color: "#215A36", fontWeight: 600 }}>
            +12% до минулого місяця
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-val">98%</div>
          <div className="admin-stat-label">Стабільність</div>
          <div className="admin-stat-change">Усі основні сервіси доступні</div>
        </div>
      </section>

      <div style={{ textAlign: "right", fontSize: "12px", color: "var(--text-secondary)", marginTop: "-16px", marginBottom: "32px" }}>
        *** Усі показники платформи оновлено • Зростання оплат на 12% за місяць
      </div>

      <div className="admin-grid-layout">
        
        <section className="admin-chart-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="admin-tag">[ АКТИВНІСТЬ ]</span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>17 серпня 2026</span>
          </div>

          <h2 className="admin-chart-title">Динаміка платформи</h2>
          <p className="admin-chart-sub">Нові користувачі та завершення курсів за останній місяць.</p>

          <svg className="admin-chart-svg" viewBox="0 0 700 200" fill="none">
            
            <line x1="40" y1="20" x2="680" y2="20" stroke="#E8E2DA" strokeDasharray="3 3" />
            <line x1="40" y1="70" x2="680" y2="70" stroke="#E8E2DA" strokeDasharray="3 3" />
            <line x1="40" y1="120" x2="680" y2="120" stroke="#E8E2DA" strokeDasharray="3 3" />
            <line x1="40" y1="170" x2="680" y2="170" stroke="#557061" strokeWidth="1.5" />

            <text x="15" y="24" fontSize="10" fill="#88968E">100</text>
            <text x="15" y="74" fontSize="10" fill="#88968E">75</text>
            <text x="15" y="124" fontSize="10" fill="#88968E">50</text>
            <text x="15" y="174" fontSize="10" fill="#88968E">0</text>

            <path
              d="M 60 85 L 140 70 L 220 50 L 300 130 L 380 90 L 460 168 L 540 60 L 620 120 L 680 160"
              stroke="#476252"
              strokeWidth="2.5"
              fill="none"
            />
            
            <circle cx="60" cy="85" r="4.5" fill="#476252" />
            <circle cx="140" cy="70" r="4.5" fill="#476252" />
            <circle cx="220" cy="50" r="4.5" fill="#476252" />
            <circle cx="300" cy="130" r="4.5" fill="#476252" />
            <circle cx="380" cy="90" r="4.5" fill="#476252" />
            <circle cx="460" cy="168" r="4.5" fill="#476252" />
            <circle cx="540" cy="60" r="4.5" fill="#476252" />
            <circle cx="620" cy="120" r="4.5" fill="#476252" />
            <circle cx="680" cy="160" r="4.5" fill="#476252" />

            <path
              d="M 60 110 L 140 105 L 220 90 L 300 80 L 380 100 L 460 85 L 540 135 L 620 105 L 680 75"
              stroke="#C07C54"
              strokeWidth="2"
              fill="none"
            />
            
            <circle cx="60" cy="110" r="4" fill="#C07C54" />
            <circle cx="140" cy="105" r="4" fill="#C07C54" />
            <circle cx="220" cy="90" r="4" fill="#C07C54" />
            <circle cx="300" cy="80" r="4" fill="#C07C54" />
            <circle cx="380" cy="100" r="4" fill="#C07C54" />
            <circle cx="460" cy="85" r="4" fill="#C07C54" />
            <circle cx="540" cy="135" r="4" fill="#C07C54" />
            <circle cx="620" cy="105" r="4" fill="#C07C54" />
            <circle cx="680" cy="75" r="4" fill="#C07C54" />
          </svg>

          <div className="admin-chart-legend">
            <div className="admin-legend-item">
              <span className="admin-legend-dot" style={{ background: "#476252" }}></span>
              <span>Нові користувачі</span>
            </div>
            <div className="admin-legend-item">
              <span className="admin-legend-dot" style={{ background: "#C07C54" }}></span>
              <span>Завершені курси</span>
            </div>
          </div>

          <div className="admin-chart-metrics-row">
            <div className="admin-chart-mini-stat">
              <div className="admin-chart-mini-val">+8,4%</div>
              <div className="admin-chart-mini-lbl">активність користувачів</div>
            </div>
            <div className="admin-chart-mini-stat">
              <div className="admin-chart-mini-val">71%</div>
              <div className="admin-chart-mini-lbl">курсів завершено</div>
            </div>
            <div className="admin-chart-mini-stat">
              <div className="admin-chart-mini-val">4,8/5</div>
              <div className="admin-chart-mini-lbl">середня оцінка курсів</div>
            </div>
          </div>
        </section>

        <aside className="admin-events-card">
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#C2D1C9", letterSpacing: "0.05em" }}>
            [ ПОТРЕБУЄ УВАГИ ]
          </div>
          <h2 className="admin-events-title">Системні події</h2>
          <p className="admin-events-sub">Події, які варто перевірити адміністратору.</p>

          <div className="admin-event-item">
            <div className="admin-event-item-title">12 нових заявок</div>
            <div className="admin-event-item-sub">Потребують перегляду сьогодні</div>
          </div>

          <div className="admin-event-item">
            <div className="admin-event-item-title">3 платежі очікують</div>
            <div className="admin-event-item-sub">Статус не підтверджено</div>
          </div>

          <div className="admin-event-item">
            <div className="admin-event-item-title">2 курси на модерації</div>
            <div className="admin-event-item-sub">Очікують публікації</div>
          </div>

          <div className="admin-events-links">
            <Link to="/admin/users" className="admin-event-link-btn">
              <span>Користувачі &bull; Переглянути список</span>
              <span>&rarr;</span>
            </Link>
            <Link to="/admin/orders" className="admin-event-link-btn">
              <span>Оплати &bull; Перевірити транзакції</span>
              <span>&rarr;</span>
            </Link>
            <Link to="/admin/courses" className="admin-event-link-btn">
              <span>Курси &bull; Каталог і модерація</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
