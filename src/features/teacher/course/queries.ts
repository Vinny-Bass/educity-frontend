'use server';

import { getUser } from '@/lib/auth';
import { fetchFromStrapi } from '@/lib/strapi';
import qs from 'qs';
import type { Chapter, Course } from './types';

interface TeacherProgress {
  id: number;
  course: Course;
  progress: number;
}

export interface ActivityProgressStat {
  id: string;
  name: string;
  completedCount: number;
  totalStudents: number;
}

export interface ChapterCompletionStat {
  completedStudents: number;
  totalStudents: number;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  sendos: number;
}

export interface StudentProgressStat {
  id: string;
  name: string;
  avatar: string;
  status: "Complete" | "In Progress";
  chapterName: string;
  activityName: string;
  rankingPosition: number;
  sendos: number;
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
  const endpoint = `/chapters?filters[courses][id][$eq]=${courseId}&populate=thumbnail`;
  return fetchFromStrapi<Chapter[]>(endpoint);
}

/**
 * Get teacher progress
 */
export async function getTeacherProgress(courseId: number): Promise<TeacherProgress[]> {
  const endpoint = `/teacher-progresses?filters[course][id][$eq]=${courseId}&populate=*`;
  return fetchFromStrapi<TeacherProgress[]>(endpoint);
}

/**
 * Get activity progress stats for a chapter
 */
export async function getChapterProgressStats(chapterId: string | number, courseId: string | number): Promise<ActivityProgressStat[]> {
  const user = await getUser();
  if (!user) return [];

  // 1. Get classes and enrollments
  const classesQuery = qs.stringify({
    filters: {
      teachers: { id: { $eq: user.id } },
      course: { id: { $eq: courseId } },
    },
    populate: {
      enrollments: {
        fields: ['id']
      }
    }
  });

  const classes = await fetchFromStrapi<any[]>(`/classes?${classesQuery}`);

  const enrollmentIds = classes.flatMap((c: any) => c.enrollments?.map((e: any) => e.id) || []);
  const totalStudents = enrollmentIds.length;

  if (totalStudents === 0) return [];

  // 2. Get activities for the chapter
  const chapterQuery = qs.stringify({
    populate: {
      activities: {
        fields: ['id', 'title', 'standardActivityType', 'type'],
        sort: ['order:asc']
      }
    }
  });

  const chapter = await fetchFromStrapi<any[]>(`/chapters?filters[id][$eq]=${chapterId}&${chapterQuery}`).then(res => Array.isArray(res) ? res[0] : null);

  if (!chapter || !chapter.activities) return [];

  // 3. Get progress
  // We fetch all 'completed' progress for these enrollments and this chapter
  const progressQuery = qs.stringify({
    filters: {
      enrollment: { id: { $in: enrollmentIds } },
      activity: { chapter: { id: { $eq: chapterId } } },
      activityStatus: { $eq: 'completed' }
    },
    populate: {
      activity: { fields: ['id'] }
    },
    pagination: {
      limit: -1 // Get all
    }
  });

  const progress = await fetchFromStrapi<any[]>(`/student-activity-progresses?${progressQuery}`);

  // 4. Aggregate
  return chapter.activities.map((activity: any) => {
    const completedCount = progress.filter((p: any) => p.activity?.id === activity.id).length;
    return {
      id: activity.id.toString(),
      name: activity.title,
      completedCount,
      totalStudents
    };
  });
}

/**
 * Get chapter completion stats
 * Calculates how many students have completed all activities in a chapter
 */
