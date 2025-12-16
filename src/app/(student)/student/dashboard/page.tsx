import DashboardView from "@/features/student/dashboard/components/DashboardView";
import { getMyStudentDashboard } from "@/features/student/dashboard/queries";
import { DashboardData } from "@/features/student/dashboard/types";
import { requireAuth } from "@/lib/auth";
import { StrapiApiError } from "@/types/errors";

/**
 * Renders the main student dashboard.
 * This is a Server Component that fetches all its own data.
 */
export default async function StudentDashboardPage() {
  await requireAuth();

  let dashboardData: DashboardData | null = null;
  try {
    dashboardData = await getMyStudentDashboard();

    if (!dashboardData?.currentChapter) {
      return (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center px-4">
            <p className="text-lg font-semibold">
              No chapter found for this course
            </p>
          </div>
        </div>
      );
    }
  } catch (error: unknown) {
    if (
      error instanceof StrapiApiError &&
      error.status === 404 &&
      error.message.includes("No active enrollment")
    ) {
      return (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center px-4">
            <p className="text-lg font-semibold">
              You are not enrolled in any class
            </p>
          </div>
        </div>
      );
    }

    if (
      error instanceof StrapiApiError &&
      error.status === 404 &&
      error.message.includes("No course found")
    ) {
      return (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center px-4">
            <p className="text-lg font-semibold">
              No course found for this enrollment
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center px-4">
          <p className="text-lg font-semibold text-red-500">
            Failed to load dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardView
      sendosAmount={dashboardData.totalSendos}
      dashboardData={dashboardData}
    />
  );
}
