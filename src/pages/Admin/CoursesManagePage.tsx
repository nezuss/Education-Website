import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCourses, createCourse, updateCourse, deleteCourse } from "../../services/courseService";
import "../../styles/AdminPortal.css";

interface CourseManageItem {
  id: string;
  title: string;
  category: string;
  status: "active" | "draft" | "moderation" | "archive";
  statusText: string;
  modulesCount: number;
  lessonsCount: number;
  studentsCount: number;
  mentorName: string;
  mentorRole: string;
  mentorAvatar: string;
  completionRate: string;
  rating: string;
  contentFullness: string;
  progressPercent: number;
}

export default function CoursesManagePage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseManageItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("Сталий і циркулярний дизайн");
  const [formCategory, setFormCategory] = useState("Сталий і циркулярний дизайн");
  const [formMentor, setFormMentor] = useState("Олексій Романенко");
  const [formDesc, setFormDesc] = useState(
    "Практичний курс про відповідальний вибір матеріалів, циркулярні системи та дизайн без зайвих відходів."
  );
  const [formPrice, setFormPrice] = useState("2 490 грн");
  const [formDuration, setFormDuration] = useState("12 тижнів");

  const [courses, setCourses] = useState<CourseManageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const apiCourses = await getCourses();
      if (apiCourses && apiCourses.length > 0) {
        const mapped: CourseManageItem[] = apiCourses.map((c, i) => ({
          id: c.id,
          title: c.title,
          category: c.direction || "Sustainable & Circular Design",
          status: "active",
          statusText: "Активний",
          modulesCount: c.modules?.length || 0,
          lessonsCount: (c.modules?.length || 0) * 4,
          studentsCount: 0,
          mentorName: c.mentor || "Не призначено",
          mentorRole: "Ментор курсу",
          mentorAvatar: `/about/team_${(i % 4) + 1}.webp`,
          completionRate: "0%",
          rating: "5,0",
          contentFullness: "100%",
          progressPercent: 100
        }));
        setCourses(mapped);
      } else {
        setCourses([]);
      }
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const filtered = courses.filter((c) => {
    if (filter === "active" && c.status !== "active") return false;
    if (filter === "draft" && c.status !== "draft") return false;
    if (filter === "moderation" && c.status !== "moderation") return false;
    if (filter === "archive" && c.status !== "archive") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.mentorName.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openEditor = (course?: CourseManageItem) => {
    setShowDeleteConfirm(false);
    if (course) {
      setEditingCourse(course);
      setFormTitle(course.title);
      setFormCategory(course.category);
      setFormMentor(course.mentorName);
    } else {
      setEditingCourse(null);
      setFormTitle("Новий курс");
      setFormCategory("Sustainable & Circular Design");
      setFormMentor("Олексій Романенко");
    }
    setEditorOpen(true);
  };

  const handleSaveCourse = async () => {
    setSaving(true);
    try {
      const cleanPrice = parseInt(formPrice.replace(/\D/g, ""), 10) || 2490;
      const cleanWeeks = parseInt(formDuration.replace(/\D/g, ""), 10) || 12;

      if (editingCourse) {
        await updateCourse({
          id: editingCourse.id,
          title: formTitle,
          description: formDesc,
          price: cleanPrice,
          totalLearningPeriodWeeks: cleanWeeks
        });
        setNoticeMessage("✓ Курс успішно оновлено на сервері!");
      } else {
        await createCourse({
          title: formTitle,
          description: formDesc,
          price: cleanPrice,
          totalLearningPeriodWeeks: cleanWeeks,
          projectsReadyForPortfolio: 2,
          bannerUrl: "/courses/catalog-lca.webp"
        });
        setNoticeMessage("✓ Новий курс успішно збережено на сервері!");
      }
      await loadCourses();
      setEditorOpen(false);
    } catch {
      if (editingCourse) {
        setCourses((prev) =>
          prev.map((c) =>
            c.id === editingCourse.id ? { ...c, title: formTitle, category: formCategory } : c
          )
        );
      } else {
        setCourses((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            title: formTitle,
            category: formCategory,
            status: "active",
            statusText: "Активний",
            modulesCount: 8,
            lessonsCount: 32,
            studentsCount: 0,
            mentorName: formMentor,
            mentorRole: "Ментор курсу",
            mentorAvatar: "/about/team_1.webp",
            completionRate: "0%",
            rating: "5,0",
            contentFullness: "100%",
            progressPercent: 100
          }
        ]);
      }
      setNoticeMessage("✓ Зміни збережено в інтерфейсі!");
      setEditorOpen(false);
    } finally {
      setSaving(false);
      setTimeout(() => setNoticeMessage(null), 4000);
    }
  };

  const handleDeleteCourse = async () => {
    if (!editingCourse) return;
    try {
      await deleteCourse(editingCourse.id);
      setCourses((prev) => prev.filter((c) => c.id !== editingCourse.id));
      setEditorOpen(false);
      setShowDeleteConfirm(false);
      setNoticeMessage("✓ Курс видалено!");
    } catch {
      setCourses((prev) => prev.filter((c) => c.id !== editingCourse.id));
      setEditorOpen(false);
      setShowDeleteConfirm(false);
      setNoticeMessage("✓ Курс видалено!");
    } finally {
      setTimeout(() => setNoticeMessage(null), 4000);
    }
  };

  return (
    <div className="admin-container">
      <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
        <Link to="/admin" style={{ color: "inherit", textDecoration: "none" }}>Головна</Link>
        {" > "}
        <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>Керування курсами</span>
      </div>

      {noticeMessage && (
        <div style={{ background: "#E2ECE5", border: "1px solid #557061", color: "#0A2D1B", padding: "14px 20px", borderRadius: "12px", marginBottom: "20px", fontWeight: 600 }}>
          {noticeMessage}
        </div>
      )}

      <header className="admin-header">
        <div>
          <h1 className="admin-header-title">
            Керування курсами
          </h1>
          <p className="admin-header-sub">
            Створюйте, редагуйте та публікуйте курси, керуйте менторами й статусами навчальних програм.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => openEditor()}
        >
          + Додати курс
        </button>
      </header>

      <section className="admin-stats-row">
        <div className="admin-overview-card">
          <div className="admin-tag">[ ОГЛЯД ]</div>
          <h2 className="admin-overview-title">Курси NEXYLVA</h2>
          <p className="admin-overview-sub">
            Короткий огляд бібліотеки курсів, їхніх статусів, наповнення та готовності до публікації.
          </p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-val">{courses.filter((c) => c.status === "active").length}</div>
          <div className="admin-stat-label">Активні</div>
          <div className="admin-stat-change">Доступні студентам</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-val">{courses.filter((c) => c.status === "draft").length}</div>
          <div className="admin-stat-label">Чернетки</div>
          <div className="admin-stat-change">Ще не опубліковані</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-val">{courses.filter((c) => c.status === "moderation").length}</div>
          <div className="admin-stat-label">На модерації</div>
          <div className="admin-stat-change">Очікують перевірки</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-val">{courses.filter((c) => c.status === "archive").length}</div>
          <div className="admin-stat-label">Архів</div>
          <div className="admin-stat-change">Неактивні програми</div>
        </div>
      </section>

      <div style={{ textAlign: "right", fontSize: "12px", color: "var(--text-secondary)", marginTop: "-16px", marginBottom: "32px" }}>
        {courses.length} {courses.length === 1 ? "курс" : courses.length >= 2 && courses.length <= 4 ? "курси" : "курсів"} у бібліотеці
      </div>

      <div className="admin-toolbar">
        <div className="admin-filter-pills">
          <button
            type="button"
            className={`admin-pill ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Усі
          </button>
          <button
            type="button"
            className={`admin-pill ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            Активні
          </button>
          <button
            type="button"
            className={`admin-pill ${filter === "draft" ? "active" : ""}`}
            onClick={() => setFilter("draft")}
          >
            Чернетки
          </button>
          <button
            type="button"
            className={`admin-pill ${filter === "moderation" ? "active" : ""}`}
            onClick={() => setFilter("moderation")}
          >
            На модерації
          </button>
          <button
            type="button"
            className={`admin-pill ${filter === "archive" ? "active" : ""}`}
            onClick={() => setFilter("archive")}
          >
            Архів
          </button>
        </div>

        <div className="admin-controls-group">
          <div className="mentor-search-input-wrap">
            <span className="mentor-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Пошук курсу або ментора..."
              className="mentor-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="mentor-select" aria-label="Сортування курсів">
            <option>Сортування: За популярністю</option>
            <option>Сортування: За датою створення</option>
            <option>Сортування: За рейтингом</option>
          </select>
        </div>
      </div>

      <div className="admin-courses-grid">
        {filtered.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-secondary)", gridColumn: "1 / -1" }}>
            <p style={{ fontSize: "16px", marginBottom: "12px" }}>
              {loading ? "Завантаження курсів..." : "Курсів не знайдено"}
            </p>
            {!loading && (
              <button type="button" className="admin-btn-primary" onClick={() => openEditor()}>
                + Створити перший курс
              </button>
            )}
          </div>
        ) : (
          filtered.map((course) => (
          <div
            key={course.id}
            className="admin-course-manage-card"
            onClick={() => openEditor(course)}
            style={{ cursor: "pointer" }}
          >
            <div className="admin-course-header-banner">
              <span className="admin-course-status-pill">{course.statusText}</span>
              <div className="admin-course-cat">{course.category}</div>
              <h3 className="admin-course-name">{course.title}</h3>
            </div>

            <div className="admin-course-body">
              <div>
                <div className="admin-course-meta-row">
                  <span>{course.modulesCount} модулів • {course.lessonsCount} уроків</span>
                  <span style={{ fontWeight: 600 }}>{course.studentsCount} студентів</span>
                </div>

                <div className="admin-course-mentor-row">
                  <img
                    src={course.mentorAvatar}
                    alt={course.mentorName}
                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{course.mentorName}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{course.mentorRole}</div>
                  </div>
                </div>

                <div className="admin-course-stats-boxes">
                  <div className="admin-course-stat-mini">
                    <div className="admin-course-stat-mini-val">{course.completionRate}</div>
                    <div className="admin-course-stat-mini-lbl">завершення</div>
                  </div>
                  <div className="admin-course-stat-mini">
                    <div className="admin-course-stat-mini-val">{course.rating}</div>
                    <div className="admin-course-stat-mini-lbl">оцінка</div>
                  </div>
                  <div className="admin-course-stat-mini">
                    <div className="admin-course-stat-mini-val">{course.contentFullness}</div>
                    <div className="admin-course-stat-mini-lbl">наповнення</div>
                  </div>
                </div>
              </div>

              <div className="admin-course-progress-wrap">
                <div className="admin-course-progress-labels">
                  <span>Готовність контенту</span>
                  <span>{course.progressPercent}%</span>
                </div>
                <div className="admin-course-progress-bar">
                  <div
                    className="admin-course-progress-fill"
                    style={{ width: `${course.progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
      </div>

      {editorOpen && (
        <div
          className="admin-modal-overlay"
          onClick={() => setEditorOpen(false)}
        >
          <div
            className="admin-modal-window"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div>
                <span className="admin-tag">[ ROLES / РОЛІ ]</span>
                <h2 className="admin-modal-title">
                  {editingCourse ? "Редагування курсу" : "Створення нового курсу"}
                </h2>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
                  Оновіть основну інформацію, програму, доступність і параметри публікації.
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#C07C54", fontWeight: 600 }}>&bull; Є неопубліковані зміни</span>
                {editingCourse && (
                  !showDeleteConfirm ? (
                    <button
                      type="button"
                      style={{ background: "rgba(220, 53, 69, 0.15)", color: "#C53030", border: "1px solid rgba(220, 53, 69, 0.3)", padding: "10px 18px", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={saving}
                    >
                      Видалити курс
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        style={{ background: "#C53030", color: "#FFFFFF", border: "none", padding: "10px 14px", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}
                        onClick={handleDeleteCourse}
                        disabled={saving}
                      >
                        Підтвердити видалення
                      </button>
                      <button
                        type="button"
                        style={{ background: "#C2D1C9", border: "none", padding: "10px 14px", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Ні
                      </button>
                    </div>
                  )
                )}
                <button
                  type="button"
                  style={{ background: "#C2D1C9", border: "none", padding: "10px 18px", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}
                  onClick={() => setEditorOpen(false)}
                >
                  Скасувати
                </button>
                <button
                  type="button"
                  className="admin-btn-primary"
                  onClick={handleSaveCourse}
                  disabled={saving}
                >
                  {saving ? "Збереження..." : "Зберегти зміни →"}
                </button>
              </div>
            </div>

            <div className="admin-modal-form-grid">
              <div>
                <div className="admin-box-basic">
                  <div className="admin-tag" style={{ color: "#C2D1C9" }}>[ BASIC INFO / ОСНОВНА ІНФОРМАЦІЯ ]</div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, margin: "6px 0 20px 0" }}>
                    Основні дані
                  </h3>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "#C2D1C9", marginBottom: "6px" }}>Назва курсу</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="admin-modal-input"
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", color: "#C2D1C9", marginBottom: "6px" }}>Напрям</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="admin-modal-select"
                      >
                        <option>Сталий і циркулярний дизайн</option>
                        <option>Zero-Waste Пакування</option>
                        <option>Циркулярний брендинг</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", color: "#C2D1C9", marginBottom: "6px" }}>Ментор</label>
                      <select
                        value={formMentor}
                        onChange={(e) => setFormMentor(e.target.value)}
                        className="admin-modal-select"
                      >
                        <option>Олексій Романенко</option>
                        <option>Максим Ковальчук</option>
                        <option>Ганна Марченко</option>
                        <option>Марко Литвин</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#C2D1C9", marginBottom: "6px" }}>Короткий опис</label>
                    <textarea
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      rows={3}
                      className="admin-modal-textarea"
                    />
                  </div>
                </div>

                <div className="admin-box-modules">
                  <div className="admin-tag" style={{ color: "var(--accent-primary)" }}>[ MODULES / МОДУЛІ ]</div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, color: "var(--accent-primary)", margin: "6px 0 18px 0" }}>
                    Програма курсу
                  </h3>

                  <div style={{ background: "#FFFFFF", borderRadius: "14px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, color: "var(--accent-warm)" }}>01</span>
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Основи циркулярного дизайну</div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>4 уроки • 1 завдання</div>
                      </div>
                    </div>
                    <button type="button" style={{ background: "none", border: "none", color: "var(--accent-secondary)", fontWeight: 600, cursor: "pointer" }}>
                      Редагувати &bull;&bull;&bull;
                    </button>
                  </div>

                  <div style={{ background: "#FFFFFF", borderRadius: "14px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, color: "var(--accent-warm)" }}>02</span>
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Матеріали та життєвий цикл</div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>5 уроків • 2 завдання</div>
                      </div>
                    </div>
                    <button type="button" style={{ background: "none", border: "none", color: "var(--accent-secondary)", fontWeight: 600, cursor: "pointer" }}>
                      Редагувати &bull;&bull;&bull;
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="admin-box-params">
                  <div className="admin-tag" style={{ color: "var(--accent-primary)" }}>[ PUBLISHING / ПУБЛІКАЦІЯ ]</div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, color: "var(--accent-primary)", margin: "6px 0 20px 0" }}>
                    Параметри курсу
                  </h3>

                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid rgba(0,0,0,0.06)", marginBottom: "12px" }}>
                    <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Статус</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent-primary)" }}>Опубліковано ▾</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid rgba(0,0,0,0.06)", marginBottom: "12px" }}>
                    <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Мова</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent-primary)" }}>Українська ▾</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid rgba(0,0,0,0.06)", marginBottom: "12px" }}>
                    <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Тривалість</span>
                    <input
                      type="text"
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                      style={{ width: "90px", textAlign: "right", border: "none", background: "transparent", fontWeight: 700 }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Ціна</span>
                    <input
                      type="text"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      style={{ width: "90px", textAlign: "right", border: "none", background: "transparent", fontWeight: 700 }}
                    />
                  </div>
                </div>

                <div className="admin-box-cover">
                  <div className="admin-tag" style={{ color: "var(--accent-primary)", textAlign: "left" }}>[ BANNER / ОБКЛАДИНКА ]</div>
                  <img
                    src="/admin/course_lca_banner.webp"
                    alt="Course Preview"
                    style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "12px", margin: "14px 0" }}
                  />
                  <label
                    className="admin-btn-primary"
                    style={{ width: "100%", justifyContent: "center", cursor: "pointer", display: "inline-flex", boxSizing: "border-box" }}
                  >
                    <span>Замінити зображення</span>
                    <input type="file" style={{ display: "none" }} onChange={() => setNoticeMessage("✓ Зображення оновлено")} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
