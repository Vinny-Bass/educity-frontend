'use client';

import { OnboardingProvider } from '@/contexts/OnboardingContext';
import OnboardingWizard from '@/features/onboarding/components/OnboardingWizard';
import { TeacherStep1 } from '@/features/onboarding/components/steps/TeacherStep1';
import { TeacherStep2 } from '@/features/onboarding/components/steps/TeacherStep2';
import { User } from '@/types/user';
import React from 'react';

export const TeacherOnboardingFlow: React.FC<{ user: User }> = ({ user }) => {
  return (
    <OnboardingProvider user={user}>
      <OnboardingWizard>
        <TeacherStep1 />
        <TeacherStep2 />
      </OnboardingWizard>
    </OnboardingProvider>
  );
};

