import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEnrolledCourses } from "../../services/courseService";
import type { Course } from "../../types/course";
import "../../styles/StudentDashboard.css";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");
  const [, setLoading] = useState(true);

  useEffect(() => {
    getEnrolledCourses()
      .then((data) => setCourses(data))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const displayCourses = courses.length > 0 ? courses : [
    {
      id: "1",
      title: "LCA & Еко-проєктування",
      description: "Оцінка життєвого циклу продукту, вибір еко-сировини та циркулярний дизайн.",
      mentor: "Андрій Мазур",
      totalLearningPeriodWeeks: 8,
      category: "Design",
      materials: [],
      tags: ["PRO", "LCA"]
    },
    {
      id: "2",
      title: "Біоматеріали у сучасному пакуванні",
      description: "Від водоростей і міцелію до промислових зразків біопластику.",
      mentor: "Олена Бойко",
      totalLearningPeriodWeeks: 6,
      category: "Materials",
      materials: [],
      tags: ["Materials"]
    },
    {
      id: "3",
      title: "Креативний апсайклінг",
      description: "Переосмислення вторинного текстилю, дерева та промислових залишків.",
      mentor: "Ірина Шевченко",
      totalLearningPeriodWeeks: 4,
      category: "Upcycling",
      materials: [],
      tags: ["Upcycling"]
    }
  ];

  const filtered = displayCourses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="std-dash">
      
      <div style={{ fontSize: "14px", color: "var(--color-brand-soft)", display: "flex", gap: "8px" }}>
        <Link to="/student" style={{ color: "var(--color-brand-soft)", textDecoration: "none" }}>Головна</Link>
        <span>&gt;</span>
        <span style={{ color: "var(--color-brand-dark)", fontWeight: 500 }}>Мої курси</span>
      </div>

      <div className="std-greeting-row">
        <div>
          <h1 className="std-greeting-title">Мої курси</h1>
          <p className="std-greeting-sub">
            Продовжуйте активні курси, переглядайте завершені та слідкуйте за прогресом.
          </p>
        </div>
        <div className="std-date-badge">10 серпня 2026</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className={`std-chip ${filter === "all" ? "active" : ""}`}
            style={{
              cursor: "pointer",
              border: "none",
              padding: "8px 16px",
              background: filter === "all" ? "var(--color-brand-dark)" : "var(--color-bg-sand)",
              color: filter === "all" ? "#FFFFFF" : "var(--color-brand-dark)"
            }}
            onClick={() => setFilter("all")}
          >
            Усі
          </button>
          <button
            type="button"
            className={`std-chip ${filter === "active" ? "active" : ""}`}
            style={{
              cursor: "pointer",
              border: "none",
              padding: "8px 16px",
              background: filter === "active" ? "var(--color-brand-dark)" : "var(--color-bg-sand)",
              color: filter === "active" ? "#FFFFFF" : "var(--color-brand-dark)"
            }}
            onClick={() => setFilter("active")}
          >
            Активні
          </button>
          <button
            type="button"
            className={`std-chip ${filter === "completed" ? "active" : ""}`}
            style={{
              cursor: "pointer",
              border: "none",
              padding: "8px 16px",
              background: filter === "completed" ? "var(--color-brand-dark)" : "var(--color-bg-sand)",
              color: filter === "completed" ? "#FFFFFF" : "var(--color-brand-dark)"
            }}
            onClick={() => setFilter("completed")}
          >
            Завершені
          </button>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div className="lms-search-box" style={{ width: "300px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#557061" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Знайти курс..."
              className="lms-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span style={{ fontSize: "14px", color: "var(--color-brand-soft)", cursor: "pointer" }}>
            Сортувати ▾
          </span>
        </div>
      </div>

      <div className="std-top-grid">
        <div className="std-active-course-card">
          <div className="std-active-course-left">
            <span className="std-badge-tag">[ ПРОДОВЖИТИ НАВЧАННЯ ]</span>
            <h2 className="std-active-course-title">LCA &amp; Еко-проєктування</h2>
            <div className="std-active-course-module">
              Останній відкритий курс: Модуль 4 • Урок 3 Підбір еко-сировини
            </div>

            <div className="std-progress-wrap">
              <div className="std-progress-label">
                <span>Ваш прогрес</span>
                <span>42%</span>
              </div>
              <div className="std-progress-bar-bg">
                <div className="std-progress-bar-fill" style={{ width: "42%" }}></div>
              </div>
            </div>

            <Link to="/student/learning/1" className="std-continue-btn">
              <span>Продовжити навчання</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="std-active-course-art">
            <img src="/student/my_courses_hero.webp" alt="LCA Workspace" />
          </div>
        </div>

        <div className="std-overview-card" style={{ background: "#C4D3CB" }}>
          <span className="std-badge-tag" style={{ color: "#385546" }}>[ НАСТУПНЕ ]</span>
          <h3 className="std-overview-title" style={{ fontSize: "24px" }}>Що далі?</h3>
          <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-brand-dark)", margin: "0 0 4px 0" }}>
            Практичне завдання №2
          </p>
          <p style={{ fontSize: "14px", color: "var(--color-brand-soft)", margin: "0 0 20px 0" }}>
            Аналіз життєвого циклу продукту.
          </p>

          <div style={{ background: "var(--color-bg-sand)", padding: "12px 18px", borderRadius: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", color: "#8C6D53" }}>Дедлайн</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-brand-dark)" }}>14 серпня</span>
          </div>

          <Link to="/student/learning/1" className="std-continue-btn" style={{ width: "100%", justifyContent: "center", boxSizing: "border-box" }}>
            <span>Переглянути програму &rarr;</span>
          </Link>
        </div>
      </div>

      <div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 700, color: "var(--color-brand-dark)", marginBottom: "20px" }}>
          Усі мої курси
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {filtered.map((course, idx) => (
            <div
              key={course.id}
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(10, 45, 27, 0.04)",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <img
                src={idx === 0 ? "/student/my_courses_hero.webp" : idx === 1 ? "/courses/course_card_2.webp" : "/courses/course_card_3.webp"}
                alt={course.title}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
                <span className="std-badge-tag">[ {(course as any).category || "DESIGN"} ]</span>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 700, color: "var(--color-brand-dark)", margin: "0 0 8px 0" }}>
                  {course.title}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--color-brand-soft)", margin: "0 0 16px 0", lineHeight: 1.4 }}>
                  {course.description}
                </p>

                <div style={{ marginTop: "auto" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
                    <span>Прогрес</span>
                    <span>{idx === 0 ? "42%" : idx === 1 ? "18%" : "0%"}</span>
                  </div>
                  <div className="std-progress-bar-bg" style={{ marginBottom: "16px" }}>
                    <div className="std-progress-bar-fill" style={{ width: idx === 0 ? "42%" : idx === 1 ? "18%" : "0%" }}></div>
                  </div>

                  <Link
                    to={`/student/learning/${course.id}`}
                    className="std-continue-btn"
                    style={{ width: "100%", justifyContent: "center", boxSizing: "border-box" }}
                  >
                    <span>{idx === 0 ? "Продовжити" : "Почати навчання"} &rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
