"use client";

import { YouTubePlayer } from "@/features/student/activity/components/YouTubePlayer";
import type { ActivityStub } from "@/features/student/activity/types";

interface VideoActivityContentProps {
  activity: ActivityStub;
  onPlay: () => void;
}

/**
 * Renders the content for a video activity, including
 * title, description, and the video player itself.
 */
export function VideoActivityContent({
  activity,
  onPlay,
}: VideoActivityContentProps) {
  if (activity.standardActivityType !== "video" || !activity.videoUrl) {
    return <div>This activity is missing its video.</div>;
  }

  return (
    <div className="px-4 md:px-8 pt-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-baloo text-2xl font-normal text-gray-900">
            {activity.title}
          </h1>
          {activity.duration && (
            <span className="font-baloo-2 text-base font-medium text-gray-600 ml-4 shrink-0">
              {activity.duration} min
            </span>
          )}
        </div>

        {activity.description && (
          <p className="font-baloo-2 text-base font-medium text-gray-700 mt-2">
            {activity.description}
          </p>
        )}

        <div className="mt-6 aspect-video w-full">
          <YouTubePlayer
            videoUrl={activity.videoUrl}
            onPlay={onPlay}
          />
        </div>
      </div>
    </div>
  );
}
