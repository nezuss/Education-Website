import type { Submission } from "./submissionService";

export type FeedbackFilter = "all" | "pending" | "reviewed" | "returned";
export type FeedbackState = {
  key: "new" | "in-review" | "reviewed" | "returned" | "unknown";
  label: string;
};
export type FeedbackGroup = {
  materialId?: string;
  type?: string;
  current?: Submission;
  history: Submission[];
};

function nonblank(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function getFeedbackReviewer(item?: Submission) {
  const name = nonblank(item?.reviewerName);
  const automatic = nonblank(item?.reviewerId) === "0" || name?.toLowerCase() === "autocheck";
  return {
    automatic,
    name: automatic ? "Автоматична перевірка" : name,
    avatarUrl: automatic ? undefined : nonblank(item?.reviewerAvatarUrl),
  };
}

function timestamp(value: unknown): number {
  if (typeof value !== "string" || !value.trim()) return -1;
  const date = Date.parse(value);
  return Number.isFinite(date) && date >= 0 ? date : -1;
}

function newestFirst(left: Submission, right: Submission): number {
  const dates = timestamp(right.createdAt) - timestamp(left.createdAt)
    || timestamp(right.updatedAt) - timestamp(left.updatedAt);
  if (dates) return dates;
  return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
}

export function groupStudentFeedback(items: Submission[]): FeedbackGroup[] {
  const identities = new Set<string>();
  const grouped = new Map<string, { materialId?: string; type?: string; attempts: Submission[] }>();

  for (const item of items) {
    const id = nonblank(item?.id);
    if (!id) throw new Error("Не вдалося визначити ідентифікатор роботи. Спробуйте оновити сторінку.");
    if (identities.has(id)) throw new Error("Сервер повернув повторний ідентифікатор роботи. Спробуйте оновити сторінку.");
    identities.add(id);

    const materialId = nonblank(item.relatedMaterialId);
    const type = nonblank(item.type);
    const key = JSON.stringify(materialId ? ["material", type, materialId] : ["submission", id]);
    const group = grouped.get(key);
    if (group) group.attempts.push(item);
    else grouped.set(key, { materialId, type, attempts: [item] });
  }

  const groups = Array.from(grouped.values(), ({ materialId, type, attempts }): FeedbackGroup => {
    const sorted = [...attempts].sort(newestFirst);
    // Review updates cannot establish submission order when creation dates are missing or tied.
    const uncertain = sorted.length > 1 && (
      sorted.some(item => timestamp(item.createdAt) < 0)
      || timestamp(sorted[0].createdAt) === timestamp(sorted[1].createdAt)
    );
    return { materialId, type, current: uncertain ? undefined : sorted[0], history: uncertain ? sorted : sorted.slice(1) };
  });

  return groups.sort((left, right) => newestFirst(left.current ?? left.history[0], right.current ?? right.history[0]));
}

export function currentFeedbackState(item?: Submission): FeedbackState {
  if (item?.status === "NeedsRevision") return { key: "returned", label: "На доопрацюванні" };
  if (item?.status === "Reviewed") return { key: "reviewed", label: "Перевірено" };
  if (item?.status === "InReview") return { key: "in-review", label: "На перевірці" };
  if (item?.status === "Submitted") return { key: "new", label: "Надіслано" };
  return { key: "unknown", label: "Статус поки недоступний" };
}

export function getFeedbackComment(item: Submission): { feedback?: string; revision?: string } {
  return {
    feedback: nonblank(item.feedback),
    revision: item.status === "NeedsRevision" ? nonblank(item.revisionMessage) : undefined,
  };
}

export function getFeedbackCounts(groups: FeedbackGroup[]): { reviewed: number | undefined; pending: number | undefined; returned: number | undefined } {
  const counts = { reviewed: 0, pending: 0, returned: 0 };
  for (const group of groups) {
    const state = currentFeedbackState(group.current).key;
    if (state === "unknown") return { reviewed: undefined, pending: undefined, returned: undefined };
    if (state === "reviewed") counts.reviewed += 1;
    else if (state === "returned") counts.returned += 1;
    else counts.pending += 1;
  }
  return counts;
}

export function matchesFeedbackFilter(group: FeedbackGroup, filter: FeedbackFilter): boolean {
  if (filter === "all") return true;
  const state = currentFeedbackState(group.current).key;
  if (filter === "pending") return state === "new" || state === "in-review";
  return state === filter;
}
