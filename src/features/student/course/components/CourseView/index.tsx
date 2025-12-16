"use client";

import { getMyStudentDashboard } from "@/features/student/dashboard/queries";
import type {
  Activity,
  ChapterWithActivities,
  DashboardData
} from "@/features/student/dashboard/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ActivityItem } from "./ActivityItem";
import { CoinIcon } from "./CoinIcon";

export default function CourseView() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMyStudentDashboard();
        setDashboardData(data);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!dashboardData || !dashboardData.currentChapter) {
    return <div>No course data available.</div>;
  }

  const currentChapterFull = dashboardData.currentChapter as ChapterWithActivities;
  const chapterToDisplayId = selectedChapterId ?? currentChapterFull.id;
  const currentChapter = dashboardData.allChapters.find(c => c.id === chapterToDisplayId) as ChapterWithActivities;
  console.log(currentChapter);

  const handleActivityClick = () => {
    // if (activity.standardActivityType === "quiz") {
    //   setSelectedActivity(activity);
    // }
  };

  const onlineActivities = currentChapter.activities.filter(
    (a: Activity) => a.type === "standard"
  );
  const inClassActivities = currentChapter.activities.filter(
    (a: Activity) => a.type === "team"
  );
  const homeworkActivities = currentChapter.activities.filter(
    (a: Activity) => a.type === "homework"
  );

  const completedActivities = currentChapter.activities.filter(
    (a) => a.completed
  ).length;
  const totalActivities = currentChapter.activities.length;
  const progressPercentage =
    totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  return (
    <div className="bg-[#f2f2f2] min-h-screen py-[89px] px-4 sm:px-6 md:px-8">
      <div className="max-w-[600px] mx-auto">
        <div className="flex justify-between items-center mb-4 relative">
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setIsChapterDropdownOpen(!isChapterDropdownOpen)}
          >
            <span className="font-baloo text-[30px] text-[#0E0420]">Chapter {currentChapter.chapterNumber}</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${isChapterDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isChapterDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-[12px] shadow-lg z-10 py-2 overflow-hidden border border-gray-100">
              {dashboardData.allChapters.map((chapter) => (
                <div
                  key={chapter.id}
                  onClick={() => {
                    setSelectedChapterId(chapter.id as number);
                    setIsChapterDropdownOpen(false);
                  }}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between ${
                    chapter.id === currentChapter.id ? 'bg-gray-50 font-medium' : ''
                  }`}
                >
                  <span className="font-baloo text-[18px] text-[#0E0420]">Chapter {chapter.chapterNumber}</span>
                  {chapter.id === dashboardData.currentChapter?.id && (
                    <span className="text-xs bg-[#9056F5] text-white px-2 py-1 rounded-full">Current</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CoinIcon className="w-[22px] h-[22px]" />
              <span className="font-baloo text-[20px] text-[#0E0420]">
                {currentChapter.totalSendos}
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

        <h1 className="font-baloo text-[26px] text-[#0E0420] mb-4">
          {currentChapter.name}
        </h1>

        <div className="space-y-6">
          {onlineActivities.length > 0 && (
            <section>
              <h2 className="font-baloo text-[20px] text-[#474250] mb-4">Online Class</h2>
              <div className="space-y-4">
                {onlineActivities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    onClick={() => handleActivityClick()}
                  />
                ))}
              </div>
            </section>
          )}

          {inClassActivities.length > 0 && (
            <section>
              <h2 className="font-baloo text-[20px] text-[#474250] mb-4">In Class</h2>
              <div className="space-y-4">
                {inClassActivities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    onClick={() => handleActivityClick()}
                  />
                ))}
              </div>
            </section>
          )}

          {homeworkActivities.length > 0 && (
            <section>
              <h2 className="font-baloo text-[20px] text-[#474250] mb-4">Homework</h2>
              <div className="space-y-4">
                {homeworkActivities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    onClick={() => handleActivityClick()}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
