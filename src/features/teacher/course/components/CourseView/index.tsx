"use client";

import { Pagination } from "@/components/ui/pagination";
import Image from "next/image";
import { useState, useTransition } from "react";
import { getChapters } from "../../queries";
import type { Chapter, Course } from "../../types";
import { ChapterCard } from "../ChapterCard";

interface CourseViewProps {
  initialCourses: Course[];
  initialSelectedCourse: Course;
  initialChapters: Chapter[];
}

export function CourseView({
  initialCourses,
  initialSelectedCourse,
  initialChapters,
}: CourseViewProps) {
  const [_courses] = useState<Course[]>(initialCourses);
  const [selectedCourse, setSelectedCourse] =
    useState<Course>(initialSelectedCourse);
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);

  const [currentPage, setCurrentPage] = useState(0);
  const [isPending, startTransition] = useTransition();

  const chaptersPerPage = 4;

  const handleCourseChange = (courseIdStr: string) => {
    const courseId = Number(courseIdStr);
    const newCourse = _courses.find((c) => c.id === courseId);

    if (!newCourse || newCourse.id === selectedCourse?.id) {
      return;
    }

    setSelectedCourse(newCourse);
    setCurrentPage(0);
    setChapters([]);

    startTransition(async () => {
      const newChapters = await getChapters(newCourse.id);
      setChapters(newChapters);
    });
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const essentialQuestions = Array.isArray(selectedCourse.essentialQuestions)
    ? selectedCourse.essentialQuestions
    : selectedCourse.essentialQuestions
    ? [selectedCourse.essentialQuestions]
    : [];

  const ideasAndSkills = Array.isArray(selectedCourse.ideasAndSkillsEarned)
    ? selectedCourse.ideasAndSkillsEarned
    : selectedCourse.ideasAndSkillsEarned
    ? [selectedCourse.ideasAndSkillsEarned]
    : [];

  const totalPages = Math.ceil(chapters.length / chaptersPerPage);
  const startIndex = currentPage * chaptersPerPage;
  const endIndex = startIndex + chaptersPerPage;
  const currentChapters = chapters.slice(startIndex, endIndex);

  return (
    <div className="p-5 md:p-6 lg:p-8 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <div className={`flex items-center ${_courses.length > 1 ? 'justify-between' : ''} mb-4 gap-4`}>
          <h1
            className="text-[30px] font-extrabold text-[#0E0420]"
            style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif", fontWeight: 800 }}
          >
            {`Course ${selectedCourse.courseNumber}`}
          </h1>
          {_courses.length > 1 && (
            <div className="min-w-[200px]">
              <select
                id="course-select"
                value={selectedCourse.id}
                onChange={(e) => handleCourseChange(e.target.value)}
                disabled={isPending}
                className="block w-full p-2 border border-gray-300 rounded-md"
              >
                {_courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <h2
          className="text-[30px] font-extrabold text-[#0E0420] mb-6"
          style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif", fontWeight: 800 }}
        >
          Introduction
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 mb-12">
          <div className="bg-white rounded-[20px] p-5 md:p-6 shadow-[0_5px_20px_0_rgba(14,4,32,0.04)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F3ECFF] flex items-center justify-center shrink-0">
                <Image
                  src="/navbar_course.svg" // Make sure this path is correct in /public
                  alt="Course"
                  width={20}
                  height={20}
                  className="w-5 h-5 md:w-6 md:h-6"
                />
              </div>
              <h3
                className="text-[18px] font-bold text-[#9056F5]"
                style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif", fontWeight: 700 }}
              >
                {selectedCourse.name}
              </h3>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#F3ECFF] flex items-center justify-center shrink-0">
                  <Image
                    src="/teacher_dash_book.svg" // Make sure this path is correct
                    alt="Goal"
                    width={16}
                    height={16}
                    className="w-4 h-4 md:w-5 md:h-5"
                  />
                </div>
                <h4
                  className="text-base md:text-lg font-bold text-[#0E0420]"
                  style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif", fontWeight: 700 }}
                >
                  Goal
                </h4>
              </div>
              <p
                className="text-sm md:text-base text-[#0E0420] ml-0 md:ml-[42px]"
                style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
              >
                {selectedCourse.goal || "No goal specified"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-5 md:p-6 shadow-[0_5px_20px_0_rgba(14,4,32,0.04)]">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#F3ECFF] flex items-center justify-center shrink-0">
                  <Image
                    src="/teacher_dash_book.svg"
                    alt="Essential Questions"
                    width={16}
                    height={16}
                    className="w-4 h-4 md:w-5 md:h-5"
                  />
                </div>
                <h4
                  className="text-base md:text-lg font-bold text-[#0E0420]"
                  style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif", fontWeight: 700 }}
                >
                  Essential questions
                </h4>
              </div>
              {essentialQuestions.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 ml-0 md:ml-[42px]">
                  {essentialQuestions.map((question, index) => (
                    <li
                      key={index}
                      className="text-sm md:text-base text-[#0E0420]"
                      style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
                    >
                      {question}
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  className="text-sm md:text-base text-[#0E0420] ml-0 md:ml-[42px]"
                  style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
                >
                  No essential questions specified
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#F3ECFF] flex items-center justify-center shrink-0">
                  <Image
                    src="/teacher_dash_book.svg"
                    alt="Big Idea and Skills Learning"
                    width={16}
                    height={16}
                    className="w-4 h-4 md:w-5 md:h-5"
                  />
                </div>
                <h4
                  className="text-base md:text-lg font-bold text-[#0E0420]"
                  style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif", fontWeight: 700 }}
                >
                  Big idea and skills learning
                </h4>
              </div>
              {ideasAndSkills.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 ml-0 md:ml-[42px]">
                  {ideasAndSkills.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm md:text-base text-[#0E0420]"
                      style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  className="text-sm md:text-base text-[#0E0420] ml-0 md:ml-[42px]"
                  style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
                >
                  No ideas and skills specified
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2
            className="text-[30px] font-extrabold text-[#0E0420] mb-6"
            style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif", fontWeight: 800 }}
          >
            Chapters
          </h2>

          {isPending ? (
            <div className="text-[#0E0420]">Loading chapters...</div>
          ) : currentChapters.length === 0 ? (
            <div className="text-[#0E0420]">No chapters available</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-6">
                {currentChapters.map((chapter) => (
                  <ChapterCard key={chapter.id} chapter={chapter} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={handlePreviousPage}
                onNext={handleNextPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
