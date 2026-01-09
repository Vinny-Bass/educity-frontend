"use client";

import { Button } from "@/components/ui/button";
import type { ActivityStub, PlotOption } from "@/features/student/activity/types";
import { useActivityStore } from "@/store/activity.store";
import Image from "next/image";
import { useState } from "react";

interface PlotAuctionActivityProps {
  activity: ActivityStub;
}

export function PlotAuctionActivity({ activity }: PlotAuctionActivityProps) {
  const [selectedPlot, setSelectedPlot] = useState<PlotOption | null>(null);
  const setIsCurrentActivityCompleted = useActivityStore(
    (state) => state.setIsCurrentActivityCompleted
  );
  const setCompletionPayload = useActivityStore(
    (state) => state.setCompletionPayload
  );

  const plots = activity.plots || [];
  
  // Debug logging
  console.log('PlotAuctionActivity - activity:', activity);
  console.log('PlotAuctionActivity - plots:', plots);

  const handlePlotSelect = (plot: PlotOption) => {
    setSelectedPlot(plot);
    // Mark activity as ready to complete
    setIsCurrentActivityCompleted(true);
    // Store the selected plot data for completion
    setCompletionPayload({
      type: "plot_auction",
      data: {
        plotId: plot.documentId,
        bidAmount: plot.startingBid,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] py-12 px-4 md:px-8">
      <div className="max-w-[900px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Left side - Title and Description */}
          <div className="md:col-span-2">
            <h1 className="font-baloo text-[34px] font-bold text-[#0E0420] mb-6">
              {activity.title}
            </h1>
            {activity.description && (
              <div
                className="text-[#474250]
                  [&>p]:font-inter [&>p]:text-[16px] [&>p]:text-[#474250] [&>p]:mb-3 [&>p]:leading-relaxed
                  [&>h1]:font-baloo [&>h1]:text-[22px] [&>h1]:font-bold [&>h1]:mb-3 [&>h1]:text-[#0E0420]
                  [&>h2]:font-baloo [&>h2]:text-[20px] [&>h2]:font-bold [&>h2]:mb-2 [&>h2]:text-[#0E0420]
                  [&>h3]:font-baloo [&>h3]:text-[18px] [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:text-[#0E0420]
                  [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:mb-4 [&>ul]:pl-6
                  [&>ul>li]:font-inter [&>ul>li]:text-[16px] [&>ul>li]:text-[#474250] [&>ul>li]:leading-relaxed
                  [&>ol]:list-decimal [&>ol]:space-y-2 [&>ol]:mb-4 [&>ol]:pl-6
                  [&>ol>li]:font-inter [&>ol>li]:text-[16px] [&>ol>li]:text-[#474250] [&>ol>li]:leading-relaxed
                  [&>strong]:font-bold
                  [&>em]:italic
                  [&>a]:text-[#9056F5] [&>a]:underline hover:[&>a]:text-[#7d49d9]"
                dangerouslySetInnerHTML={{ __html: activity.description }}
              />
            )}
          </div>

          {/* Right side - Card */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-[24px] p-8 shadow-md">
              {/* Cat Image positioned above header */}
              <div className="flex justify-start mb-0 pl-2">
                <Image
                  src="/cat_head.svg"
                  alt="Character"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>

              {/* Purple Header Section */}
              <div className="bg-[#E8DDFF] rounded-[20px] px-6 py-6 mb-6">
                {activity.guideline && (
                  <div 
                    className="font-baloo text-[24px] font-bold text-[#0E0420] text-left leading-snug
                      [&>p]:font-baloo [&>p]:text-[24px] [&>p]:font-bold [&>p]:text-[#0E0420] [&>p]:mb-0 [&>p]:leading-snug
                      [&>h1]:font-baloo [&>h1]:text-[26px] [&>h1]:font-bold [&>h1]:text-[#0E0420] [&>h1]:mb-2
                      [&>h2]:font-baloo [&>h2]:text-[24px] [&>h2]:font-bold [&>h2]:text-[#0E0420] [&>h2]:mb-2
                      [&>h3]:font-baloo [&>h3]:text-[22px] [&>h3]:font-bold [&>h3]:text-[#0E0420] [&>h3]:mb-2
                      [&>strong]:font-bold"
                    dangerouslySetInnerHTML={{ __html: activity.guideline }}
                  />
                )}
              </div>

              {/* Plot Options */}
              <div className="space-y-4 mb-6">
                {plots.length === 0 ? (
                  <div className="bg-[#F5F5F5] rounded-[20px] p-6 text-center">
                    <p className="font-inter text-[16px] text-[#474250]">
                      No plots available for this activity. Please contact your teacher.
                    </p>
                  </div>
                ) : (
                  plots.map((plot) => (
                  <div
                    key={plot.documentId}
                    onClick={() => handlePlotSelect(plot)}
                    className={`bg-[#F5F5F5] rounded-[20px] p-6 cursor-pointer transition-all hover:shadow-md ${
                      selectedPlot?.documentId === plot.documentId
                        ? "ring-2 ring-[#9056F5] bg-[#F3ECFF]"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Plot Code */}
                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-[10px] flex items-center justify-center">
                        <span className="font-baloo text-[18px] font-bold text-[#0E0420]">
                          {plot.plotCode}
                        </span>
                      </div>

                      {/* Plot Info */}
                      <div className="flex-1">
                        <h3 className="font-baloo text-[20px] font-bold text-[#0E0420] mb-2">
                          {plot.title}
                        </h3>
                        <p className="font-inter text-[14px] text-[#474250] leading-relaxed mb-3">
                          {plot.description}
                        </p>

                        {/* Bid Amount Badge */}
                        <div className="inline-flex items-center gap-2 bg-[#FFF4E3] rounded-full px-4 py-2">
                          <Image
                            src="/sendos_coin.svg"
                            alt="Sendos"
                            width={20}
                            height={20}
                          />
                          <span className="font-baloo text-[16px] font-bold text-[#0E0420]">
                            {plot.startingBid}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>

              {/* Info text */}
              {selectedPlot && (
                <div className="bg-[#E8DDFF] rounded-[12px] px-4 py-3 mb-6">
                  <p className="font-inter text-[14px] text-[#0E0420] text-center">
                    You selected <strong>{selectedPlot.plotCode}</strong>. Click Next to proceed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

