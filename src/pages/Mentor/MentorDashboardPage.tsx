import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile, type UserProfile } from "../../services/profileService";
import { getCourses } from "../../services/courseService";
import type { Course } from "../../types/course";
import { PageHeader, Panel, Stat } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function MentorDashboardPage() {
    const [profile, setProfile] = useState<UserProfile>();
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getProfile().catch((err: Error) => {
                setError(err.message);
                return undefined;
            }),
            getCourses().catch(() => [] as Course[]),
        ])
            .then(([prof, crs]) => {
                if (prof) setProfile(prof);
                if (crs) setCourses(crs);
            })
            .finally(() => setLoading(false));
    }, []);

    const mentorCourses = courses.filter(
        (c) => profile?.id && c.assignedTeacherId === profile.id
    );

    return (
        <>
            <PageHeader
                title="Кабінет ментора"
                description="Управління навчальним процесом, курсами та перевірка робіт студентів."
                action={
                    <div className="actions">
                        <Link className="button-link" to="/mentor/submissions">
                            Перевірка робіт
                        </Link>
                        <Link className="button-link" to="/courses">
                            Каталог курсів
                        </Link>
                    </div>
                }
            />

            <section className="grid grid-3">
                <Stat
                    value={profile?.username ?? "Ментор"}
                    label="Поточний акаунт"
                />
                <Stat
                    value={String(mentorCourses.length > 0 ? mentorCourses.length : courses.length)}
                    label={mentorCourses.length > 0 ? "Закріплені курси" : "Всього курсів на платформі"}
                />
                <Stat
                    value="1 - 12"
                    label="Шкала оцінювання робіт"
                />
            </section>

            <div className="two-column section">
                <Panel>
                    <h2>Профіль викладача</h2>
                    {loading ? (
                        <p>Завантаження даних...</p>
                    ) : error ? (
                        <p role="alert" style={{ color: "#d32f2f" }}>{error}</p>
                    ) : (
                        <dl className="profile-list">
                            <dt>Користувач</dt>
                            <dd>{profile?.username ?? "Не вказано"}</dd>
                            <dt>Email</dt>
                            <dd>{profile?.email ?? "—"}</dd>
                            <dt>Статус доступу</dt>
                            <dd>Роль Teacher (доступне оцінювання)</dd>
                        </dl>
                    )}

                    <div style={{ marginTop: "24px" }}>
                        <h3>Швидкі дії ментора</h3>
                        <div className="actions" style={{ marginTop: "12px" }}>
                            <Link className="button-link" to="/mentor/review/new">
                                Оцінити роботу за ID
                            </Link>
                            <Link className="button-link" to="/mentor/submissions">
                                Черга перевірки робіт
                            </Link>
                        </div>
                    </div>
                </Panel>

                <Panel>
                    <h2>Курси ментора</h2>
                    {mentorCourses.length > 0 ? (
                        <ul className="list">
                            {mentorCourses.map((course) => (
                                <li key={course.id}>
                                    <strong>{course.title}</strong>
                                    <p>{course.description}</p>
                                    <Link to={`/courses/${course.id}`}>Переглянути сторінку курсу</Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>
                            <p>У вас наразі немає персонально закріплених курсів через поле AssignedTeacherId.</p>
                            <p className="meta" style={{ marginTop: "8px" }}>
                                Викладачі закріплюються адміністратором через ендпоінт <code>POST /admin/assign/teacher-to-cource</code>.
                            </p>
                            <h3 style={{ marginTop: "18px" }}>Усі доступні курси:</h3>
                            <ul className="list" style={{ marginTop: "8px" }}>
                                {courses.slice(0, 5).map((c) => (
                                    <li key={c.id}>
                                        <Link to={`/courses/${c.id}`}><strong>{c.title}</strong></Link>
                                        <span className="meta"> ({c.price} грн)</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Panel>
            </div>
        </>
    );
}
