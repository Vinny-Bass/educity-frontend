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

  // Format guideline text (plain text to HTML)
  const formatGuideline = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    let html = '';
    let inList = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Check if it's a list item (starts with - or *)
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        html += `<li>${trimmedLine.substring(2)}</li>`;
      } else {
        // Close list if we were in one
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        
        // Check if it's a heading (first line or larger text)
        if (index === 0 || trimmedLine.length > 50) {
          html += `<h3>${trimmedLine}</h3>`;
        } else {
          html += `<p>${trimmedLine}</p>`;
        }
      }
    });

    // Close list if still open
    if (inList) {
      html += '</ul>';
    }

    return html;
  };

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

        {/* Activity Guidelines */}
        {activity.guideline && (
          <div className="mt-4 bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <div
              className="prose prose-lg max-w-none 
                [&>h1]:font-baloo-2 [&>h1]:text-[20px] [&>h1]:font-bold [&>h1]:text-[#0E0420] [&>h1]:mb-3
                [&>h2]:font-baloo-2 [&>h2]:text-[18px] [&>h2]:font-bold [&>h2]:text-[#0E0420] [&>h2]:mb-2
                [&>h3]:font-baloo-2 [&>h3]:text-[16px] [&>h3]:font-semibold [&>h3]:text-[#0E0420] [&>h3]:mb-2
                [&>p]:font-baloo-2 [&>p]:text-[14px] [&>p]:font-normal [&>p]:text-[#474250] [&>p]:mb-2
                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-3
                [&>ul>li]:font-baloo-2 [&>ul>li]:text-[14px] [&>ul>li]:font-normal [&>ul>li]:text-[#474250] [&>ul>li]:mb-1
                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-3
                [&>ol>li]:font-baloo-2 [&>ol>li]:text-[14px] [&>ol>li]:font-normal [&>ol>li]:text-[#474250] [&>ol>li]:mb-1
                [&>strong]:font-bold [&>em]:italic"
              dangerouslySetInnerHTML={{ __html: formatGuideline(activity.guideline) }}
            />
          </div>
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
