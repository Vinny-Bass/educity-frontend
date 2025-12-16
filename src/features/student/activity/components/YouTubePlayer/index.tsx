"use client";

import ReactPlayer from "react-player";

interface YouTubePlayerProps {
  videoUrl: string;
  //onProgress: (progressPercent: number) => void;
  onPlay: () => void;
}

/**
 * This is the YouTube player component.
 */
export function YouTubePlayer({ videoUrl, onPlay }: YouTubePlayerProps) {
  const handlePlay = () => {
    onPlay();
  };

  return (
    <div className="relative pt-[56.25%]">
      {" "}
      {/* 16:9 Aspect Ratio */}
      <ReactPlayer
        src={videoUrl}
        onPlay={handlePlay}
        width="100%"
        height="100%"
        controls={true}
        className="absolute top-0 left-0"
      />
    </div>
  );
}
