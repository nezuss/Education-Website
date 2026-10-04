import { request } from "./api/apiClient";
import type { CreateQuestionDTO, Material } from "./learningService";

export async function uploadMaterialFile(file: File): Promise<string> {
    return (await uploadMaterial(file)).url;
}

export async function uploadMaterial(file: File): Promise<{ url: string; material: Material }> {
    const formData = new FormData();
    formData.append("file", file);
    const result = await request<{ url: string; material: Material }>("/api/cource/material/upload", {
        method: "POST",
        body: formData,
    });
    if (!result?.url || !result.material?.id) throw new Error("Сервер не повернув адресу та ID завантаженого матеріалу. Перевірте дані перед повторним завантаженням.");
    return result;
}

export type AssignTeacherData = {
    courceId: string;
    teacherId: string;
};

export async function assignTeacherToCourse(data: AssignTeacherData) {
    return request("/admin/assign/teacher-to-cource", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function unassignTeacherFromCourse(data: AssignTeacherData) {
    return request("/admin/unassign/teacher-from-cource", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export type AssignModuleData = {
    courceId: string;
    moduleId: string;
};

export async function unassignModuleFromCourse(data: AssignModuleData) {
    return request("/admin/unassign/module-from-cource", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export type AssignLessonData = {
    moduleId: string;
    lessonId: string;
};

export async function unassignLessonFromModule(data: AssignLessonData) {
    return request("/admin/unassign/lesson-from-module", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export type AssignMaterialData = {
    lessonId: string;
    materialId: string;
};

export async function unassignMaterialFromLesson(data: AssignMaterialData) {
    return request("/admin/unassign/material-from-lesson", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export type UpdateModulePayload = {
    id: string;
    title?: string;
    description?: string;
};

export async function updateModule(data: UpdateModulePayload) {
    return request("/api/cource/module/update", {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export type UpdateLessonPayload = {
    id: string;
    title?: string;
    description?: string;
};

export async function updateLesson(data: UpdateLessonPayload) {
    return request("/api/cource/lesson/update", {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export type UpdateMaterialPayload = Partial<CreateMaterialPayload> & {
    id: string;
};

export async function updateMaterial(data: UpdateMaterialPayload) {
    return request("/api/cource/material/update", {
        method: "PATCH",
        body: JSON.stringify({ id: data.id, content: data.content, description: data.description, deadline: data.deadline, videoUrl: data.videoUrl, url: data.url, linkTitle: data.linkTitle, fileUrl: data.fileUrl, questions: data.questions }),
    });
}

export type CreateMaterialPayload = {
    type: "Text" | "Video" | "Link" | "File" | "Assignment" | "Test";
    content?: string;
    description?: string;
    videoUrl?: string;
    url?: string;
    linkTitle?: string;
    fileUrl?: string;
    deadline?: string;
    questions?: CreateQuestionDTO[];
};

export async function createMaterial(data: CreateMaterialPayload) {
    return request<{ id: string; type: string }>("/api/cource/material/create", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export { deleteCourse } from "./courseService";

export async function deleteModule(id: string) {
    return request(`/api/cource/module/delete/${id}`, { method: "DELETE" });
}

export async function deleteLesson(id: string) {
    return request(`/api/cource/lesson/delete/${id}`, { method: "DELETE" });
}

export async function deleteMaterial(id: string) {
    return request(`/api/cource/material/delete/${id}`, { method: "DELETE" });
}
