import { useMemo, useState } from "react";
import { courses } from "../../data/mockData";
import { CourseCard, PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";

const allDirections = "Усі напрями";
const directions = [...new Set(courses.map((course) => course.direction))];

export default function CoursesPage() {
    const [query, setQuery] = useState("");
    const [direction, setDirection] = useState(allDirections);
    const visibleCourses = useMemo(() => courses.filter((course) => {
        const matchesDirection = direction === allDirections || course.direction === direction;
        const matchesQuery = course.title.toLowerCase().includes(query.toLowerCase());
        return matchesDirection && matchesQuery;
    }), [direction, query]);

    return (
        <>
            <PageHeader title="Каталог курсів" description="Оберіть програму та почніть навчання." />
            <Panel className="filters">
                <label>
                    Пошук
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Назва курсу" />
                </label>
                <label>
                    Напрям
                    <select value={direction} onChange={(event) => setDirection(event.target.value)}>
                        <option>{allDirections}</option>
                        {directions.map((item) => <option key={item}>{item}</option>)}
                    </select>
                </label>
            </Panel>
            <p className="result-count">Знайдено курсів: {visibleCourses.length}</p>
            <section className="grid grid-3">
                {visibleCourses.map((course) => <CourseCard key={course.id} course={course} />)}
            </section>
        </>
    );
}
