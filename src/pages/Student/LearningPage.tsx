import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
    getLessons,
    getMaterials,
    getModules,
    getSubmissionStatus,
    submitTest,
    type Lesson,
    type Material,
    type Module,
    type SubmissionStatus,
} from "../../services/learningService";
import { getCourseStats, type CourseStats } from "../../services/courseStatsService";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";

function VideoMaterial({ url }: { url: string }) {
    const isEmbed = url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com");

    let embedUrl = url;
    if (url.includes("youtube.com/watch?v=")) {
        embedUrl = url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
        embedUrl = url.replace("youtu.be/", "www.youtube.com/embed/");
    }

    if (isEmbed) {
        return (
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "4px", margin: "16px 0" }}>
                <iframe
                    src={embedUrl}
                    title="Відео матеріалу"
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <div style={{ margin: "16px 0" }}>
            <video controls style={{ width: "100%", maxHeight: "480px", borderRadius: "4px", background: "#000" }}>
                <source src={url} />
                Ваш браузер не підтримує тег video.
            </video>
        </div>
    );
}

function AssignmentPreview({ material }: { material: Material }) {
    const [status, setStatus] = useState<SubmissionStatus>();

    useEffect(() => {
        getSubmissionStatus(material.id).then(setStatus).catch(() => {});
    }, [material.id]);

    const isSubmitted = status?.isSubmitted;
    const rate = status?.submission?.rate;

    return (
        <div style={{ padding: "16px", border: "1px solid #e0e0e0", borderRadius: "4px", background: "#fcfcfc", margin: "14px 0" }}>
            {material.deadline && (
                <p className="meta" style={{ color: "#c62828", fontWeight: 600, marginBottom: "8px" }}>
                    Дедлайн: {new Date(material.deadline).toLocaleDateString("uk-UA")}
                </p>
            )}
            <p>{material.description}</p>
            
            <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "14px" }}>
                <Link className="button-link" to={`/student/assignments/${material.id}`}>
                    {isSubmitted ? "Переглянути статус та оцінку" : "Здати завдання"}
                </Link>
                {isSubmitted && (
                    <span style={{ color: rate !== undefined && rate !== -1 ? "#1b5e20" : "#e65100", fontWeight: 600 }}>
                        {rate !== undefined && rate !== -1 ? `Оцінено: ${rate}/12 балів` : "Очікує перевірки"}
                    </span>
                )}
            </div>
        </div>
    );
}

function TestMaterial({ material }: { material: Material }) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        getSubmissionStatus(material.id).then((res) => {
            if (res.isSubmitted) {
                setSubmitted(true);
                setMessage(res.submission?.rate !== -1 ? `Тест перевірено. Оцінка: ${res.submission?.rate} / 12` : "Відповіді надіслано на перевірку.");
            }
        }).catch(() => {});
    }, [material.id]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);
        try {
            await submitTest(
                material.id,
                Object.entries(answers).map(([questionId, answerId]) => ({ questionId, answerId }))
            );
            setSubmitted(true);
            setMessage("Ваші відповіді надіслано успішно!");
        } catch (reason) {
            setError((reason as Error).message);
        } finally {
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <div style={{ padding: "16px", background: "#f1f8e9", border: "1px solid #c5e1a5", borderRadius: "4px", margin: "14px 0" }}>
                <h3 style={{ color: "#2e7d32" }}>Тестування завершено</h3>
                <p>{message}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ margin: "16px 0" }}>
            <h3>Тестові запитання</h3>
            {material.questions?.map((question) => (
                <fieldset key={question.id} style={{ border: "1px solid #ddd", padding: "12px", margin: "12px 0" }}>
                    <legend style={{ fontWeight: 600 }}>{question.text}</legend>
                    {question.answers.map((answer) => (
                        <label key={answer.id} style={{ display: "flex", alignItems: "center", gap: "8px", margin: "6px 0", cursor: "pointer" }}>
                            <input
                                type="radio"
                                name={question.id}
                                required
                                onChange={() => setAnswers((current) => ({ ...current, [question.id]: answer.id }))}
                            />
                            {answer.text}
                        </label>
                    ))}
                </fieldset>
            ))}
            {error && <p role="alert" style={{ color: "#d32f2f" }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ marginTop: "10px" }}>
                {loading ? "Надсилання відповідей..." : "Завершити тест"}
            </button>
        </form>
    );
}

