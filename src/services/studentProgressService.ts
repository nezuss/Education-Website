import { getEnrolledCourses } from "./courseService";
import type { Course } from "../types/course";
import { getCourseStats, type CourseStats } from "./courseStatsService";
import { getStudentSubmissions } from "./submissionService";
import { assignmentDate, getStudentAssignments, type StudentAssignment } from "./assignmentService";

export type CourseProgress = { course: Course; stats?: CourseStats; error?: string };

export function progressTotals(items: CourseProgress[]) {
  if (items.some(item => !item.stats)) return undefined;
  const totals = items.reduce((total, { stats }) => ({
    lessons: total.lessons + stats!.completedLessons,
    materials: total.materials + stats!.totalSubmittableMaterials,
    completed: total.completed + stats!.completedSubmittableMaterials,
  }), { lessons: 0, materials: 0, completed: 0 });
  return { lessons: totals.lessons, percentage: totals.materials > 0 ? totals.completed / totals.materials * 100 : undefined };
}

export async function getStudentProgress() {
  const courses = await getEnrolledCourses();
  const items: CourseProgress[] = await Promise.all(courses.map(async course => {
    try { return { course, stats: await getCourseStats(course.id) }; }
    catch (reason) { return { course, error: reason instanceof Error ? reason.message : "Дані поки недоступні." }; }
  }));
  return { items, totals: progressTotals(items) };
}

export async function getSubmittedProjectCount() {
  const submissions = await getStudentSubmissions();
  if (submissions.some(item => !item || typeof item.id !== "string" || !item.id.trim() ||
    typeof item.relatedMaterialId !== "string" || !item.relatedMaterialId.trim() || !["Assignment", "Test"].includes(item.type ?? ""))) {
    throw new Error("Сервер не повернув типи надісланих робіт. Дані проєктів поки недоступні.");
  }
  return new Set(submissions.filter(item => item.type === "Assignment").map(item => item.relatedMaterialId)).size;
}

export async function getUpcomingDeadlines(): Promise<{ items: StudentAssignment[]; incomplete: boolean }> {
  const catalog = await getStudentAssignments();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const candidates = catalog.items.filter(item => !item.status?.isSubmitted || item.status.needsRevision || item.status.canResubmit);
  const items = candidates.filter(item => (assignmentDate(item.deadline)?.getTime() ?? -Infinity) >= today)
    .sort((a, b) => assignmentDate(a.deadline)!.getTime() - assignmentDate(b.deadline)!.getTime());
  return { items, incomplete: catalog.warnings.length > 0 || candidates.some(item => !assignmentDate(item.deadline) || item.statusError !== undefined) };
}
