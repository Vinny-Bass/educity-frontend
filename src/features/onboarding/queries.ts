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

export async function getChaptersByCourse(courseId: number) {
  const query = qs.stringify({
    filters: { course: { id: { $eq: courseId } } },
    sort: ["order:asc"],
  });

  return fetchFromStrapi(`/chapters?${query}`);
}

