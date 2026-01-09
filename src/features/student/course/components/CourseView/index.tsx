"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getMyStudentDashboard } from "@/features/student/dashboard/queries";
import type {
  Activity,
  DashboardData
} from "@/features/student/dashboard/types";
import { getChapterActivities, getChapterProgress } from "@/features/student/activity/queries";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ActivityItem } from "./ActivityItem";
import { CoinIcon } from "./CoinIcon";
import { GuidelinesCard } from "./GuidelinesCard";

export default function CourseView() {
  const router = useRouter();
  const auth = useAuth();
  const enrollmentId = auth?.enrollmentId ?? null;
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [chapterActivities, setChapterActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMyStudentDashboard();
        setDashboardData(data);
        
        // Fetch activities for the current chapter if available
        if (data.currentChapter?.documentId && enrollmentId) {
          const activities = await getChapterActivities(data.currentChapter.documentId);
          
          // Fetch progress to mark completed activities
          const progressList = await getChapterProgress(enrollmentId, data.currentChapter.documentId);
          const completedActivityIds = new Set(progressList.map((p: any) => p.activity?.id));
          
          // Map activities with completion status
          const activitiesWithProgress = activities.map((activity: any) => ({
            ...activity,
            completed: completedActivityIds.has(activity.id),
          }));
          
          setChapterActivities(activitiesWithProgress);
        } else if (data.currentChapter?.documentId) {
          // If no enrollmentId, fetch activities without progress
          const activities = await getChapterActivities(data.currentChapter.documentId);
          setChapterActivities(activities.map((a: any) => ({ ...a, completed: false })));
        }
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [enrollmentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!dashboardData || !dashboardData.currentChapter) {
    return <div>No course data available.</div>;
  }

  const currentChapter = dashboardData.currentChapter;

  const handleActivityClick = (activity: Activity) => {
    router.push(`/student/chapter/${currentChapter.documentId}/activity/${activity.documentId}`);
  };

  const onlineActivities = chapterActivities.filter(
    (a: Activity) => a.type === "standard" && a.standardActivityType !== "recap"
  );
  const inClassActivities = chapterActivities.filter(
    (a: Activity) => a.type === "team"
  );
  const homeworkActivities = chapterActivities.filter(
    (a: Activity) => a.type === "homework"
  );
  const recapActivities = chapterActivities.filter(
    (a: Activity) => a.type === "standard" && a.standardActivityType === "recap"
  );

  const completedActivities = chapterActivities.filter(
    (a) => a.completed
  ).length;
  const totalActivities = chapterActivities.length;
  const progressPercentage =
    totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  return (
    <div className="bg-[#f2f2f2] min-h-screen py-[89px] px-4 sm:px-6 md:px-8">
      <div className="max-w-[600px] mx-auto">
        <div className="flex justify-between items-center mb-4 relative">
          <div className="flex items-center gap-2">
            <span className="font-baloo text-[30px] text-[#0E0420]">{currentChapter.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CoinIcon className="w-[22px] h-[22px]" />
              <span className="font-baloo text-[20px] text-[#0E0420]">
                {dashboardData.totalSendos}
              </span>
            </div>
            <ChevronRight className="w-6 h-6 text-[#0E0420]" />
          </div>
        </div>

        <div className="w-full bg-[#C6C4CB] rounded-[5px] h-[10px] mb-4">
          <div
            className="bg-[#9056F5] h-[10px] rounded-[5px]"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Show guidelines card or congratulations */}
        {(() => {
          if (chapterActivities.length === 0) return null;
          
          // Check if chapter is completed
          const isChapterCompleted = chapterActivities.every(a => a.completed);
          
          if (isChapterCompleted) {
            // Show congratulations card
            return (
              <div className="bg-white rounded-[20px] p-6 shadow-sm mb-6">
                <div className="bg-[#F3ECFF] rounded-[20px] p-6 flex flex-col items-center justify-center text-center">
                  <h2 className="font-baloo-2 text-[26px] font-bold text-[#0E0420] mb-4">
                    Congratulations! 🎉
                  </h2>
                  <p className="font-baloo-2 text-[18px] font-normal text-[#474250] mb-6">
                    You&apos;ve completed this chapter!
                  </p>
                  <div className="flex items-center gap-3 bg-white rounded-full px-6 py-3">
                    <span className="font-baloo-2 text-[18px] font-normal text-[#474250]">
                      You earned
                    </span>
                    <div className="flex items-center gap-2">
                      <CoinIcon className="w-[24px] h-[24px]" />
                      <span className="font-baloo-2 text-[24px] font-bold text-[#9056F5]">
                        {currentChapter.totalSendos || 0}
                      </span>
                    </div>
                    <span className="font-baloo-2 text-[18px] font-normal text-[#474250]">
                      sendos
                    </span>
                  </div>
                </div>
              </div>
            );
          }
          
          // Find the first incomplete activity, or default to the first activity
          const nextActivity = chapterActivities.find(a => !a.completed) || chapterActivities[0];
          
          return (
            <GuidelinesCard
              chapterOnlineEstimatedTime={currentChapter.onlineEstimatedTime}
              chapterInClassEstimatedTime={currentChapter.inClassEstimatedTime}
              activityDocumentId={nextActivity.documentId}
              chapterDocumentId={currentChapter.documentId}
              chapterSendosDescription={currentChapter.sendosDescription}
              chapterTotalSendos={currentChapter.totalSendos}
            />
          );
        })()}

        {/* Online Activities */}
        {onlineActivities.length > 0 && (
          <div className="mb-6">
            <h2 className="font-baloo text-[22px] text-[#0E0420] mb-3">
              Online Mission
            </h2>
            <div className="space-y-3">
              {onlineActivities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  onClick={() => handleActivityClick(activity)}
                />
              ))}
            </div>
          </div>
        )}

        {/* In-Class Activities */}
        {inClassActivities.length > 0 && (
          <div className="mb-6">
            <h2 className="font-baloo text-[22px] text-[#0E0420] mb-3">
              In-Class Activities
            </h2>
            <div className="space-y-3">
              {inClassActivities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  onClick={() => handleActivityClick(activity)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Homework Activities */}
        {homeworkActivities.length > 0 && (
          <div className="mb-6">
            <h2 className="font-baloo text-[22px] text-[#0E0420] mb-3">
              Homework
            </h2>
            <div className="space-y-3">
              {homeworkActivities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  onClick={() => handleActivityClick(activity)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recap Activities */}
        {recapActivities.length > 0 && (
          <div className="mb-6">
            <h2 className="font-baloo text-[22px] text-[#0E0420] mb-3">
              Recap
            </h2>
            <div className="space-y-3">
              {recapActivities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  onClick={() => handleActivityClick(activity)}
                  hideRewards={true}
                />
              ))}
            </div>
          </div>
        )}
    
        </div>
    </div>
  );
}
