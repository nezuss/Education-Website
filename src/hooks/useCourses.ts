import { useEffect, useState } from "react";
import { getCourses } from "../services/courseService";
import type { Course } from "../types/course";

export function useCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getCourses().then(setCourses).catch((reason: Error) => setError(reason.message)).finally(() => setIsLoading(false));
    }, []);

    return { courses, isLoading, error };
}
