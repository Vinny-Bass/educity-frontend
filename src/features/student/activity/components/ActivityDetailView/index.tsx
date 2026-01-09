"use client";

import JoinTeamActivity from "@/features/student/activity/components/JoinTeamActivity";
import { PlotAuctionActivity } from "@/features/student/activity/components/PlotAuctionActivity";
import ProblemStatementActivity from "@/features/student/activity/components/ProblemStatementActivity";
import { RecapActivity } from "@/features/student/activity/components/RecapActivity";
import RenameTeamActivity from "@/features/student/activity/components/RenameTeamActivity";
import UploadIdeaActivity from "@/features/student/activity/components/UploadIdeaActivity";
import { VideoActivityContent } from "@/features/student/activity/components/VideoActivityContent";
import type { ActivityStub } from "@/features/student/activity/types";
import { QuizActivity } from "@/features/student/course/components/QuizActivity";
import { useActivityStore } from "@/store/activity.store";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface ActivityDetailViewProps {
  activity: ActivityStub;
}

/**
 * This is the main view for a single activity.
 * It manages the "step completed" state and renders the
 * correct activity type (video, quiz, etc.) and the bottom bar.
 */
export function ActivityDetailView({ activity }: ActivityDetailViewProps) {
  const setIsCurrentActivityCompleted = useActivityStore(
    (state) => state.setIsCurrentActivityCompleted
  );
  const resetCompletion = useActivityStore((state) => state.resetCompletion);

  useEffect(() => {
    resetCompletion();

    return () => {
      resetCompletion();
    };
  }, [resetCompletion, activity.id]);

  const handleVideoPlay = () => {
    setIsCurrentActivityCompleted(true);
  };

  const renderActivityContent = () => {
    if (activity.type === "standard" || activity.type === "homework") {
      switch (activity.standardActivityType) {
        case "video":
          return (
            <VideoActivityContent
              activity={activity}
              onPlay={handleVideoPlay}
            />
          );
        case "quiz":
          return (
            <QuizActivity
              activity={activity}
              onComplete={() => setIsCurrentActivityCompleted(true)}
              onClose={() => {}}
            />
          );
        case "recap":
          return (
            <RecapActivity
              activity={activity}
              onComplete={() => setIsCurrentActivityCompleted(true)}
            />
          );
        case "plot_auction":
          return (
            <PlotAuctionActivity
              activity={activity}
            />
          );
        case "reading":
          return <div>Reading component will go here.</div>;
        case "problem_statement":
          return (
            <ProblemStatementActivity
              activityId={activity.documentId}
              title={activity.title}
              description={activity.description}
            />
          );
      }
    } else if (activity.type === "team") {
      switch (activity.teamActivityType) {
        case "join_team":
          return (
            <JoinTeamActivity
              title={activity.title}
              description={activity.description}
              activityKey={activity.teamActivityType}
            />
          );
        case "rename_team":
          return (
            <RenameTeamActivity
              title={activity.title}
              description={activity.description}
              activityKey={activity.teamActivityType}
            />
          );
        case "upload_idea":
          return (
            <UploadIdeaActivity
              title={activity.title}
              description={activity.description}
              activityKey={activity.teamActivityType}
            />
          );
      }
    }
    return <div>Unknown activity type.</div>;
  };

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 lg:px-4">
        <Link href="/student/dashboard" className="inline-block">
          <Image
            src="/back_arrow.svg"
            alt="Back to dashboard"
            width={30}
            height={30}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>
      </div>
      <div className="flex-1">{renderActivityContent()}</div>
    </div>
  );
}
