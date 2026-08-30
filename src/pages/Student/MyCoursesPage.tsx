import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEnrolledCourses } from "../../services/courseService";
import type { Course } from "../../types/course";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function MyCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        let isCancelled = false;

        getEnrolledCourses()
            .then((loaded) => {
                if (!isCancelled) {
                    setCourses(loaded);
                }
            })
            .catch((reason: Error) => !isCancelled && setError(reason.message));

        return () => {
            isCancelled = true;
        };
    }, []);

    return (
        <>
            <PageHeader title="Мої курси" />
            {error && <p role="alert">Не вдалося завантажити курси: {error}</p>}
            {!error && courses.length === 0 && <p>У вас поки немає активних курсів.</p>}
            <section className="grid grid-2">
                {courses.map((course, index) => (
                    <Panel key={course.id}>
                        <p className="eyebrow">{index === 0 ? "У процесі · 42%" : "Не розпочато"}</p>
                        <h2>{course.title}</h2>
                        <Link className="button-link" to={`/student/learning/${course.id}`}>Відкрити курс</Link>
                    </Panel>
                ))}
            </section>
        </>
    );
}
