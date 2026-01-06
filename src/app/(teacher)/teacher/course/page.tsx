import { CourseView } from '@/features/teacher/course/components/CourseView';
import { getCourses } from '@/features/teacher/course/queries';
import { requireAuth } from '@/lib/auth';
import { Suspense } from 'react';

export default async function CoursePage() {
  await requireAuth();

  const courses = await getCourses();

  if (!courses || courses.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">No courses found</h1>
        <p className="mt-2 text-gray-600">You are not assigned to any courses yet.</p>
      </div>
    );
  }

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
