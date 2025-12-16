"use client";

import Image from "next/image";

interface StudentCardProps {
  id: string;
  name: string;
  avatar?: string;
  status: "Complete" | "In Progress";
  chapterName: string;
  activityName: string;
  rankingPosition: number;
  sendos: number;
  progress?: number; // Progress percentage (0-100)
}

export function StudentCard({
  name,
  avatar,
  status,
  chapterName,
  activityName,
  rankingPosition,
  sendos,
  progress = 50,
}: StudentCardProps) {
  return (
    <div className="bg-white rounded-[20px] shadow-sm flex flex-col items-center min-w-[220px] max-w-[290px] overflow-hidden">
      {/* Profile Avatar */}
      <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#9056F5] to-[#7c4ae8] flex items-center justify-center shrink-0 overflow-hidden mb-3 border-2 border-gray-100 mt-5">
        <Image
          src={avatar || "/teacher_dash_no_profile_pic.svg"}
          alt={name}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Student Name */}
      <h4
        className="text-[16px] font-bold text-[#0E0420] text-center mb-4 px-5"
        style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
      >
        {name}
      </h4>

      {/* Divider */}
      <div className="w-full h-px bg-gray-200 mb-4" />

      {/* Progress Section */}
      <div className="w-full mb-4 px-5">
        <div className="flex items-start gap-2.5">
          {/* Book Icon */}
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Status and Activity Info */}
          <div className="flex-1 min-w-0">
            <p
              className="text-[11px] font-bold mb-1"
              style={{
                fontFamily: "ABC Diatype Unlicensed Trial, sans-serif",
                color: "#87838F",
              }}
            >
              {status}
            </p>
            <p
              className="text-[13px] font-bold text-[#474250] mb-2 leading-tight line-clamp-2"
              style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
              title={`${chapterName} > ${activityName}`}
            >
              {chapterName} {">"} {activityName}
            </p>
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#9056F5] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ranking & Sendos Section */}
      <div className="w-full px-5 pb-5">
        <div className="flex items-start gap-2.5">
          {/* Lightning Icon */}
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 1L2 11H10L9 19L18 9H10L11 1Z"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Ranking and Sendos Info */}
          <div className="flex-1 min-w-0">
            <p
              className="text-[11px] font-bold text-[#87838F] mb-1"
              style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
            >
              {rankingPosition}{rankingPosition === 1 ? 'st' : rankingPosition === 2 ? 'nd' : rankingPosition === 3 ? 'rd' : 'th'}
            </p>
            <p
              className="text-[13px] font-bold text-[#474250]"
              style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
            >
              {sendos} Sendos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

