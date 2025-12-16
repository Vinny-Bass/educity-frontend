
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getTeams } from "@/features/student/activity/queries";
import type { TeamOption } from "@/features/student/activity/types";
import { useActivityStore } from "@/store/activity.store";
import { useEffect, useState } from "react";
import { TeamActionButtons } from "../TeamActionButtons";

export interface JoinTeamActivityProps {
  title?: string;
  description?: string;
  activityKey: string;
}

export default function JoinTeamActivity({
  title = "Join a team",
  description = "You’ll be working together to share ideas, and earn Sendos as a team",
  activityKey,
}: JoinTeamActivityProps) {
  const auth = useAuth();
  const userId = auth?.user?.id ?? null;

  const classDocId = auth?.classDocId ?? null;
  const setIsCurrentActivityCompleted = useActivityStore(
    (state) => state.setIsCurrentActivityCompleted
  );
  const setCompletionPayload = useActivityStore(
    (state) => state.setCompletionPayload
  );
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamDocumentId, setTeamDocumentId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const currentTeamId = teams.find((team) => team.id === teamId)?.id ?? null;


  useEffect(() => {
    if (!classDocId) {
      return;
    }

    const fetchData = async () => {
      try {
        const teams = await getTeams(classDocId);
        setTeams(teams);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };

    fetchData();
  }, [classDocId]);

  useEffect(() => {
    if (!userId || !teamId) return;
    setCompletionPayload({
      type: "team.join",
      data: {
        activityKey,
        studentId: userId,
        currentTeamId: currentTeamId,
        newTeamId: teamDocumentId || "",
        isLocked: isLocked,
      },
    });
  }, [activityKey, userId, teamId, teamDocumentId, currentTeamId, isLocked, setCompletionPayload]);

  const handleJoinClick = (teamId: string) => {
    if (!auth?.user?.id || !auth?.user?.username) return; //TODO add error toast
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      setTeamDocumentId(team.documentId);
    }

    const newTeams = teams.map((team) => {
      if (team.id === teamId) {
        team.enrollments.push({
          student: { id: auth?.user?.id, username: auth?.user?.username },
        });
      }
      return team;
    });
    setTeams(newTeams);
    setTeamId(teamId);
    setIsCurrentActivityCompleted(true);
  };

  const handleLeaveClick = (teamId: string) => {
    const newTeams = teams.map((team) => {
      if (team.id === teamId) {
        team.enrollments = team.enrollments.filter(
          (enrollment) => enrollment.student.id !== auth?.user?.id
        );
      }
      return team;
    });
    setTeams(newTeams);
    setTeamId(null);
    setTeamDocumentId(null);
    setIsCurrentActivityCompleted(false);
  };

  const handleLock = (teamId: string) => {
    const newTeams = teams.map((team) => {
      if (team.id === teamId) {
        team.isLocked = true;
      }
      return team;
    });
    setTeams(newTeams);
    setIsLocked(true);
  };

  const handleUnlock = (teamId: string) => {
    const newTeams = teams.map((team) => {
      if (team.id === teamId) {
        team.isLocked = false;
      }
      return team;
    });
    setTeams(newTeams);
  };

  return (
    <div className="mx-auto py-10 flex max-w-5xl flex-col justify-center gap-8 px-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex-1">
        <h1 className="font-baloo text-[26px] font-normal text-[#0E0420] md:text-[26px]">
          {title}
        </h1>
        <p className="mt-4 max-w-xl font-baloo-2 text-[20px] font-medium text-[#5A5564] md:text-[18px]">
          {description}
        </p>
      </div>

      <div className="flex-1">
        <Card>
          <CardHeader className="rounded-[20px] bg-[#F3ECFF] px-5 py-4">
            <CardTitle className="font-baloo text-[26px] font-normal text-[#0E0420]">
              Which team will you join?
            </CardTitle>
          </CardHeader>

          <CardContent className="mt-4 max-h-[340px] space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#D4C6F6]">
            {teams.length === 0 ? (
              <div className="rounded-[20px] bg-[#F3F3F3] px-5 py-4">
                <p className="font-baloo-2 text-[14px] font-medium text-[#5A5564]">
                  There are no teams available yet. Please check back later.
                </p>
              </div>
            ) : (
              teams.map((team) => {
                const isEnrolled = teamId === team.id;
                return (
                  <Card
                    key={team.id}
                    variant={teamId === team.id ? "selectedItem" : "item"}
                    size="item"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-baloo-2 text-[20px] font-normal text-[#0E0420]">
                        {team.name}
                      </span>
                      <TeamActionButtons
                        team={team}
                        isEnrolled={isEnrolled}
                        hasActiveTeam={teamId != null}
                        onJoin={handleJoinClick}
                        onLeave={handleLeaveClick}
                        onLock={handleLock}
                        onUnlock={handleUnlock}
                      />
                    </div>
                    {!!team.enrollments?.length && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {team.enrollments.map((enrollment) => (
                          <Badge
                            key={enrollment.student.id}
                            variant="tag"
                          >
                            {enrollment.student.username}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
