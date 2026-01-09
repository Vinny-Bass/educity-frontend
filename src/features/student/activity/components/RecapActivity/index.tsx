"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { completeActivity } from "@/features/student/activity/queries";
import type { ActivityStub } from "@/features/student/activity/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RecapActivityProps {
  activity: ActivityStub;
  onComplete?: () => void;
}

export function RecapActivity({ activity, onComplete }: RecapActivityProps) {
  const router = useRouter();
  const auth = useAuth();
  const enrollmentId = auth?.enrollmentId ?? null;
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    // Automatically mark as completed when user views the recap
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  const handleGoHome = async () => {
    if (isCompleting || !enrollmentId) {
      router.push("/student/dashboard");
      return;
    }

    try {
      setIsCompleting(true);
      // Complete the activity in the backend
      await completeActivity(activity.documentId, enrollmentId, { type: "" });
      
      // Mark activity as completed in local state
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Failed to complete recap activity:", error);
    } finally {
      setIsCompleting(false);
      router.push("/student/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] py-12 px-4 md:px-8">
      <div className="max-w-[900px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Left side - Title and Description */}
          <div className="md:col-span-2">
            <h1 className="font-baloo text-[34px] font-bold text-[#0E0420] mb-6">
              {activity.title}
            </h1>
            {activity.description && (
              <div
                className="text-[#474250]
                  [&>p]:font-inter [&>p]:text-[16px] [&>p]:text-[#474250] [&>p]:mb-3 [&>p]:leading-relaxed
                  [&>h1]:font-baloo [&>h1]:text-[22px] [&>h1]:font-bold [&>h1]:mb-3 [&>h1]:text-[#0E0420]
                  [&>h2]:font-baloo [&>h2]:text-[20px] [&>h2]:font-bold [&>h2]:mb-2 [&>h2]:text-[#0E0420]
                  [&>h3]:font-baloo [&>h3]:text-[18px] [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:text-[#0E0420]
                  [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:mb-4 [&>ul]:pl-6
                  [&>ul>li]:font-inter [&>ul>li]:text-[16px] [&>ul>li]:text-[#474250] [&>ul>li]:leading-relaxed
                  [&>ol]:list-decimal [&>ol]:space-y-2 [&>ol]:mb-4 [&>ol]:pl-6
                  [&>ol>li]:font-inter [&>ol>li]:text-[16px] [&>ol>li]:text-[#474250] [&>ol>li]:leading-relaxed
                  [&>strong]:font-bold
                  [&>em]:italic
                  [&>a]:text-[#9056F5] [&>a]:underline hover:[&>a]:text-[#7d49d9]"
                dangerouslySetInnerHTML={{ __html: activity.description }}
              />
            )}
          </div>

          {/* Right side - Card */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-[24px] p-8 shadow-md">
              {/* Cat Image positioned above header */}
              <div className="flex justify-start mb-0 pl-2">
                <Image
                  src="/cat_head.svg"
                  alt="Character"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>

              {/* Purple Header Section */}
              <div className="bg-[#E8DDFF] rounded-[20px] px-6 py-6 mb-6">
                {activity.recapHeader && (
                  <h2 className="font-baloo text-[24px] font-bold text-[#0E0420] text-left leading-snug">
                    {activity.recapHeader}
                  </h2>
                )}
              </div>

              {/* Guideline Content Box */}
              {activity.guideline && (
                <div
                  className="mb-6 text-[#0E0420] bg-[#F5F5F5] rounded-[20px] px-6 py-6 whitespace-pre-line
                    [&>h1]:font-baloo [&>h1]:text-[24px] [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:text-[#0E0420]
                    [&>h2]:font-baloo [&>h2]:text-[20px] [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:text-[#0E0420]
                    [&>h3]:font-baloo [&>h3]:text-[18px] [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:text-[#0E0420]
                    [&>p]:font-inter [&>p]:text-[16px] [&>p]:text-[#0E0420] [&>p]:mb-3 [&>p]:leading-relaxed [&>p]:whitespace-pre-line
                    [&>ul]:list-disc [&>ul]:space-y-3 [&>ul]:mb-0 [&>ul]:pl-6 [&>ul]:marker:text-[#0E0420]
                    [&>ul>li]:font-inter [&>ul>li]:text-[16px] [&>ul>li]:text-[#0E0420] [&>ul>li]:leading-relaxed
                    [&>ol]:list-decimal [&>ol]:space-y-2 [&>ol]:mb-4 [&>ol]:pl-6
                    [&>ol>li]:font-inter [&>ol>li]:text-[16px] [&>ol>li]:text-[#0E0420] [&>ol>li]:leading-relaxed
                    [&>strong]:font-bold [&>strong]:text-[#0E0420]
                    [&>em]:italic
                    [&>a]:text-[#9056F5] [&>a]:underline hover:[&>a]:text-[#7d49d9]
                    [&>blockquote]:border-l-4 [&>blockquote]:border-[#9056F5] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4"
                  dangerouslySetInnerHTML={{ __html: activity.guideline }}
                />
              )}

              {/* Home Button */}
              <Button
                onClick={handleGoHome}
                disabled={isCompleting}
                className="w-full h-[60px] rounded-[12px] bg-[#E8DDFF] hover:bg-[#D5C5EF] text-[#9056F5] font-baloo text-[22px] font-bold border-2 border-[#9056F5] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCompleting ? "Completing..." : "Home"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

