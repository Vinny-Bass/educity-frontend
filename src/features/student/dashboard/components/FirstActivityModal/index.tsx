"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { DashboardData } from "@/features/student/dashboard/types";
import Image from "next/image";

interface FirstActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboardData: DashboardData;
  onStartActivity: () => void;
}

export function FirstActivityModal({
  open,
  onOpenChange,
  dashboardData,
  onStartActivity,
}: FirstActivityModalProps) {
  const chapterNumber = dashboardData.currentChapter?.chapterNumber;
  const activityTitle = dashboardData.nextActivity?.title || "";
  const activityDescription = dashboardData.nextActivity?.description || "";

  const handleStartMission = () => {
    onOpenChange(false);
    onStartActivity();
  };

  const handleLater = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[20px] p-0" showCloseButton={false}>
        <VisuallyHidden>
          <DialogTitle>This week&apos;s Mission</DialogTitle>
        </VisuallyHidden>
        <div className="flex flex-col items-center px-6 pt-6 pb-6 relative">
          {/* Cat icon in circle */}
          <div className="w-[110px] h-[110px] rounded-full bg-[#F3ECFF] flex items-center justify-center mb-4">
            <Image
              src="/cat.svg"
              alt="Cat"
              width={96}
              height={82}
              className="w-20 h-16 object-contain"
            />
          </div>

          {/* Title */}
          <h2 className="font-baloo-2 text-[20px] font-semibold text-[#9056F5] text-center mb-6">
            This week&apos;s Mission
          </h2>

          {/* Info box with star and chapter/activity */}
          <div className="w-full bg-[#F3F3F3] rounded-[20px] p-6 relative mb-6">
            {/* Star icon in white circle */}
            <div className="w-[46px] h-[46px] rounded-[23px] bg-white flex items-center justify-center absolute top-6 left-6">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="#9056F5"
                />
              </svg>
            </div>

            {/* Mission number and title */}
            <div className="ml-[90px] mb-4">
              <p className="font-baloo-2 text-[18px] font-medium text-[#87838F] leading-[20px] mb-2">
                {chapterNumber ? `Mission ${chapterNumber}` : "Mission"}
              </p>
              <p className="font-baloo text-[22px] font-normal text-[#0E0420] leading-[27px]">
                {activityTitle}
              </p>
            </div>

            {/* Divider line */}
            <div className="w-full h-px bg-[#DCDBDE] mb-4" />

            {/* Description */}
            {activityDescription && (
              <p className="font-baloo-2 text-[16px] font-medium text-[#87838F] leading-normal">
                {activityDescription}
              </p>
            )}
          </div>

          {/* Start Mission button */}
          <Button
            onClick={handleStartMission}
            className="w-full h-[54px] rounded-[10px] bg-[#9056F5] text-white font-baloo text-[22px] font-normal mb-4"
          >
            Start Mission
          </Button>

          {/* Later link */}
          <button
            onClick={handleLater}
            className="text-[#474250] font-baloo text-[22px] font-normal underline cursor-pointer"
          >
            Later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
