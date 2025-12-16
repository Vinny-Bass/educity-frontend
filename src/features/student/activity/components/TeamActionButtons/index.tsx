import { Button } from "@/components/ui/button";
import type { TeamOption } from "@/features/student/activity/types";
import Image from "next/image";

interface TeamActionButtonsProps {
  team: TeamOption;
  isEnrolled: boolean;
  hasActiveTeam: boolean;
  onJoin: (teamId: string) => void;
  onLeave: (teamId: string) => void;
  onLock: (teamId: string) => void;
  onUnlock: (teamId: string) => void;
}

export function TeamActionButtons({
  team,
  isEnrolled,
  hasActiveTeam,
  onJoin,
  onLeave,
  onLock,
  onUnlock,
}: TeamActionButtonsProps) {

  const memberCount = team.enrollments.length;
  const isFull = memberCount >= 3;

  if (isEnrolled) {
    if (team.isLocked) {
      return (
        <Button variant="gray" onClick={() => onUnlock(team.id)}>
          Unlock
        </Button>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Button variant="gray" onClick={() => onLeave(team.id)}>
          Leave
        </Button>
        <Button onClick={() => onLock(team.id)}>
          Lock
        </Button>
      </div>
    );
  }

  if (hasActiveTeam) {
    return null;
  }

  if (team.isLocked || isFull) {
    return (
      <Button variant="locked" disabled>
        <Image src="/lock.svg" alt="Locked" width={20} height={20} className="mr-2 " />
        Locked
      </Button>
    );
  }

  return (
    <Button onClick={() => onJoin(team.id)}>
      Join
    </Button>
  );
}
