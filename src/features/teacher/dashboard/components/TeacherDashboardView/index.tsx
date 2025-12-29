"use client";

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
  // Initialize with the first course if available
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courses.length > 0 ? courses[0].id.toString() : ""
  );

  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentStudentPage, setCurrentStudentPage] = useState(0);
  const [activityStats, setActivityStats] = useState<ActivityProgressStat[]>([]);
  const [completionStats, setCompletionStats] = useState<ChapterCompletionStat>({ completedStudents: 0, totalStudents: 0 });
  const [leaderboardStats, setLeaderboardStats] = useState<LeaderboardEntry[]>([]);
  const [studentStats, setStudentStats] = useState<StudentProgressStat[]>([]);

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

  // Reset selected chapter when course changes
  useEffect(() => {
    if (chapters.length > 0) {
      const firstChapterId = chapters[0].id.toString();
      if (selectedChapterId !== firstChapterId) {
        setSelectedChapterId(firstChapterId);
      }
    } else {
      if (selectedChapterId !== "") {
        setSelectedChapterId("");
      }
    }
  }, [chapters, selectedChapterId]);

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
    } else {
      setActivityStats([]);
      setCompletionStats({ completedStudents: 0, totalStudents: 0 });
      setLeaderboardStats([]);
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
    } else {
      setStudentStats([]);
    }
  }, [selectedCourseId, searchQuery]);


  // Pagination for students
  const studentsPerPage = 4;
  const totalStudentPages = Math.ceil(studentStats.length / studentsPerPage);
  const startStudentIndex = currentStudentPage * studentsPerPage;
  const endStudentIndex = startStudentIndex + studentsPerPage;
  const currentStudents = studentStats.slice(startStudentIndex, endStudentIndex);

  const handlePreviousStudentPage = () => {
    setCurrentStudentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextStudentPage = () => {
    setCurrentStudentPage((prev) => Math.min(totalStudentPages - 1, prev + 1));
  };

  const selectedChapterName = chapters.find(c => c.id.toString() === selectedChapterId)?.name || "";

  return (
    <div className="p-5 md:p-6 lg:p-8 bg-[#FAFAFA] min-h-screen">
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
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
              >
                {courses.length === 0 && <option value="">No courses available</option>}
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </Select>

              <Select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Card 1 - Chapter Progress (50% width on large screens) */}
          <div className="lg:col-span-1">
            <ChapterProgressCard
              chapterName={selectedChapterName || "No Chapter Selected"}
              activities={activityStats}
              itemsPerPage={3}
            />
          </div>

          {/* Cards 2 & 3 - Right Column (25% each on large screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5">
            {/* Card 2 - Chapter Completion */}
            <ChapterCompletionCard
              chapterName={selectedChapterName ? `Chapter ${selectedChapterName.split(':')[0].replace('Chapter ', '')}` : "N/A"}
              completedStudents={completionStats.completedStudents}
              totalStudents={completionStats.totalStudents}
            />

            {/* Card 3 - Leaderboard */}
            <LeaderboardCard entries={leaderboardStats} maxEntries={5} />
          </div>
        </div>

        {/* Students Section */}
        <div className="mt-12">
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

