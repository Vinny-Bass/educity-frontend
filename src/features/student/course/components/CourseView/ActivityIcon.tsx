import { Lightbulb, PenSquare, Users, Video } from "lucide-react";

interface ActivityIconProps {
  type: string | undefined;
  className?: string;
}

export function ActivityIcon({ type, className }: ActivityIconProps) {
  const iconProps = { className: className ?? "w-6 h-6" };

  switch (type) {
    case "video":
      return <Video {...iconProps} />;
    case "quiz":
      return <PenSquare {...iconProps} />;
    case "team":
      return <Users {...iconProps} />;
    default:
      return <Lightbulb {...iconProps} />;
  }
}
