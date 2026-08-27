import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEnrolledCourses } from "../../services/courseService";
import type { Course } from "../../data/mockData";
import { courses as mockCourses } from "../../data/mockData";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function MyCoursesPage() {
    const [courses, setCourses] = useState<Course[]>(mockCourses);

    useEffect(() => {
        let isCancelled = false;

        getEnrolledCourses()
            .then((loaded) => {
                if (!isCancelled && loaded.length > 0) {
                    setCourses(loaded);
                }
            })
            .catch(() => {
                setCourses(mockCourses);
            });

        return () => {
            isCancelled = true;
        };
    }, []);

    return (
        <>
            <PageHeader title="Мої курси" />
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
