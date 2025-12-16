'use server';

import { fetchFromStrapi } from '@/lib/strapi';
import type { Chapter, Course } from './types';

interface TeacherProgress {
  id: number;
  course: Course;
  progress: number;
}

/**
 * Get all courses
 * (This is now simple, secure, and authenticated)
 */
export async function getCourses(): Promise<Course[]> {
  // No token needed, fetchFromStrapi handles it!
  return fetchFromStrapi<Course[]>('/courses?populate[chapters][populate]=thumbnail');
}

/**
 * Get chapters for a course
 */
export async function getChapters(courseId: number): Promise<Chapter[]> {
  const endpoint = `/chapters?filters[course][id][$eq]=${courseId}&populate=thumbnail`;
  return fetchFromStrapi<Chapter[]>(endpoint);
}

/**
 * Get teacher progress
 */
export async function getTeacherProgress(courseId: number): Promise<TeacherProgress[]> {
  const endpoint = `/teacher-progresses?filters[course][id][$eq]=${courseId}&populate=*`;
  return fetchFromStrapi<TeacherProgress[]>(endpoint);
}
