"use client";

import { MySendos } from "@/components/MySendos";
import { ActivityCard } from "@/features/student/dashboard/components/ActivityCard";
import { FirstActivityModal } from "@/features/student/dashboard/components/FirstActivityModal";
import { NextActivityCard } from "@/features/student/dashboard/components/NextActivityCard";
import { DashboardData } from "@/features/student/dashboard/types";
import { getStrapiMedia } from "@/lib/media";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DashboardViewProps {
  sendosAmount: number;
  dashboardData: DashboardData;
}
export default function DashboardView({
  sendosAmount,
  dashboardData,
}: DashboardViewProps) {
  const router = useRouter();
  const [isFirstActivityModalOpen, setIsFirstActivityModalOpen] =
    useState(false);

  const currentChapterId = dashboardData.currentChapter?.documentId;

  useEffect(() => {
    if (!dashboardData.isFirstActivityOfChapter) return;
    if (!currentChapterId) return;
    if (typeof window === "undefined") return;

    const storageKey = `dashboard:firstActivityModalSeen:${currentChapterId}`;
    const hasSeen = window.sessionStorage.getItem(storageKey) === "1";
    if (!hasSeen && !isFirstActivityModalOpen) {
      setTimeout(() => setIsFirstActivityModalOpen(true), 0);
    }
  }, [dashboardData.isFirstActivityOfChapter, currentChapterId, isFirstActivityModalOpen]);

  const handleFirstActivityModalOpenChange = (open: boolean) => {
    setIsFirstActivityModalOpen(open);
    if (!open && currentChapterId && typeof window !== "undefined") {
      const storageKey = `dashboard:firstActivityModalSeen:${currentChapterId}`;
      window.sessionStorage.setItem(storageKey, "1");
    }
  };

  const handleStartActivity = () => {
    if (
      dashboardData.currentChapter?.documentId &&
      dashboardData.nextActivity?.documentId
    ) {
      const chapterId = dashboardData.currentChapter.documentId;
      const activityId = dashboardData.nextActivity.documentId;
      router.push(`/student/chapter/${chapterId}/activity/${activityId}`);
    }
  };

  function renderNextActivity() {
    const { isChapterComplete, nextActivity } = dashboardData;
    if (!isChapterComplete && nextActivity) {
      return (
        <ActivityCard
          type={dashboardData.nextActivity?.type || "standard"}
          standardActivityType={dashboardData.nextActivity?.standardActivityType}
          teamActivityType={dashboardData.nextActivity?.teamActivityType}
          isChapterCompleted={dashboardData.isChapterComplete}
          title={dashboardData.nextActivity?.title || ""}
          sendosAmount={dashboardData.nextActivity?.sendosReward || 0}
          thumbnailUrl={getStrapiMedia(dashboardData.nextActivity?.thumbnail?.url) || "/video_card_thumb.svg"}
          iconUrl="/video_card_logo.svg"
          onStart={handleStartActivity}
        />
      );
    }
  }

  function renderNextActivityAfter() {
    const { isChapterComplete, nextActivityAfter } = dashboardData;
    if (!isChapterComplete && nextActivityAfter) {
      return (
        <NextActivityCard
          title={nextActivityAfter.title}
          type={
            nextActivityAfter.standardActivityType || "quiz"
          }
          sendosAmount={nextActivityAfter.sendosReward || 0}
          iconUrl="/quiz_todo_logo.svg"
        />
      );
    }
  }

  function renderIsChapterComplete() {
    const { isChapterComplete } = dashboardData;
    if (isChapterComplete) {
      const badgeUrl =
        dashboardData.currentChapter?.badge?.logo?.url || null;
      const totalChapterSendos =
        dashboardData.currentChapter?.totalSendos;

      return (
        <ActivityCard
          type={dashboardData.nextActivity?.type || "standard"}
          standardActivityType={dashboardData.nextActivity?.standardActivityType}
          teamActivityType={dashboardData.nextActivity?.teamActivityType}
          isChapterCompleted={dashboardData.isChapterComplete}
          title="Chapter complete"
          sendosAmount={0}
          thumbnailUrl="/video_card_thumb.svg"
          iconUrl="/video_card_logo.svg"
          badgeUrl={badgeUrl}
          totalChapterSendos={totalChapterSendos}
        />
      );
    }
  }

  function renderLockedNextChapterDetails() {
    const { isChapterComplete, isNextChapterLocked, nextChapterDetails } =
      dashboardData;

    if (
      isChapterComplete &&
      isNextChapterLocked &&
      nextChapterDetails
    ) {
      const tooltipMessage = dashboardData.nextChapterLockMessage ?? undefined;

      return (
        <>
          <h2 className="font-baloo text-[26px] font-normal text-foreground">
            Next Chapter
          </h2>
          <NextActivityCard
            title={nextChapterDetails.name}
            type="chapter"
            iconUrl="/lock.svg"
            chapterNumber={nextChapterDetails.chapterNumber}
            tooltipMessage={tooltipMessage}
          />
        </>
      );
    }
  }

  return (
    <div className="bg-white p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <MySendos sendosAmount={sendosAmount} showTitle={true}/>

        <div className="space-y-4">
          <h2 className="font-baloo text-[26px] font-normal text-foreground">
            {`Chapter ${dashboardData.currentChapter?.chapterNumber}: ` +
              dashboardData.currentChapter?.name}
          </h2>

          {renderIsChapterComplete()}

          {renderLockedNextChapterDetails()}

          {renderNextActivity()}

          {renderNextActivityAfter()}
        </div>
      </div>

      <FirstActivityModal
        open={isFirstActivityModalOpen}
        onOpenChange={handleFirstActivityModalOpenChange}
        dashboardData={dashboardData}
        onStartActivity={handleStartActivity}
      />
    </div>
  );
}
