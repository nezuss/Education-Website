import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getLessons,
  getMaterials,
  getModules,
  submitTest,
  type Lesson,
  type Material,
  type Module,
} from "../../services/learningService";
import { getCourses } from "../../services/courseService";
import { getCourseStats, getModuleStats, type CourseStats, type ModuleStats } from "../../services/courseStatsService";
import type { Course } from "../../types/course";
import "../../styles/CourseLearning.css";
import "../../styles/StudentDashboard.css";

function VideoPlayer({ url }: { url: string }) {
  let embedUrl = url;
  if (url.includes("watch?v=")) {
    embedUrl = url.replace("watch?v=", "embed/");
  } else if (url.includes("youtu.be/")) {
    embedUrl = url.replace("youtu.be/", "www.youtube.com/embed/");
  }
  return (
    <div className="learn-video-player-wrap">
      <iframe
        className="learn-video-iframe"
        src={embedUrl}
        title="Лекція"
        allowFullScreen
      />
    </div>
  );
}

function TestQuizWidget({ material }: { material: Material }) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelect = (questionId: string, answerId: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    if (!material.questions || material.questions.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const answersPayload = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
        questionId,
        answerId,
      }));
      await submitTest(material.id, answersPayload);
      setSubmitted(true);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Не вдалося надіслати тест");
    } finally {
      setLoading(false);
    }
  };

  if (!material.questions || material.questions.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: "20px", background: "#FFFFFF", borderRadius: "16px", padding: "24px", border: "1px solid rgba(10,45,27,0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>📝 Тестування</h3>
        {submitted && <span style={{ color: "#215A36", fontWeight: 600, fontSize: "14px" }}>✓ Тест надіслано</span>}
      </div>
      {material.questions.map((q, qIdx) => (
        <div key={q.id} style={{ marginBottom: "16px" }}>
          <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "8px" }}>
            {qIdx + 1}. {q.text}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {q.answers.map((ans) => (
              <label
                key={ans.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: selectedAnswers[q.id] === ans.id ? "rgba(19,73,44,0.08)" : "var(--color-bg-sand)",
                  cursor: submitted ? "default" : "pointer",
                }}
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={ans.id}
                  checked={selectedAnswers[q.id] === ans.id}
                  onChange={() => handleSelect(q.id, ans.id)}
                  disabled={submitted}
                />
                <span style={{ fontSize: "14px" }}>{ans.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      {error && <div style={{ color: "#E53E3E", fontSize: "13px", marginBottom: "12px" }}>{error}</div>}
      {!submitted && (
        <button
          type="button"
          className="std-continue-btn"
          onClick={handleSubmit}
          disabled={loading || Object.keys(selectedAnswers).length < material.questions.length}
          style={{ padding: "10px 24px", fontSize: "14px" }}
        >
          {loading ? "Надсилання..." : "Завершити тест"}
        </button>
      )}
    </div>
  );
}

function AssignmentWidget({ material, courseId, courseTitle }: { material: Material; courseId?: string; courseTitle?: string }) {
  return (
    <div style={{ marginTop: "20px", background: "var(--color-bg-card-alt)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(10,45,27,0.08)" }}>
      <div className="std-badge-tag">[ ПРАКТИЧНЕ ЗАВДАННЯ ]</div>
      <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "8px 0" }}>{material.title || "Завдання до уроку"}</h3>
      <p style={{ fontSize: "14px", color: "var(--color-brand-soft)", marginBottom: "16px" }}>
        {material.description || "Виконайте практичне завдання та завантажте файл на перевірку ментору."}
      </p>
      {material.deadline && (
        <div style={{ fontSize: "13px", color: "#8C6D53", marginBottom: "16px" }}>
          Дедлайн: {new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(material.deadline))}
        </div>
      )}
      <Link
        to={`/student/assignments/${material.id}`}
        state={{ courseId, courseTitle, assignmentTitle: material.title, description: material.description, deadline: material.deadline }}
        className="std-continue-btn"
        style={{ display: "inline-flex", padding: "10px 20px", fontSize: "14px" }}
      >
        <span>Здати роботу &rarr;</span>
      </Link>
    </div>
  );
}

