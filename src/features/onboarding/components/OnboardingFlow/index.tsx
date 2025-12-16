'use client';

import { OnboardingProvider } from '@/contexts/OnboardingContext';
import OnboardingWizard from '@/features/onboarding/components/OnboardingWizard';
import { CongratsStep } from '@/features/onboarding/components/steps/CongratsStep';
import { QuizStep } from '@/features/onboarding/components/steps/QuizStep';
import { WelcomeStep } from '@/features/onboarding/components/steps/WelcomeStep';
import { User } from '@/types/user';
import React from 'react';

/**
 * This Client Component wraps the entire interactive onboarding flow,
 * including the context provider and the wizard itself.
 */

export const OnboardingFlow: React.FC<{ user: User }> = ({ user }) => {
  return (
    <OnboardingProvider user={user}>
      <OnboardingWizard>
        <QuizStep />
        <CongratsStep />
        <WelcomeStep />
      </OnboardingWizard>
    </OnboardingProvider>
  );
};

export default OnboardingFlow;
