"use client";

import { Pagination } from "@/components/ui/pagination";
import Image from "next/image";
import { useState } from "react";

interface ActivityProgress {
  id: string;
  name: string;
  completedCount: number;
  totalStudents: number;
}

interface ChapterProgressCardProps {
  chapterName: string;
  chapterIcon?: string;
  activities: ActivityProgress[];
  itemsPerPage?: number;
}

export function ChapterProgressCard({
  chapterName,
  chapterIcon = "/teacher_dash_book.svg",
  activities,
  itemsPerPage = 3,
}: ChapterProgressCardProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = activities.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-cardPC flex flex-col min-h-[300px]">
      {/* Chapter Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#F3ECFF] flex items-center justify-center shrink-0">
          <Image src={chapterIcon} alt="Chapter" width={16} height={16} />
        </div>
        <h3
          className="text-[15px] font-bold text-[#9056F5]"
          style={{ fontFamily: "var(--font-abc-diatype), sans-serif" }}
        >
          {chapterName}
        </h3>
      </div>

      {/* Activities List */}
      <div className="space-y-3 flex-1">
        {currentActivities.map((activity) => {
          const progressPercentage =
            activity.totalStudents > 0
              ? (activity.completedCount / activity.totalStudents) * 100
              : 0;

          return (
            <div key={activity.id} className="flex items-center gap-3">
              {/* Activity Name */}
              <div
                className="min-w-0 flex-[0_1_180px] text-[13px] font-bold text-[#0E0420] truncate"
                style={{ fontFamily: "var(--font-abc-diatype), sans-serif" }}
                title={activity.name}
              >
                {activity.name}
              </div>

              {/* Progress Bar */}
              <div className="flex-1 h-1.5 bg-[#F3F3F3] rounded-[6px] overflow-hidden">
                <div
                  className="h-full bg-[#9056F5] rounded-[6px] transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Completion Badge */}
              <div className="flex items-center justify-center min-w-[40px] h-6 px-2.5 bg-[#F3ECFF] rounded-[10px] shrink-0">
                <span
                  className="text-[12px] font-bold text-[#9056F5]"
                  style={{ fontFamily: "var(--font-abc-diatype), sans-serif" }}
                >
                  {activity.completedCount}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={handlePrevious}
        onNext={handleNext}
        className="mt-4"
      />
    </div>
  );
}

