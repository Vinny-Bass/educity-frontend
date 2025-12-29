"use client";

import { GuidedTour, type GuidedTourStep } from "@/components/ui/guided-tour";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { ActivityProgressStat, ChapterCompletionStat, getChapterCompletionStats, getChapterProgressStats, getLeaderboardStats, getStudentProgressStats, LeaderboardEntry, StudentProgressStat } from "@/features/teacher/course/queries";
import { Course } from "@/features/teacher/course/types";
import { ChapterCompletionCard } from "@/features/teacher/dashboard/components/ChapterCompletionCard";
import { ChapterProgressCard } from "@/features/teacher/dashboard/components/ChapterProgressCard";
import { LeaderboardCard } from "@/features/teacher/dashboard/components/LeaderboardCard";
import { StudentCard } from "@/features/teacher/dashboard/components/StudentCard";
import { useEffect, useMemo, useState } from "react";

interface TeacherDashboardViewProps {
  courses: Course[];
}

export function TeacherDashboardView({ courses }: TeacherDashboardViewProps) {
  const TOUR_STORAGE_KEY = "educity.teacherDashboardTourSeen.v1";

  // Store explicit user selection; compute an effective selection from current data.
  const [courseSelection, setCourseSelection] = useState<string | null>(null);
  const selectedCourseId = useMemo(() => {
    if (courses.length === 0) return "";
    if (
      courseSelection &&
      courses.some((c) => c.id.toString() === courseSelection)
    ) {
      return courseSelection;
    }
    return courses[0].id.toString();
  }, [courses, courseSelection]);

  const [chapterSelection, setChapterSelection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentStudentPage, setCurrentStudentPage] = useState(0);
  const [activityStats, setActivityStats] = useState<ActivityProgressStat[]>([]);
  const [completionStats, setCompletionStats] = useState<ChapterCompletionStat>({ completedStudents: 0, totalStudents: 0 });
  const [leaderboardStats, setLeaderboardStats] = useState<LeaderboardEntry[]>([]);
  const [studentStats, setStudentStats] = useState<StudentProgressStat[]>([]);

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  // Derived state for the currently selected course object
  const selectedCourse = useMemo(() =>
    courses.find(c => c.id.toString() === selectedCourseId),
    [courses, selectedCourseId]
  );

  // Derived chapters from the selected course
  const chapters = useMemo(() =>
    selectedCourse?.chapters || [],
    [selectedCourse]
  );

  const selectedChapterId = useMemo(() => {
    if (chapters.length === 0) return "";
    if (
      chapterSelection &&
      chapters.some((c) => c.id.toString() === chapterSelection)
    ) {
      return chapterSelection;
    }
    return chapters[0].id.toString();
  }, [chapters, chapterSelection]);

  // Fetch stats when chapter or course changes
  useEffect(() => {
    if (selectedChapterId && selectedCourseId) {
      Promise.all([
        getChapterProgressStats(selectedChapterId, selectedCourseId),
        getChapterCompletionStats(selectedChapterId, selectedCourseId),
        getLeaderboardStats(selectedCourseId)
      ])
        .then(([activityStatsData, completionStatsData, leaderboardStatsData]) => {
          setActivityStats(activityStatsData);
          setCompletionStats(completionStatsData);
          setLeaderboardStats(leaderboardStatsData);
        })
        .catch(console.error);
    }
  }, [selectedChapterId, selectedCourseId]);

  // Fetch students when course or search query changes
  useEffect(() => {
    if (selectedCourseId) {
      // Debounce
      const timeoutId = setTimeout(() => {
        getStudentProgressStats(selectedCourseId, searchQuery)
          .then((data) => {
            setStudentStats(data);
            setCurrentStudentPage(0); // Reset to first page on new search
          })
          .catch(console.error);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedCourseId, searchQuery]);

  const tourText =
    "This is where you can view the full program your class will follow. Explore each mission, see what students will learn, and prepare for upcoming activities.";

  const tourSteps: GuidedTourStep[] = useMemo(
    () => [
      {
        key: "menu-dashboard",
        targetSelector: '[data-tour="teacher-menu-dashboard"]',
        title: "Dashboard",
        text: tourText,
      },
      {
        key: "menu-course",
        targetSelector: '[data-tour="teacher-menu-course"]',
        title: "Course",
        text: tourText,
      },
      {
        key: "menu-team",
        targetSelector: '[data-tour="teacher-menu-team"]',
        title: "Team",
        text: tourText,
      },
      {
        key: "menu-manage-class",
        targetSelector: '[data-tour="teacher-menu-manage-class"]',
        title: "Manage class",
        text: tourText,
      },
      {
        key: "students",
        targetSelector: '[data-tour="teacher-dashboard-students"]',
        title: "Students",
        text: tourText,
      },
    ],
    []
  );

  // First-time tour (localStorage)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const hasSeen = window.localStorage.getItem(TOUR_STORAGE_KEY) === "1";
      if (hasSeen) return;

      // Delay a tick so targets can render.
      const id = window.setTimeout(() => {
        setTourStepIndex(0);
        setIsTourOpen(true);
      }, 250);
      return () => window.clearTimeout(id);
    } catch {
      // If storage is blocked, just don't auto-open.
    }
  }, []);

  const closeTour = () => {
    setIsTourOpen(false);
    try {
      window.localStorage.setItem(TOUR_STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  };

  const displayedActivityStats =
    selectedChapterId && selectedCourseId ? activityStats : [];
  const displayedCompletionStats =
    selectedChapterId && selectedCourseId
      ? completionStats
      : { completedStudents: 0, totalStudents: 0 };
  const displayedLeaderboardStats = selectedCourseId ? leaderboardStats : [];
  const displayedStudentStats = selectedCourseId ? studentStats : [];

  // Pagination for students
  const studentsPerPage = 4;
  const totalStudentPages = Math.max(
    1,
    Math.ceil(displayedStudentStats.length / studentsPerPage)
  );
  const startStudentIndex = currentStudentPage * studentsPerPage;
  const endStudentIndex = startStudentIndex + studentsPerPage;
  const currentStudents = displayedStudentStats.slice(startStudentIndex, endStudentIndex);

  const handlePreviousStudentPage = () => {
    setCurrentStudentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextStudentPage = () => {
    setCurrentStudentPage((prev) => Math.min(totalStudentPages - 1, prev + 1));
  };

  const selectedChapterName = chapters.find(c => c.id.toString() === selectedChapterId)?.name || "";

  return (
    <div className="p-5 md:p-6 lg:p-8 bg-[#FAFAFA] min-h-screen">
      <GuidedTour
        isOpen={isTourOpen}
        steps={tourSteps}
        currentStepIndex={tourStepIndex}
        onStepChange={setTourStepIndex}
        onClose={closeTour}
      />
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h1
              className="text-[24px] font-extrabold text-[#0E0420]"
              style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif", fontWeight: 800 }}
            >
              Dashboard
            </h1>

            {/* Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                data-tour="teacher-dashboard-course-select"
                value={selectedCourseId}
                onChange={(e) => {
                  setCourseSelection(e.target.value);
                  setChapterSelection(null);
                }}
              >
                {courses.length === 0 && <option value="">No courses available</option>}
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </Select>

              <Select
                data-tour="teacher-dashboard-chapter-select"
                value={selectedChapterId}
                onChange={(e) => setChapterSelection(e.target.value)}
                disabled={chapters.length === 0}
              >
                {chapters.length === 0 && <option value="">No chapters available</option>}
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" data-tour="teacher-dashboard-chapter-stats">
          {/* Card 1 - Chapter Progress (50% width on large screens) */}
          <div className="lg:col-span-1">
            <ChapterProgressCard
              chapterName={selectedChapterName || "No Chapter Selected"}
              activities={displayedActivityStats}
              itemsPerPage={3}
            />
          </div>

          {/* Cards 2 & 3 - Right Column (25% each on large screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5">
            {/* Card 2 - Chapter Completion */}
            <ChapterCompletionCard
              chapterName={selectedChapterName ? `Chapter ${selectedChapterName.split(':')[0].replace('Chapter ', '')}` : "N/A"}
              completedStudents={displayedCompletionStats.completedStudents}
              totalStudents={displayedCompletionStats.totalStudents}
            />

            {/* Card 3 - Leaderboard */}
            <LeaderboardCard entries={displayedLeaderboardStats} maxEntries={5} />
          </div>
        </div>

        {/* Students Section */}
        <div className="mt-12" data-tour="teacher-dashboard-students">
          {/* Students Header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <h2
                className="text-[24px] font-extrabold text-[#0E0420]"
                style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif", fontWeight: 800 }}
              >
                Students
              </h2>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <SearchInput
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="sm:w-64"
                />

              </div>
            </div>
          </div>

          {/* Students Cards - Horizontal Scroll */}
          <div className="relative -mx-5 md:-mx-6 lg:-mx-8">
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide px-5 md:px-6 lg:px-8">
              {currentStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  id={student.id}
                  name={student.name}
                  avatar={student.avatar}
                  status={student.status}
                  chapterName={student.chapterName}
                  activityName={student.activityName}
                  rankingPosition={student.rankingPosition}
                  sendos={student.sendos}
                  progress={student.progress}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentStudentPage}
              totalPages={totalStudentPages}
              onPrevious={handlePreviousStudentPage}
              onNext={handleNextStudentPage}
              className="mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

