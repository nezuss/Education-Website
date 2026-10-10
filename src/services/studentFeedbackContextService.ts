import { getEnrolledCourses } from "./courseService";
import { getLessons, getModules } from "./learningService";

export type FeedbackContext = {
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
};

type NamedItem = { id: string; title: string; materialsId?: unknown };

function usableText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
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

function sameContext(left: FeedbackContext, right: FeedbackContext) {
  return left.courseId === right.courseId && left.courseTitle === right.courseTitle
    && left.moduleId === right.moduleId && left.moduleTitle === right.moduleTitle
    && left.lessonId === right.lessonId && left.lessonTitle === right.lessonTitle;
}

export function getStudentFeedbackContexts(materialIds: string[]) {
  return getFeedbackContexts(materialIds, getEnrolledCourses);
}

export async function getFeedbackContexts(materialIds: string[], loadCourses: () => Promise<unknown>): Promise<{ contexts: Map<string, FeedbackContext>; unavailable: boolean }> {
  const contexts = new Map<string, FeedbackContext>();
  const wanted = new Set(materialIds.filter(usableText));
  if (!wanted.size) return { contexts, unavailable: false };
  let unavailable = false;

  async function readItems(load: () => Promise<unknown>): Promise<NamedItem[]> {
    try {
      const value = await load();
      if (!Array.isArray(value)) {
        unavailable = true;
        return [];
      }
      return value.filter((item): item is NamedItem => {
        const valid = item !== null && typeof item === "object" && usableText(item.id) && usableText(item.title);
        if (!valid) unavailable = true;
        return valid;
      });
    } catch {
      unavailable = true;
      return [];
    }
  }

  const courses = await readItems(loadCourses);
  const moduleRequests = new Map<string, Promise<NamedItem[]>>();
  const groups = await mapLimited(courses, async course => {
    let request = moduleRequests.get(course.id);
    if (!request) {
      request = readItems(() => getModules(course.id));
      moduleRequests.set(course.id, request);
    }
    const modules = await request;
    return modules.map(module => ({ course, module }));
  });

  const lessonRequests = new Map<string, Promise<NamedItem[]>>();
  const branches = await mapLimited(groups.flat(), async branch => {
    let request = lessonRequests.get(branch.module.id);
    if (!request) {
      request = readItems(() => getLessons(branch.module.id));
      lessonRequests.set(branch.module.id, request);
    }
    return { ...branch, lessons: await request };
  });

  const ambiguous = new Set<string>();
  for (const { course, module, lessons } of branches) {
    for (const lesson of lessons) {
      if (lesson.materialsId == null) continue;
      if (!Array.isArray(lesson.materialsId)) {
        unavailable = true;
        continue;
      }
      const context: FeedbackContext = {
        courseId: course.id, courseTitle: course.title.trim(),
        moduleId: module.id, moduleTitle: module.title.trim(),
        lessonId: lesson.id, lessonTitle: lesson.title.trim(),
      };
      for (const id of lesson.materialsId) {
        if (!usableText(id)) {
          unavailable = true;
          continue;
        }
        if (!wanted.has(id) || ambiguous.has(id)) continue;
        const previous = contexts.get(id);
        if (previous && !sameContext(previous, context)) {
          contexts.delete(id);
          ambiguous.add(id);
          unavailable = true;
        } else {
          contexts.set(id, context);
        }
      }
    }
  }

  return { contexts, unavailable: unavailable || contexts.size < wanted.size };
}
