"use client";

interface ChapterCompletionCardProps {
  chapterName: string;
  completedStudents: number;
  totalStudents: number;
}

export function ChapterCompletionCard({
  chapterName,
  completedStudents,
  totalStudents,
}: ChapterCompletionCardProps) {
  const percentage =
    totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;

  // SVG circle parameters
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm flex flex-col items-center">
      {/* Title */}
      <h3
        className="text-[15px] font-bold text-[#9056F5] mb-4 self-start"
        style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
      >
        {chapterName}
      </h3>

      {/* Circular Progress */}
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="-rotate-90">
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F3F3F3"
            strokeWidth={strokeWidth}
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#9056F5"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-[28px] font-bold text-[#9056F5]"
            style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
          >
            {Math.round(percentage)}%
          </div>
          <div
            className="text-[11px] font-normal text-gray-600"
            style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
          >
            Completed
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 text-center">
        <p
          className="text-[12px] text-gray-600"
          style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
        >
          <span className="font-bold text-[#9056F5]">{completedStudents}</span>
          {" of "}
          <span className="font-bold">{totalStudents}</span>
          {" students"}
        </p>
      </div>
    </div>
  );
}

