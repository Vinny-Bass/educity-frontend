import { getCourses } from "@/features/teacher/course/queries";
import { TeacherDashboardView } from "@/features/teacher/dashboard/components/TeacherDashboardView";
import { requireAuth } from "@/lib/auth";

export default async function TeacherDashboardPage() {
  await requireAuth();

  const courses = await getCourses();

  return <TeacherDashboardView courses={courses} />;
}