export async function getChapterCompletionStats(chapterId: string | number, courseId: string | number): Promise<ChapterCompletionStat> {
  const user = await getUser();
  if (!user) return { completedStudents: 0, totalStudents: 0 };

  // 1. Get classes and enrollments
  const classesQuery = qs.stringify({
    filters: {
      teachers: { id: { $eq: user.id } },
      course: { id: { $eq: courseId } },
    },
    populate: {
      enrollments: {
        fields: ['id']
      }
    }
  });

  const classes = await fetchFromStrapi<any[]>(`/classes?${classesQuery}`);
  const enrollmentIds = classes.flatMap((c: any) => c.enrollments?.map((e: any) => e.id) || []);
  const totalStudents = enrollmentIds.length;

  if (totalStudents === 0) return { completedStudents: 0, totalStudents: 0 };

  // 2. Get all activities for the chapter
  const chapterQuery = qs.stringify({
    populate: {
      activities: {
        fields: ['id'],
      }
    }
  });

  const chapter = await fetchFromStrapi<any[]>(`/chapters?filters[id][$eq]=${chapterId}&${chapterQuery}`).then(res => Array.isArray(res) ? res[0] : null);

  if (!chapter || !chapter.activities || chapter.activities.length === 0) {
    return { completedStudents: 0, totalStudents };
  }

  // 3. Get all completed progress for these enrollments in this chapter
  const progressQuery = qs.stringify({
    filters: {
      enrollment: { id: { $in: enrollmentIds } },
      activity: { chapter: { id: { $eq: chapterId } } },
      activityStatus: { $eq: 'completed' }
    },
    populate: {
      enrollment: { fields: ['id'] },
      activity: { fields: ['id'] }
    },
    pagination: {
      limit: -1
    }
  });

  const progress = await fetchFromStrapi<any[]>(`/student-activity-progresses?${progressQuery}`);

  // 4. Calculate how many students completed all activities
  let completedStudentsCount = 0;

  for (const enrollmentId of enrollmentIds) {
    // Get all completed activity IDs for this student
    const studentCompletedActivities = new Set(
      progress
        .filter((p: any) => p.enrollment?.id === enrollmentId)
        .map((p: any) => p.activity?.id)
    );

    // Check if student completed all chapter activities
    const isChapterComplete = chapter.activities.every((activity: any) =>
      studentCompletedActivities.has(activity.id)
    );

    if (isChapterComplete) {
      completedStudentsCount++;
    }
  }

  return {
    completedStudents: completedStudentsCount,
    totalStudents
  };
}

/**
 * Get leaderboard stats for a course
 * Returns top students ranked by sendos earned
 */
export async function getLeaderboardStats(courseId: string | number): Promise<LeaderboardEntry[]> {
  const user = await getUser();
  if (!user) return [];

  // 1. Get classes and enrollments
  const classesQuery = qs.stringify({
    filters: {
      teachers: { id: { $eq: user.id } },
      course: { id: { $eq: courseId } },
    },
    populate: {
      enrollments: {
        fields: ['id'],
        populate: {
          student: {
            fields: ['firstName', 'lastName']
          },
          sendos_transactions: {
            fields: ['amount']
          }
        }
      }
    }
  });

  const classes = await fetchFromStrapi<any[]>(`/classes?${classesQuery}`);

  // Flatten all enrollments from all classes for this course
  const allEnrollments = classes.flatMap((c: any) => c.enrollments || []);

  if (allEnrollments.length === 0) return [];

  // 2. Calculate total sendos for each student
  const leaderboard = allEnrollments.map((enrollment: any) => {
    const totalSendos = (enrollment.sendos_transactions || []).reduce((acc: number, tx: any) => acc + (tx.amount || 0), 0);
    const fullName = [enrollment.student?.firstName, enrollment.student?.lastName].filter(Boolean).join(' ') || 'Unknown Student';

    return {
      id: enrollment.id.toString(),
      rank: 0, // Will be set later
      name: fullName,
      sendos: totalSendos
    };
  });

  // 3. Sort by sendos descending
  leaderboard.sort((a: any, b: any) => b.sendos - a.sendos);

  // 4. Add rank and return top entries
  return leaderboard.map((entry: any, index: number) => ({
    ...entry,
    rank: index + 1
  }));
}

