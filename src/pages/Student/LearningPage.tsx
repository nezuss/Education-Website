import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getLessons,
  getMaterials,
  getModules,
  type Lesson,
  type Material,
  type Module,
} from "../../services/learningService";
import "../../styles/CourseLearning.css";
import "../../styles/StudentDashboard.css";

export default function LearningPage() {
  const { courseId, lessonId: paramLessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const [modules, setModules] = useState<Module[]>([]);
  const [lessonsByModule, setLessonsByModule] = useState<Record<string, Lesson[]>>({});
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeMaterials, setActiveMaterials] = useState<Material[]>([]);
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    getModules(courseId)
      .then(async (mods) => {
        setModules(mods);
        if (mods.length > 0) {
          setOpenModuleId(mods[0].id);
          const map: Record<string, Lesson[]> = {};
          for (const m of mods) {
            try {
              map[m.id] = await getLessons(m.id);
            } catch {
              map[m.id] = [];
            }
          }
          setLessonsByModule(map);

          // Find requested lesson or default to first lesson of first module
          let targetLesson: Lesson | null = null;
          if (paramLessonId) {
            for (const key of Object.keys(map)) {
              const found = map[key].find((l) => l.id === paramLessonId);
              if (found) {
                targetLesson = found;
                setOpenModuleId(key);
                break;
              }
            }
          }
          if (!targetLesson && mods[0] && map[mods[0].id]?.length > 0) {
            targetLesson = map[mods[0].id][0];
          }

          if (targetLesson) {
            setActiveLesson(targetLesson);
            getMaterials(targetLesson.id).then(setActiveMaterials).catch(() => setActiveMaterials([]));
          }
        }
      })
      .catch(() => {
        // Mock fallback if course not found in backend
        setModules([
          { id: "mod-1", title: "Основи LCA та сталого проєктування", description: "Життєвий цикл продукту, системне мислення та базові принципи.", lessonsId: ["mock-1", "mock-2"] },
          { id: "mod-2", title: "Матеріали нового покоління", description: "Біополімери, вторинні матеріали та їх властивості.", lessonsId: [] },
          { id: "mod-3", title: "Циркулярний дизайн пакування", description: "Розробка концепцій безвідходного життєвого циклу.", lessonsId: [] },
          { id: "mod-4", title: "Підбір еко-сировини та оцінка", description: "Практичний аналіз впливу матеріалів на довкілля.", lessonsId: [] },
        ]);
        setOpenModuleId("mod-1");
      })
      .finally(() => setLoading(false));
  }, [courseId, paramLessonId]);

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    getMaterials(lesson.id).then(setActiveMaterials).catch(() => setActiveMaterials([]));
  };

  return (
    <div className="learn-page">
      {/* Breadcrumbs */}
      <nav className="learn-breadcrumbs" aria-label="breadcrumb">
        <Link to="/student">Головна</Link>
        <span>&gt;</span>
        <Link to="/student/courses">Мої курси</Link>
        <span>&gt;</span>
        <span className="active">LCA &amp; Еко-проєктування</span>
      </nav>

      {/* Top Banner Card */}
      <div className="learn-hero-card">
        <div className="learn-hero-info">
          <span className="std-badge-tag">[ НАВЧАЛЬНИЙ КУРС ]</span>
          <h1 className="learn-hero-title">LCA &amp; Еко-проєктування</h1>
          <p className="learn-hero-desc">
            Практичний курс зі сталого проєктування та оцінки життєвого циклу продукту.
          </p>
          <div className="learn-hero-badges">
            <span className="std-chip">PRO</span>
            <span className="std-chip">10 модулів</span>
            <span className="std-chip">28 уроків</span>
          </div>
        </div>

        <div className="learn-hero-col-center">
          <span className="learn-col-caption">Поточний етап</span>
          <div className="learn-current-stage">Модуль 4 із 10</div>
          <div className="learn-current-lesson">Урок 3 • Підбір еко-сировини</div>
        </div>

        <div className="learn-hero-col-right">
          <div className="std-progress-label">
            <span>Ваш прогрес</span>
            <span>42%</span>
          </div>
          <div className="std-progress-bar-bg">
            <div className="std-progress-bar-fill" style={{ width: "42%" }}></div>
          </div>
          <Link to="/student/assignments/1" className="std-continue-btn" style={{ justifyContent: "center" }}>
            <span>Здати завдання &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Active Lesson Viewer (if opened) */}
      {activeLesson && (
        <div className="learn-viewer-card">
          <span className="std-badge-tag">[ УРОК ]</span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "24px", color: "var(--color-brand-dark)", margin: "8px 0" }}>
            {activeLesson.title}
          </h2>
          <p style={{ fontSize: "15px", color: "var(--color-brand-soft)", margin: "0 0 20px 0" }}>
            {activeLesson.description || "Перегляньте лекційний матеріал, вивчіть рекомендації та перейдіть до виконання практичного завдання."}
          </p>

          <div className="learn-video-player-wrap">
            <iframe
              className="learn-video-iframe"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Лекція"
              allowFullScreen
            />
          </div>

          {activeMaterials.length > 0 && (
            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(10, 45, 27, 0.08)" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>Матеріали уроку</h3>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {activeMaterials.map((mat) => (
                  <div
                    key={mat.id}
                    style={{
                      background: "var(--color-bg-sand)",
                      padding: "10px 16px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    <span>📄</span>
                    <span style={{ fontWeight: 600 }}>{mat.description || "Методичні матеріали (PDF)"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Body: Curriculum list + Next Step Panel */}
      <div className="learn-body-grid">
        <div className="learn-curriculum-col">
          <h2>Програма курсу</h2>
          <div className="learn-curriculum-sub">
            Відкривайте модулі послідовно та продовжуйте з поточного уроку.
          </div>

          <div className="learn-modules-list">
            {modules.map((mod, idx) => {
              const isOpen = openModuleId === mod.id;
              const lessons = lessonsByModule[mod.id] || [];

              return (
                <div key={mod.id} className="learn-module-box">
                  <div
                    className="learn-module-header"
                    onClick={() => setOpenModuleId(isOpen ? null : mod.id)}
                  >
                    <div className="learn-module-left">
                      <div className="learn-module-num">{idx + 1}</div>
                      <div>
                        <div className="learn-module-title">{mod.title}</div>
                        <div className="learn-module-summary">{mod.description}</div>
                      </div>
                    </div>

                    <div className="learn-module-right">
                      <div className="learn-module-pct">
                        {idx === 0 ? "100%" : idx === 1 ? "60%" : "0%"}
                      </div>
                      <div className="learn-module-counter">
                        {lessons.length > 0 ? `${lessons.length} уроків` : "3 уроки"}
                      </div>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="learn-lessons-table">
                      {lessons.length > 0 ? (
                        lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`learn-lesson-row ${activeLesson?.id === lesson.id ? "active" : ""}`}
                            onClick={() => handleSelectLesson(lesson)}
                          >
                            <div className="learn-lesson-meta-left">
                              <div className="learn-lesson-check done">✓</div>
                              <div className="learn-lesson-info">
                                <span className="learn-lesson-name">{lesson.title}</span>
                                <span className="learn-lesson-type">Відео • теорія</span>
                              </div>
                            </div>

                            <div className="learn-lesson-meta-right">
                              <span className="learn-lesson-duration">18 хв.</span>
                              <span className="learn-status-pill">ЗАВЕРШЕНО</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div
                            className="learn-lesson-row active"
                            onClick={() => setActiveLesson({ id: "mock-1", title: "Що таке життєвий цикл продукту", description: "Вступ до методології LCA.", materialsId: [] })}
                          >
                            <div className="learn-lesson-meta-left">
                              <div className="learn-lesson-check done">✓</div>
                              <div className="learn-lesson-info">
                                <span className="learn-lesson-name">Що таке життєвий цикл продукту</span>
                                <span className="learn-lesson-type">Відео • теорія</span>
                              </div>
                            </div>
                            <div className="learn-lesson-meta-right">
                              <span className="learn-lesson-duration">18 хв.</span>
                              <span className="learn-status-pill">ЗАВЕРШЕНО</span>
                            </div>
                          </div>

                          <div
                            className="learn-lesson-row"
                            onClick={() => setActiveLesson({ id: "mock-2", title: "Етапи LCA-аналізу", description: "Детальний розбір стадій аналізу.", materialsId: [] })}
                          >
                            <div className="learn-lesson-meta-left">
                              <div className="learn-lesson-check done">✓</div>
                              <div className="learn-lesson-info">
                                <span className="learn-lesson-name">Етапи LCA-аналізу</span>
                                <span className="learn-lesson-type">Відео + PDF</span>
                              </div>
                            </div>
                            <div className="learn-lesson-meta-right">
                              <span className="learn-lesson-duration">24 хв.</span>
                              <span className="learn-status-pill">ЗАВЕРШЕНО</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Next Step Panel */}
        <aside className="learn-next-step-panel">
          <span className="std-badge-tag" style={{ color: "#385546" }}>[ ДАЛІ ]</span>
          <h3 className="learn-next-step-title">Наступний крок</h3>

          <div className="learn-next-lesson-name">Урок 3 • Підбір еко-сировини</div>
          <p className="learn-next-lesson-desc">
            Порівняйте матеріали за походженням, впливом і потенціалом повторного використання.
          </p>

          <Link to="/student/assignments/1" className="learn-next-assignment-bar">
            <span>Після уроку:</span>
            <span style={{ color: "var(--color-brand-primary)" }}>Завдання №2 &rarr;</span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
