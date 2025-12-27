"use client";

import { Asset } from "@/features/student/assets/queries";
import { Card } from "@/components/ui/card";
import { AssetCard } from "../AssetCard";

interface AssetsViewProps {
  totalAssets: number;
  totalValue: number;
  assets: Asset[];
  sendosBalance: number;
}

export default function AssetsView({ totalAssets, totalValue, assets, sendosBalance }: AssetsViewProps) {
  // Filter out "My Sendos" from the API assets (we'll add it manually as the first card)
  const nonSendosAssets = assets.filter(
    (asset) => !asset.title.toLowerCase().includes("sendos")
  );

  // Calculate totals including sendos balance
  // Total assets count includes "My Sendos" + other assets
  const displayTotalAssets = nonSendosAssets.length + 1; // +1 for "My Sendos"
  
  // Total value should include sendos balance + other assets
  const assetsValue = nonSendosAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const displayTotalValue = sendosBalance + assetsValue;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="flex flex-col gap-4">
        <Card className="p-4 flex items-center justify-between">
          <span className="font-baloo text-[18px] font-normal text-[#0E0420]">
            Total Assets
          </span>
          <span className="font-baloo text-[22px] font-normal text-[#0E0420]">
            {displayTotalAssets}
          </span>
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <span className="font-baloo text-[18px] font-normal text-[#0E0420]">
            Total Value
          </span>
          <div className="flex items-center gap-2">
            <img 
              src="/dollar_coin.svg" 
              alt="Sendos coin" 
              className="w-5 h-5 shrink-0"
            />
            <span className="font-baloo text-[22px] font-normal text-[#0E0420]">
              {displayTotalValue.toLocaleString()}
            </span>
          </div>
        </Card>
      </div>

      {/* Asset Cards */}
      <div className="space-y-4">
        {/* My Sendos Card - Always first, no purchase details */}
        <AssetCard
          title="My Sendos"
          currentValue={sendosBalance}
          icon="currency-dollar"
        />
        
        {/* Other Assets */}
        {nonSendosAssets.map((asset) => (
          <AssetCard
            key={asset.id}
            title={asset.title}
            currentValue={asset.currentValue}
            purchasePrice={asset.purchasePrice}
            dateBought={asset.dateBought}
            icon={asset.assetType.icon}
          />
        ))}
        
        {nonSendosAssets.length === 0 && sendosBalance === 0 && (
          <p className="text-center text-gray-500">No assets yet.</p>
        )}
      </div>
    </div>
  );
}





