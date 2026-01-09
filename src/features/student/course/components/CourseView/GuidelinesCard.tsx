"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface GuidelinesCardProps {
  chapterOnlineEstimatedTime?: number | null;
  chapterInClassEstimatedTime?: number | null;
  activityDocumentId: string;
  chapterDocumentId: string;
  chapterSendosDescription?: string | null;
  chapterTotalSendos?: number;
}

export function GuidelinesCard({ chapterOnlineEstimatedTime, chapterInClassEstimatedTime, activityDocumentId, chapterDocumentId, chapterSendosDescription, chapterTotalSendos }: GuidelinesCardProps) {
  const router = useRouter();

  const handleStart = () => {
    router.push(`/student/chapter/${chapterDocumentId}/activity/${activityDocumentId}`);
  };

  return (
    <div className="bg-white rounded-[20px] p-6 shadow-sm mb-6">
      {/* Estimated time section */}
      <div className="mt-6">
        <h3 className="font-baloo-2 text-[22px] font-bold text-[#0E0420] mb-4">
          Estimated time
        </h3>
        <div className="flex items-center gap-4 mb-3">
          <span className="font-baloo-2 text-[16px] font-normal text-[#474250] min-w-[160px]">
            Online Mission
          </span>
          <span className="font-baloo-2 text-[16px] font-medium text-[#87838F] bg-[#F3F3F3] rounded-full px-4 py-1">
            {chapterOnlineEstimatedTime || 15} min
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-baloo-2 text-[16px] font-normal text-[#474250] min-w-[160px]">
            In-Class Activities
          </span>
          <span className="font-baloo-2 text-[16px] font-medium text-[#87838F] bg-[#F3F3F3] rounded-full px-4 py-1">
            {chapterInClassEstimatedTime || 40} min
          </span>
        </div>
      </div>

      {/* Earn Sendos section */}
      <div className="mt-6 bg-[#F3ECFF] rounded-[20px] p-6 flex items-center justify-between">
        <div className="flex-1">
          {chapterSendosDescription && (
            <>
              <div 
                className="font-baloo-2 text-[16px] font-normal text-[#474250] [&>h1]:font-baloo-2 [&>h1]:text-[22px] [&>h1]:font-bold [&>h1]:text-[#0E0420] [&>h1]:mb-2 [&>h2]:font-baloo-2 [&>h2]:text-[20px] [&>h2]:font-bold [&>h2]:text-[#0E0420] [&>h2]:mb-2 [&>h3]:font-baloo-2 [&>h3]:text-[18px] [&>h3]:font-bold [&>h3]:text-[#0E0420] [&>h3]:mb-2 [&>p]:font-baloo-2 [&>p]:text-[16px] [&>p]:font-normal [&>p]:text-[#474250] [&>p]:mb-1 [&>strong]:font-bold"
                dangerouslySetInnerHTML={{ __html: chapterSendosDescription }}
              />
              <p className="font-baloo-2 text-[16px] font-normal text-[#474250] mt-1">
                {chapterTotalSendos && chapterTotalSendos > 0
                  ? `You can Earn ${chapterTotalSendos} sendos!`
                  : "and earn as many Sendos as you can!"}
              </p>
            </>
          )}
        </div>
        <Image
          src="/dollar_coin.svg"
          alt="Sendos coin"
          width={60}
          height={60}
          className="shrink-0"
        />
      </div>

      {/* Start button */}
      <Button
        onClick={handleStart}
        className="w-full h-[60px] rounded-[10px] bg-[#9056F5] hover:bg-[#7d49d9] text-white font-baloo-2 text-[22px] font-bold mt-6"
      >
        Start!
      </Button>
    </div>
  );
}

