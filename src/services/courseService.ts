import type { Course } from "../types/course";
import { request } from "./api/apiClient";
import { getProfileById } from "./profileService";
import { requestCollection } from "./api/collection";

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
    rating: number;
    reviews: number;
    studentsCount: number;
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
        rating: course.rating,
        reviews: course.reviews,
        studentsCount: course.studentsCount,
        direction: "Без категорії",
        mentor: course.assignedTeacherId ? "Ім’я ментора недоступне" : "Не призначено",
        assignedTeacherId: course.assignedTeacherId,
        modules: course.modulesId ?? [],
        bannerUrl: course.bannerUrl,
        totalLearningPeriodWeeks: course.totalLearningPeriodWeeks,
        projectsReadyForPortfolio: course.projectsReadyForPortfolio,
    };
}

export async function getCourses() {
    const courses = await requestCollection<ApiCourse>("/api/cource/get-all", "There are no cources yet");
    return resolveMentors((courses ?? []).map(mapCourse));
}

export async function getCourse(id: string) {
    try {
        const course = mapCourse(await request<ApiCourse>(`/api/cource/get-by-id/${encodeURIComponent(id)}`));
        return (await resolveMentors([course]))[0];
    } catch (reason) {
        if ((reason as { status?: number }).status !== 404) throw reason;
        const course = (await getCourses()).find(item => item.id === id);
        if (!course) throw Object.assign(new Error("Курс не знайдено"), { status: 404 });
        return course;
    }
}

async function resolveMentors(courses: Course[]) {
    const ids = [...new Set(courses.map(course => course.assignedTeacherId).filter((id): id is string => Boolean(id)))];
    const names = new Map<string, string>();
    await Promise.all(ids.map(async id => {
        try {
            const profile = await getProfileById(id);
            if (profile.username) names.set(id, profile.username);
        } catch { return; }
    }));
    return courses.map(course => ({ ...course, mentor: names.get(course.assignedTeacherId || "") || course.mentor }));
}

export async function getEnrolledCourses() {
    const courses = await requestCollection<ApiCourse>("/api/cource/get-enrolled", "There are no enrolled cources");
    return resolveMentors((courses ?? []).map(mapCourse));
}

export async function enrollToCourse(courseId: string, promocode?: string): Promise<string | undefined> {
    return request<string>(`/api/cource/enrol/${encodeURIComponent(courseId)}`, { method: "POST", body: JSON.stringify({ ...(promocode?.trim() ? { promocode: promocode.trim() } : {}) }) });
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
