'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingBottomBar } from '@/features/onboarding/components/OnboardingBottomBar';
import {
  ARCHETYPE_LIBRARY,
} from '@/features/onboarding/data/archetypes';
import { completeOnboarding, CompleteOnboardingPayload } from '@/features/onboarding/queries';
import { YouTubePlayer } from '@/features/student/activity/components/YouTubePlayer';
import { User } from '@/types/user';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';

// --- Component Definition ---

const BOTTOM_BAR_OFFSET = 110;
const SUMMARY_FLOW_STEPS = ['Your Type', 'Your Mission'];
const INTRO_VIDEO_URL = 'https://www.youtube.com/watch?v=kYfNvmF0Bqw';

export const SummaryStep: React.FC<{ user: User }> = ({ user }) => {
  const {
    profileData,
    archetype,
    nextStep,
    quizAnswers,
    superpower,
  } = useOnboarding();
  const [bottomBarStep, setBottomBarStep] = useState(0);
  const [isCompletionModalOpen, setCompletionModalOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [completionSuccess, setCompletionSuccess] = useState(false);
  const [notSureMessageVisible, setNotSureMessageVisible] = useState(false);
  const notSureTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const archetypeDetails = archetype ? ARCHETYPE_LIBRARY[archetype] : null;

  const radarChartData = useMemo(() => {
    if (!archetypeDetails) {
      return [];
    }
    return archetypeDetails.radarAttributes.map((attribute) => ({
      subject: attribute.label,
      score: attribute.value,
      fullMark: 5,
    }));
  }, [archetypeDetails]);

  const maxSummaryIndex = SUMMARY_FLOW_STEPS.length - 1;

  const handleNext = () => {
    if (bottomBarStep < maxSummaryIndex) {
      setBottomBarStep((prev) => Math.min(prev + 1, maxSummaryIndex));
      return;
    }
    setCompletionModalOpen(true);
  };

  const handleStepSelect = (index: number) => {
    const safeIndex = Math.max(0, Math.min(index, maxSummaryIndex));
    setBottomBarStep(safeIndex);
  };

  const handleModalChange = (open: boolean) => {
    setCompletionModalOpen(open);
    if (!open) {
      setCompletionError(null);
      setCompletionSuccess(false);
      setNotSureMessageVisible(false);
      if (notSureTimeoutRef.current) {
        clearTimeout(notSureTimeoutRef.current);
        notSureTimeoutRef.current = null;
      }
    }
  };

  const handleNotSure = () => {
    setNotSureMessageVisible(true);
    if (notSureTimeoutRef.current) {
      clearTimeout(notSureTimeoutRef.current);
    }
    notSureTimeoutRef.current = setTimeout(() => {
      setNotSureMessageVisible(false);
      notSureTimeoutRef.current = null;
    }, 4000);
  };

  const handleConfirmCompletion = async () => {
    if (!profileData?.firstName) {
      setCompletionError('We are missing your profile details. Please complete the form first.');
      return;
    }

    try {
      setIsCompleting(true);
      setCompletionError(null);
      setCompletionSuccess(false);

      const payload: CompleteOnboardingPayload = {
        archetype,
        superpower,
        quizAnswers: quizAnswers ?? {},
        profile: {
          firstName: profileData?.firstName ?? '',
          lastName: profileData?.lastName ?? '',
          password: profileData?.password ?? '',
          guardianName: profileData?.guardianName ?? '',
          guardianEmail: profileData?.guardianEmail ?? '',
        },
      };

      await completeOnboarding(user.id, payload);

      setCompletionSuccess(true);
      nextStep();
      setTimeout(() => handleModalChange(false), 1200);
      router.push('/student/dashboard');
    } catch (error) {
      setCompletionError(error instanceof Error ? error.message : 'Unexpected error while completing onboarding.');
    } finally {
      setIsCompleting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (notSureTimeoutRef.current) {
        clearTimeout(notSureTimeoutRef.current);
      }
    };
  }, []);

  const summaryHeading = (
    <h1 className="text-[26px] font-baloo font-normal text-gray-900 text-center leading-tight">
      {profileData?.firstName ? `${profileData.firstName}, here’s your starting map.` : 'Here’s your starting map.'}
    </h1>
  );

  const handleVideoPlay = useCallback(() => {
    console.log('Video played');
  }, []);

  if (!archetypeDetails) {
    return <div className="min-h-screen flex items-center justify-center">Loading or no archetype selected...</div>;
  }

  // --- Step 0 Content ---
  const step0Content = (
    <>
      {summaryHeading}
      <Card
        className="rounded-[20px] shadow-lg w-full max-w-6xl h-auto bg-white overflow-hidden"
        key="step-0-card"
      >
        <CardContent className="p-0 h-full flex flex-col gap-8 lg:flex-row lg:gap-10">

          {/* Left Column (Main Intro/Description) */}
          <div className="p-8 sm:p-10 shrink-0 w-full lg:w-2/5 flex flex-col justify-center border-b lg:border-r lg:border-b-0 border-gray-100">
            <Badge className="w-fit bg-gray-100 rounded-xl mb-4 hover:bg-gray-100 text-gray-500 font-semibold">
              My Archetype
            </Badge>

            <h1 className="text-2xl font-baloo font-normal text-gray-900 mb-3">
              {archetypeDetails.name}
            </h1>

            <p className="text-base font-medium text-gray-500 mb-6 max-w-sm">
              {archetypeDetails.shortDescription}
            </p>
          </div>

          {/* Right Column (Visuals and Captions) */}
          <div className="p-6 sm:p-8 grow lg:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-6 content-center">

              {/* Visuals Row */}
              <div className="md:col-span-1 flex justify-center">
                  {/* Card 1: Custom Badge/Advance Card */}
                  <Card className="w-full max-w-md aspect-4/3 flex rounded-[20px] border border-gray-200 justify-center items-center">
                    <div className="flex flex-col items-center justify-center p-6">
                            <Image
                                src={archetypeDetails.radarChart}
                                alt="Archetype radar chart placeholder"
                                width={130}
                                height={130}
                                className="object-contain"

                            />
                        </div>
                  </Card>
              </div>

              <div className="md:col-span-1 flex justify-center">
                  {/* Card 2: Radar Chart */}
                  <Card className="w-full max-w-md aspect-4/3 flex rounded-[20px] border border-gray-200 justify-center items-center relative p-2">
                    <ResponsiveContainer width="100%" height="70%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="85%"
                        data={radarChartData}
                      >
                        <PolarGrid />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fill: '#474250', fontSize: 8 }}
                        />
                        <Radar
                          name="Score"
                          dataKey="score"
                          stroke="#9056F5"
                          fill="#9056F5"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Card>
              </div>

              {/* Descriptions Row (Aligns under the Visuals) */}
              <div className="md:col-span-1">
                  <p className="font-medium text-gray-500 text-sm md:text-base leading-5 max-w-xs mx-auto">
                      {archetypeDetails.longDescription1}
                  </p>
              </div>

              <div className="md:col-span-1">
                  <p className="font-medium text-gray-500 text-sm md:text-base leading-5 max-w-xs mx-auto">
                      {archetypeDetails.longDescription2}
                  </p>
              </div>

          </div>

        </CardContent>
      </Card>
    </>

  );

  // --- Step 1 Content ---
  const step1Content = (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      {summaryHeading}
      <Card className="rounded-[20px] shadow-lg w-full max-w-4xl bg-white overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-baloo font-normal text-gray-900">
              What is an archetype?
            </h2>
            <span className="text-sm font-semibold text-gray-500">1 min</span>
          </div>
          <YouTubePlayer videoUrl={INTRO_VIDEO_URL} onPlay={handleVideoPlay} />
        </div>
      </Card>
    </div>
  );

  // --- Main Render ---
  return (
    <div
      className="bg-gray-100 px-4 py-6 lg:px-8 lg:py-10 flex flex-col items-center gap-6 relative"
      style={{
        minHeight: `calc(100dvh - ${BOTTOM_BAR_OFFSET}px)`,
      }}
    >

      <div className="w-full max-w-7xl flex flex-col items-center gap-6 flex-grow">

        {/* Main Content Area */}
        {bottomBarStep === 0 && step0Content}
        {bottomBarStep === 1 && step1Content}
      </div>

      {/* Floating Helper Avatar */}


      {/* Onboarding Bottom Bar */}
      <OnboardingBottomBar
        steps={SUMMARY_FLOW_STEPS}
        currentStep={bottomBarStep}
        onNext={handleNext}
        onStepSelect={handleStepSelect}
        canProceed={true}
      />

      <Dialog open={isCompletionModalOpen} onOpenChange={handleModalChange}>
        <DialogContent className="max-w-lg border-0 bg-transparent p-0 shadow-none">
          <Card className="rounded-[24px] border-none shadow-xl bg-white">
            <CardContent className="p-8 flex flex-col gap-6">
              <div className="space-y-2 text-center">
                <DialogTitle className="text-2xl font-baloo font-normal text-gray-900">
                  Did this initial archetype feel right for you?
                </DialogTitle>
                <DialogDescription className="text-base text-gray-500">
                  Your answer helps us personalize your journey even more.
                </DialogDescription>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  variant="gray"
                  onClick={handleNotSure}
                  className="px-8"
                  disabled={isCompleting}
                >
                  Not sure
                </Button>
                <Button
                  onClick={handleConfirmCompletion}
                  disabled={isCompleting}
                  className="px-8"
                >
                  {isCompleting ? 'Sending...' : 'Yes'}
                </Button>
              </div>
              <p
                className="text-sm text-gray-600 text-center transition-opacity duration-500"
                style={{ opacity: notSureMessageVisible ? 1 : 0 }}
              >
                It’s ok, this is just a starting point—your archetype will evolve as you explore EDEN.
              </p>
              {completionError && (
                <p className="text-sm text-red-500 text-center">
                  {completionError}
                </p>
              )}
              {completionSuccess && (
                <p className="text-sm text-green-600 text-center">
                  Awesome! We’ve saved your progress and will keep guiding you forward.
                </p>
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
};
