"use client";

import { Asset } from "@/features/student/assets/queries";
import { AssetCard } from "../AssetCard";

interface AssetsViewProps {
  totalAssets: number;
  totalValue: number;
  assets: Asset[];
}

export default function AssetsView({ totalAssets, totalValue, assets }: AssetsViewProps) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="flex gap-4">
        <div className="flex-1 bg-white rounded-xl-plus p-4 flex items-center justify-between">
          <span className="font-baloo text-[18px] font-normal text-[#0E0420]">
            Total <span className="text-[#FCD34D]">Assets</span>
          </span>
          <span className="font-baloo text-[22px] font-normal text-[#0E0420]">
            {totalAssets}
          </span>
        </div>
        <div className="flex-1 bg-white rounded-xl-plus p-4 flex items-center justify-between">
          <span className="font-baloo text-[18px] font-normal text-[#0E0420]">
            Total Value
          </span>
          <span className="font-baloo text-[22px] font-normal text-[#0E0420]">
            <span className="text-[#FCD34D]">$ </span>
            {totalValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Asset Cards */}
      <div className="space-y-4">
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            title={asset.title}
            currentValue={asset.currentValue}
            purchasePrice={asset.purchasePrice}
            dateBought={asset.dateBought}
            icon={asset.assetType.icon}
          />
        ))}
        {assets.length === 0 && (
          <p className="text-center text-gray-500">No assets yet.</p>
        )}
      </div>
    </div>
  );
}



