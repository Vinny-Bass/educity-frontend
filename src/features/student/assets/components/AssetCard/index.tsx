"use client";

import { format } from "date-fns";
import { AssetIcon } from "./AssetIcon";

interface AssetCardProps {
  title: string;
  currentValue: number;
  purchasePrice?: number;
  dateBought?: string;
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

  const showPurchaseDetails = purchasePrice !== undefined && dateBought !== undefined;

  return (
    <div className="bg-white rounded-[20px] border border-gray-200 p-4 flex flex-col gap-4 transition-opacity hover:opacity-90" style={{ borderRadius: '20px' }}>
      {/* Purple inner card with icon, title, and value */}
      <div className="bg-[#F3ECFF] rounded-[20px] border border-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full shrink-0 bg-white flex items-center justify-center">
            <AssetIcon iconName={icon} className="w-6 h-6 text-[#9056F5]" />
          </div>
          <span className="font-baloo text-[18px] font-normal text-[#0E0420]">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <img 
            src="/dollar_coin.svg" 
            alt="Sendos coin" 
            className="w-5 h-5 shrink-0"
          />
          <span className="font-baloo text-[18px] font-normal text-[#9056F5]">
            {currentValue.toLocaleString()}
          </span>
        </div>
      </div>
      
      {/* Purchase details in white section below */}
      {showPurchaseDetails && (
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col gap-1">
            <span className="font-baloo-2 text-[14px] font-medium text-[#474250]">
              Purchase Price
            </span>
            <span className="font-baloo-2 text-[14px] font-medium text-[#474250]">
              Date Bought
            </span>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <div className="flex items-center gap-1">
              <img 
                src="/dollar_coin.svg" 
                alt="Sendos coin" 
                className="w-4 h-4 shrink-0"
              />
              <span className="font-baloo-2 text-[14px] font-medium text-[#474250]">
                {purchasePrice.toLocaleString()}
              </span>
            </div>
            <span className="font-baloo-2 text-[14px] font-medium text-[#474250]">
              {formatDate(dateBought!)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};





