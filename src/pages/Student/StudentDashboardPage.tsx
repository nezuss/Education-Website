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
  const [, setLoading] = useState(true);

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
            // stats not ready
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const activeCourse = courses[0];
  const progressVal = activeCourseStats?.progressPercentage ?? 42;

  return (
    <div className="std-dash">
      {/* Greeting Row */}
      <div className="std-greeting-row">
        <div>
          <h1 className="std-greeting-title">
            <span>👋</span>
            <span>Добрий день, {profile?.username || "Анно"}</span>
          </h1>
          <p className="std-greeting-sub">
            Продовжуйте навчання та не пропустіть найближчі дедлайни.
          </p>
        </div>
        <div className="std-date-badge">10 серпня 2026</div>
      </div>

      {/* Row 1: Active Course + Overview Stats */}
      <div className="std-top-grid">
        <div className="std-active-course-card">
          <div className="std-active-course-left">
            <span className="std-badge-tag">[ ПРОДОВЖИТИ НАВЧАННЯ ]</span>
            <h2 className="std-active-course-title">
              {activeCourse?.title || "LCA & Еко-проєктування"}
            </h2>
            <div className="std-active-course-module">
              Модуль 4 — Підбір еко-сировини та оцінка життєвого циклу.
            </div>

            <div className="std-course-chips">
              <span className="std-chip">4 / 10 модулів</span>
              <span className="std-chip">12 уроків завершено</span>
              <span className="std-chip">PRO</span>
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
              to={activeCourse ? `/student/learning/${activeCourse.id}` : "/student/courses"}
              className="std-continue-btn"
            >
              <span>Продовжити навчання</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="std-active-course-art">
            <img
              src="/student/lca_card_art.webp"
              alt="LCA Course Visual"
            />
          </div>
        </div>

        {/* Overview Stats */}
        <div className="std-overview-card">
          <span className="std-badge-tag" style={{ color: "#385546" }}>[ ОГЛЯД ]</span>
          <h3 className="std-overview-title">Навчання</h3>

          <div className="std-stats-2x2">
            <div className="std-stat-box">
              <span className="std-stat-num">{courses.length > 0 ? courses.length : 2}</span>
              <span className="std-stat-name">активні курси</span>
            </div>
            <div className="std-stat-box">
              <span className="std-stat-num">1</span>
              <span className="std-stat-name">завершений курс</span>
            </div>
            <div className="std-stat-box">
              <span className="std-stat-num">3</span>
              <span className="std-stat-name">проєкти здано</span>
            </div>
            <div className="std-stat-box">
              <span className="std-stat-num">1</span>
              <span className="std-stat-name">сертифікат</span>
            </div>
          </div>

          <div className="std-overview-deadline">
            Наступний дедлайн: <strong>14 серпня</strong>
            <br />
            Практичне завдання №2
          </div>
        </div>
      </div>

      {/* Row 2: Practical Assignment + Mentor Feedback */}
      <div className="std-mid-grid">
        <div className="std-assignment-card">
          <div>
            <span className="std-badge-tag">[ ЗАВДАННЯ ]</span>
            <h3>Практичне завдання №2</h3>
            <p>
              Аналіз життєвого циклу продукту. Завантажте короткий аналіз та схему життєвого циклу обраного продукту.
            </p>
          </div>
          <div className="std-assignment-footer">
            <span style={{ fontSize: "13px", color: "#8C6D53" }}>
              Дедлайн: 14 серпня
            </span>
            <Link to="/student/assignments/1" className="std-assignment-link">
              Переглянути деталі &rarr;
            </Link>
          </div>
        </div>

        <div className="std-feedback-card">
          <div>
            <span className="std-badge-tag">[ МЕНТОР ]</span>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, margin: "8px 0 0 0" }}>
              Останній фідбек
            </h3>
            <p className="std-feedback-quote">
              “Добре пропрацьований вибір матеріалу. Додайте аргументацію щодо повторного використання.”
            </p>
          </div>

          <div className="std-mentor-meta">
            <img
              src="/student/mentor_mazur.webp"
              alt="Mentor Mazur"
              className="std-mentor-avatar"
            />
            <div>
              <div className="std-mentor-name">Андрій Мазур</div>
              <div className="std-mentor-role">Senior Eco-Designer @ NEXYLVA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Activity + Show Progress + Tree Illustration */}
      <div className="std-bot-grid">
        <div className="std-activity-card">
          <span className="std-badge-tag">[ АКТИВНІСТЬ ]</span>
          <h3>Останні події</h3>

          <div className="std-activity-item">
            <div className="std-activity-icon">✓</div>
            <div className="std-activity-info">
              <div className="std-act-title">Урок завершено</div>
              <div className="std-act-sub">Матеріали та їх вплив</div>
            </div>
            <span className="std-act-time">сьогодні</span>
          </div>

          <div className="std-activity-item">
            <div className="std-activity-icon">💬</div>
            <div className="std-activity-info">
              <div className="std-act-title">Новий фідбек</div>
              <div className="std-act-sub">Від Андрія Мазура</div>
            </div>
            <span className="std-act-time">2 год</span>
          </div>

          <div className="std-activity-item">
            <div className="std-activity-icon">🔓</div>
            <div className="std-activity-info">
              <div className="std-act-title">Відкрито модуль 4</div>
              <div className="std-act-sub">Підбір еко-сировини</div>
            </div>
            <span className="std-act-time">вчора</span>
          </div>
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
