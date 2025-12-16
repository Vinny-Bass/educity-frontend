'use server';

import { postToStrapi } from '@/lib/strapi';
import { revalidatePath } from 'next/cache';

export async function resetEnrollmentProgress() {
  try {
    await postToStrapi('/enrollments/reset', {});
    revalidatePath('/student');
    return { success: true };
  } catch (error) {
    console.error('Failed to reset enrollment progress:', error);
    return { success: false, error: 'Failed to reset progress' };
  }
}