/**
 * Get detailed student progress stats
 */
export async function getStudentProgressStats(courseId: string | number, nameFilter?: string): Promise<StudentProgressStat[]> {
  const user = await getUser();
  if (!user) return [];

  // 1. Get classes and enrollments
  const classesQuery = qs.stringify({
    filters: {
      teachers: { id: { $eq: user.id } },
      course: { id: { $eq: courseId } },
    },
    populate: {
      enrollments: {
        fields: ['id'],
        populate: {
          student: {
            fields: ['firstName', 'lastName']
          },
          sendos_transactions: {
            fields: ['amount']
          }
        }
      }
    }
  });

  const classes = await fetchFromStrapi<any[]>(`/classes?${classesQuery}`);

  // Flatten all enrollments from all classes for this course
  const allEnrollments = classes.flatMap((c: any) => c.enrollments || []);

  if (allEnrollments.length === 0) return [];

  // 2. Get leaderboard to calculate ranking
  const leaderboard = await getLeaderboardStats(courseId);
  const rankingMap = new Map(leaderboard.map(l => [l.id, l.rank]));

  // 3. For each student, find their current progress (latest active chapter/activity)
  // This is a bit complex. For simplicity and performance, we'll fetch their *last completed* activity.
  const students = await Promise.all(allEnrollments.map(async (enrollment: any) => {
    const fullName = [enrollment.student?.firstName, enrollment.student?.lastName].filter(Boolean).join(' ') || 'Unknown Student';

    // Filter by name if provided
    if (nameFilter && !fullName.toLowerCase().includes(nameFilter.toLowerCase())) {
      return null;
    }

    const totalSendos = (enrollment.sendos_transactions || []).reduce((acc: number, tx: any) => acc + (tx.amount || 0), 0);
    const rank = rankingMap.get(enrollment.id.toString()) || 0;

    // Get last completed activity to determine "current" status
    const progressQuery = qs.stringify({
      filters: {
        enrollment: { id: { $eq: enrollment.id } },
        activityStatus: { $eq: 'completed' },
        activity: { // Ensure activity belongs to the course
             chapter: {
                courses: {
                    id: { $eq: courseId }
                }
             }
        }
      },
      sort: ['updatedAt:desc'], // Most recently updated first
      populate: {
        activity: {
          fields: ['title', 'id'],
          populate: {
            chapter: {
              fields: ['name']
            }
          }
        }
      },
      pagination: {
        limit: 1
      }
    });

    const lastProgress = await fetchFromStrapi<any[]>(`/student-activity-progresses?${progressQuery}`).then(res => res[0]);

    // Calculate overall course progress
    // Get total activities in course
    // This is expensive to do per student loop if optimized, but for now we'll do a simpler approximation or just use Sendos as proxy for now since exact % requires fetching all course structure again
    // Optimization: We could fetch total activities count for the course once at the start.

    // Let's assume progress based on chapter completion or just use a placeholder for now as
    // exact "56%" calculation requires: (completed_activities / total_course_activities) * 100
    // We'll leave progress as 0 for now or implement if needed.
    // Actually, let's try to get a rough count.

    // Using sendos as a proxy for progress or just last activity.

    const chapterName = lastProgress?.activity?.chapter?.name || "Starting...";
    const activityName = lastProgress?.activity?.title || "Welcome";
    const status = lastProgress ? "In Progress" : "In Progress"; // Simplified logic

    return {
      id: enrollment.id.toString(),
      name: fullName,
      avatar: "", // Strapi doesn't provide avatar URL by default in this minimal query
      status: "In Progress", // Todo: determine "Complete" if all activities done
      chapterName,
      activityName,
      rankingPosition: rank,
      sendos: totalSendos,
      progress: 0 // Placeholder until we calculate real %
    } as StudentProgressStat;
  }));

  return students.filter(Boolean) as StudentProgressStat[];
}
