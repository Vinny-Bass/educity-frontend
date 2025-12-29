import { Sidebar } from "@/components/layout/Sidebar";
import { requireAuth } from "@/lib/auth";
import { isTeacher } from "@/lib/roles";
import { redirect } from "next/navigation";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure user is authenticated
  const user = await requireAuth();

  // Check if user is a teacher
  if (!isTeacher(user)) {
    // Redirect non-students back to their appropriate dashboard
    if (user.role.type === "student" || user.role.name.toLowerCase() === "student") {
      redirect("/student/dashboard");
    } else {
      redirect("/");
    }
  }

  if (user.isOnboardingCompleted === false) {
    redirect("/teacher/onboarding");
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 md:ml-0">{children}</main>
    </div>
  );
}

