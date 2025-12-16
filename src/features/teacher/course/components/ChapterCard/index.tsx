"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Chapter } from "../../types";

interface ChapterCardProps {
  chapter: Chapter;
}

export function ChapterCard({ chapter }: ChapterCardProps) {
  return (
    <div className="bg-white rounded-[20px] p-4 md:p-5 shadow-[0_5px_20px_0_rgba(14,4,32,0.04)]">
      {false && chapter.thumbnail ? (
        <div className="w-full h-32 md:h-40 mb-4 rounded-[10px] overflow-hidden">
          <Image
            src={chapter.thumbnail || ""}
            alt={chapter.name}
            width={200}
            height={160}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-32 md:h-40 mb-4 rounded-[10px] bg-[#F3ECFF] flex items-center justify-center">
          <Image
            src="/teacher_dash_book.svg"
            alt="Chapter"
            width={48}
            height={48}
            className="w-12 h-12 opacity-50"
          />
        </div>
      )}

      {/* Chapter Number Badge */}
      <div className="mb-3">
        <div className="inline-block px-3 py-1 rounded-[10px] bg-[#F3ECFF]">
          <span
            className="text-[11px] font-extrabold text-[#7345C2]"
            style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif", fontWeight: 800 }}
          >
            Chapter {chapter.chapterNumber}
          </span>
        </div>
      </div>

      {/* Chapter Title */}
      <h3
        className="text-[18px] font-bold text-[#0E0420] mb-4"
        style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif", fontWeight: 700 }}
      >
        {chapter.name}
      </h3>

      {/* Line Breaker */}
      <div className="h-px bg-[#DCDBDE] rounded mb-4" />

      {/* Completion Status */}
      <div className="flex items-center gap-2 mb-4">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={chapter.completed ? "text-[#9056F5]" : "text-[#87838F]"}
        >
          {chapter.completed ? (
            <path
              d="M13.333 4L6 11.333 2.667 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <rect
              x="2"
              y="2"
              width="12"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          )}
        </svg>
        <span
          className="text-[11px] font-medium text-[#87838F]"
          style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif", fontWeight: 500 }}
        >
          {chapter.completed ? "Completed" : "Mark as complete"}
        </span>
      </div>

      {/* Start Button */}
      <Button
        className="w-full h-auto rounded-[0.625rem] bg-[#9056F5] py-3 text-base font-normal text-white hover:bg-[#7c4ae8] font-baloo"
        style={{ fontFamily: "Baloo, sans-serif" }}
      >
        Start
      </Button>
    </div>
  );
}

