import { request } from "./api/apiClient";

export type Module = { id: string; title: string; description?: string; lessonsId?: string[] };
export type Lesson = { id: string; title: string; description?: string; materialsId?: string[] };
export type Material = {
    id: string;
    type: "File" | "Photo" | "Text" | "Assignment" | "Video" | "Link" | "Test" | string;
    title?: string;
    description?: string;
    content?: string;
    url?: string;
    fileUrl?: string;
    photoUrl?: string;
    videoUrl?: string;
    linkUrl?: string;
    deadline?: string;
    questions?: TestQuestion[];
};
export type TestQuestion = { id: string; text: string; answers: { id: string; text: string; isCorrect?: boolean }[] };
export type SubmissionStatus = { isSubmitted: boolean; submission?: unknown };

export const getModules = (courseId: string) => request<Module[]>(`/api/cource/module/get-all-on-cource/${courseId}`);
export const getLessons = (moduleId: string) => request<Lesson[]>(`/api/cource/lesson/get-all-on-module/${moduleId}`);
export const getMaterials = (lessonId: string) => request<Material[]>(`/api/cource/material/get-all-on-lesson/${lessonId}`);
export const getSubmissionStatus = (materialId: string) => request<SubmissionStatus>(`/api/cource/submit-material/status/${materialId}`);

export async function submitAssignment(assignmentId: string, file: File) {
    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("file", file);
    await request("/api/cource/submit-material/assignment", { method: "POST", body: formData });
}

export async function submitTest(testId: string, answers: { questionId: string; answerId: string }[]) {
    await request("/api/cource/submit-material/test", { method: "POST", body: JSON.stringify({ testId, answers }) });
}
