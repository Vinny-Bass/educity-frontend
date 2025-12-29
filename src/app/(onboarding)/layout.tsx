import { getUser } from '@/lib/auth';
import { isStudent, isTeacher } from '@/lib/roles';
import { redirect } from 'next/navigation';
import React from 'react';

/**
 * This layout handles the onboarding flow.
 * - It ensures the user is logged in.
 * - It checks if the user has already completed onboarding (i.e., has an enrollment).
 * - If onboarding is complete, it redirects to the student dashboard.
 * - Otherwise, it displays the onboarding steps.
 */
export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // If the user is not logged in, redirect to the login page.
  if (!user) {
    redirect('/login');
  }

  // If the user has an enrollment, they have completed onboarding.
  // Redirect them to their dashboard.
  if (user.isOnboardingCompleted === true) {
    if (isTeacher(user)) {
      redirect('/teacher/dashboard');
    }
    if (isStudent(user)) {
      redirect('/student/dashboard');
    }
    redirect('/');
  }

  // User is logged in but has not completed onboarding, show the flow.
  return <>{children}</>;
}
