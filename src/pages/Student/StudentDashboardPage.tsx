import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEnrolledCourses } from "../../services/courseService";
import { getProfile, type UserProfile } from "../../services/profileService";
import { getCourseStats, type CourseStats } from "../../services/courseStatsService";
import type { Course } from "../../types/course";
import { PageHeader, Panel, Stat } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function StudentDashboardPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [profile, setProfile] = useState<UserProfile>();
    const [activeCourseStats, setActiveCourseStats] = useState<CourseStats>();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getEnrolledCourses().catch((reason: Error) => {
                if (reason.message !== "There are no enrolled cources" && reason.message !== "There are no enrolled courses") {
                    setError(reason.message);
                }
                return [] as Course[];
            }),
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
                        // Ignore stats failure if not available
                    }
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const activeCourse = courses[0];

    return (
        <>
            <PageHeader
                title="Кабінет студента"
                description={profile?.username ? `Вітаємо, ${profile.username}! Продовжуйте своє навчання на платформі.` : "Ваші активні курси та навчальний прогрес."}
                action={
                    <div className="actions">
                        <Link className="button-link" to="/student/courses">
                            Мої курси
                        </Link>
                        <Link className="button-link" to="/courses">
                            Каталог курсів
                        </Link>
                    </div>
                }
            />

            <section className="grid grid-3">
                <Stat value={String(courses.length)} label="Активних курсів" />
                <Stat value={profile?.username ?? "Студент"} label="Обліковий запис" />
                <Stat value="Вільний графік" label="Формат навчання" />
            </section>

            {error && <p role="alert" style={{ color: "#d32f2f", marginTop: "16px" }}>Не вдалося завантажити дані: {error}</p>}

            <div className="two-column section">
                <Panel>
                    <h2>Поточний курс для вивчення</h2>
                    {loading ? (
                        <p>Завантаження...</p>
                    ) : activeCourse ? (
                        <div>
                            <p className="eyebrow" style={{ color: "#2e7d32", fontWeight: 600 }}>
                                {activeCourseStats ? `Прогрес: ${activeCourseStats.progressPercentage}%` : "Активне навчання"}
                            </p>
                            <h3 style={{ marginTop: "6px" }}>{activeCourse.title}</h3>
                            <p>{activeCourse.description}</p>
                            {activeCourseStats && (
                                <div style={{ margin: "10px 0" }}>
                                    <div style={{ width: "100%", height: "6px", background: "#e5e7eb", borderRadius: "3px", overflow: "hidden" }}>
                                        <div style={{ width: `${activeCourseStats.progressPercentage}%`, height: "100%", background: "#1b4332" }} />
                                    </div>
                                    <p className="meta" style={{ marginTop: "4px" }}>
                                        Пройдено {activeCourseStats.completedLessons} з {activeCourseStats.totalLessons} уроків · Здано {activeCourseStats.completedSubmittableMaterials} з {activeCourseStats.totalSubmittableMaterials} завдань
                                    </p>
                                </div>
                            )}
                            <p className="meta" style={{ margin: "10px 0" }}>
                                Тривалість: {activeCourse.totalLearningPeriodWeeks ?? 4} тижні(в) · Ментор: {activeCourse.mentor}
                            </p>
                            <Link className="button-link" to={`/student/learning/${activeCourse.id}`}>
                                Продовжити навчання →
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <p>Ви ще не записалися на жоден курс.</p>
                            <p className="meta" style={{ marginTop: "8px" }}>
                                Перегляньте каталог та оберіть відповідну програму, щоб почати навчання.
                            </p>
                            <div style={{ marginTop: "16px" }}>
                                <Link className="button-link" to="/courses">Переглянути каталог курсів</Link>
                            </div>
                        </div>
                    )}
                </Panel>

                <Panel>
                    <h2>Швидкий доступ</h2>
                    <ul className="list">
                        <li>
                            <Link to="/student/courses"><strong>Усі мої курси</strong></Link>
                            <p className="meta">Список курсів, до яких у вас є активний доступ</p>
                        </li>
                        <li>
                            <Link to="/student/profile"><strong>Мій профіль</strong></Link>
                            <p className="meta">Особиста інформація та статус облікового запису</p>
                        </li>
                    </ul>
                </Panel>
            </div>
        </>
    );
}
