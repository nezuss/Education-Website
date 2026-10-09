import { getMentorCourses } from "./mentorService";

export async function getMentorProfileCourseCount(): Promise<number> {
  const courses = await getMentorCourses();
  const ids = new Set<string>();
  for (const course of courses) {
    if (!course || typeof course.courceId !== "string" || !course.courceId.trim()) {
      throw new Error("Сервер не повернув повні дані призначених курсів.");
    }
    ids.add(course.courceId);
  }
  return ids.size;
}
