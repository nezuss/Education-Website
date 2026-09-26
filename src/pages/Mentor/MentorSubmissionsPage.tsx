import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/MentorPortal.css";

interface SubmissionItem {
  id: string;
  num: string;
  studentName: string;
  studentRole: string;
  avatar: string;
  workTitle: string;
  assignmentName: string;
  courseName: string;
  module: string;
  dateStr: string;
  status: "reviewed" | "new" | "in-review" | "returned";
  statusText: string;
  actionText: string;
  actionType: "primary" | "secondary";
}

export default function MentorSubmissionsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const submissions: SubmissionItem[] = [
    {
      id: "1",
      num: "1",
      studentName: "Анна Коваль",
      studentRole: "Студентка",
      avatar: "/about/team_1.webp",
      workTitle: "Аналіз життєвого циклу продукту",
      assignmentName: "Практичне завдання №2",
      courseName: "LCA & Еко-проєктування",
      module: "Модуль 4",
      dateStr: "10 серпня • 14:26",
      status: "reviewed",
      statusText: "Перевірено",
      actionText: "Переглянути",
      actionType: "secondary"
    },
    {
      id: "2",
      num: "2",
      studentName: "Марія Іванова",
      studentRole: "Студентка",
      avatar: "/about/team_2.webp",
      workTitle: "Матеріальна карта продукту",
      assignmentName: "Практичне завдання №1",
      courseName: "LCA & Еко-проєктування",
      module: "Модуль 4",
      dateStr: "9 серпня • 18:40",
      status: "new",
      statusText: "Нова робота",
      actionText: "Перевірити",
      actionType: "primary"
    },
    {
      id: "3",
      num: "3",
      studentName: "Олексій Бондар",
      studentRole: "Студент",
      avatar: "/about/team_3.webp",
      workTitle: "Zero-Waste Packaging Concept",
      assignmentName: "Проєктна робота",
      courseName: "Zero-Waste Пакування",
      module: "Модуль 5",
      dateStr: "8 серпня • 12:15",
      status: "in-review",
      statusText: "На перевірці",
      actionText: "Продовжити",
      actionType: "secondary"
    },
    {
      id: "4",
      num: "4",
      studentName: "Наталія Савчук",
      studentRole: "Студентка",
      avatar: "/about/team_4.webp",
      workTitle: "Аудит сталих комунікацій бренду",
      assignmentName: "Практичне завдання №3",
      courseName: "Циркулярний брендинг",
      module: "Модуль 2",
      dateStr: "7 серпня • 09:10",
      status: "returned",
      statusText: "Повернено",
      actionText: "Відкрити",
      actionType: "primary"
    }
  ];

  const filtered = submissions.filter((item) => {
    if (filter === "new" && item.status !== "new") return false;
    if (filter === "in-review" && item.status !== "in-review") return false;
    if (filter === "returned" && item.status !== "returned") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.studentName.toLowerCase().includes(q) ||
        item.workTitle.toLowerCase().includes(q) ||
        item.courseName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="mentor-container">
      
      <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
        <Link to="/mentor" style={{ color: "inherit", textDecoration: "none" }}>Головна</Link>
        {" > "}
        <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>На перевірці</span>
      </div>

      <header className="mentor-header">
        <div>
          <h1 className="mentor-header-title">
            Завдання на перевірці
          </h1>
          <p className="mentor-header-sub">
            Перевіряйте роботи студентів, залишайте feedback та відстежуйте статус перевірки.
          </p>
        </div>
        <div className="mentor-date-badge">
          {new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" }).format(new Date())}
        </div>
      </header>

      <section className="queue-stats-row">
        <div className="queue-banner-card">
          <div className="queue-tag">[ Огляд ]</div>
          <h2 className="queue-banner-title">Черга перевірки</h2>
          <p className="queue-banner-sub">
            Усі роботи, які зараз потребують вашої уваги.
          </p>
        </div>

        <div className="mentor-metric-card">
          <div className="mentor-metric-value">3</div>
          <div className="mentor-metric-label">очікують перевірки</div>
        </div>

        <div className="mentor-metric-card">
          <div className="mentor-metric-value">1</div>
          <div className="mentor-metric-label">нова робота</div>
        </div>

        <div className="mentor-metric-card">
          <div className="mentor-metric-value">2</div>
          <div className="mentor-metric-label">у роботі</div>
        </div>
      </section>

      <div className="mentor-toolbar">
        <div className="mentor-filter-group">
          <button
            type="button"
            className={`mentor-filter-pill ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Усі
          </button>
          <button
            type="button"
            className={`mentor-filter-pill ${filter === "new" ? "active" : ""}`}
            onClick={() => setFilter("new")}
          >
            Нові
          </button>
          <button
            type="button"
            className={`mentor-filter-pill ${filter === "in-review" ? "active" : ""}`}
            onClick={() => setFilter("in-review")}
          >
            На перевірці
          </button>
          <button
            type="button"
            className={`mentor-filter-pill ${filter === "returned" ? "active" : ""}`}
            onClick={() => setFilter("returned")}
          >
            Повернено
          </button>
        </div>

        <div className="mentor-search-controls">
          <div className="mentor-search-input-wrap">
            <span className="mentor-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Знайти роботу..."
              className="mentor-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="mentor-select" aria-label="Фільтр курсів">
            <option>Усі курси</option>
            <option>LCA & Еко-проєктування</option>
            <option>Zero-Waste Пакування</option>
            <option>Циркулярний брендинг</option>
          </select>

          <select className="mentor-select" aria-label="Сортування">
            <option>Сортувати: Спочатку нові</option>
            <option>Сортувати: За дедлайном</option>
            <option>Сортувати: За студентом</option>
          </select>
        </div>
      </div>

      <div className="mentor-table-wrap">
        <div className="mentor-table-header">
          <span>№</span>
          <span>Студент</span>
          <span>Робота</span>
          <span>Курс / модуль / надіслано</span>
          <span>Статус</span>
          <span>Дія</span>
        </div>

        {filtered.map((item) => (
          <div key={item.id} className="mentor-table-row">
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 700, color: "var(--accent-warm)" }}>
              {item.num}
            </span>

            <div className="mentor-student-col">
              <img src={item.avatar} alt={item.studentName} className="mentor-avatar-img" />
              <div>
                <div className="mentor-student-name">{item.studentName}</div>
                <div className="mentor-student-role">{item.studentRole}</div>
              </div>
            </div>

            <div>
              <div className="mentor-work-title">{item.workTitle}</div>
              <div className="mentor-work-sub">{item.assignmentName}</div>
            </div>

            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{item.courseName}</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{item.module} • {item.dateStr}</div>
            </div>

            <div>
              <span className={`mentor-status-pill ${item.status}`}>
                {item.statusText}
              </span>
            </div>

            <div>
              <Link
                to={`/mentor/review/${item.id}`}
                className={`mentor-action-btn ${item.actionType === "secondary" ? "secondary" : ""}`}
              >
                {item.actionText} &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
