'use client';

import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import React from 'react';

export const TeacherStep1: React.FC = () => {
  const { nextStep } = useOnboarding();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F3F3F3] p-4 text-center">
      <div className="flex flex-col items-center gap-6 max-w-lg">
        <h1 className="font-baloo text-[32px] font-normal text-[#0E0420]">
          Welcome Teacher - Step 1
        </h1>

        <p className="font-baloo-2 text-lg font-medium text-[#474250]">
          This is the first step of the teacher onboarding. Please read this important information.
        </p>

        <Button
          onClick={nextStep}
          className="mt-4 w-full max-w-xs bg-[#9056F5] h-14 text-xl"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

