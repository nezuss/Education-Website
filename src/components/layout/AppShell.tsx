import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { signOut } from "../../services/authService";
import "./AppShell.css";

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const isMentor = location.pathname.startsWith("/mentor");
  const isAdmin = location.pathname.startsWith("/admin");
  const isStudent = !isMentor && !isAdmin;

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <div className="lms-layout">
      {/* Left Sidebar */}
      <aside className="lms-sidebar">
        <Link to="/" className="lms-brand-link">
          <img src="/logo.svg" alt="NEXYLVA" className="lms-brand-logo" />
        </Link>

        <nav className="lms-nav-group" aria-label="LMS Navigation">
          {isStudent && (
            <>
              <NavLink to="/student" end className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`}>
                <span className="lms-nav-icon">🏠</span>
                <span>Головна</span>
              </NavLink>
              <NavLink to="/student/courses" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`}>
                <span className="lms-nav-icon">📚</span>
                <span>Мої курси</span>
              </NavLink>
              <NavLink to="/student/assignments/1" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`}>
                <span className="lms-nav-icon">📝</span>
                <span>Завдання</span>
              </NavLink>
              <NavLink to="/student/progress" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`}>
                <span className="lms-nav-icon">📊</span>
                <span>Прогрес</span>
              </NavLink>
              <NavLink to="/student/schedule" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`}>
                <span className="lms-nav-icon">📅</span>
                <span>Розклад</span>
              </NavLink>
              <NavLink to="/student/reviews" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`}>
                <span className="lms-nav-icon">💬</span>
                <span>Відгуки ментора</span>
              </NavLink>
              <NavLink to="/community" className="lms-nav-item">
                <span className="lms-nav-icon">👥</span>
                <span>Спільнота</span>
              </NavLink>

              <div className="lms-nav-divider"></div>

              <NavLink to="/student/profile" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`}>
                <span className="lms-nav-icon">👤</span>
                <span>Профіль</span>
              </NavLink>
            </>
          )}

          {isMentor && (
            <>
              <NavLink to="/mentor" end className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`}>
                <span className="lms-nav-icon">📋</span>
                <span>Головна панель</span>
              </NavLink>
              <NavLink to="/mentor/submissions" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`}>
                <span className="lms-nav-icon">📥</span>
                <span>Черга перевірки</span>
              </NavLink>
              <NavLink to="/mentor/profile" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`}>
                <span className="lms-nav-icon">👤</span>
                <span>Профіль ментора</span>
              </NavLink>
              <NavLink to="/community" className="lms-nav-item">
                <span className="lms-nav-icon">👥</span>
                <span>Спільнота</span>
              </NavLink>
            </>
          )}

          {isAdmin && (
            <>
              <NavLink to="/admin" end className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`}>
                <span className="lms-nav-icon">⚙️</span>
                <span>Головна панель</span>
              </NavLink>
              <NavLink to="/admin/users" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`}>
                <span className="lms-nav-icon">👥</span>
                <span>Користувачі</span>
              </NavLink>
              <NavLink to="/admin/courses" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`}>
                <span className="lms-nav-icon">🎓</span>
                <span>Керування курсами</span>
              </NavLink>
              <NavLink to="/admin/orders" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`}>
                <span className="lms-nav-icon">💳</span>
                <span>Замовлення / Оплати</span>
              </NavLink>
              <NavLink to="/admin/analytics" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`}>
                <span className="lms-nav-icon">📈</span>
                <span>Аналітика</span>
              </NavLink>
              <NavLink to="/admin/profile" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`}>
                <span className="lms-nav-icon">👤</span>
                <span>Профіль адміністратора</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Bottom Promo Card */}
        <div className="lms-sidebar-promo-card">
          <div className="lms-promo-icon">🌿</div>
          <div className="lms-promo-title">Створи свій шлях у сталому дизайні</div>
          <div className="lms-promo-desc">
            Кожен проєкт — це крок до кращого майбутнього для нас і планети.
          </div>
          <Link to="/about" className="lms-promo-link">
            <span>Дізнатися більше &rarr;</span>
          </Link>
        </div>

        <div className="lms-sidebar-footer">
          <span>&copy; 2026 NEXYLVA</span>
          <Link to="/contacts" style={{ color: '#AABDB3', textDecoration: 'none' }}>Підтримка</Link>
        </div>
      </aside>

      {/* Main Container */}
      <div className="lms-main">
        {/* Topbar */}
        <header className="lms-topbar">
          <div className="lms-topbar-left">
            <span className="lms-topbar-breadcrumb">
              {isAdmin ? "Admin LMS / Панель" : isMentor ? "Mentor LMS / Кабінет ментора" : "Student LMS / Головна"}
            </span>
          </div>

          <div className="lms-topbar-right">
            <div className="lms-search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#557061" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Пошук курсу..."
                className="lms-search-input"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </div>

            <button type="button" className="lms-lang-toggle">
              🌐 UA / EN
            </button>

            <button type="button" className="lms-bell-btn" aria-label="Сповіщення">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="lms-bell-dot"></span>
            </button>

            <div className="lms-user-menu">
              <button
                type="button"
                className="lms-user-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src="/student/student_avatar.webp"
                  alt="User Avatar"
                  className="lms-user-avatar"
                />
                <span className="lms-user-name">Анна</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {dropdownOpen && (
                <div className="lms-dropdown">
                  <Link to="/student" className="lms-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    🎓 Кабінет студента
                  </Link>
                  <Link to="/mentor" className="lms-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    🧑‍🏫 Кабінет ментора
                  </Link>
                  <Link to="/admin" className="lms-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    🛡️ Адмін-панель
                  </Link>
                  <div className="lms-dropdown-divider"></div>
                  <Link to="/student/profile" className="lms-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    👤 Налаштування профілю
                  </Link>
                  <div className="lms-dropdown-divider"></div>
                  <button type="button" className="lms-dropdown-item" onClick={handleSignOut} style={{ color: '#E53E3E' }}>
                    🚪 Вийти
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="lms-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
