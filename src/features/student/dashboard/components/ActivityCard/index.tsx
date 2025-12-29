"use client";

import ChapterCompleted from "@/features/student/dashboard/components/ChapterCompleted";
import Image from "next/image";

interface ActivityCardProps {
  type: "standard" | "team" | "homework";
  standardActivityType?: "video" | "quiz" | "reading";
  teamActivityType?: "join_team";
  title: string;
  sendosAmount: number;
  thumbnailUrl: string;
  iconUrl?: string;
  onStart?: () => void;
  isChapterCompleted: boolean;
  badgeUrl?: string | null;
  totalChapterSendos?: number;
}

export const ActivityCard = ({
  type,
  standardActivityType,
  teamActivityType,
  title,
  sendosAmount,
  thumbnailUrl,
  iconUrl,
  onStart,
  isChapterCompleted,
  badgeUrl,
  totalChapterSendos,
}: ActivityCardProps) => {
  const getTypeLabel = () => {
    if (type === "standard") {
      if (standardActivityType === "video") return "Video";
      if (standardActivityType === "quiz") return "Quiz";
      if (standardActivityType === "reading") return "Reading";
    }
    if (type === "team") return "Mission"
    if (type === "homework") return "Homework";
    return "";
  };

  if (isChapterCompleted) return <ChapterCompleted badgeUrl={badgeUrl || ""} totalChapterSendos={totalChapterSendos || 0} />

  return (
    <div className="bg-[#9056F5] rounded-[20px] p-4 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        {iconUrl && (
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-white/20">
            <Image
              src={iconUrl}
              alt={title}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-baloo text-[18px] font-normal text-white">
            {getTypeLabel()}
          </h3>
          <p className="font-baloo-2 text-[14px] font-medium text-white">
            {title}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Image
            src="/dollar_coin.svg"
            alt="Sendos"
            width={16}
            height={16}
            className="w-4 h-4"
          />
          <span className="font-baloo text-[14px] font-normal text-white">
            {sendosAmount}
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-video rounded-[10px] overflow-hidden">
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <button
        onClick={onStart}
        className="bg-white rounded-[10px] py-2 px-6 font-baloo text-[22px] font-normal text-[#9056F5] transition-opacity hover:opacity-90 cursor-pointer"
      >
        Start!
      </button>
    </div>
  );
};

