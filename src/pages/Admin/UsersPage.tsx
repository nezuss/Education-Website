import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/AdminPortal.css";

interface UserItem {
  id: string;
  num: string;
  name: string;
  email: string;
  role: "Студентка" | "Студент" | "Ментор" | "Адміністратор";
  roleType: "student" | "mentor" | "admin";
  regDate: string;
  lastLogin: string;
  status: "active" | "pending" | "blocked";
  statusText: string;
  coursesCount: string;
  avatar: string;
  phone?: string;
  progress?: string;
  tasksCompleted?: string;
  certificates?: string;
}

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const users: UserItem[] = [
    {
      id: "1",
      num: "1",
      name: "Анна Коваль",
      email: "anna@nexylva.ua",
      role: "Студентка",
      roleType: "student",
      regDate: "10 серпня",
      lastLogin: "Сьогодні • 18:42",
      status: "active",
      statusText: "Активний",
      coursesCount: "3",
      avatar: "/about/team_1.webp",
      phone: "+380 (67) 123-45-67",
      progress: "68%",
      tasksCompleted: "12",
      certificates: "2"
    },
    {
      id: "2",
      num: "2",
      name: "Марія Іванова",
      email: "m.ivanova@nexylva.ua",
      role: "Студентка",
      roleType: "student",
      regDate: "17 серпня",
      lastLogin: "Сьогодні • 17:05",
      status: "active",
      statusText: "Активний",
      coursesCount: "1",
      avatar: "/about/team_2.webp",
      phone: "+380 (50) 987-65-43",
      progress: "45%",
      tasksCompleted: "5",
      certificates: "0"
    },
    {
      id: "3",
      num: "3",
      name: "Максим Ковальчук",
      email: "m.kovalchuk@nexylva.ua",
      role: "Ментор",
      roleType: "mentor",
      regDate: "16 серпня",
      lastLogin: "Сьогодні • 15:28",
      status: "active",
      statusText: "Активний",
      coursesCount: "2",
      avatar: "/about/team_3.webp",
      phone: "+380 (63) 333-22-11",
      progress: "94%",
      tasksCompleted: "48",
      certificates: "5"
    },
    {
      id: "4",
      num: "4",
      name: "Олексій Бондар",
      email: "o.bondar@nexylva.ua",
      role: "Студент",
      roleType: "student",
      regDate: "08 серпня",
      lastLogin: "Сьогодні • 14:11",
      status: "pending",
      statusText: "Очікує",
      coursesCount: "4",
      avatar: "/about/team_4.webp",
      phone: "+380 (99) 444-55-66",
      progress: "20%",
      tasksCompleted: "3",
      certificates: "0"
    },
    {
      id: "5",
      num: "5",
      name: "Наталія Савчук",
      email: "n.savchuk@nexylva.ua",
      role: "Студентка",
      roleType: "student",
      regDate: "07 серпня",
      lastLogin: "Сьогодні • 20:36",
      status: "blocked",
      statusText: "Заблокований",
      coursesCount: "2",
      avatar: "/student/student_avatar.webp",
      phone: "+380 (68) 555-77-88",
      progress: "10%",
      tasksCompleted: "1",
      certificates: "0"
    },
    {
      id: "6",
      num: "6",
      name: "Андрій Данилюк",
      email: "a.danyliuk@nexylva.ua",
      role: "Адміністратор",
      roleType: "admin",
      regDate: "02 липня",
      lastLogin: "Сьогодні • 19:02",
      status: "active",
      statusText: "Активний",
      coursesCount: "—",
      avatar: "/student/mentor_mazur.webp",
      phone: "+380 (44) 111-00-00",
      progress: "100%",
      tasksCompleted: "—",
      certificates: "—"
    }
  ];

  const filtered = users.filter((u) => {
    if (roleFilter === "students" && u.roleType !== "student") return false;
    if (roleFilter === "mentors" && u.roleType !== "mentor") return false;
    if (roleFilter === "admins" && u.roleType !== "admin") return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="admin-container">
      {/* Breadcrumbs */}
      <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
        <Link to="/admin" style={{ color: "inherit", textDecoration: "none" }}>Головна</Link>
        {" > "}
        <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>Керування користувачами</span>
      </div>

      {/* Header */}
      <header className="admin-header">
        <div>
          <h1 className="admin-header-title">
            Керування користувачами
          </h1>
          <p className="admin-header-sub">
            Переглядайте акаунти студентів, менторів та адміністраторів, змінюйте ролі й статуси доступу.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => alert("Форма створення нового користувача")}
        >
          + Додати користувача
        </button>
      </header>

      {/* Overview Cards Row */}
      <section className="admin-stats-row">
        <div className="admin-overview-card">
          <div className="admin-tag">[ ОГЛЯД ]</div>
          <h2 className="admin-overview-title">Користувачі NEXYLVA</h2>
          <p className="admin-overview-sub">
            Короткий огляд найважливіших показників платформи за поточний день.
          </p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-val">1 284</div>
          <div className="admin-stat-label">Усього користувачів</div>
          <div className="admin-stat-change">+36 за останні 7 днів</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-val">1 146</div>
          <div className="admin-stat-label">Студенти</div>
          <div className="admin-stat-change">89% усіх акаунтів</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-val">126</div>
          <div className="admin-stat-label">Ментори</div>
          <div className="admin-stat-change">9,8% усіх акаунтів</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-val">12</div>
          <div className="admin-stat-label">Адміністратори</div>
          <div className="admin-stat-change">Системні ролі</div>
        </div>
      </section>

      <div style={{ textAlign: "right", fontSize: "12px", color: "var(--text-secondary)", marginTop: "-16px", marginBottom: "32px" }}>
        Структура аудиторії: 89% студентів, 9,8% менторів та 1,2% адміністраторів
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-filter-pills">
          <button
            type="button"
            className={`admin-pill ${roleFilter === "all" ? "active" : ""}`}
            onClick={() => setRoleFilter("all")}
          >
            Усі
          </button>
          <button
            type="button"
            className={`admin-pill ${roleFilter === "students" ? "active" : ""}`}
            onClick={() => setRoleFilter("students")}
          >
            Студенти
          </button>
          <button
            type="button"
            className={`admin-pill ${roleFilter === "mentors" ? "active" : ""}`}
            onClick={() => setRoleFilter("mentors")}
          >
            Ментори
          </button>
          <button
            type="button"
            className={`admin-pill ${roleFilter === "admins" ? "active" : ""}`}
            onClick={() => setRoleFilter("admins")}
          >
            Адміністратори
          </button>
        </div>

        <div className="admin-controls-group">
          <div className="mentor-search-input-wrap">
            <span className="mentor-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Пошук користувача..."
              className="mentor-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="mentor-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Фільтр статусу"
          >
            <option value="all">Усі статуси</option>
            <option value="active">Активний</option>
            <option value="pending">Очікує</option>
            <option value="blocked">Заблокований</option>
          </select>

          <select className="mentor-select" aria-label="Дата реєстрації">
            <option>Дата реєстрації: Усі</option>
            <option>За останній місяць</option>
            <option>За цей рік</option>
          </select>

          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => alert("Експорт таблиці у CSV формат успішно розпочато!")}
          >
            Експорт CSV
          </button>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span>№</span>
          <span>Користувач</span>
          <span>Роль</span>
          <span>Реєстрація</span>
          <span>Останній вхід</span>
          <span>Статус</span>
          <span>Курси</span>
          <span>Дія</span>
        </div>

        {filtered.map((user) => (
          <div key={user.id} className="admin-table-row">
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 700, color: "var(--accent-warm)" }}>
              {user.num}
            </span>

            <div className="admin-user-cell">
              <img src={user.avatar} alt={user.name} className="admin-user-avatar" />
              <div>
                <div className="admin-user-name">{user.name}</div>
                <div className="admin-user-email">{user.email}</div>
              </div>
            </div>

            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
              {user.role}
            </div>

            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              {user.regDate}
            </div>

            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              {user.lastLogin}
            </div>

            <div>
              <span className={`admin-status-badge ${user.status}`}>
                {user.statusText}
              </span>
            </div>

            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent-primary)" }}>
              {user.coursesCount}
            </div>

            <div>
              <button
                type="button"
                className="admin-row-btn"
                onClick={() => setSelectedUser(user)}
              >
                <span>Відкрити</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* User Details Modal (Figma 18-01 User Details) */}
      {selectedUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px"
          }}
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="admin-user-card-view"
            style={{ maxWidth: "860px", width: "100%", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero */}
            <div className="admin-user-card-hero">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="admin-user-card-photo"
              />
              <div className="admin-user-card-hero-info">
                <div className="admin-tag" style={{ color: "#C2D1C9" }}>[ ACCOUNT / АКАУНТ ]</div>
                <h2 className="admin-user-card-name">{selectedUser.name}</h2>
                <div className="admin-user-card-email">{selectedUser.email}</div>
                <div className="admin-user-card-pills">
                  <span className="mentor-status-pill reviewed">{selectedUser.role}</span>
                  <span className="mentor-status-pill new">Активний акаунт</span>
                </div>
              </div>

              <div style={{ textAlign: "right", color: "#AABDB3", fontSize: "13px" }}>
                <div>Остання активність: 18.09.2026 • 18:24</div>
                <div style={{ margin: "6px 0" }}>Chrome • Windows</div>
                <div style={{ color: "#77DDAA", fontWeight: 600 }}>🟢 Зараз онлайн</div>
              </div>
            </div>

            {/* Metrics */}
            <div className="admin-user-card-metrics">
              <div className="admin-user-metric-box">
                <div className="admin-user-metric-val">{selectedUser.coursesCount}</div>
                <div className="admin-user-metric-lbl">активні курси</div>
              </div>
              <div className="admin-user-metric-box" style={{ background: "#E8E2DA" }}>
                <div className="admin-user-metric-val">{selectedUser.progress || "68%"}</div>
                <div className="admin-user-metric-lbl">середній прогрес</div>
              </div>
              <div className="admin-user-metric-box">
                <div className="admin-user-metric-val">{selectedUser.tasksCompleted || "12"}</div>
                <div className="admin-user-metric-lbl">виконаних завдань</div>
              </div>
              <div className="admin-user-metric-box" style={{ background: "#476252", color: "#FFFFFF" }}>
                <div className="admin-user-metric-val" style={{ color: "#FFFFFF" }}>{selectedUser.certificates || "2"}</div>
                <div className="admin-user-metric-lbl" style={{ color: "#C2D1C9" }}>сертифікати</div>
              </div>
            </div>

            {/* Contact details */}
            <div style={{ padding: "32px 40px" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, color: "var(--accent-primary)", margin: "0 0 16px 0" }}>
                Контактна інформація
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                <div style={{ background: "#F5EFEB", padding: "14px 18px", borderRadius: "12px" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Ім'я та прізвище</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{selectedUser.name}</div>
                </div>
                <div style={{ background: "#F5EFEB", padding: "14px 18px", borderRadius: "12px" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Email</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{selectedUser.email}</div>
                </div>
                <div style={{ background: "#F5EFEB", padding: "14px 18px", borderRadius: "12px" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Телефон</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{selectedUser.phone || "+380 (67) 123-45-67"}</div>
                </div>
                <div style={{ background: "#F5EFEB", padding: "14px 18px", borderRadius: "12px" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Мова інтерфейсу</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Українська (UA)</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--accent-border)", paddingTop: "20px" }}>
                <button
                  type="button"
                  style={{ background: "#FCE8E6", color: "#C53929", border: "none", padding: "10px 20px", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}
                  onClick={() => {
                    alert(`Статус користувача ${selectedUser.name} оновлено на "Заблокований"`);
                    setSelectedUser(null);
                  }}
                >
                  Заблокувати акаунт
                </button>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    type="button"
                    style={{ background: "#E8E2DA", border: "none", padding: "10px 20px", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}
                    onClick={() => setSelectedUser(null)}
                  >
                    Закрити
                  </button>
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={() => {
                      alert(`Дані користувача ${selectedUser.name} збережено`);
                      setSelectedUser(null);
                    }}
                  >
                    Зберегти зміни &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
