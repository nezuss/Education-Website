import type { StudentAssignment } from "./assignmentService";
import type { Submission } from "./submissionService";

export type DashboardEvent = {
  id: string;
  submissionId: string;
  title: string;
  description: string;
  date: string;
  kind: "submitted" | "feedback" | "revision";
};

function nonblank(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function timestamp(value: unknown) {
  const text = nonblank(value);
  const result = text ? Date.parse(text) : NaN;
  return Number.isFinite(result) && result >= 0 ? result : undefined;
}

function submissionIdentity(item: Submission) {
  return item && nonblank(item.id) && nonblank(item.relatedMaterialId)
    && (item.type === "Assignment" || item.type === "Test");
}

function attemptOrder(first: Submission, second: Submission) {
  const created = (timestamp(first.createdAt) ?? -Infinity) - (timestamp(second.createdAt) ?? -Infinity);
  if (created && !Number.isNaN(created)) return created;
  const updated = (timestamp(first.updatedAt) ?? -Infinity) - (timestamp(second.updatedAt) ?? -Infinity);
  return updated && !Number.isNaN(updated) ? updated : first.id.localeCompare(second.id);
}

function commentOrder(first: Submission, second: Submission) {
  const date = (timestamp(first.updatedAt) ?? timestamp(first.createdAt) ?? -Infinity)
    - (timestamp(second.updatedAt) ?? timestamp(second.createdAt) ?? -Infinity);
  return date && !Number.isNaN(date) ? date : first.id.localeCompare(second.id);
}

function submissionStatusDescription(item: Submission) {
  if (item.status === "NeedsRevision") return "На доопрацюванні";
  if (item.status === "Reviewed") return "Перевірено";
  if (item.status === "InReview") return "На перевірці";
  if (item.status === "Submitted") return "Надіслано";
  return nonblank(item.status) ?? (item.type === "Test" ? "Тест" : "Практичне завдання");
}

function currentSubmissionComments(item: Submission) {
  const feedback = nonblank(item.feedback);
  const revisionMessage = nonblank(item.revisionMessage);
  if (item.status === "NeedsRevision") return { feedback, revisionMessage };
  const knownStatus = item.status === "Reviewed" || item.status === "InReview" || item.status === "Submitted";
  return { feedback: knownStatus ? feedback : feedback ?? revisionMessage, revisionMessage: undefined };
}

export function getDashboardSubmissionSummary(items: Submission[]): { projects: number | undefined; latestFeedback?: Submission; events: DashboardEvent[] } {
  const validItems = items.filter(submissionIdentity).map(item => ({
    ...item, ...currentSubmissionComments(item),
  }));
  const projects = validItems.length === items.length
    ? new Set(validItems.filter(item => item.type === "Assignment").map(item => item.relatedMaterialId)).size
    : undefined;

  const attempts = new Map<string, Submission>();
  for (const item of validItems) {
    const previous = attempts.get(item.relatedMaterialId);
    if (!previous || attemptOrder(item, previous) > 0) attempts.set(item.relatedMaterialId, item);
  }
  const latestFeedback = [...attempts.values()]
    .filter(item => item.feedback || item.revisionMessage)
    .sort((first, second) => commentOrder(second, first))[0];

  const activity = new Map<string, DashboardEvent>();
  for (const item of validItems) {
    const created = timestamp(item.createdAt);
    if (created === undefined) continue;
    const material = item.type === "Test" ? "тест" : "практичну роботу";
    const submitted: DashboardEvent = {
      id: `${item.id}:submitted`, submissionId: item.id, kind: "submitted", date: item.createdAt,
      title: `Надіслано ${material}`, description: submissionStatusDescription(item),
    };
    activity.set(submitted.id, submitted);
    const updated = timestamp(item.updatedAt);
    const description = item.revisionMessage || item.feedback;
    if (!description || updated === undefined || updated < created) continue;
    const kind = item.status === "NeedsRevision" ? "revision" : "feedback";
    const comment: DashboardEvent = {
      id: `${item.id}:${kind}`, submissionId: item.id, kind, date: item.updatedAt, description,
      title: kind === "revision" ? "Повідомлення про доопрацювання" : `Отримано коментар до ${item.type === "Test" ? "тесту" : "практичної роботи"}`,
    };
    activity.set(comment.id, comment);
  }
  const events = [...activity.values()]
    .sort((first, second) => timestamp(second.date)! - timestamp(first.date)! || first.id.localeCompare(second.id))
    .slice(0, 3);
  return { projects, latestFeedback, events };
}

function assignmentStatusUnknown(item: StudentAssignment) {
  const status = item.status;
  return item.statusError !== undefined || !status
    || [status.isSubmitted, status.hasSubmission, status.needsRevision, status.canResubmit].some(value => typeof value !== "boolean");
}

export function selectDashboardAssignment(catalog: { items: StudentAssignment[]; warnings: string[] }): { assignment?: StudentAssignment; deadlinesUnavailable: boolean } {
  const pending = catalog.items.filter(item => assignmentStatusUnknown(item) || !item.status!.isSubmitted
    || item.status!.needsRevision || item.status!.canResubmit || item.status!.submission?.status === "NeedsRevision");
  const assignment = [...pending].sort((first, second) => {
    const firstDate = timestamp(first.deadline);
    const secondDate = timestamp(second.deadline);
    if (firstDate === undefined) return secondDate === undefined ? 0 : 1;
    return secondDate === undefined ? -1 : firstDate - secondDate;
  })[0];
  const deadlinesUnavailable = catalog.warnings.length > 0 || catalog.items.some(assignmentStatusUnknown)
    || pending.some(item => timestamp(item.deadline) === undefined);
  return { assignment, deadlinesUnavailable };
}
