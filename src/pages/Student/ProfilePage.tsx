import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile, type UserProfile } from "../../services/profileService";
import { getEnrolledCourses } from "../../services/courseService";
import type { Course } from "../../types/course";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile>();
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getProfile().catch((reason: Error) => {
                setError(reason.message);
                return undefined;
            }),
            getEnrolledCourses().catch(() => [] as Course[]),
        ])
            .then(([prof, enrolled]) => {
                if (prof) setProfile(prof);
                if (enrolled) setCourses(enrolled);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <PageHeader
                title="Профіль студента"
                description="Дані вашого облікового запису та інформація про поточне навчання."
                action={
                    <Link className="button-link" to="/student/courses">
                        Мої курси
                    </Link>
                }
            />

            <div className="two-column">
                <Panel>
                    <h2>Особисті дані</h2>
                    {loading ? (
                        <p>Завантаження профілю...</p>
                    ) : error && !profile ? (
                        <p role="alert" style={{ color: "#d32f2f" }}>{error}</p>
                    ) : (
                        <dl className="profile-list" style={{ marginTop: "14px" }}>
                            <dt>ID користувача</dt>
                            <dd style={{ wordBreak: "break-all", fontFamily: "monospace", fontSize: "13px" }}>
                                {profile?.id ?? "—"}
                            </dd>

                            <dt>Ім'я користувача</dt>
                            <dd>{profile?.username ?? profile?.name ?? "—"}</dd>

                            <dt>Email</dt>
                            <dd>{profile?.email ?? "—"}</dd>

                            <dt>Статус</dt>
                            <dd style={{ color: "#2e7d32", fontWeight: 600 }}>Активний студент</dd>
                        </dl>
                    )}
                </Panel>

                <Panel>
                    <h2>Записані курси ({courses.length})</h2>
                    {courses.length > 0 ? (
                        <ul className="list" style={{ marginTop: "14px" }}>
                            {courses.map((course) => (
                                <li key={course.id}>
                                    <strong>{course.title}</strong>
                                    <p className="meta">{course.description}</p>
                                    <div style={{ marginTop: "6px" }}>
                                        <Link to={`/student/learning/${course.id}`}>Перейти до уроків →</Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>
                            <p style={{ marginTop: "14px" }}>У вас наразі немає придбаних курсів.</p>
                            <div style={{ marginTop: "14px" }}>
                                <Link className="button-link" to="/courses">Обрати курс у каталозі</Link>
                            </div>
                        </div>
                    )}
                </Panel>
            </div>
        </>
    );
}
