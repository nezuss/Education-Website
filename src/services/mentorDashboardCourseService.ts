import { request } from "./api/apiClient";
import type { MentorCourse } from "./mentorService";
import type { UserProfile } from "./profileService";

export type MentorDashboardCourseNames = { names: Map<string, string>; unavailable: boolean };
type AssignedCourse = { id: string; title: string; assignedTeacherId?: string };

function nonblank(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export async function getMentorDashboardCourseNames(courses: MentorCourse[], profile: UserProfile): Promise<MentorDashboardCourseNames> {
  const names = new Map<string, string>();
  if (!courses.length) return { names, unavailable: false };
  const profileId = nonblank(profile.id);
  if (profile.role !== "Teacher" || !profileId) return { names, unavailable: true };

  let unavailable = false;
  const uniqueIds = new Set<string>();
  for (const course of courses) {
    const id = nonblank(course?.courceId);
    if (id) uniqueIds.add(id);
    else unavailable = true;
  }
  const ids = Array.from(uniqueIds);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(4, ids.length) }, async () => {
    while (next < ids.length) {
      const id = ids[next++];
      try {
        const course = await request<AssignedCourse>(`/api/cource/get-by-id/${encodeURIComponent(id)}`);
        const title = nonblank(course?.title);
        if (course?.id === id && course.assignedTeacherId === profileId && title) names.set(id, title);
        else unavailable = true;
      } catch { unavailable = true; }
    }
  }));
  return { names, unavailable };
}
