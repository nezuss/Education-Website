import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEnrolledCourses } from "../../services/courseService";
import { getProfile, type UserProfile } from "../../services/profileService";
import { getCourseStats, type CourseStats } from "../../services/courseStatsService";
import type { Course } from "../../types/course";
import "../../styles/StudentDashboard.css";

export default function StudentDashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [profile, setProfile] = useState<UserProfile>();
  const [activeCourseStats, setActiveCourseStats] = useState<CourseStats>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getEnrolledCourses().catch(() => [] as Course[]),
      getProfile().catch(() => undefined),
    ])
      .then(async ([enrolled, prof]) => {
        setCourses(enrolled);
        if (prof) setProfile(prof);
        if (enrolled.length > 0) {
          try {
            const stats = await getCourseStats(enrolled[0].id);
            setActiveCourseStats(stats);
          } catch {
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const activeCourse = courses[0];
  const progressVal = Math.round(activeCourseStats?.progressPercentage ?? 0);
  const formattedDate = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" }).format(new Date());

  if (loading) {
    return (
      <div className="std-dash" style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "36px", marginBottom: "16px" }}>⏳</div>
        <h2 style={{ color: "var(--color-brand-dark)", fontSize: "20px" }}>Завантаження кабінету...</h2>
      </div>
    );
  }

  return (
    <div className="std-dash">
      
      <div className="std-greeting-row">
        <div>
          <h1 className="std-greeting-title">
            <span>👋</span>
            <span>Добрий день, {profile?.username || profile?.name || "Студенте"}</span>
          </h1>
          <p className="std-greeting-sub">
            Продовжуйте навчання та не пропустіть найближчі дедлайни.
          </p>
        </div>
        <div className="std-date-badge">{formattedDate}</div>
      </div>

      <div className="std-top-grid">
        {activeCourse ? (
          <div className="std-active-course-card">
            <div className="std-active-course-left">
              <span className="std-badge-tag">[ ПРОДОВЖИТИ НАВЧАННЯ ]</span>
              <h2 className="std-active-course-title">
                {activeCourse.title}
              </h2>
              <div className="std-active-course-module">
                {activeCourseStats?.title || activeCourse.description || "Курс у процесі вивчення"}
              </div>

              <div className="std-course-chips">
                <span className="std-chip">
                  {activeCourseStats
                    ? `${activeCourseStats.completedModules} / ${activeCourseStats.totalModules} модулів`
                    : `${activeCourse.modules?.length || 0} модулів`}
                </span>
                <span className="std-chip">
                  {activeCourseStats
                    ? `${activeCourseStats.completedLessons} / ${activeCourseStats.totalLessons} уроків завершено`
                    : "0 уроків завершено"}
                </span>
              </div>

              <div className="std-progress-wrap">
                <div className="std-progress-label">
                  <span>Ваш прогрес</span>
                  <span>{progressVal}%</span>
                </div>
                <div className="std-progress-bar-bg">
                  <div
                    className="std-progress-bar-fill"
                    style={{ width: `${progressVal}%` }}
                  ></div>
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
                src={activeCourse.bannerUrl || "/student/lca_card_art.webp"}
                alt={activeCourse.title}
              />
            </div>
          </div>
        ) : (
          <div className="std-active-course-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", padding: "40px 32px" }}>
            <span className="std-badge-tag">[ ВІТАЄМО В NEXYLVA ]</span>
            <h2 className="std-active-course-title" style={{ fontSize: "24px", marginBottom: "8px" }}>
              У вас поки немає активних курсів
            </h2>
            <p style={{ color: "var(--color-brand-soft)", fontSize: "14px", margin: "0 0 24px 0", maxWidth: "480px" }}>
              Оберіть курс у нашому каталозі, щоб розпочати навчання сталого дизайну та отримати практичні навички.
            </p>
            <Link to="/courses" className="std-continue-btn">
              <span>Обрати курс у каталозі</span>
              <span>&rarr;</span>
            </Link>
          </div>
        )}

        <div className="std-overview-card">
          <span className="std-badge-tag" style={{ color: "#385546" }}>[ ОГЛЯД ]</span>
          <h3 className="std-overview-title">Навчання</h3>

          <div className="std-stats-2x2">
            <div className="std-stat-box">
              <span className="std-stat-num">{courses.length}</span>
              <span className="std-stat-name">активні курси</span>
            </div>
            <div className="std-stat-box">
              <span className="std-stat-num">{activeCourseStats && activeCourseStats.progressPercentage >= 100 ? 1 : 0}</span>
              <span className="std-stat-name">завершений курс</span>
            </div>
            <div className="std-stat-box">
              <span className="std-stat-num">{activeCourseStats?.completedSubmittableMaterials ?? activeCourse?.projectsReadyForPortfolio ?? 0}</span>
              <span className="std-stat-name">робіт здано</span>
            </div>
            <div className="std-stat-box">
              <span className="std-stat-num">{activeCourseStats && activeCourseStats.progressPercentage >= 100 ? 1 : 0}</span>
              <span className="std-stat-name">сертифікат</span>
            </div>
          </div>

          <div className="std-overview-deadline">
            Наступний дедлайн: <strong>{activeCourse ? "Перевірте завдання" : "—"}</strong>
            <br />
            {activeCourse ? activeCourse.title : "Немає активних дедлайнів"}
          </div>
        </div>
      </div>

      <div className="std-mid-grid">
        <div className="std-assignment-card">
          <div>
            <span className="std-badge-tag">[ ЗАВДАННЯ ]</span>
            <h3>{activeCourse ? `Практичне завдання` : "Немає активних завдань"}</h3>
            <p>
              {activeCourse
                ? `Виконайте практичне завдання курсу «${activeCourse.title}» та завантажте результат на перевірку.`
                : "Оберіть курс у каталозі для початку."}
            </p>
          </div>
          <div className="std-assignment-footer">
            <span style={{ fontSize: "13px", color: "#8C6D53" }}>
              Перевірте дедлайни у матеріалах курсу
            </span>
            <Link to={activeCourse ? `/student/learning/${activeCourse.id}` : "/student/courses"} className="std-assignment-link">
              Переглянути деталі &rarr;
            </Link>
          </div>
        </div>

        <div className="std-feedback-card">
          <div>
            <span className="std-badge-tag">[ МЕНТОР ]</span>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, margin: "8px 0 0 0" }}>
              Зворотний зв'язок
            </h3>
            <p className="std-feedback-quote">
              {activeCourseStats && activeCourseStats.completedSubmittableMaterials > 0
                ? "Ваші роботи надіслано на перевірку. Очікуйте фідбек від ментора протягом 48 годин."
                : "Виконуйте перше практичне завдання, щоб отримати зворотний зв'язок від ментора."}
            </p>
          </div>

          <div className="std-mentor-meta">
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(19,73,44,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
              🧑‍🏫
            </div>
            <div>
              <div className="std-mentor-name">{activeCourse?.mentor || "Ментор курсу"}</div>
              <div className="std-mentor-role">NEXYLVA Platform</div>
            </div>
          </div>
        </div>
      </div>

      <div className="std-bot-grid">
        <div className="std-activity-card">
          <span className="std-badge-tag">[ АКТИВНІСТЬ ]</span>
          <h3>Останні події</h3>

          {activeCourseStats && activeCourseStats.completedLessons > 0 ? (
            <div className="std-activity-item">
              <div className="std-activity-icon">✓</div>
              <div className="std-activity-info">
                <div className="std-act-title">Уроків завершено: {activeCourseStats.completedLessons}</div>
                <div className="std-act-sub">{activeCourse?.title || "Курс"}</div>
              </div>
              <span className="std-act-time">активно</span>
            </div>
          ) : (
            <div className="std-activity-item">
              <div className="std-activity-icon">📖</div>
              <div className="std-activity-info">
                <div className="std-act-title">Почніть навчання</div>
                <div className="std-act-sub">Виконайте перший урок курсу</div>
              </div>
              <span className="std-act-time">зараз</span>
            </div>
          )}

          {courses.length > 0 && (
            <div className="std-activity-item">
              <div className="std-activity-icon">🎓</div>
              <div className="std-activity-info">
                <div className="std-act-title">Активних курсів: {courses.length}</div>
                <div className="std-act-sub">Продовжуйте навчання</div>
              </div>
              <span className="std-act-time">сьогодні</span>
            </div>
          )}

          {activeCourseStats && activeCourseStats.completedSubmittableMaterials > 0 && (
            <div className="std-activity-item">
              <div className="std-activity-icon">📝</div>
              <div className="std-activity-info">
                <div className="std-act-title">Здано робіт: {activeCourseStats.completedSubmittableMaterials}</div>
                <div className="std-act-sub">Очікують оцінки</div>
              </div>
              <span className="std-act-time">активно</span>
            </div>
          )}
        </div>

        <div className="std-community-invite-card">
          <div>
            <span className="std-badge-tag">[ СПІЛЬНОТА ]</span>
            <h3>Покажіть свій прогрес</h3>
            <p>
              Діліться проєктами, отримуйте реакції та дивіться роботи інших студентів.
            </p>
          </div>
          <Link to="/community" className="std-community-btn">
            <span>Перейти у спільноту</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="std-art-illustration-col">
          <img
            src="/student/tree_circuits.webp"
            alt="Eco tech tree circuits"
          />
        </div>
      </div>
    </div>
  );
}
