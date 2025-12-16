"use client";

import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { ChapterCompletionCard } from "@/features/teacher/dashboard/components/ChapterCompletionCard";
import { ChapterProgressCard } from "@/features/teacher/dashboard/components/ChapterProgressCard";
import { LeaderboardCard } from "@/features/teacher/dashboard/components/LeaderboardCard";
import { StudentCard } from "@/features/teacher/dashboard/components/StudentCard";
import { useState } from "react";

export default function TeacherDashboardPage() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [studentsCourse, setStudentsCourse] = useState("");
  const [currentStudentPage, setCurrentStudentPage] = useState(0);

  // Mock data - replace with actual data from backend
  const courses = [
    { id: "course-1", name: "Introduction to Creativity" },
    { id: "course-2", name: "Advanced Innovation" },
    { id: "course-3", name: "Design Thinking" },
  ];

  const chapters = [
    { id: "chapter-1", name: "Chapter 1: Getting Started" },
    { id: "chapter-2", name: "Chapter 2: Core Concepts" },
    { id: "chapter-3", name: "Chapter 3: Practice" },
  ];

  const activities = [
    { id: "1", name: "Video 1", completedCount: 15, totalStudents: 20 },
    { id: "2", name: "Quiz 1", completedCount: 12, totalStudents: 20 },
    { id: "3", name: "Video 2", completedCount: 18, totalStudents: 20 },
    { id: "4", name: "Mission 1", completedCount: 8, totalStudents: 20 },
    { id: "5", name: "Video 3", completedCount: 10, totalStudents: 20 },
  ];

  const leaderboardEntries = [
    { id: "1", rank: 1, name: "Alice Johnson", sendos: 1250 },
    { id: "2", rank: 2, name: "Bob Smith", sendos: 1100 },
    { id: "3", rank: 3, name: "Carol Williams", sendos: 980 },
    { id: "4", rank: 4, name: "David Brown", sendos: 875 },
    { id: "5", rank: 5, name: "Emma Davis", sendos: 820 },
  ];

  const students = [
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "",
      status: "Complete" as const,
      chapterName: "Chapter 1",
      activityName: "Video 1",
      rankingPosition: 1,
      sendos: 1250,
      progress: 100,
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar: "",
      status: "In Progress" as const,
      chapterName: "Chapter 2",
      activityName: "Quiz 3",
      rankingPosition: 2,
      sendos: 1100,
      progress: 65,
    },
    {
      id: "3",
      name: "Carol Williams",
      avatar: "",
      status: "Complete" as const,
      chapterName: "Chapter 1",
      activityName: "Mission 2",
      rankingPosition: 3,
      sendos: 980,
      progress: 100,
    },
    {
      id: "4",
      name: "David Brown",
      avatar: "",
      status: "In Progress" as const,
      chapterName: "Chapter 3",
      activityName: "Video 5",
      rankingPosition: 4,
      sendos: 875,
      progress: 45,
    },
    {
      id: "5",
      name: "Emma Davis",
      avatar: "",
      status: "Complete" as const,
      chapterName: "Chapter 2",
      activityName: "Quiz 1",
      rankingPosition: 5,
      sendos: 820,
      progress: 100,
    },
    {
      id: "6",
      name: "Frank Miller",
      avatar: "",
      status: "In Progress" as const,
      chapterName: "Chapter 1",
      activityName: "Video 2",
      rankingPosition: 6,
      sendos: 750,
      progress: 30,
    },
  ];

  // Filter students by search query
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination for students
  const studentsPerPage = 4;
  const totalStudentPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startStudentIndex = currentStudentPage * studentsPerPage;
  const endStudentIndex = startStudentIndex + studentsPerPage;
  const currentStudents = filteredStudents.slice(startStudentIndex, endStudentIndex);

  const handlePreviousStudentPage = () => {
    setCurrentStudentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextStudentPage = () => {
    setCurrentStudentPage((prev) => Math.min(totalStudentPages - 1, prev + 1));
  };

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
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </Select>

              <Select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
              >
                <option value="">Select Chapter</option>
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
              chapterName="Chapter 1: Getting Started"
              activities={activities}
              itemsPerPage={3}
            />
          </div>

          {/* Cards 2 & 3 - Right Column (25% each on large screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5">
            {/* Card 2 - Chapter Completion */}
            <ChapterCompletionCard
              chapterName="Chapter 1"
              completedStudents={15}
              totalStudents={20}
            />

            {/* Card 3 - Leaderboard */}
            <LeaderboardCard entries={leaderboardEntries} maxEntries={5} />
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

                <Select
                  value={studentsCourse}
                  onChange={(e) => setStudentsCourse(e.target.value)}
                >
                  <option value="">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </Select>
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

