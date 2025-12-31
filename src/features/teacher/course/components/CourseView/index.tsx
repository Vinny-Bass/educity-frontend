"use client";

import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
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
    <div className="p-5 md:p-6 lg:p-8 bg-(--grayscale-100) min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <div
          className={`flex items-center ${
            _courses.length > 1 ? "justify-between" : ""
          } mb-4 gap-4`}
        >
          <h1
            className="text-[30px] leading-[45px] font-extrabold text-[#0E0420]"
            style={{
              fontFamily: "var(--font-abc-diatype), sans-serif",
              fontWeight: 800,
            }}
          >
            {selectedCourse.name}
          </h1>
          {_courses.length > 1 && (
            <div className="min-w-[150px]">
              <Select
                id="course-select"
                value={selectedCourse.id}
                onChange={(e) => handleCourseChange(e.target.value)}
                disabled={isPending}
                size="figma"
                className="w-[150px]"
              >
                {_courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>

        <h2
          className="text-[20px] leading-[30px] font-extrabold text-[#0E0420] mb-6"
          style={{
            fontFamily: "var(--font-abc-diatype), sans-serif",
            fontWeight: 800,
          }}
        >
          Introduction
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 mb-12">
          <div className="bg-white rounded-[20px] p-5 shadow-cardPC min-h-[247px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#F3ECFF] flex items-center justify-center shrink-0">
                <Image
                  src="/navbar_course.svg" // Make sure this path is correct in /public
                  alt="Course"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </div>
              <h3
                className="text-[18px] font-bold text-[#9056F5]"
                style={{
                  fontFamily: "var(--font-abc-diatype), sans-serif",
                  fontWeight: 700,
                }}
              >
                {selectedCourse.name}
              </h3>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#F3F3F3] flex items-center justify-center shrink-0">
                  <Image
                    src="/teacher_dash_book.svg" // Make sure this path is correct
                    alt="Goal"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </div>
                <h4
                  className="text-[18px] leading-[24px] font-bold text-[#0E0420]"
                  style={{
                    fontFamily: "var(--font-abc-diatype), sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Objective
                </h4>
              </div>
              <p
                className="text-[14px] leading-[21px] font-medium text-[#474250] pl-[55px]"
                style={{ fontFamily: "var(--font-abc-diatype), sans-serif" }}
              >
                {selectedCourse.goal || "No goal specified"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-5 shadow-cardPC min-h-[247px]">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#F3F3F3] flex items-center justify-center shrink-0">
                  <Image
                    src="/fire_gray.svg"
                    alt="Big Idea and Skills Learning"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </div>
                <h4
                  className="text-[18px] leading-[24px] font-bold text-[#0E0420]"
                  style={{
                    fontFamily: "var(--font-abc-diatype), sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Big idea and skills learning
                </h4>
              </div>
              {ideasAndSkills.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 pl-[55px]">
                  {ideasAndSkills.map((item, index) => (
                    <li
                      key={index}
                      className="text-[14px] leading-[21px] font-medium text-[#474250]"
                      style={{ fontFamily: "var(--font-abc-diatype), sans-serif" }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  className="text-[14px] leading-[21px] font-medium text-[#474250] pl-[55px]"
                  style={{ fontFamily: "var(--font-abc-diatype), sans-serif" }}
                >
                  No ideas and skills specified
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2
            className="text-[20px] leading-[30px] font-extrabold text-[#0E0420] mb-6"
            style={{
              fontFamily: "var(--font-abc-diatype), sans-serif",
              fontWeight: 800,
            }}
          >
            Mission
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
