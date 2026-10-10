import { getEnrolledCourses } from "./courseService";
import { getLessons, getMaterials, getModules, getSubmissionStatus, type Material, type SubmissionStatus } from "./learningService";

export type StudentAssignment = {
  id: string;
  title?: string;
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  description?: string;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: SubmissionStatus;
  statusError?: string;
};

export type AssignmentContext = StudentAssignment & { assignmentTitle: string; materials: Material[] };

function errorMessage(reason: unknown) {
  return reason instanceof Error ? reason.message : "Дані поки недоступні.";
}

function collection<T>(value: T[]): T[] {
  if (!Array.isArray(value)) throw new Error("Сервер не повернув список навчальних матеріалів.");
  return value;
}

async function mapLimited<T, R>(items: T[], load: (item: T) => Promise<R>): Promise<R[]> {
  const output: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(4, items.length) }, async () => {
    while (next < items.length) { const index = next++; output[index] = await load(items[index]); }
  }));
  return output;
}

async function assignmentCatalog() {
  const courses = collection(await getEnrolledCourses());
  const warnings: string[] = [];
  const groups = await mapLimited(courses, async course => {
    try {
      const modules = collection(await getModules(course.id));
      const moduleItems = await mapLimited(modules, async module => {
        try {
          const lessons = collection(await getLessons(module.id));
          const lessonItems = await mapLimited(lessons, async lesson => {
            try {
              const materials = collection(await getMaterials(lesson.id));
              return materials.filter(material => material.type === "Assignment").map(material => ({
                id: material.id, title: material.title, assignmentTitle: material.title || "Практичне завдання",
                courseId: course.id, courseTitle: course.title, moduleId: module.id, moduleTitle: module.title,
                lessonId: lesson.id, lessonTitle: lesson.title, description: material.description, deadline: material.deadline,
                createdAt: material.createdAt, updatedAt: material.updatedAt, materials,
              } satisfies AssignmentContext));
            } catch (reason) { warnings.push(`${course.title} / ${lesson.title}: ${errorMessage(reason)}`); return []; }
          });
          return lessonItems.flat();
        } catch (reason) { warnings.push(`${course.title} / ${module.title}: ${errorMessage(reason)}`); return []; }
      });
      return moduleItems.flat();
    } catch (reason) { warnings.push(`${course.title}: ${errorMessage(reason)}`); return []; }
  });
  const unique = new Map(groups.flat().map(item => [item.id, item]));
  return { items: [...unique.values()], warnings };
}

export async function getAssignmentContext(id: string): Promise<AssignmentContext> {
  const { items, warnings } = await assignmentCatalog();
  const item = items.find(assignment => assignment.id === id);
  if (item) return item;
  if (warnings.length) throw new Error("Дані завдання поки недоступні. Не вдалося отримати всі матеріали ваших курсів.");
  throw Object.assign(new Error("Завдання не знайдено у ваших курсах."), { status: 404 });
}

export async function getAssignmentStatus(id: string) {
  const status = await getSubmissionStatus(id);
  if (!assignmentStatusKind(status, id)) throw new Error("Статус роботи поки недоступний.");
  return status;
}

export async function getStudentAssignments(): Promise<{ items: StudentAssignment[]; warnings: string[] }> {
  const { items, warnings } = await assignmentCatalog();
  return { items: await mapLimited(items, async context => {
    const item: StudentAssignment = { id: context.id, title: context.title, courseId: context.courseId, courseTitle: context.courseTitle, moduleId: context.moduleId, moduleTitle: context.moduleTitle, lessonId: context.lessonId, lessonTitle: context.lessonTitle, description: context.description, deadline: context.deadline, createdAt: context.createdAt, updatedAt: context.updatedAt };
    try { return { ...item, status: await getAssignmentStatus(item.id) }; }
    catch (reason) { return { ...item, statusError: errorMessage(reason) }; }
  }), warnings };
}

export function assignmentStatusKind(status?: SubmissionStatus, materialId?: string): "todo" | "revision" | "review" | "reviewed" | undefined {
  if (!status || [status.isSubmitted, status.hasSubmission, status.needsRevision, status.canResubmit].some(value => typeof value !== "boolean")) return undefined;
  const submission = status.submission;
  if (!status.hasSubmission) {
    return !status.isSubmitted && !status.needsRevision && !status.canResubmit && submission == null ? "todo" : undefined;
  }
  if (typeof submission?.id !== "string" || !submission.id.trim()
    || typeof submission.relatedMaterialId !== "string" || !submission.relatedMaterialId.trim()
    || materialId !== undefined && submission.relatedMaterialId !== materialId) return undefined;
  if (submission.status === "NeedsRevision") {
    return !status.isSubmitted && status.needsRevision && status.canResubmit ? "revision" : undefined;
  }
  if (!status.isSubmitted || status.needsRevision || status.canResubmit) return undefined;
  if (submission.status === "Reviewed") return "reviewed";
  if (submission.status === "Submitted" || submission.status === "InReview") return "review";
  return undefined;
}

export function canSubmitAssignment(status?: SubmissionStatus) {
  const kind = assignmentStatusKind(status);
  return kind === "todo" || kind === "revision";
}

export function assignmentDate(value?: string) {
  const date = value ? new Date(value) : undefined;
  return date && Number.isFinite(date.getTime()) && date.getFullYear() >= 1970 ? date : undefined;
}

export function assignmentDaysLeft(value?: string) {
  const date = assignmentDate(value);
  if (!date) return undefined;
  const today = new Date();
  const day = (current: Date) => Date.UTC(current.getFullYear(), current.getMonth(), current.getDate());
  return Math.round((day(date) - day(today)) / 86400000);
}
