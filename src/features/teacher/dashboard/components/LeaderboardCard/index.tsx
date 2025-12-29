"use client";

import Image from "next/image";
import Link from "next/link";

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar?: string;
  sendos: number;
}

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  maxEntries?: number;
}

export function LeaderboardCard({
  entries,
  maxEntries = 5,
}: LeaderboardCardProps) {
  const displayedEntries = entries.slice(0, maxEntries);

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-[15px] font-bold text-[#9056F5]"
          style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
        >
          Leaderboard
        </h3>
        <Link
          href="/teacher/leaderboard"
          className="text-[#9056F5] hover:text-[#7c4ae8] transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2.5">
        {displayedEntries.map((entry) => {
          const isTopThree = entry.rank <= 3;

          return (
            <div
              key={entry.id}
              className="flex items-center gap-3"
            >
              {/* Rank Number */}
              <div
                className={`text-[15px] font-black w-5 shrink-0 ${isTopThree ? 'text-[#9056F5]' : 'text-[#474250]'}`}
                style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif", fontWeight: 900 }}
              >
                {entry.rank}
              </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#9056F5] to-[#7c4ae8] flex items-center justify-center shrink-0 overflow-hidden">
                <Image
                  src={entry.avatar ? entry.avatar : "/teacher_dash_no_profile_pic.svg"}
                  alt={entry.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
            </div>

            {/* Student Name */}
            <div
              className="flex-1 text-[11px] font-bold text-[#0E0420] truncate"
              style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
            >
              {entry.name}
            </div>

            {/* Sendos */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Image
                src="/dollar_coin.svg"
                alt="Sendos"
                width={14}
                height={14}
              />
              <span
                className="text-[11px] font-black text-[#474250]"
                style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif", fontWeight: 900 }}
              >
                {entry.sendos}
              </span>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

