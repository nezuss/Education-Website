import { request } from "./api/apiClient";
import { getMaterials } from "./learningService";
import { getMentorCourses, type MentorSubmission } from "./mentorService";
import type { UserProfile } from "./profileService";
import { getFeedbackContexts, type FeedbackContext } from "./studentFeedbackContextService";

export type MentorQueueContext = FeedbackContext & { materialTitle?: string };
export type MentorQueueContexts = { contexts: Map<string, MentorQueueContext>; unavailable: boolean };
type AssignedCourse = { id: string; title: string; assignedTeacherId?: string };

function nonblank(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

async function mapLimited<T, R>(items: T[], load: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(4, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await load(items[index]);
    }
  }));
  return results;
}

export async function getMentorQueueContexts(items: MentorSubmission[], profile: UserProfile): Promise<MentorQueueContexts> {
  const contexts = new Map<string, MentorQueueContext>();
  if (!items.length) return { contexts, unavailable: false };
  const profileId = nonblank(profile.id);
  if (profile.role !== "Teacher" || !profileId) return { contexts, unavailable: true };

  let unavailable = false;
  const requestedTypes = new Map<string, string | undefined>();
  for (const item of items) {
    const id = nonblank(item?.relatedMaterialId);
    if (!id) { unavailable = true; continue; }
    const type = item.type === "Assignment" || item.type === "Test" ? item.type : undefined;
    if (!type || requestedTypes.has(id) && requestedTypes.get(id) !== type) {
      requestedTypes.set(id, undefined);
      unavailable = true;
    } else if (!requestedTypes.has(id)) requestedTypes.set(id, type);
  }
  if (!requestedTypes.size) return { contexts, unavailable: true };

  async function loadCourses() {
    const assigned = await getMentorCourses();
    const ids = new Set<string>();
    for (const entry of assigned) {
      const id = nonblank(entry?.courceId);
      if (id) ids.add(id);
      else unavailable = true;
    }
    const courses = await mapLimited(Array.from(ids), async id => {
      try {
        const course = await request<AssignedCourse>(`/api/cource/get-by-id/${encodeURIComponent(id)}`);
        if (course?.id === id && nonblank(course.title) && nonblank(course.assignedTeacherId) === profileId) return course;
      } catch { /* Preserve other assigned courses when this one is unavailable. */ }
      unavailable = true;
      return undefined;
    });
    return courses.filter((course): course is AssignedCourse => course !== undefined);
  }

  const resolved = await getFeedbackContexts(Array.from(requestedTypes.keys()), loadCourses);
  unavailable ||= resolved.unavailable;
  const lessonRequests = new Map<string, string[]>();
  for (const [id, context] of resolved.contexts) {
    contexts.set(id, { ...context });
    if (!requestedTypes.get(id)) continue;
    const ids = lessonRequests.get(context.lessonId);
    if (ids) ids.push(id);
    else lessonRequests.set(context.lessonId, [id]);
  }

  await mapLimited(Array.from(lessonRequests), async ([lessonId, ids]) => {
    try {
      const materials = await getMaterials(lessonId);
      if (!Array.isArray(materials)) throw new Error("Сервер не повернув список матеріалів уроку.");
      for (const id of ids) {
        const matches = materials.filter(material => material && nonblank(material.id) === id && material.type === requestedTypes.get(id));
        if (matches.length !== 1) { unavailable = true; continue; }
        const title = nonblank(matches[0].title);
        if (title) contexts.get(id)!.materialTitle = title;
      }
    } catch { unavailable = true; }
  });
  return { contexts, unavailable };
}
