import { getStrapiMedia } from "@/lib/media";
import Image from "next/image";

interface ChapterCompletedProps {
  badgeUrl: string;
  totalChapterSendos: number;
}

export default function ChapterCompleted({
  badgeUrl,
  totalChapterSendos,
}: ChapterCompletedProps) {
  return (
    <div className="bg-[#9056F5] rounded-[20px] p-6 flex flex-col items-center justify-center gap-4 text-center">
      <h3 className="font-baloo text-[28px] font-normal text-white">
        Congratulations!
      </h3>

      {badgeUrl ? (
        <div className="relative h-28 w-28">
          <Image
            src={getStrapiMedia(badgeUrl) || ""}
            alt="Chapter badge"
            fill
            className="object-contain"
            sizes="112px"
            unoptimized
          />
        </div>
      ) : null}

      {typeof totalChapterSendos === "number" ? (
        <div className="mt-2 flex items-center gap-2 rounded-[10px] bg-[#0E0420] px-4 py-2">
          <Image
            src="/sendos_coin.svg"
            alt="Sendos"
            width={20}
            height={20}
            className="h-5 w-5"
          />
          <span className="font-baloo text-[20px] font-normal text-white">
            {totalChapterSendos}
          </span>
        </div>
      ) : null}
    </div>
  )
}
