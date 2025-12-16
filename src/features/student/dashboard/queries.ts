import { fetchFromStrapi } from '@/lib/strapi';
import { DashboardData } from './types'; // Make sure to type this!

/**
 * Fetches all dashboard data for the currently logged-in student.
 * This single call replaces fetching enrollments and then dashboard data.
 */
export async function getMyStudentDashboard() {
  const data = await fetchFromStrapi<DashboardData>(
    '/dashboard/my'
  );
  return data;
}
