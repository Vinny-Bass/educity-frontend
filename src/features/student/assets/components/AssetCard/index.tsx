"use client";

import { format } from "date-fns";
import { AssetIcon } from "./AssetIcon";

interface AssetCardProps {
  title: string;
  currentValue: number;
  purchasePrice: number;
  dateBought: string;
  icon: string;
}

export const AssetCard = ({
  title,
  currentValue,
  purchasePrice,
  dateBought,
  icon,
}: AssetCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-[#F3ECFF] rounded-xl-plus p-4 flex flex-col gap-3 transition-opacity hover:opacity-90">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full shrink-0 bg-white flex items-center justify-center">
            <AssetIcon iconName={icon} className="w-6 h-6 text-[#9056F5]" />
          </div>
          <span className="font-baloo text-[18px] font-normal text-[#0E0420]">
            {title}
          </span>
        </div>
        <span className="font-baloo text-[22px] font-normal text-[#0E0420]">
          <span className="text-[#FCD34D]">$ </span>
          {currentValue.toLocaleString()}
        </span>
      </div>
      <div className="flex flex-col gap-1 pl-[52px]">
        <div className="flex gap-2">
          <span className="font-baloo-2 text-[14px] font-medium text-[#474250]">
            Purchase Price:
          </span>
          <span className="font-baloo-2 text-[14px] font-medium text-[#474250]">
            <span className="text-[#FCD34D]">$ </span>
            {purchasePrice.toLocaleString()}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-baloo-2 text-[14px] font-medium text-[#474250]">
            Date Bought:
          </span>
          <span className="font-baloo-2 text-[14px] font-medium text-[#474250]">
            {formatDate(dateBought)}
          </span>
        </div>
      </div>
    </div>
  );
};



