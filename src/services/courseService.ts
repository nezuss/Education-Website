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
    assignedTeacherId?: string;
    modulesId?: string[];
};

export type CreateCourseData = {
    title: string;
    description: string;
    price: number;
    bannerUrl?: string;
    totalLearningPeriodWeeks?: number;
    projectsReadyForPortfolio?: number;
};

function mapCourse(course: ApiCourse): Course {
    return {
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price,
        direction: "Без категорії",
        mentor: course.assignedTeacherId ? `ID: ${course.assignedTeacherId}` : "Не призначено",
        assignedTeacherId: course.assignedTeacherId,
        modules: course.modulesId ?? [],
        bannerUrl: course.bannerUrl,
        totalLearningPeriodWeeks: course.totalLearningPeriodWeeks,
        projectsReadyForPortfolio: course.projectsReadyForPortfolio,
    };
}

export async function getCourses() {
    const courses = await request<ApiCourse[]>("/api/cource/get-all");
    return (courses ?? []).map(mapCourse);
}

export async function getEnrolledCourses() {
    const courses = await request<ApiCourse[]>("/api/cource/get-enrolled");
    return (courses ?? []).map(mapCourse);
}

export async function enrollToCourse(courseId: string): Promise<string | undefined> {
    return request<string>(`/api/cource/enrol/${courseId}`, { method: "POST" });
}

export async function createCourse(data: CreateCourseData) {
    const course = await request<ApiCourse>("/api/cource/create", {
        method: "POST",
        body: JSON.stringify({
            ...data,
            modulesId: [],
            bannerUrl: data.bannerUrl ?? "",
            totalLearningPeriodWeeks: data.totalLearningPeriodWeeks ?? 4,
            projectsReadyForPortfolio: data.projectsReadyForPortfolio ?? 1,
        }),
    });

    return mapCourse(course);
}

export type UpdateCourseData = {
    id: string;
    title?: string;
    description?: string;
    price?: number;
    bannerUrl?: string;
    totalLearningPeriodWeeks?: number;
    projectsReadyForPortfolio?: number;
};

export async function updateCourse(data: UpdateCourseData) {
    const course = await request<ApiCourse>("/api/cource/update", {
        method: "PATCH",
        body: JSON.stringify(data),
    });
    return mapCourse(course);
}

export async function deleteCourse(id: string) {
    return request<string>(`/api/cource/delete/${encodeURIComponent(id)}`, { method: "DELETE" });
}
