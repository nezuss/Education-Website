import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEnrolledCourses } from "../../services/courseService";
import { getCourseStats, type CourseStats } from "../../services/courseStatsService";
import type { Course } from "../../types/course";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function MyCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [statsByCourse, setStatsByCourse] = useState<Record<string, CourseStats>>({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isCancelled = false;

        getEnrolledCourses()
            .then(async (loaded) => {
                if (isCancelled) return;
                setCourses(loaded);

                // Load stats for each course in parallel
                const statsPromises = loaded.map(async (c) => {
                    try {
                        const stats = await getCourseStats(c.id);
                        return [c.id, stats] as const;
                    } catch {
                        return null;
                    }
                });

                const results = await Promise.all(statsPromises);
                if (!isCancelled) {
                    const statsMap: Record<string, CourseStats> = {};
                    for (const item of results) {
                        if (item) statsMap[item[0]] = item[1];
                    }
                    setStatsByCourse(statsMap);
                }
            })
            .catch((reason: Error) => {
                if (!isCancelled && reason.message !== "There are no enrolled courses" && reason.message !== "There are no enrolled cources") {
                    setError(reason.message);
                }
            })
            .finally(() => {
                if (!isCancelled) setLoading(false);
            });

        return () => {
            isCancelled = true;
        };
    }, []);

    return (
        <>
            <PageHeader title="Мої курси" description="Курси, до яких у вас є активний доступ, та ваш навчальний прогрес." />
            {loading && <p>Завантаження курсів та прогресу…</p>}
            {error && <p role="alert" style={{ color: "#d32f2f" }}>Не вдалося завантажити курси: {error}</p>}
            {!loading && !error && courses.length === 0 && <p>У вас поки немає активних курсів.</p>}
            <section className="grid grid-2">
                {courses.map((course) => {
                    const stats = statsByCourse[course.id];
                    const progress = stats?.progressPercentage ?? 0;
                    const statusLabel =
                        progress === 100
                            ? "Завершено (100%)"
                            : progress > 0
                            ? `У процесі · ${progress}%`
                            : "Не розпочато (0%)";

                    return (
                        <Panel key={course.id}>
                            <p className="eyebrow" style={{ fontWeight: 600, color: progress === 100 ? "#2e7d32" : "#1b4332" }}>
                                {statusLabel}
                            </p>
                            <h2>{course.title}</h2>
                            <p style={{ margin: "8px 0" }}>{course.description}</p>

                            <div style={{ margin: "14px 0" }}>
                                <div style={{ width: "100%", height: "8px", background: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                                    <div
                                        style={{
                                            width: `${progress}%`,
                                            height: "100%",
                                            background: progress === 100 ? "#2e7d32" : "#1b4332",
                                            transition: "width 0.4s ease",
                                        }}
                                    />
                                </div>
                                {stats && (
                                    <p className="meta" style={{ marginTop: "6px" }}>
                                        Пройдено уроків: <strong>{stats.completedLessons}</strong> з {stats.totalLessons} · Здано робіт: <strong>{stats.completedSubmittableMaterials}</strong> з {stats.totalSubmittableMaterials}
                                    </p>
                                )}
                            </div>

                            <div style={{ marginTop: "16px" }}>
                                <Link className="button-link" to={`/student/learning/${course.id}`}>
                                    {progress > 0 ? "Продовжити навчання →" : "Почати навчання →"}
                                </Link>
                            </div>
                        </Panel>
                    );
                })}
            </section>
        </>
    );
}
