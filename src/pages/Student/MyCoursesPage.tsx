import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEnrolledCourses } from "../../services/courseService";
import { getCourseStats, type CourseStats } from "../../services/courseStatsService";
import type { Course } from "../../types/course";
import "../../styles/StudentDashboard.css";
import RequestError from "../shared/RequestError";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourseStats, setActiveCourseStats] = useState<CourseStats>();
  const [courseStats, setCourseStats] = useState<Record<string, CourseStats>>({});
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getEnrolledCourses()
      .then(async (data) => {
        setCourses(data);
        const stats = await Promise.all(
          data.map(async (course) => {
            try {
              return [course.id, await getCourseStats(course.id)] as const;
            } catch (reason) {
              setError((reason as Error).message);
              return null;
            }
          }),
        );
        const statsByCourse = Object.fromEntries(
          stats.filter((entry): entry is readonly [string, CourseStats] => entry !== null),
        );
        setCourseStats(statsByCourse);
        if (data[0]) {
          setActiveCourseStats(statsByCourse[data[0].id]);
        }
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  const activeCourse = courses[0];
  const progressVal = Math.round(activeCourseStats?.progressPercentage ?? 0);
  const formattedDate = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" }).format(new Date());

  const filtered = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const progress = courseStats[c.id]?.progressPercentage ?? 0;
    const matchesFilter = filter === "all" || (filter === "active" ? progress < 100 : progress >= 100);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="std-dash">
      {error && <RequestError message={error} />}
      
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
        <div className="std-date-badge">{formattedDate}</div>
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

      {activeCourse && (
        <div className="std-top-grid">
          <div className="std-active-course-card">
            <div className="std-active-course-left">
              <span className="std-badge-tag">[ ПРОДОВЖИТИ НАВЧАННЯ ]</span>
              <h2 className="std-active-course-title">
                {activeCourse.title}
              </h2>
              <div className="std-active-course-module">
                {activeCourseStats?.title || activeCourse.description || "Курс у процесі вивчення"}
              </div>

              <div className="std-progress-wrap">
                <div className="std-progress-label">
                  <span>Ваш прогрес</span>
                  <span>{progressVal}%</span>
                </div>
                <div className="std-progress-bar-bg">
                  <div className="std-progress-bar-fill" style={{ width: `${progressVal}%` }}></div>
                </div>
              </div>

              <Link
                to={`/student/learning/${activeCourse.id}`}
                className="std-continue-btn"
              >
                <span>Продовжити навчання</span>
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="std-active-course-art">
              <img
                src={activeCourse.bannerUrl || "/student/my_courses_hero.webp"}
                alt={activeCourse.title}
              />
            </div>
          </div>

          <div className="std-overview-card" style={{ background: "#C4D3CB" }}>
            <span className="std-badge-tag" style={{ color: "#385546" }}>[ НАСТУПНЕ ]</span>
            <h3 className="std-overview-title" style={{ fontSize: "24px" }}>Що далі?</h3>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-brand-dark)", margin: "0 0 4px 0" }}>
              {activeCourse.title}
            </p>
            <p style={{ fontSize: "14px", color: "var(--color-brand-soft)", margin: "0 0 20px 0" }}>
              Перейдіть до програми курсу та виконуйте завдання.
            </p>

            <Link
              to={`/student/learning/${activeCourse.id}`}
              className="std-continue-btn"
              style={{ width: "100%", justifyContent: "center", boxSizing: "border-box" }}
            >
              <span>Переглянути програму →</span>
            </Link>
          </div>
        </div>
      )}

      <div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 700, color: "var(--color-brand-dark)", marginBottom: "20px" }}>
          Усі мої курси
        </h2>

        {filtered.length === 0 ? (
          <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "40px", textAlign: "center" }}>
            <h3 style={{ fontSize: "18px", color: "var(--color-brand-dark)", marginBottom: "8px" }}>
              {loading ? "Завантаження курсів..." : "У вас поки немає активних курсів"}
            </h3>
            <p style={{ color: "var(--color-brand-soft)", fontSize: "14px", marginBottom: "20px" }}>
              Перегляньте каталог та оберіть напрямок навчання.
            </p>
            <Link to="/courses" className="std-continue-btn" style={{ display: "inline-flex" }}>
              <span>Переглянути каталог курсів →</span>
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
            {filtered.map((course) => {
              const stats = courseStats[course.id];
              const progress = Math.round(stats?.progressPercentage ?? 0);
              const isCompleted = progress >= 100;

              return (
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
                  src={course.bannerUrl || "/course-placeholder.svg"}
                  alt={course.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <span className="std-badge-tag">[ {course.direction || "DESIGN"} ]</span>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 700, color: "var(--color-brand-dark)", margin: "0 0 8px 0" }}>
                    {course.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--color-brand-soft)", margin: "0 0 16px 0", lineHeight: 1.4 }}>
                    {course.description}
                  </p>

                  <div style={{ marginTop: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
                      <span>{isCompleted ? "Прогрес завершено" : "Ваш прогрес"}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="std-progress-bar-bg" style={{ marginBottom: "16px" }}>
                      <div className="std-progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>

                    <Link
                      to={`/student/learning/${course.id}`}
                      className="std-continue-btn"
                      style={{ width: "100%", justifyContent: "center", boxSizing: "border-box" }}
                    >
                      <span>{isCompleted ? "Переглянути курс" : "Продовжити навчання"} &rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
