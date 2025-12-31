"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Chapter } from "../../types";

interface ChapterCardProps {
  chapter: Chapter;
}

export function ChapterCard({ chapter }: ChapterCardProps) {
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-cardPC w-[260px] h-[380px] flex flex-col">
      {false && chapter.thumbnail ? (
        <div className="w-full h-[130px] mb-5 rounded-[10px] overflow-hidden">
          <Image
            src={chapter.thumbnail || ""}
            alt={chapter.name}
            width={200}
            height={160}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-[130px] mb-5 rounded-[10px] bg-[#F3ECFF] flex items-center justify-center">
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
        <div className="inline-flex items-center justify-center px-2.5 h-[30px] rounded-[10px] bg-[#F3ECFF]">
          <span
            className="text-[11px] font-extrabold text-[#7345C2]"
            style={{
              fontFamily: "var(--font-abc-diatype), sans-serif",
              fontWeight: 800,
            }}
          >
            Mission {chapter.chapterNumber}
          </span>
        </div>
      </div>

      {/* Chapter Title */}
      <h3
        className="text-[18px] leading-[24px] font-bold text-[#0E0420] mb-4"
        style={{
          fontFamily: "var(--font-abc-diatype), sans-serif",
          fontWeight: 700,
        }}
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
          className={`text-[11px] leading-[18px] font-medium ${
            chapter.completed ? "text-[#9056F5]" : "text-[#87838F]"
          }`}
          style={{
            fontFamily: "var(--font-abc-diatype), sans-serif",
            fontWeight: 500,
          }}
        >
          Mark as complete
        </span>
      </div>

      {/* Start Button */}
      <Button
        disabled={chapter.completed}
        className={`w-full h-10 rounded-[10px] text-[15px] leading-[18px] font-bold ${
          chapter.completed
            ? "bg-[#DCDBDE] text-white/60 hover:bg-[#DCDBDE]"
            : "bg-[#9056F5] text-white hover:bg-[#7c4ae8]"
        }`}
        style={{ fontFamily: "var(--font-abc-diatype), sans-serif" }}
      >
        {chapter.completed ? "Done" : "Start"}
      </Button>
    </div>
  );
}

