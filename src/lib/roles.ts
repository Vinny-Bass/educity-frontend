import type { User } from "@/types/user";

/**
 * Check if a user is a teacher
 */
export function isTeacher(user: User): boolean {
  // Check both role type and name to be flexible with different Strapi configurations
  return (
    user.role.type === "teacher" ||
    user.role.name.toLowerCase() === "teacher" ||
    user.role.type === "authenticated" && user.role.name.toLowerCase().includes("teacher")
  );
}

/**
 * Check if a user is a student
 */
export function isStudent(user: User): boolean {
  // Students are typically the default authenticated role
  return (
    user.role.type === "student" ||
    user.role.name.toLowerCase() === "student" ||
    (user.role.type === "authenticated" && !isTeacher(user))
  );
}

/**
 * Get user role display name
 */
export function getUserRoleDisplayName(user: User): string {
  if (isTeacher(user)) return "Teacher";
  if (isStudent(user)) return "Student";
  return user.role.name;
}

