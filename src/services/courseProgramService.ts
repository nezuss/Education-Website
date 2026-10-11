import { requestCollection } from "./api/collection";
import type { Lesson, Module } from "./learningService";

export type ProgramModule = Module & { lessons: Lesson[]; lessonsError?: string };

function orderByIds<T extends { id: string }>(items: T[], ids?: string[]) {
  return [...items].sort((a, b) => {
    const position = (id: string) => { const index = ids?.indexOf(id) ?? -1; return index < 0 ? Number.MAX_SAFE_INTEGER : index; };
    return position(a.id) - position(b.id);
  });
}

export async function getCourseProgram(courseId: string, moduleIds?: string[]): Promise<ProgramModule[]> {
  const modules = await requestCollection<Module>(`/api/cource/module/get-all-on-cource/${encodeURIComponent(courseId)}`, "There are no modules yet", false);
  return Promise.all(orderByIds(modules, moduleIds).map(async module => {
    try {
      const lessons = await requestCollection<Lesson>(`/api/cource/lesson/get-all-on-module/${encodeURIComponent(module.id)}`, "There are no lessons yet", false);
      return { ...module, lessons: orderByIds(lessons, module.lessonsId) };
    } catch (reason) { return { ...module, lessons: [], lessonsError: (reason as Error).message }; }
  }));
}
