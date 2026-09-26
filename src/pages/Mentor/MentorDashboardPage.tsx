import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile, type UserProfile } from "../../services/profileService";
import "../../styles/MentorPortal.css";

interface QueueWork {
  id: string;
  num: string;
  studentName: string;
  taskTitle: string;
  courseName: string;
  status: "new" | "in-review" | "reviewed" | "returned";
  statusText: string;
  date: string;
}

export default function MentorDashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const works: QueueWork[] = [
    {
      id: "1",
      num: "02",
      studentName: "Анна Коваль",
      taskTitle: "Аналіз життєвого циклу продукту",
      courseName: "LCA & Еко-проєктування • Модуль 4",
      status: "new",
      statusText: "Нова робота",
      date: "10 серпня"
    },
    {
      id: "2",
      num: "01",
      studentName: "Марія Іванова",
      taskTitle: "Практичне завдання №1 • Надіслано 8 серпня",
      courseName: "LCA & Еко-проєктування • Модуль 3",
      status: "in-review",
      statusText: "На перевірці",
      date: "8 серпня"
    },
    {
      id: "3",
      num: "03",
      studentName: "Олексій Бондар",
      taskTitle: "Zero-Waste Packaging Concept",
      courseName: "Zero-Waste Пакування • Модуль 5",
      status: "in-review",
      statusText: "На перевірці",
      date: "8 серпня"
    }
  ];

  const deadlines = [
    {
      title: "LCA — Завдання №2",
      sub: "5 студентів ще не здали",
      date: "14 серпня"
    },
    {
      title: "Brand Audit",
      sub: "3 студенти ще не здали",
      date: "18 серпня"
    },
    {
      title: "Eco Materials Research",
      sub: "7 студентів ще не здали",
      date: "22 серпня"
    }
  ];

  useEffect(() => {
    getProfile()
      .then((prof) => { if (prof) setProfile(prof); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const mentorName = profile?.username || "Андрію";
  const formattedDate = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" }).format(new Date());

  if (loading) {
    return (
      <div className="mentor-container" style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "36px", marginBottom: "16px" }}>⏳</div>
        <h2 style={{ fontSize: "20px" }}>Завантаження панелі ментора...</h2>
      </div>
    );
  }

  return (
    <div className="mentor-container">
      
      <header className="mentor-header">
        <div>
          <h1 className="mentor-header-title">
            <span>👋</span>
            <span>Добрий день, {mentorName}</span>
          </h1>
          <p className="mentor-header-sub">
            Ось що потребує вашої уваги сьогодні.
          </p>
        </div>
        <div className="mentor-date-badge">
          {formattedDate}
        </div>
      </header>

      <section className="mentor-hero-card">
        <div className="mentor-hero-top">
          <div className="mentor-hero-heading">
            <h2>Огляд роботи ментора</h2>
            <p>Перевірки, студенти та активність за поточний тиждень</p>
          </div>
          <div className="mentor-hero-ring">
            <div className="mentor-hero-ring-inner">
              72%
            </div>
          </div>
        </div>

        <div className="mentor-hero-metrics">
          <div className="mentor-metric-card">
            <div className="mentor-metric-value">3</div>
            <div className="mentor-metric-label">роботи на перевірці</div>
          </div>
          <div className="mentor-metric-card">
            <div className="mentor-metric-value">18</div>
            <div className="mentor-metric-label">активних студентів</div>
          </div>
          <div className="mentor-metric-card">
            <div className="mentor-metric-value">2</div>
            <div className="mentor-metric-label">заняття сьогодні</div>
          </div>
        </div>
      </section>

      <div className="mentor-grid-layout">
        
        <section>
          <div className="mentor-section-header">
            <h2 className="mentor-section-title">На перевірці</h2>
            <Link to="/mentor/submissions" className="mentor-section-link">
              Усі роботи &rarr;
            </Link>
          </div>

          <div className="mentor-works-panel">
            <div className="mentor-works-panel-header">
              <h3 className="mentor-works-panel-title">Нові роботи студентів</h3>
              <span className="mentor-works-panel-badge">{works.length} роботи</span>
            </div>

            {works.map((work) => (
              <div key={work.id} className="mentor-work-item">
                <div className="mentor-work-num">{work.num}</div>
                <div className="mentor-work-info">
                  <div className="mentor-work-name">{work.studentName}</div>
                  <div className="mentor-work-task">{work.taskTitle}</div>
                  <div className="mentor-work-course">{work.courseName}</div>
                </div>
                <span className={`mentor-status-pill ${work.status}`}>
                  {work.statusText}
                </span>
                <Link
                  to={`/mentor/review/${work.id}`}
                  className="mentor-action-btn"
                >
                  Перевірити &rarr;
                </Link>
              </div>
            ))}
          </div>
        </section>

        <aside>
          <div className="mentor-section-header">
            <h2 className="mentor-section-title">Дедлайни</h2>
          </div>

          <div className="mentor-deadlines-panel">
            <div className="mentor-deadlines-header">
              <h3 className="mentor-deadlines-title">Найближчі дедлайни</h3>
            </div>

            {deadlines.map((dl, idx) => (
              <div key={idx} className="mentor-deadline-item">
                <div>
                  <div className="mentor-deadline-title">{dl.title}</div>
                  <div className="mentor-deadline-sub">{dl.sub}</div>
                </div>
                <div className="mentor-deadline-badge">{dl.date}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