export default function LearningPage() {
    const { courseId, lessonId } = useParams();
    const [modules, setModules] = useState<Module[]>([]);
    const [lessonsByModule, setLessonsByModule] = useState<Record<string, Lesson[]>>({});
    const [materials, setMaterials] = useState<Material[]>([]);
    const [courseStats, setCourseStats] = useState<CourseStats>();
    const [error, setError] = useState("");
    const lessons = useMemo(() => modules.flatMap((module) => lessonsByModule[module.id] ?? []), [modules, lessonsByModule]);

    useEffect(() => {
        if (courseId) {
            getModules(courseId).then(setModules).catch((reason: Error) => setError(reason.message));
            getCourseStats(courseId).then(setCourseStats).catch(() => {});
        }
    }, [courseId]);

    useEffect(() => {
        if (modules.length === 0) return;
        Promise.all(
            modules.map(async (module) => [module.id, await getLessons(module.id)] as const)
        )
            .then((entries) => setLessonsByModule(Object.fromEntries(entries)))
            .catch((reason: Error) => setError(reason.message));
    }, [modules]);

    const currentLesson = lessonId ? lessons.find((lesson) => lesson.id === lessonId) : lessons[0];
    const selectedLessonId = lessonId ?? lessons[0]?.id;

    useEffect(() => {
        if (selectedLessonId) {
            getMaterials(selectedLessonId).then(setMaterials).catch((reason: Error) => setError(reason.message));
        }
    }, [selectedLessonId]);

    return (
        <>
            <PageHeader
                title={currentLesson?.title ?? "Навчання"}
                description={currentLesson?.description}
                action={
                    <Link className="button-link" to="/student/courses">
                        До моїх курсів
                    </Link>
                }
            />

            {error && <p role="alert" style={{ color: "#d32f2f" }}>Не вдалося завантажити навчальні матеріали: {error}</p>}

            <div className="two-column">
                <Panel>
                    <h2>Програма курсу</h2>
                    {courseStats && (
                        <div style={{ margin: "12px 0 16px", padding: "12px", background: "#f9fafb", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600 }}>
                                <span>Прогрес курсу</span>
                                <span style={{ color: "#1b4332" }}>{courseStats.progressPercentage}%</span>
                            </div>
                            <div style={{ width: "100%", height: "6px", background: "#e5e7eb", borderRadius: "3px", overflow: "hidden", margin: "8px 0" }}>
                                <div style={{ width: `${courseStats.progressPercentage}%`, height: "100%", background: "#1b4332" }} />
                            </div>
                            <p className="meta" style={{ fontSize: "12px" }}>
                                Пройдено уроків: <strong>{courseStats.completedLessons}</strong>/{courseStats.totalLessons} · Здано робіт: <strong>{courseStats.completedSubmittableMaterials}</strong>/{courseStats.totalSubmittableMaterials}
                            </p>
                        </div>
                    )}
                    <ol className="list">
                        {modules.map((module) => (
                            <li key={module.id} style={{ marginBottom: "16px" }}>
                                <strong>{module.title}</strong>
                                {(lessonsByModule[module.id] ?? []).map((lesson) => {
                                    const isCurrent = lesson.id === selectedLessonId;
                                    return (
                                        <div key={lesson.id} style={{ margin: "6px 0", paddingLeft: "12px" }}>
                                            <Link
                                                to={`/student/learning/${courseId}/lesson/${lesson.id}`}
                                                style={{ fontWeight: isCurrent ? 700 : 400, textDecoration: isCurrent ? "underline" : "none" }}
                                            >
                                                {isCurrent ? "👉 " : "• "}{lesson.title}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </li>
                        ))}
                    </ol>
                </Panel>

                <Panel>
                    <h2>Матеріали уроку</h2>
                    {currentLesson && materials.length === 0 && !error && (
                        <p style={{ marginTop: "12px", color: "#666" }}>Матеріали до цього уроку ще не додано.</p>
                    )}

                    {materials.map((material) => (
                        <article key={material.id} className="section" style={{ borderBottom: "1px solid #eee", paddingBottom: "24px" }}>
                            <h3>{material.title ?? material.type}</h3>
                            {material.description && <p>{material.description}</p>}
                            {material.content && (
                                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, background: "#fafafa", padding: "16px", borderRadius: "4px" }}>
                                    {material.content}
                                </div>
                            )}

                            {material.type === "Video" && (material.videoUrl || material.url) && (
                                <VideoMaterial url={material.videoUrl ?? material.url ?? ""} />
                            )}

                            {material.type === "File" && (material.fileUrl || material.url) && (
                                <p style={{ marginTop: "12px" }}>
                                    <a className="button-link" href={material.fileUrl ?? material.url} target="_blank" rel="noreferrer">
                                        📥 Завантажити прикріплений файл
                                    </a>
                                </p>
                            )}

                            {material.type === "Link" && (material.url || material.linkUrl) && (
                                <p style={{ marginTop: "12px" }}>
                                    <a className="button-link" href={material.url ?? material.linkUrl} target="_blank" rel="noreferrer">
                                        🔗 Відкрити посилання
                                    </a>
                                </p>
                            )}

                            {material.type === "Assignment" && (
                                <AssignmentPreview material={material} />
                            )}

                            {material.type === "Test" && (
                                <TestMaterial material={material} />
                            )}
                        </article>
                    ))}
                </Panel>
            </div>
        </>
    );
}
