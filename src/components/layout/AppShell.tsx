import UiIcon from "../ui/Icon/UiIcon";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { signOut } from "../../services/authService";
import { getProfile, type UserProfile } from "../../services/profileService";
import "./AppShell.css";
import "../../styles/StudentInsights.css";
import "../../styles/FigmaAccountShell.css";
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

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") { setDropdownOpen(false); setSidebarOpen(false); }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  const isMentor = location.pathname.startsWith("/mentor");
  const isAdmin = location.pathname.startsWith("/admin");
  const isStudent = !isMentor && !isAdmin;
  const isCourseOverview = /^\/student\/learning\/[^/]+\/?$/.test(location.pathname);
  const isLesson = /^\/student\/(?:learning\/[^/]+\/lesson|lesson)\/[^/]+\/?$/.test(location.pathname);
  const isAssignment = location.pathname.startsWith("/student/assignments") || location.pathname.startsWith("/student/upload/");
  const isSubmissionResult = /^\/student\/submissions\/[^/]+\/?$/.test(location.pathname);
  const isMentorProfile = /^\/mentor\/profile\/?$/.test(location.pathname);
  const isStudentHome = location.pathname === "/student" || location.pathname === "/student/";
  const isStudentFeedback = location.pathname === "/student/submissions" || location.pathname === "/student/submissions/";
  const isStudentInsights = isStudentHome || isStudentFeedback || location.pathname === "/student/progress" || location.pathname === "/student/profile";

  const userRole = profile?.role || "None";
  const hasTeacherAccess = userRole === "Teacher" || userRole === "Admin";
  const hasAdminAccess = userRole === "Admin";

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`lms-layout${isAdmin ? " admin-layout" : ""}${isStudentInsights ? " student-insights-layout" : ""}${location.pathname === "/student/courses" ? " my-courses-layout" : ""}${isCourseOverview ? " course-learning-layout" : ""}${isLesson ? " lesson-layout" : ""}${isAssignment || isSubmissionResult ? " assignment-layout" : ""}${isSubmissionResult ? " submission-result-layout" : ""}${isMentorProfile ? " mentor-profile-layout" : ""}${location.pathname === "/mentor" || (location.pathname === "/mentor/submissions" || location.pathname.startsWith("/mentor/review/")) ? " mentor-dashboard-layout" : ""}${location.pathname === "/mentor/submissions" ? " mentor-queue-layout" : ""}${location.pathname.startsWith("/mentor/review/") ? " mentor-review-layout" : ""}`}>
      {sidebarOpen && (
        <div className="lms-sidebar-backdrop" onClick={closeSidebar} />
      )}

      <aside id="lms-sidebar" className={`lms-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="lms-sidebar-top-row">
          <Link to="/" aria-label="NEXYLVA" className="lms-brand-link" onClick={closeSidebar}>
            <img src={isAdmin || isMentor || isStudentInsights || location.pathname === "/student/courses" || isCourseOverview || isLesson || isAssignment || isSubmissionResult ? "/logo-on-dark.svg" : "/logo.svg"} alt="NEXYLVA" className="lms-brand-logo" />
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
              <NavLink to="/student" aria-label="Головна" end className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="home" /></span>
                <span>Головна</span>
              </NavLink>
              <NavLink to="/student/courses" aria-label="Мої курси" className={({ isActive }) => `lms-nav-item ${isActive || location.pathname.startsWith("/student/learning/") ? "active" : ""}`} onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="courses" /></span>
                <span>Мої курси</span>
              </NavLink>
              <NavLink to="/student/assignments" aria-label="Завдання" className={({ isActive }) => `lms-nav-item ${isActive || isAssignment ? "active" : ""}`} onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="assignment" /></span>
                <span>Завдання</span>
              </NavLink>
              <button type="button" className="lms-nav-item lms-nav-unavailable" disabled title="Прогрес поки недоступний">
                <span className="lms-nav-icon"><UiIcon name="progress" /></span><span>Прогрес</span>
              </button>
              <button type="button" className="lms-nav-item lms-nav-unavailable" disabled title="Розклад поки недоступний">
                <span className="lms-nav-icon"><UiIcon name="calendar" /></span><span>Розклад</span>
              </button>
              <NavLink to="/student/submissions" aria-label="Відгуки ментора" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="feedback" /></span>
                <span>Відгуки ментора</span>
              </NavLink>
              <NavLink to="/community" aria-label="Спільнота" className="lms-nav-item" onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="users" /></span>
                <span>Спільнота</span>
              </NavLink>
              <button type="button" className="lms-nav-item lms-nav-unavailable" disabled title="Повідомлення поки недоступні">
                <span className="lms-nav-icon"><UiIcon name="mail" /></span><span>Повідомлення</span>
              </button>

              <div className="lms-nav-divider"></div>
              <button type="button" className="lms-nav-item lms-nav-unavailable" disabled title="Сертифікати поки недоступні">
                <span className="lms-nav-icon"><UiIcon name="certificate" /></span><span>Сертифікати</span>
              </button>
              <div className="lms-nav-divider"></div>

              <NavLink to="/student/profile" aria-label="Профіль" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="person" /></span>
                <span>Профіль</span>
              </NavLink>
              <button type="button" className="lms-nav-item lms-nav-unavailable" disabled title="Додаткові налаштування поки недоступні">
                <span className="lms-nav-icon"><UiIcon name="settings" /></span><span>Налаштування</span>
              </button>
            </>
          )}

          {isMentorProfile && (
            <>
              <NavLink to="/mentor" aria-label="Головна панель" end className="lms-nav-item" onClick={closeSidebar}><span className="lms-nav-icon"><UiIcon name="home" /></span><span>Головна</span></NavLink>
              <div className="lms-nav-divider" />
              <button type="button" className="lms-nav-item lms-nav-unavailable" disabled title="Окрема сторінка завдань ментора поки недоступна"><span className="lms-nav-icon"><UiIcon name="assignment" /></span><span>Завдання</span></button>
              <NavLink to="/mentor/submissions" aria-label="Черга перевірки" className="lms-nav-item" onClick={closeSidebar}><span className="lms-nav-icon"><UiIcon name="progress" /></span><span>На перевірці</span></NavLink>
              <div className="lms-nav-divider" />
              <button type="button" className="lms-nav-item lms-nav-unavailable" disabled title="Сторінка студентів ментора поки недоступна"><span className="lms-nav-icon"><UiIcon name="users" /></span><span>Студенти</span></button>
              <button type="button" className="lms-nav-item lms-nav-unavailable" disabled title="Окрема сторінка курсів ментора поки недоступна; призначені курси доступні на головній панелі"><span className="lms-nav-icon"><UiIcon name="courses" /></span><span>Курси</span></button>
              <button type="button" className="lms-nav-item lms-nav-unavailable" disabled title="Розклад поки недоступний"><span className="lms-nav-icon"><UiIcon name="calendar" /></span><span>Розклад</span></button>
              <button type="button" className="lms-nav-item lms-nav-unavailable" disabled title="Повідомлення поки недоступні"><span className="lms-nav-icon"><UiIcon name="mail" /></span><span>Повідомлення</span></button>
              <div className="lms-nav-divider mentor-profile-nav-separator" />
              <button type="button" className="lms-nav-item lms-nav-unavailable" disabled title="Окрема сторінка зворотного зв’язку поки недоступна; відгук до роботи доступний у черзі перевірки"><span className="lms-nav-icon"><UiIcon name="feedback" /></span><span>Зворотний зв’язок</span></button>
              <div className="lms-nav-divider mentor-profile-nav-separator" />
              <NavLink to="/mentor/profile" aria-label="Профіль ментора" className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}><span className="lms-nav-icon"><UiIcon name="person" /></span><span>Профіль</span></NavLink>
              <button type="button" className="lms-nav-item lms-nav-unavailable" disabled title="Додаткові налаштування поки недоступні"><span className="lms-nav-icon"><UiIcon name="settings" /></span><span>Налаштування</span></button>
              <NavLink to="/community" aria-label="Спільнота" className="lms-nav-item mentor-profile-tablet-community" onClick={closeSidebar}><span className="lms-nav-icon"><UiIcon name="users" /></span><span>Спільнота</span></NavLink>
            </>
          )}

          {isMentor && !isMentorProfile && (
            <>
              <NavLink to="/mentor" end className={({ isActive }) => `lms-nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
                <span className="lms-nav-icon"><UiIcon name="home" /></span>
                <span>Головна панель</span>
              </NavLink>
              <NavLink to="/mentor/submissions" className={({ isActive }) => `lms-nav-item ${isActive || location.pathname.startsWith("/mentor/review/") ? "active" : ""}`} onClick={closeSidebar}>
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
          <div className="lms-promo-title">{isAdmin ? "Системні дані поки недоступні" : isMentor ? "Допомагайте розвиватися" : "Створи свій шлях у сталому дизайні"}</div>
          <div className="lms-promo-desc">
            {isAdmin ? "Переглядайте доступні показники платформи в розділі аналітики." : isMentor ? "Конструктивний feedback допомагає студентам бачити сильні сторони роботи та розуміти наступний крок." : "Кожен проєкт — це крок до кращого майбутнього для нас і планети."}
          </div>
          <Link to={isAdmin ? "/admin/analytics" : "/about"} className="lms-promo-link" onClick={closeSidebar}>
            <span>{isAdmin ? "Переглянути аналітику" : "Дізнатися більше"} <UiIcon name="arrow" /></span>
          </Link>
        </div>

        <div className="lms-sidebar-footer">
          <span>&copy; 2026 NEXYLVA</span>
          <Link to="/contacts" style={{ color: isSubmissionResult || isMentorProfile ? '#FFFFFF' : '#AABDB3', textDecoration: 'none' }} onClick={closeSidebar}>Підтримка</Link>
          {isMentorProfile && <Link to="/community" style={{ color: '#FFFFFF', textDecoration: 'none' }} onClick={closeSidebar}>Спільнота</Link>}
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
              aria-expanded={sidebarOpen}
              aria-controls="lms-sidebar"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <span className="lms-topbar-breadcrumb">
              {isAdmin ? `Admin LMS / ${{ "/admin/users": "Користувачі", "/admin/courses": "Курси", "/admin/orders": "Замовлення / Оплати", "/admin/analytics": "Аналітика", "/admin/profile": "Профіль" }[location.pathname] || "Головна"}` : isMentor ? `Mentor LMS / ${isMentorProfile ? "Профіль" : (location.pathname === "/mentor/submissions" || location.pathname.startsWith("/mentor/review/")) ? "На перевірці" : "Кабінет ментора"}` : isStudentInsights ? `Student LMS / ${isStudentHome ? "Головна" : isStudentFeedback ? "Відгуки ментора" : location.pathname === "/student/progress" ? "Прогрес" : "Профіль"}` : isSubmissionResult ? "Student LMS / Результат перевірки" : isAssignment ? "Student LMS / Завдання" : location.pathname === "/student/courses" || location.pathname.startsWith("/student/learning/") ? "Student LMS / Мої курси" : "Student LMS / Головна"}
            </span>
          </div>

          <div className="lms-topbar-right">
            <div className="lms-search-box">
              <UiIcon name="search" size={16} style={{ color: "#557061" }} />
              <input
                type="text"
                placeholder="Пошук курсу..."
                aria-label="Пошук курсу"
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
              <UiIcon name={isSubmissionResult || isMentorProfile ? "bell-filled" : "bell"} size={20} />

            </button>

            <div className="lms-user-menu" ref={dropdownRef}>
              <button
                type="button"
                className="lms-user-btn"
                aria-label={"Меню користувача: " + (profile?.username || profile?.name || "Користувач")}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
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
