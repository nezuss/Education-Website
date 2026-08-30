import type { Course } from "../types/course";
import { request } from "./api/apiClient";

type ApiCourse = {
    id: string;
    title: string;
    description: string;
    price: number;
    bannerUrl?: string;
    totalLearningPeriodWeeks?: number;
    projectsReadyForPortfolio?: number;
    modulesId?: string[];
};

function mapCourse(course: ApiCourse): Course {
    return {
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price,
        direction: "Без категорії",
        mentor: "Не вказано",
        modules: course.modulesId ?? [],
        bannerUrl: course.bannerUrl,
        totalLearningPeriodWeeks: course.totalLearningPeriodWeeks,
        projectsReadyForPortfolio: course.projectsReadyForPortfolio,
    };
}

export async function getCourses() {
    const courses = await request<ApiCourse[]>("/api/cource/get-all");
    return courses.map(mapCourse);
}

export async function getEnrolledCourses() {
    const courses = await request<ApiCourse[]>("/api/cource/get-enrolled");
    return courses.map(mapCourse);
}

export async function enrollToCourse(courseId: string) {
    await request(`/api/cource/enrol/${courseId}`, { method: "POST" });
}
