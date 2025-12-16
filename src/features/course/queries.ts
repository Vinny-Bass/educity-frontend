import { fetchFromStrapi } from "@/lib/strapi";
import qs from "qs";

export async function getCourses() {
  return fetchFromStrapi("/courses");
}

export async function getTeacherProgress(
  teacherId: number,
  courseId?: number,
  chapterId?: number,
) {
  const filters: any = {
    teacher: { id: { $eq: teacherId } },
  };
  if (courseId) {
    filters.course = { id: { $eq: courseId } };
  }
  if (chapterId) {
    filters.chapter = { id: { $eq: chapterId } };
  }
  const query = qs.stringify({
    filters,
  });

  return fetchFromStrapi(`/teacher-progresses?${query}`);
}
