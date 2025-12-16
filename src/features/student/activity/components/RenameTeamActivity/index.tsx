"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { getTeams } from "@/features/student/activity/queries";
import { TeamOption } from "@/features/student/activity/types";
import { useActivityStore } from "@/store/activity.store";
import { useEffect, useState } from "react";

export interface RenameTeamActivityProps {
  title?: string;
  description?: string;
  activityKey: string;
}

export default function RenameTeamActivity({
  title = "Name your team",
  description = "Choose a unique name and cheer for your team!",
  activityKey,
}: RenameTeamActivityProps) {
  const auth = useAuth();
  const userId = auth?.user?.id;
  const classDocId = auth?.classDocId;

  const setIsCurrentActivityCompleted = useActivityStore(
    (state) => state.setIsCurrentActivityCompleted
  );
  const setCompletionPayload = useActivityStore(
    (state) => state.setCompletionPayload
  );

  const [teamName, setTeamName] = useState("");
  const [teamCheer, setTeamCheer] = useState("");
  const [loading, setLoading] = useState(true);
  const [myTeam, setMyTeam] = useState<TeamOption | null>(null);

  useEffect(() => {
    if (!classDocId || !userId) return;

    const fetchData = async () => {
      try {
        const teams = await getTeams(classDocId);
        const userTeam = teams.find((t) =>
          t.enrollments.some((e) => e.student.id === userId)
        );

        if (userTeam) {
          setMyTeam(userTeam);
          setTeamName(userTeam.name || "");
          setTeamCheer(userTeam.cheer || "");
        }
      } catch (error) {
        console.error("Failed to fetch team", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classDocId, userId]);

  useEffect(() => {
    const isValid = teamName.trim().length > 0 && teamCheer.trim().length > 0;
    setIsCurrentActivityCompleted(isValid);

    if (isValid) {
      setCompletionPayload({
        type: "team.rename",
        data: {
          name: teamName,
          cheer: teamCheer,
        },
      });
    } else {
      setCompletionPayload(null);
    }
  }, [teamName, teamCheer, setIsCurrentActivityCompleted, setCompletionPayload]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-lg font-baloo text-brand-purple">Loading team...</div>
      </div>
    );
  }

  if (!myTeam) {
    return (
      <div className="mx-auto py-10 flex max-w-5xl flex-col justify-center px-4">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="font-baloo-2 text-lg text-gray-600">
              You are not in a team yet. Please go back and join a team first.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              What is your team name and cheer?
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Team Members Section */}
            <div className="w-full max-w-[520px] items-start bg-[#F3F3F3] border-2 border-[#D4D4D4] rounded-[20px] flex flex-col gap-[10px] justify-center p-[20px_24px] relative">
              <div className="flex items-center gap-[10px] relative flex-wrap">
                {myTeam.enrollments.map((enrollment) => (
                  <div
                    key={enrollment.student.id}
                    className="items-center bg-[#EBEBEB] rounded-[10px] inline-flex flex-none gap-[10px] justify-center px-[14px] py-[10px] relative"
                  >
                    <div className="text-[#5A5564] font-baloo-2 text-[20px] font-medium tracking-normal leading-normal -mt-[1px] relative w-fit">
                      {enrollment.student.username}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="w-full max-w-[520px] h-[80px] flex items-center border-2 border-[#F3F3F3] rounded-[20px] gap-[10px] p-6 relative">
                <Input
                  placeholder="Team Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="font-baloo-2 text-[20px] font-medium text-[#0E0420] border-none shadow-none focus-visible:ring-0 p-0 h-auto w-full bg-transparent placeholder:text-[#C6C4CB]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="w-full max-w-[520px] h-[80px] flex items-center border-2 border-[#F3F3F3] rounded-[20px] gap-[10px] p-6 relative">
                <Input
                  placeholder="Team Cheer"
                  value={teamCheer}
                  onChange={(e) => setTeamCheer(e.target.value)}
                  className="font-baloo-2 text-[20px] font-medium text-[#0E0420] border-none shadow-none focus-visible:ring-0 p-0 h-auto w-full bg-transparent placeholder:text-[#C6C4CB]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
