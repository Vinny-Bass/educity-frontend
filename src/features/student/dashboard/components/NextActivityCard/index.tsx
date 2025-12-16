"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

interface NextActivityCardProps {
  title: string;
  type: "video" | "quiz" | "chapter";
  sendosAmount?: number;
  iconUrl: string;
  chapterNumber?: number;
  tooltipMessage?: string;
}

export const NextActivityCard = ({
  title,
  type,
  sendosAmount,
  iconUrl,
  chapterNumber,
  tooltipMessage,
}: NextActivityCardProps) => {
  return (
<Tooltip>
  <TooltipTrigger asChild>
  <div
      className="bg-gray-100 rounded-xl-plus p-4 flex items-center gap-3 cursor-not-allowed transition-opacity hover:opacity-90"
    >
      <div className="w-10 h-10 rounded-full shrink-0 bg-[#DCDBDE] flex items-center justify-center">
        <Image
          src={iconUrl}
          alt={title}
          width={40}
          height={40}
          className="w-6 h-6 object-contain"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-baloo text-[18px] font-normal text-gray-600">
          {type === "video" ? "Video" : type === "quiz" ? "Quiz" : `Chapter ${chapterNumber}`}
        </h3>
        <p className="font-baloo-2 text-[14px] font-medium text-gray-400">
          {title}
        </p>
      </div>

      {sendosAmount !== undefined && (
        <div className="bg-[#FFF4E3] rounded-[10px] px-3 py-1 flex items-center gap-1 shrink-0">
          <Image
            src="/sendos_coin.svg"
            alt="Sendos"
            width={16}
            height={16}
            className="w-4 h-4"
          />
          <span className="font-baloo text-[14px] font-normal text-gray-600">
            {sendosAmount}
          </span>
        </div>
      )}
    </div>
  </TooltipTrigger>
  <TooltipContent>
    {tooltipMessage}
  </TooltipContent>
</Tooltip>

  );
};
