"use client";

import { useAuth } from "@/contexts/AuthContext";
import { CongratsModal } from "@/features/student/activity/components/CongratsModal";
import {
  completeActivity,
  getChapterActivities,
  getChapterProgress,
} from "@/features/student/activity/queries";
import { ActivityStub, ProgressStub } from "@/features/student/activity/types";
import { useActivityStore } from "@/store/activity.store";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../../../components/ui/button";

const formatActivityType = (type: string, title: string): string => {
  const fallback = title || "Step";

  switch (type) {
    case "video":
      return "Video";
    case "quiz":
      return "Quiz";
    case "reading":
      return "Article";
    default:
      return fallback;
  }
};

export function BottomBar() {
  const router = useRouter();

  const params = useParams();
  const { chapterId, activityId } = params as {
    chapterId: string;
    activityId: string;
  };

  const auth = useAuth();
  const enrollmentId = auth?.enrollmentId ?? null;

  const isCompleted = useActivityStore(
    (state) => state.isCurrentActivityCompleted
  );
  const setIsCurrentActivityCompleted = useActivityStore(
    (state) => state.setIsCurrentActivityCompleted
  );
  const completionPayload = useActivityStore((state) => state.completionPayload);
  const [activities, setActivities] = useState<ActivityStub[]>([]);
  const [progress, setProgress] = useState<ProgressStub[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCongrats, setShowCongrats] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!chapterId || !enrollmentId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [activitiesData, progressData] = await Promise.all([
          getChapterActivities(chapterId),
          getChapterProgress(enrollmentId, chapterId),
        ]);

        setActivities(activitiesData || []);
        setProgress(progressData || []);
      } catch (error) {
        console.error("Failed to fetch bottom bar data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [chapterId, enrollmentId]);

  const completedActivityIds = useMemo(
    () => new Set(progress.map((p) => p.activity.id)),
    [progress]
  );

  const highestCompletedIndex = useMemo(() => {
    if (!activities.length) {
      return -1;
    }

    return activities.reduce((maxIndex, activity, index) => {
      if (completedActivityIds.has(activity.id)) {
        return Math.max(maxIndex, index);
      }

      return maxIndex;
    }, -1);
  }, [activities, completedActivityIds]);

  useEffect(() => {
    if (!activityId) return;

    const currentActivity = activities.find(
      (activity) => activity.documentId === activityId
    );

    if (!currentActivity) return;

    if (completedActivityIds.has(currentActivity.id)) {
      setIsCurrentActivityCompleted(true);
    }
  }, [
    activities,
    activityId,
    completedActivityIds,
    setIsCurrentActivityCompleted,
  ]);

  if (!chapterId || !activityId) {
    return null;
  }

  const currentActivityIndex = activities.findIndex((a) => a.documentId === activityId);
  const isLastActivity = currentActivityIndex === activities.length - 1;
  const furthestUnlockedIndex =
    activities.length === 0
      ? -1
      : Math.min(
          activities.length - 1,
          Math.max(highestCompletedIndex + 1, currentActivityIndex)
        );

  const completionOptions = completionPayload
    ? { type: completionPayload.type, data: completionPayload.data }
    : { type: "" };

  const handleNext = async () => {
    if (!isCompleted || isLastActivity || activities.length === 0 || !enrollmentId)
      return;

    await completeActivity(activityId, enrollmentId, completionOptions);

    const currentActivity = activities[currentActivityIndex];
    if (currentActivity) {
      setProgress((prev) => {
        const alreadyRegistered = prev.some(
          (entry) => entry.activity.id === currentActivity.id
        );

        if (alreadyRegistered) {
          return prev.map((entry) =>
            entry.activity.id === currentActivity.id
              ? { ...entry, activityStatus: "completed" as const }
              : entry
          );
        }

        return [
          ...prev,
          {
            id: `local-${currentActivity.id}`,
            activityStatus: "completed" as const,
            activity: { id: currentActivity.id },
          },
        ];
      });
    }

    const nextActivity = activities[currentActivityIndex + 1];
    if (nextActivity) {
      setNextUrl(`/student/chapter/${chapterId}/activity/${nextActivity.documentId}`);
      setShowCongrats(true);
    }
  };

  const handleFinish = async () => {
    if (!enrollmentId) return;

    await completeActivity(activityId, enrollmentId, completionOptions);
    completedActivityIds.add(activityId);
    setNextUrl("/student/dashboard");
    setShowCongrats(true);
  };

  const handleContinue = () => {
    if (nextUrl) {
      router.push(nextUrl);
      // Reset state just in case, though unmounting should handle it
      setShowCongrats(false);
      setNextUrl(null);
    }
  };

  const stepBaseClass =
    "h-10 min-w-[40px] px-3 flex items-center justify-center rounded-[10px] font-baloo text-[18px] font-normal transition-all";
  const lockedStepClass =
    "h-10 w-10 flex items-center justify-center rounded-[10px] bg-[#DCDBDE] text-[#87838F] font-baloo text-[18px] font-normal cursor-not-allowed transition-all";
  const previousStepClass =
    "h-10 w-10 flex items-center justify-center rounded-[10px] bg-[#DCDBDE] text-[#87838F] font-baloo text-[18px] font-normal transition-all";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-transparent">
      <div className="flex h-[94px] w-full items-center justify-between rounded-t-[20px] bg-white/90 px-6 shadow-[0_0_20px_rgba(14,4,32,0.1)] backdrop-blur-xl md:px-12 lg:px-16">
        <div className="flex items-center">
          {isLoading
            ?
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`${stepBaseClass} bg-brand-gray-light w-12 animate-pulse`}
                  />
                  {i < 2 && (
                    <div className="mx-2 h-[2px] w-4 bg-gray-300 animate-pulse" />
                  )}
                </div>
              ))
            :
              activities.map((activity, index) => {
                const isCurrent = activity.documentId == activityId;
                const isPast =
                  completedActivityIds.has(activity.id) && !isCurrent;
                const isUnlocked =
                  index <= furthestUnlockedIndex && !isCurrent;
                const activityText = formatActivityType(
                  activity.standardActivityType || "",
                  activity.title
                );
                const isNotLast = index < activities.length - 1;

                return (
                  <div key={activity.id} className="flex items-center">
                    {isCurrent ? (
                      <Button asChild aria-current="page">
                        <div className="pointer-events-none cursor-default">{activityText}</div>
                      </Button>
                    ) : isPast || isUnlocked ? (
                      <Link
                        href={`/student/chapter/${chapterId}/activity/${activity.documentId}`}
                        className={`${previousStepClass}`}
                      >
                        {index + 1}
                      </Link>
                    ) : (
                      <div className={lockedStepClass}>{index + 1}</div>
                    )}

                    {isNotLast && (
                      <div className="mx-2 h-[2px] w-4 bg-[#DCDBDE]" />
                    )}
                  </div>
                );
              })}
        </div>

        <Button
          onClick={isLastActivity ? handleFinish : handleNext}
          disabled={!isCompleted}
          variant={isCompleted ? "primary" : "locked"}
        >
          {isLastActivity ? "Finish Chapter" : "Next"}
        </Button>
      </div>

      {showCongrats && (
        <CongratsModal
          sendosEarned={activities.find((a) => a.documentId === activityId)?.sendosReward || 0}
          onContinue={handleContinue}
        />
      )}
    </nav>
  );
}