export default function LearningPage() {
  const { courseId, lessonId: paramLessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [courseStats, setCourseStats] = useState<CourseStats | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [moduleStatsMap, setModuleStatsMap] = useState<Record<string, ModuleStats>>({});
  const [lessonsByModule, setLessonsByModule] = useState<Record<string, Lesson[]>>({});
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeMaterials, setActiveMaterials] = useState<Material[]>([]);
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    getCourses()
      .then((courses) => {
        const found = courses.find((c) => c.id === courseId);
        if (found) setCourseData(found);
      })
      .catch(() => {});

    getCourseStats(courseId)
      .then(setCourseStats)
      .catch(() => {});

    getModules(courseId)
      .then(async (mods) => {
        setModules(mods);
        if (mods.length > 0) {
          setOpenModuleId(mods[0].id);
          const map: Record<string, Lesson[]> = {};
          for (const m of mods) {
            getModuleStats(m.id)
              .then((ms) => setModuleStatsMap((prev) => ({ ...prev, [m.id]: ms })))
              .catch(() => {});

            try {
              map[m.id] = await getLessons(m.id);
            } catch {
              map[m.id] = [];
            }
          }
          setLessonsByModule(map);

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
        setModules([
          { id: "mod-1", title: "Основи LCA та сталого проєктування", description: "Життєвий цикл продукту, системне мислення та базові принципи.", lessonsId: [] },
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

  const courseDisplayName = courseData?.title || "LCA & Еко-проєктування";
  const progressVal = Math.round(courseStats?.progressPercentage ?? 0);
  const activeVideo = activeMaterials.find((m) => m.type === "Video" || m.videoUrl);
  const activeAssignment = activeMaterials.find((m) => m.type === "Assignment");
  const otherMaterials = activeMaterials.filter((m) => m.type !== "Video");

  const currentModuleIndex = modules.findIndex((m) => m.id === openModuleId);
  const currentModule = currentModuleIndex >= 0 ? modules[currentModuleIndex] : modules[0];

  if (loading) {
    return (
      <div className="learn-page" style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "36px", marginBottom: "16px" }}>⏳</div>
        <h2 style={{ color: "var(--color-brand-dark)", fontSize: "20px" }}>Завантаження матеріалів курсу...</h2>
      </div>
    );
  }

  return (
    <div className="learn-page">
      <nav className="learn-breadcrumbs" aria-label="breadcrumb">
        <Link to="/student">Головна</Link>
        <span>&gt;</span>
        <Link to="/student/courses">Мої курси</Link>
        <span>&gt;</span>
        <span className="active">{courseDisplayName}</span>
      </nav>

      <div className="learn-hero-card">
        <div className="learn-hero-info">
          <span className="std-badge-tag">[ НАВЧАЛЬНИЙ КУРС ]</span>
          <h1 className="learn-hero-title">{courseDisplayName}</h1>
          <p className="learn-hero-desc">
            {courseData?.description || "Практичний курс зі сталого проєктування та оцінки життєвого циклу продукту."}
          </p>
          <div className="learn-hero-badges">
            <span className="std-chip">PRO</span>
            <span className="std-chip">
              {courseStats?.totalModules ?? modules.length} модулів
            </span>
            <span className="std-chip">
              {courseStats?.totalLessons ?? Object.values(lessonsByModule).reduce((sum, l) => sum + l.length, 0)} уроків
            </span>
          </div>
        </div>

        <div className="learn-hero-col-center">
          <span className="learn-col-caption">Поточний етап</span>
          <div className="learn-current-stage">
            Модуль {(currentModuleIndex >= 0 ? currentModuleIndex + 1 : 1)} із {modules.length || 1}
          </div>
          <div className="learn-current-lesson">
            {activeLesson ? activeLesson.title : (currentModule?.title || "Початок курсу")}
          </div>
        </div>

        <div className="learn-hero-col-right">
          <div className="std-progress-label">
            <span>Ваш прогрес</span>
            <span>{progressVal}%</span>
          </div>
          <div className="std-progress-bar-bg">
            <div className="std-progress-bar-fill" style={{ width: `${progressVal}%` }}></div>
          </div>
          <Link
            to={activeAssignment ? `/student/assignments/${activeAssignment.id}` : (courseId ? `/student/learning/${courseId}` : "/student/courses")}
            state={{ courseId, courseTitle: courseDisplayName, assignmentTitle: activeAssignment?.title }}
            className="std-continue-btn"
            style={{ justifyContent: "center" }}
          >
            <span>{activeAssignment ? "Здати завдання →" : "Продовжити навчання →"}</span>
          </Link>
        </div>
      </div>

      {activeLesson && (
        <div className="learn-viewer-card">
          <span className="std-badge-tag">[ УРОК ]</span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "24px", color: "var(--color-brand-dark)", margin: "8px 0" }}>
            {activeLesson.title}
          </h2>
          <p style={{ fontSize: "15px", color: "var(--color-brand-soft)", margin: "0 0 20px 0" }}>
            {activeLesson.description || "Перегляньте лекційний матеріал, вивчіть рекомендації та перейдіть до виконання завдань."}
          </p>

          <VideoPlayer url={activeVideo?.videoUrl || "https://www.youtube-nocookie.com/embed/LXb3EKWsInQ"} />

          {otherMaterials.length > 0 && (
            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(10, 45, 27, 0.08)" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>Матеріали уроку</h3>
              
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
                {otherMaterials.map((mat) => {
                  if (mat.type === "File" && mat.fileUrl) {
                    return (
                      <a
                        key={mat.id}
                        href={mat.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        download
                        style={{
                          background: "var(--color-bg-sand)",
                          padding: "10px 16px",
                          borderRadius: "10px",
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "inherit",
                          textDecoration: "none",
                        }}
                      >
                        <span>📁</span>
                        <span style={{ fontWeight: 600 }}>{mat.title || mat.description || "Завантажити файл"}</span>
                        <span>⤓</span>
                      </a>
                    );
                  }
                  if (mat.type === "Link" && mat.url) {
                    return (
                      <a
                        key={mat.id}
                        href={mat.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: "var(--color-bg-sand)",
                          padding: "10px 16px",
                          borderRadius: "10px",
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "inherit",
                          textDecoration: "none",
                        }}
                      >
                        <span>🔗</span>
                        <span style={{ fontWeight: 600 }}>{mat.title || mat.url}</span>
                        <span>↗</span>
                      </a>
                    );
                  }
                  if (mat.type === "Text" && mat.content) {
                    return (
                      <div
                        key={mat.id}
                        style={{
                          width: "100%",
                          background: "#FFFFFF",
                          padding: "16px",
                          borderRadius: "12px",
                          lineHeight: "1.6",
                          fontSize: "14px",
                          whiteSpace: "pre-line",
                          border: "1px solid rgba(10,45,27,0.08)",
                        }}
                      >
                        {mat.content}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {otherMaterials.filter((m) => m.type === "Assignment").map((m) => (
                <AssignmentWidget key={m.id} material={m} courseId={courseId} courseTitle={courseDisplayName} />
              ))}

              {otherMaterials.filter((m) => m.type === "Test").map((m) => (
                <TestQuizWidget key={m.id} material={m} />
              ))}
            </div>
          )}
        </div>
      )}

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
              const modStat = moduleStatsMap[mod.id];
              const pctText = modStat ? `${Math.round(modStat.progressPercentage)}%` : (idx === 0 && progressVal > 0 ? `${progressVal}%` : "0%");

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
                        {pctText}
                      </div>
                      <div className="learn-module-counter">
                        {lessons.length > 0 ? `${lessons.length} уроків` : "Уроки готуються"}
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
                                <span className="learn-lesson-type">
                                  {lesson.description || "Урок курсу"}
                                </span>
                              </div>
                            </div>

                            <div className="learn-lesson-meta-right">
                              <span className="learn-status-pill">
                                {activeLesson?.id === lesson.id ? "АКТИВНИЙ" : "ВІДКРИТИ"}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: "16px 20px", color: "var(--color-brand-soft)", fontSize: "14px" }}>
                          Уроки для цього модуля завантажуються або ще не додані.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="learn-next-step-panel">
          <span className="std-badge-tag" style={{ color: "#385546" }}>[ ДАЛІ ]</span>
          <h3 className="learn-next-step-title">Наступний крок</h3>

          <div className="learn-next-lesson-name">
            {activeLesson ? activeLesson.title : "Оберіть урок із програми"}
          </div>
          <p className="learn-next-lesson-desc">
            {activeLesson?.description || "Вивчайте матеріали курсу послідовно та переходьте до виконання завдань."}
          </p>

          <Link
            to={activeAssignment ? `/student/assignments/${activeAssignment.id}` : (courseId ? `/student/learning/${courseId}` : "/student/courses")}
            state={{ courseId, courseTitle: courseDisplayName, assignmentTitle: activeAssignment?.title }}
            className="learn-next-assignment-bar"
          >
            <span>Після уроку:</span>
            <span style={{ color: "var(--color-brand-primary)" }}>
              {activeAssignment ? "Здати завдання →" : "Наступний урок →"}
            </span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
