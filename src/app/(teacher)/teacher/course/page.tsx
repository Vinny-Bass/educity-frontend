import { CourseView } from '@/features/teacher/course/components/CourseView';
import { getCourses } from '@/features/teacher/course/queries';
import { requireAuth } from '@/lib/auth';
import { Suspense } from 'react';

export default async function CoursePage() {
  await requireAuth();

  const courses = await getCourses();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseView
        initialCourses={courses}
        initialSelectedCourse={courses[0]}
        initialChapters={courses[0].chapters}
      />
    </Suspense>
  );
}
