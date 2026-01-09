"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

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

  // Compact version for header
  if (!showTitle) {
    return (
      <div
        className="bg-[#FFF4E3] rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer transition-all hover:bg-[#FFECC9] shadow-sm"
        onClick={onClick ? onClick : handleMySendosClick}
      >
        <span className="font-baloo text-[16px] font-medium text-[#0E0420]">
          My sendos
        </span>
        <Image
          src="/dollar_coin.svg"
          alt="Sendos coin"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        <span className="font-baloo text-[18px] font-bold text-[#0E0420]">
          {sendosAmount}
        </span>
        <ChevronRight className="w-4 h-4 text-[#0E0420]" />
      </div>
    );
  }

  // Full version for dashboard
  return (
    <div
      className="bg-[#FFF4E3] rounded-xl-plus p-4 flex items-center justify-between cursor-pointer transition-opacity hover:opacity-90"
      onClick={onClick ? onClick : handleMySendosClick}
    >
      <span className="font-baloo text-[20px] font-normal text-foreground">
        My sendos
      </span>

      <div className="flex items-center gap-2">
        <Image
          src="/dollar_coin.svg"
          alt="Sendos coin"
          width={24}
          height={24}
          className="w-6 h-6"
        />
        <span className="font-baloo text-[20px] font-normal text-foreground">
          {sendosAmount}
        </span>
        <span className="font-baloo text-[20px] font-normal text-foreground">
          &gt;
        </span>
      </div>
    </div>
  );
};

