"use client";

import Image from "next/image";

interface SendoTransactionProps {
  title: string;
  description: string;
  sendosAmount: number;
  iconUrl: string;
}

export const SendoTransaction = ({
  title,
  description,
  sendosAmount,
  iconUrl,
}: SendoTransactionProps) => {
  const isSpent = sendosAmount < 0;
  const sign = isSpent ? "-" : "+";
  const displayAmount = Math.abs(sendosAmount);

  return (
  <div
      className="bg-gray-100 rounded-xl-plus p-4 flex items-center gap-3 transition-opacity hover:opacity-90"
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
        <h3 className="font-baloo text-[18px] font-normal text-[#0E0420]">
          {title}
        </h3>
        <p className="font-baloo-2 text-[14px] font-medium text-gray-400">
          {description}
        </p>
      </div>

      <span
        className={`font-baloo text-[22px] font-medium ${
          isSpent ? "text-red-600" : "text-[#0E0420]"
        }`}
      >
        {sign}
        {displayAmount}
      </span>
    </div>
  );
};
