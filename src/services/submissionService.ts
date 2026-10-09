import { request } from "./api/apiClient";

export type Submission = {
  id: string;
  relatedMaterialId: string;
  userId: string;
  type?: string;
  rate: number;
  status?: string | null;
  feedback?: string | null;
  revisionMessage?: string | null;
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

export const getStudentSubmissions = () => submissionCollection<Submission>("/student/submissions", ["You don't have any submissions"]);

export async function getSubmissionDetails(id: string): Promise<Submission> {
  const data = await request<Submission>(`/submissions/${encodeURIComponent(id)}`);
  if (!data || data.id !== id) throw new Error("Сервер не повернув запитану роботу.");
  return data;
}

export function submissionState(item: Submission) {
  if (item.status === "NeedsRevision") return { key: "returned", label: "На доопрацюванні" };
  if (item.status === "Reviewed" || item.rate > 0) return { key: "reviewed", label: "Перевірено" };
  if (item.status === "InReview") return { key: "in-review", label: "На перевірці" };
  if (!item.status || item.status === "Submitted") return { key: "new", label: "Надіслано" };
  return { key: "unknown", label: item.status };
}

export function submissionDate(value?: string) {
  const date = value ? new Date(value) : null;
  return date && Number.isFinite(date.getTime()) ? date.toLocaleString("uk-UA") : "—";
}

export function submissionGrade(value?: number) {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 12 ? value : undefined;
}

export function submissionFileUrl(value?: string) {
  if (!value) return undefined;
  try {
    const base = import.meta.env.VITE_API_BASE_URL ?? "https://nexylva.pp.ua/api";
    const url = new URL(value, base.endsWith("/") ? base : `${base}/`);
    return ["http:", "https:"].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}
