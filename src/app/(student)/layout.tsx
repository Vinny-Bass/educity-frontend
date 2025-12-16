import type { SidebarItem } from "@/components/layout/Sidebar";
import { StudentShell } from "@/components/layout/StudentShell";
import { AuthProvider } from "@/contexts/AuthContext";
import { getStudentSession } from "@/lib/auth";
import { isStudent } from "@/lib/roles";
import { redirect } from "next/navigation";

const studentMenuItems: SidebarItem[] = [
  { label: "Home", href: "/student/dashboard", icon: "/navbar_home_2.svg" },
  {
    label: "Leaderboard",
    href: "/student/leaderboard",
    icon: "/navbar_leaderboard.svg",
  },
  { label: "Course", href: "/student/course", icon: "/navbar_course.svg" },
];

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getStudentSession();

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  // Check if user is a student
  if (!isStudent(user)) {
    // Redirect non-students back to their appropriate dashboard
    if (
      user.role.type === "teacher" ||
      user.role.name.toLowerCase() === "teacher"
    ) {
      redirect("/teacher/dashboard");
    } else {
      redirect("/");
    }
  }

  if (user.isOnboardingCompleted === false) {
    redirect("/onboarding");
  }

  return (
    <AuthProvider session={session}>
      <StudentShell menuItems={studentMenuItems} user={user}>
        {children}
      </StudentShell>
    </AuthProvider>
  );
}
