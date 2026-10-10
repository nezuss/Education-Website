import { request } from "./api/apiClient";
import { getEnrolledCourses } from "./courseService";
import { getMaterials } from "./learningService";
import { getMentorCourses } from "./mentorService";
import type { UserProfile } from "./profileService";
import { getFeedbackContexts, type FeedbackContext } from "./studentFeedbackContextService";
import type { Submission } from "./submissionService";

export type MentorReviewContext = {
  context?: FeedbackContext;
  materialTitle?: string;
  description?: string;
  deadline?: string;
  courseTeacherId?: string;
  materialError?: string;
  unavailable: boolean;
};

type ContextCourse = { id: string; title: string; assignedTeacherId?: string };

function nonblank(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export async function getMentorReviewContext(
  item: Pick<Submission, "relatedMaterialId" | "type" | "userId">,
  profile: UserProfile,
): Promise<MentorReviewContext> {
  const materialId = nonblank(item.relatedMaterialId);
  const profileId = nonblank(profile.id);
  if (!materialId || !profileId) return { unavailable: true };

  let courses: ContextCourse[] = [];
  let incomplete = false;
  async function loadCourses() {
    if (profile.role !== "Teacher" && profileId === nonblank(item.userId)) {
      const enrolled = await getEnrolledCourses();
      if (!Array.isArray(enrolled)) throw new Error("Сервер не повернув список курсів.");
      courses = enrolled;
      return courses;
    }

    const assigned = await getMentorCourses();
    const ids = new Set<string>();
    for (const entry of assigned) {
      const id = nonblank(entry?.courceId);
      if (!id) { incomplete = true; continue; }
      ids.add(id);
    }
    for (const id of ids) {
      try {
        const course = await request<ContextCourse>(`/api/cource/get-by-id/${encodeURIComponent(id)}`);
        if (!course || course.id !== id || !nonblank(course.title)
          || nonblank(course.assignedTeacherId) !== profileId) {
          incomplete = true;
          continue;
        }
        courses.push(course);
      } catch { incomplete = true; }
    }
    return courses;
  }

  const resolved = await getFeedbackContexts([materialId], loadCourses);
  const context = resolved.contexts.get(materialId);
  if (!context) return { unavailable: true };
  const teacherIds = new Set(courses.filter(course => course?.id === context.courseId)
    .map(course => nonblank(course.assignedTeacherId)).filter((id): id is string => Boolean(id)));
  const result: MentorReviewContext = {
    context,
    courseTeacherId: teacherIds.size === 1 ? Array.from(teacherIds)[0] : undefined,
    unavailable: incomplete || resolved.unavailable || teacherIds.size > 1,
  };
  if (item.type !== "Assignment" && item.type !== "Test") return result;

  try {
    const materials = await getMaterials(context.lessonId);
    if (!Array.isArray(materials)) throw new Error("Сервер не повернув список матеріалів уроку.");
    const matches = materials.filter(material => material && material.id === materialId && material.type === item.type);
    if (matches.length !== 1) throw new Error("Матеріал не вдалося однозначно визначити.");
    const material = matches[0];
    result.materialTitle = nonblank(material.title);
    if (item.type === "Assignment") {
      result.description = nonblank(material.description);
      const deadline = nonblank(material.deadline);
      if (deadline && Number.isFinite(Date.parse(deadline)) && Date.parse(deadline) >= 0) result.deadline = deadline;
    }
  } catch {
    result.materialError = "Не вдалося завантажити матеріал завдання.";
    result.unavailable = true;
  }
  return result;
}
