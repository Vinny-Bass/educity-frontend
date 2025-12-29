'use client';

import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { completeTeacherOnboarding } from '@/features/onboarding/queries';
import React, { useState } from 'react';

export const TeacherStep2: React.FC = () => {
  const { user } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await completeTeacherOnboarding(user.id);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F3F3F3] p-4 text-center">
      <div className="flex flex-col items-center gap-6 max-w-lg">
        <h1 className="font-baloo text-[32px] font-normal text-[#0E0420]">
          Welcome Teacher - Step 2
        </h1>

        <p className="font-baloo-2 text-lg font-medium text-[#474250]">
          This is the second step. You are almost done. Click finish to go to your dashboard.
        </p>

        <Button
          onClick={handleFinish}
          disabled={isLoading}
          className="mt-4 w-full max-w-xs bg-[#9056F5] h-14 text-xl"
        >
          {isLoading ? 'Finishing...' : 'Finish'}
        </Button>
      </div>
    </div>
  );
};

