"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface MySendosProps {
  sendosAmount: number;
  showTitle: boolean;
  onClick?: () => void;
}

export const MySendos = ({ sendosAmount, onClick, showTitle }: MySendosProps) => {
  const router = useRouter();

  const handleMySendosClick = () => {
    router.push("/student/sendos");
  };

  return (
    <div
      className={`bg-[#FFF4E3] rounded-xl-plus p-4 flex items-center justify-between ${showTitle ? "cursor-pointer" : ""} transition-opacity hover:opacity-90`}
      onClick={onClick ? onClick : handleMySendosClick}
    >
      {showTitle && (
        <span className="font-baloo text-[20px] font-normal text-foreground">
          My sendos
        </span>
      )}

      <div className="flex items-center gap-2">
        <Image
          src="/sendos_coin.svg"
          alt="Sendos coin"
          width={24}
          height={24}
          className="w-6 h-6"
        />
        <span className="font-baloo text-[20px] font-normal text-foreground">
          {sendosAmount}
        </span>
        {showTitle && (
          <span className="font-baloo text-[20px] font-normal text-foreground">
            &gt;
          </span>
        )}
      </div>
    </div>
  );
};

