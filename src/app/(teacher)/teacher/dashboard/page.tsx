import { TeacherDashboardView } from "@/features/teacher/dashboard/components/TeacherDashboardView";
import { getCourses } from "@/features/teacher/course/queries";
import { requireAuth } from "@/lib/auth";

export default async function TeacherDashboardPage() {
  await requireAuth();

  const courses = await getCourses();

  return <TeacherDashboardView courses={courses} />;
}
