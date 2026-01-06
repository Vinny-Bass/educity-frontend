"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Class } from "@/types/enrollment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateCourseProgress } from "../../queries";
import type { Chapter } from "../../types";

interface ChapterCardProps {
  chapter: Chapter;
  initialClass: Class;
}

export function ChapterCard({ chapter, initialClass }: ChapterCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isCompleted, setIsCompleted] = useState(chapter.completed);

  const handleToggleComplete = () => {
    const newStatus = !isCompleted;

    // Optimistic update
    setIsCompleted(newStatus);

    startTransition(async () => {
      try {
        await updateCourseProgress(initialClass.documentId || "", chapter.documentId, newStatus);
        router.refresh();
      } catch (error) {
        // Revert on error
        setIsCompleted(!newStatus);
        console.error("Failed to update progress:", error);
      }
    });
  };

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
      <div
        className={`flex items-center gap-2 mb-4 ${isCompleted ? 'cursor-default' : 'cursor-pointer'}`}
        onClick={(isPending || isCompleted) ? undefined : handleToggleComplete}
      >
        <Checkbox
          checked={isCompleted}
          disabled={isPending || isCompleted}
          className={isCompleted
            ? "border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white disabled:opacity-100"
            : "border-[#87838F]"
          }
        />
        <span
          className={`text-[11px] leading-[18px] font-medium ${
            isCompleted ? "text-green-700" : "text-[#87838F]"
          }`}
          style={{
            fontFamily: "var(--font-abc-diatype), sans-serif",
            fontWeight: 500,
          }}
        >
          {isCompleted ? "Completed" : "Mark as complete"}
        </span>
      </div>

      {/* Start Button */}
      <Button
        disabled={isCompleted || isPending}
        className={`w-full h-10 rounded-[10px] text-[15px] leading-[18px] font-bold ${
          isCompleted
            ? "bg-[#DCDBDE] text-white/60 hover:bg-[#DCDBDE]"
            : "bg-[#9056F5] text-white hover:bg-[#7c4ae8]"
        }`}
        style={{ fontFamily: "var(--font-abc-diatype), sans-serif" }}
      >
        {isCompleted ? "Done" : "Start"}
      </Button>
    </div>
  );
}
