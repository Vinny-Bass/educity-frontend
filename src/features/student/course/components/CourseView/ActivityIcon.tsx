import { ArrowLeft, Glasses, Lightbulb, PenSquare, Users, Sparkles, Star } from "lucide-react";

interface ActivityIconProps {
  type: string | undefined;
  className?: string;
}

export function ActivityIcon({ type, className }: ActivityIconProps) {
  const iconProps = { className: className ?? "w-6 h-6" };

  switch (type) {
    case "video":
      return <Glasses {...iconProps} />;
    case "quiz":
      return <PenSquare {...iconProps} />;
    case "recap":
      return <Sparkles {...iconProps} />;
    case "plot_auction":
      return <Star {...iconProps} />;
    case "team":
      return <Users {...iconProps} />;
    default:
      return <Lightbulb {...iconProps} />;
  }
}
