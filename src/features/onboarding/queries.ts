'use server';

import { ArchetypeId } from '@/features/onboarding/data/archetypes';
import { fetchFromStrapi, putToStrapi } from '@/lib/strapi';
import qs from 'qs';

export interface CompleteOnboardingProfilePayload {
  firstName: string;
  lastName?: string;
  password?: string;
  guardianName?: string;
  guardianEmail?: string;
}

export interface CompleteOnboardingPayload {
  quizAnswers?: Record<string, ArchetypeId>;
  profile: CompleteOnboardingProfilePayload;
}

export async function completeOnboarding(userId: number, payload: CompleteOnboardingPayload) {
  return putToStrapi(`/users/${userId}`, {
    firstName: payload.profile.firstName,
    lastName: payload.profile.lastName,
    password: payload.profile.password,
    guardianName: payload.profile.guardianName,
    guardianEmail: payload.profile.guardianEmail,
    ...(payload.quizAnswers && { radarData: payload.quizAnswers }),
    isOnboardingCompleted: true,
  });
}

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function completeTeacherOnboarding(userId: number) {
  const result = await putToStrapi(`/users/${userId}`, {
    isOnboardingCompleted: true,
  });

  revalidatePath('/teacher/dashboard');
  revalidatePath('/teacher/onboarding');
  redirect('/teacher/dashboard');
}

export async function getChaptersByCourse(courseId: number) {
  const query = qs.stringify({
    filters: { course: { id: { $eq: courseId } } },
    sort: ["order:asc"],
  });

  return fetchFromStrapi(`/chapters?${query}`);
}

