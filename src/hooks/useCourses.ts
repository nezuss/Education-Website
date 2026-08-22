import { useEffect, useState } from "react";
import { getCourses } from "../services/courseService";
import type { Course } from "../data/mockData";
import { courses as mockCourses } from "../data/mockData";

export function useCourses() {
    const [courses, setCourses] = useState<Course[]>(mockCourses);

    useEffect(() => {
        getCourses()
            .then((loaded) => {
                if (loaded.length > 0) {
                    setCourses(loaded);
                }
            })
            .catch(() => setCourses(mockCourses));
    }, []);

    return { courses };
}
