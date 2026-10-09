import UiIcon from "../ui/Icon/UiIcon";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { signOut } from "../../services/authService";
import { getProfile, type UserProfile } from "../../services/profileService";
import "./AppShell.css";
import AdminNavIcon from "./AdminNavIcon";

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const isMentor = location.pathname.startsWith("/mentor");
  const isAdmin = location.pathname.startsWith("/admin");
  const isStudent = !isMentor && !isAdmin;
  const isCourseOverview = /^\/student\/learning\/[^/]+\/?$/.test(location.pathname);
  const isAssignment = location.pathname.startsWith("/student/assignments") || location.pathname.startsWith("/student/upload/");
  const isSubmissionResult = /^\/student\/submissions\/[^/]+\/?$/.test(location.pathname);

  const userRole = profile?.role || "None";
  const hasTeacherAccess = userRole === "Teacher" || userRole === "Admin";
  const hasAdminAccess = userRole === "Admin";

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`lms-layout${isAdmin ? " admin-layout" : ""}${location.pathname === "/student/courses" ? " my-courses-layout" : ""}${isCourseOverview ? " course-learning-layout" : ""}${isAssignment || isSubmissionResult ? " assignment-layout" : ""}`}>
      {sidebarOpen && (
        <div className="lms-sidebar-backdrop" onClick={closeSidebar} />
      )}

      <aside className={`lms-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="lms-sidebar-top-row">
          <Link to="/" className="lms-brand-link" onClick={closeSidebar}>
            <img src={isAdmin || location.pathname === "/student/courses" || isCourseOverview || isAssignment || isSubmissionResult ? "/logo-on-dark.svg" : "/logo.svg"} alt="NEXYLVA" className="lms-brand-logo" />
          </Link>
          <button
            type="button"
            className="lms-sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="Закрити меню"
          >
            <UiIcon name="close" />
          </button>
        </div>

        <nav className="lms-nav-group" aria-label="LMS Navigation">
          {isStudent && (
            <>
              <NavLink to="/student" end className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="home" /></span>
                <span>Головна</span>
              </NavLink>
              <NavLink to="/student/courses" className={({ isActive }) => `lms-nav-item ${isActive || location.pathname.startsWith("/student/learning/") ? "active" : ""}`} onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="courses" /></span>
                <span>Мої курси</span>
              </NavLink>
              <NavLink to="/student/assignments" className={({ isActive }) => `lms-nav-item ${isActive || isAssignment ? "active" : ""}`} onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="assignment" /></span>
                <span>Завдання</span>
              </NavLink>
              <NavLink to="/student/submissions" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="assignment" /></span>
                <span>Мої роботи</span>
              </NavLink>
              <NavLink to="/community" className="lms-nav-item" onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="users" /></span>
                <span>Спільнота</span>
              </NavLink>

              <div className="lms-nav-divider"></div>

              <NavLink to="/student/profile" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="person" /></span>
                <span>Профіль</span>
              </NavLink>
            </>
          )}

          {isMentor && (
            <>
              <NavLink to="/mentor" end className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="assignment" /></span>
                <span>Головна панель</span>
              </NavLink>
              <NavLink to="/mentor/submissions" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="download" size={18} /></span>
                <span>Черга перевірки</span>
              </NavLink>
              <NavLink to="/mentor/profile" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="person" /></span>
                <span>Профіль ментора</span>
              </NavLink>
              <NavLink to="/community" className="lms-nav-item" onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="users" /></span>
                <span>Спільнота</span>
              </NavLink>
            </>
          )}

          {isAdmin && (
            <>
              <NavLink to="/admin" end className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <AdminNavIcon name="home" />
                <span>Головна</span>
              </NavLink>
              <NavLink to="/admin/users" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <AdminNavIcon name="users" />
                <span>Користувачі</span>
              </NavLink>
              <NavLink to="/admin/courses" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <AdminNavIcon name="courses" />
                <span>Курси</span>
              </NavLink>
              <NavLink to="/admin/orders" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <AdminNavIcon name="orders" />
                <span>Замовлення / Оплати</span>
              </NavLink>
              <NavLink to="/admin/analytics" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <AdminNavIcon name="analytics" />
                <span>Аналітика</span>
              </NavLink>
              <NavLink to="/admin/promocodes" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="orders" /></span><span>Промокоди</span>
              </NavLink>
              <NavLink to="/admin/profile" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <AdminNavIcon name="profile" />
                <span>Профіль</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="lms-sidebar-promo-card">
          <div className="lms-promo-icon">{isAdmin ? "СТАН ПЛАТФОРМИ" : <UiIcon name="recycle" size={44} />}</div>
          <div className="lms-promo-title">{isAdmin ? "Системні дані поки недоступні" : "Створи свій шлях у сталому дизайні"}</div>
          <div className="lms-promo-desc">
            {isAdmin ? "Переглядайте доступні показники платформи в розділі аналітики." : "Кожен проєкт — це крок до кращого майбутнього для нас і планети."}
          </div>
          <Link to={isAdmin ? "/admin/analytics" : "/about"} className="lms-promo-link" onClick={closeSidebar}>
            <span>{isAdmin ? "Переглянути аналітику" : "Дізнатися більше"} <UiIcon name="arrow" /></span>
          </Link>
        </div>

        <div className="lms-sidebar-footer">
          <span>&copy; 2026 NEXYLVA</span>
          <Link to="/contacts" style={{ color: '#AABDB3', textDecoration: 'none' }} onClick={closeSidebar}>Підтримка</Link>
        </div>
      </aside>

      <div className="lms-main">
        <header className="lms-topbar">
          <div className="lms-topbar-left">
            <button
              type="button"
              className="lms-mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Відкрити меню"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <span className="lms-topbar-breadcrumb">
              {isAdmin ? `Admin LMS / ${{ "/admin/users": "Користувачі", "/admin/courses": "Курси", "/admin/orders": "Замовлення / Оплати", "/admin/analytics": "Аналітика", "/admin/profile": "Профіль" }[location.pathname] || "Головна"}` : isMentor ? "Mentor LMS / Кабінет ментора" : isSubmissionResult ? "Student LMS / Результат перевірки" : isAssignment ? "Student LMS / Завдання" : location.pathname === "/student/courses" || location.pathname.startsWith("/student/learning/") ? "Student LMS / Мої курси" : "Student LMS / Головна"}
            </span>
          </div>

          <div className="lms-topbar-right">
            <div className="lms-search-box">
              <UiIcon name="search" size={16} style={{ color: "#557061" }} />
              <input
                type="text"
                placeholder="Пошук курсу..."
                className="lms-search-input"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") navigate("/courses?q=" + encodeURIComponent(searchVal)); }}
              />
            </div>

            <button type="button" className="lms-lang-toggle" disabled title="Англійська версія поки недоступна">
              <UiIcon name="globe" /> UA / EN
            </button>

            <button type="button" className="lms-bell-btn" aria-label="Сповіщення поки недоступні" disabled>
              <UiIcon name="bell" size={20} />

            </button>

            <div className="lms-user-menu" ref={dropdownRef}>
              <button
                type="button"
                className="lms-user-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="lms-user-avatar profile-initial-avatar">{profile?.username?.charAt(0) || "·"}</span>
                <span className="lms-user-name">{profile?.username || profile?.name || "Користувач"}</span>
                <UiIcon name="chevron" size={14} />
              </button>

              {dropdownOpen && (
                <div className="lms-dropdown">
                  <Link to="/student" className="lms-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <UiIcon name="teacher" /> Кабінет студента
                  </Link>
                  {hasTeacherAccess && (
                    <Link to="/mentor" className="lms-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <UiIcon name="teacher" /> Кабінет ментора
                    </Link>
                  )}
                  {hasAdminAccess && (
                    <Link to="/admin" className="lms-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <UiIcon name="admin" /> Адмін-панель
                    </Link>
                  )}
                  <div className="lms-dropdown-divider"></div>
                  <Link to={isAdmin ? "/admin/profile" : isMentor ? "/mentor/profile" : "/student/profile"} className="lms-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <UiIcon name="person" /> Налаштування профілю
                  </Link>
                  <div className="lms-dropdown-divider"></div>
                  <button type="button" className="lms-dropdown-item" onClick={handleSignOut} style={{ color: '#E53E3E' }}>
                    <UiIcon name="logout" /> Вийти
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="lms-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
