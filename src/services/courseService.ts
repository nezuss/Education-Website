import type { Course } from "../data/mockData";
import { request } from "./api/apiClient";

type ApiCourse = {
    id: string;
    title: string;
    description: string;
    price: number;
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
    };
}

export async function getCourses() {
    const courses = await request<ApiCourse[]>("/cource/get-all");
    return courses.map(mapCourse);
}

export async function getEnrolledCourses() {
    const courses = await request<ApiCourse[]>("/cource/get-enrolled");
    return courses.map(mapCourse);
}

export async function enrollToCourse(courseId: string) {
    await request(`/cource/enrol/${courseId}`, { method: "POST" });
}
