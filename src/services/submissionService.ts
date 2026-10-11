import { request, requestFile } from "./api/apiClient";

export type Submission = {
  id: string;
  relatedMaterialId: string;
  materialId?: string;
  courseId?: string | null;
  courseTitle?: string | null;
  lessonId?: string | null;
  lessonTitle?: string | null;
  answers?: { questionId: string; answerId: string }[] | null;
  userId: string;
  type?: string;
  rate: number;
  status?: string | null;
  feedback?: string | null;
  revisionMessage?: string | null;
  reviewerId?: string | null;
  reviewerName?: string | null;
  reviewerAvatarUrl?: string | null;
  reviewerAt?: string | null;
  submittedAt?: string | null;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export async function submissionCollection<T>(path: string, emptyMessages: string[]): Promise<T[]> {
  try {
    const data = await request<T[]>(path);
    if (!Array.isArray(data)) throw new Error("Сервер не повернув список робіт або курсів.");
    return data;
  } catch (reason) {
    const error = reason as Error & { status?: number };
    if (error.status === 404 && emptyMessages.includes(error.message)) return [];
    throw reason;
  }
}

export function normalizeSubmission(value: unknown): Submission {
  if (!value || typeof value !== "object" || typeof (value as Submission).id !== "string" || !(value as Submission).id.trim()) {
    throw new Error("Дані робіт поки недоступні. Сервер не повернув ідентифікатор роботи.");
  }
  const item = value as Submission;
  const materialId = typeof item.materialId === "string" ? item.materialId.trim() : undefined;
  const legacyId = typeof item.relatedMaterialId === "string" ? item.relatedMaterialId.trim() : undefined;
  if (materialId && legacyId && materialId !== legacyId) throw new Error("Сервер повернув суперечливі ідентифікатори матеріалу роботи.");
  return { ...item, relatedMaterialId: materialId || legacyId || "" };
}

export async function getStudentSubmissions() {
  return (await submissionCollection<unknown>("/student/submissions", ["You don't have any submissions"])).map(normalizeSubmission);
}

export async function getSubmissionDetails(id: string): Promise<Submission> {
  const data = await request<Submission>(`/submissions/${encodeURIComponent(id)}`);
  if (!data || data.id !== id) throw new Error("Сервер не повернув запитану роботу.");
  return normalizeSubmission(data);
}

export const getSubmissionFile = (id: string) => {
  if (!id.trim()) return Promise.reject(new Error("Роботу не знайдено."));
  return requestFile(`/submissions/${encodeURIComponent(id)}/file`, `submission-${id.replace(/[^a-zA-Z0-9_-]/g, "_")}`);
};

export function submissionState(item: Submission) {
  if (item.status === "NeedsRevision") return { key: "returned", label: "На доопрацюванні" };
  if (item.status === "Reviewed") return { key: "reviewed", label: "Перевірено" };
  if (item.status === "InReview") return { key: "in-review", label: "На перевірці" };
  if (item.status === "Submitted") return { key: "new", label: "Надіслано" };
  return { key: "unknown", label: "Статус поки недоступний" };
}

export function submissionDate(value?: string) {
  const date = value ? new Date(value) : null;
  return date && Number.isFinite(date.getTime()) ? date.toLocaleString("uk-UA") : "—";
}

export function submissionGrade(value?: number, type?: string) {
  return typeof value === "number" && Number.isInteger(value) && value >= (type === "Test" ? 0 : 1) && value <= 12 ? value : undefined;
}

export function submissionFileUrl(value?: string) {
  if (!value) return undefined;
  try {
    const base = import.meta.env.VITE_API_BASE_URL ?? "https://nexylva.pp.ua/api";
    const url = new URL(value, base.endsWith("/") ? base : `${base}/`);
    return ["http:", "https:"].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}
