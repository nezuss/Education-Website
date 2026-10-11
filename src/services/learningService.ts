import { request } from "./api/apiClient";
import { requestCollection } from "./api/collection";
import { submissionFileError } from "./submissionUpload";
import { normalizeSubmission, submissionGrade, type Submission } from "./submissionService";

export type Module = { id: string; title: string; description?: string; lessonsId?: string[] };
export type Lesson = { id: string; title: string; description?: string; materialsId?: string[]; createdAt?: string; updatedAt?: string };
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
    createdAt?: string;
    updatedAt?: string;
    questions?: TestQuestion[];
};
export type TestQuestion = { id: string; text: string; answers: { id: string; text: string; isCorrect?: boolean }[] };
export type CreateAnswerDTO = { text: string; isCorrect: boolean };
export type CreateQuestionDTO = { text: string; answers: CreateAnswerDTO[] };
export type SubmissionDetail = Submission;
export type SubmissionStatus = { isSubmitted: boolean; hasSubmission?: boolean; needsRevision?: boolean; canResubmit?: boolean; submission?: SubmissionDetail };

export const getModules = (courseId: string) => requestCollection<Module>(`/api/cource/module/get-all-on-cource/${encodeURIComponent(courseId)}`, "There are no modules yet");
export const getLessons = (moduleId: string) => requestCollection<Lesson>(`/api/cource/lesson/get-all-on-module/${encodeURIComponent(moduleId)}`, "There are no lessons yet");
export const getMaterials = (lessonId: string) => requestCollection<Material>(`/api/cource/material/get-all-on-lesson/${encodeURIComponent(lessonId)}`, "There are no materials yet");
export const getSubmissionStatus = (materialId: string) => request<SubmissionStatus>(`/api/cource/submit-material/status/${materialId}`);

export type LessonCompletionResult = { id: string; lessonId: string; courseId: string; completedAt: string; alreadyCompleted: boolean };
export async function completeLesson(lessonId: string, courseId: string): Promise<LessonCompletionResult> {
    if (!lessonId.trim() || !courseId.trim()) throw new Error("Дані уроку поки недоступні.");
    const result = await request<LessonCompletionResult>(`/student/lessons/${encodeURIComponent(lessonId)}/complete`, { method: "POST" });
    const date = typeof result?.completedAt === "string" ? new Date(result.completedAt) : undefined;
    if (!result || typeof result.id !== "string" || !result.id.trim() || result.lessonId !== lessonId || result.courseId !== courseId
        || typeof result.alreadyCompleted !== "boolean" || !date || !Number.isFinite(date.getTime()) || date.getFullYear() < 1970) {
        throw new Error("Сервер не підтвердив завершення цього уроку. Спробуйте перевірити ще раз.");
    }
    return result;
}

export async function createModule(data: { title: string; description: string }) {
    return request<Module>("/api/cource/module/create", { method: "POST", body: JSON.stringify({ ...data, lessonsId: [] }) });
}

export async function createLesson(data: { title: string; description: string }) {
    return request<Lesson>("/api/cource/lesson/create", { method: "POST", body: JSON.stringify({ ...data, materialsId: [] }) });
}

export async function createTextMaterial(content: string) {
    return request<Material>("/api/cource/material/create", { method: "POST", body: JSON.stringify({ type: "Text", content }) });
}

export const assignModuleToCourse = (courseId: string, moduleId: string) => request("/admin/assign/module-to-cource", { method: "POST", body: JSON.stringify({ courceId: courseId, moduleId }) });
export const assignLessonToModule = (moduleId: string, lessonId: string) => request("/admin/assign/lesson-to-module", { method: "POST", body: JSON.stringify({ moduleId, lessonId }) });
export const assignMaterialToLesson = (lessonId: string, materialId: string) => request("/admin/assign/material-to-lesson", { method: "POST", body: JSON.stringify({ lessonId, materialId }) });

export async function submitAssignment(assignmentId: string, file: File) {
    const fileError = submissionFileError(file);
    if (fileError) throw new Error(fileError);
    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("file", file);
    return request<SubmissionDetail>("/api/cource/submit-material/assignment", { method: "POST", body: formData });
}

export async function submitTest(testId: string, answers: { questionId: string; answerId: string }[]): Promise<SubmissionDetail> {
    const data = await request<unknown>("/api/cource/submit-material/test", { method: "POST", body: JSON.stringify({ testId, answers }) });
    try {
        const result = normalizeSubmission(data);
        if (result.relatedMaterialId !== testId || result.type !== "Test" || result.status !== "Reviewed" || submissionGrade(result.rate, result.type) === undefined) {
            throw new Error("Сервер не повернув підтверджений результат цього тесту.");
        }
        return result;
    } catch (reason) {
        // A successful POST may have saved the attempt even when its response cannot be confirmed.
        throw Object.assign(new Error(reason instanceof Error ? reason.message : "Результат тесту поки недоступний."), { status: 200 });
    }
}
