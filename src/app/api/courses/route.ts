import { getCourses, getTeacherProgress } from '@/features/course/queries';
import { getChaptersByCourse } from '@/features/onboarding/queries';
import { getAuthToken } from '@/lib/cookies';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const courses = await getCourses();
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken();
    const body = await request.json();
    const { action, courseId, chapterId } = body;

    if (action === 'getChapters') {
      if (!courseId) {
        return NextResponse.json(
          { error: 'Course ID is required' },
          { status: 400 }
        );
      }
      const chapters = await getChaptersByCourse(courseId);
      return NextResponse.json(chapters);
    }
    const teacherId = 123
    if (teacherId) {
      if (action === 'getProgress') {
        const token = await getAuthToken();
        if (!token) {
          return NextResponse.json(
            { error: 'User not authenticated' },
            { status: 401 },
          );
        }
        const progress = await getTeacherProgress(teacherId, courseId, chapterId);
        return NextResponse.json(progress);
      }
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

