"use client";

import { MySendos } from "@/components/MySendos";
import { getMyStudentProfile } from "@/features/student/profile/queries";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getActivity } from "../../queries";
import { ActivityStub } from "../../types";

export function ActivityHeader() {
  const params = useParams();
  const { activityId } = params as { activityId: string };
  const [activity, setActivity] = useState<ActivityStub | null>(null);
  const [sendosAmount, setSendosAmount] = useState(0);

  useEffect(() => {
    if (!activityId) return;

    const fetchData = async () => {
      try {
        const [activityData, profileData] = await Promise.all([
          getActivity(activityId),
          getMyStudentProfile(),
        ]);
        setActivity(activityData);
        setSendosAmount(profileData.totalSendos || 0);
        console.log(profileData);
      } catch (error) {
        console.error("Failed to fetch activity header data:", error);
      }
    };

    fetchData();
  }, [activityId]);

  if (!activity) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Activity Name */}
        <div className="flex-1 min-w-0">
          <h1 className="font-baloo text-[24px] md:text-[28px] font-normal text-[#0E0420] truncate">
            {activity.title}
          </h1>
        </div>

        {/* My Sendos - User's Account Balance */}
        <div className="ml-4 shrink-0">
          <MySendos sendosAmount={sendosAmount} showTitle={false} />
        </div>
      </div>
    </div>
  );
}

