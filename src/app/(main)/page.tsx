import { getUser } from "@/lib/auth";
import { isStudent, isTeacher } from "@/lib/roles";
import { redirect } from "next/navigation";

export default async function HomePage() {
  // Check if user is authenticated
  const user = await getUser();

  // Redirect based on user role
  if (user && isTeacher(user)) {
    redirect("/teacher/dashboard");
  }

  if (user && isStudent(user)) {
    redirect("/student/dashboard");
  }

  // If not authenticated or unknown role, redirect to login
  if (!user) {
    redirect("/login");
  }

  // Fallback: if user exists but doesn't match any role, redirect to login
  redirect("/login");
}

