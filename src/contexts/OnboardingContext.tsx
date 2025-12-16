'use client';

import {
  ArchetypeId,
} from '@/features/onboarding/data/archetypes';
import { User } from '@/types/user';
import { createContext, ReactNode, useContext, useState } from 'react';

// Define the shape of your quiz answers
// We'll expand this later when we know the question IDs
export type QuizAnswers = { [questionId: string]: ArchetypeId };

interface ProfileData {
  firstName: string;
  lastName?: string;
  password?: string;
  guardianName?: string;
  guardianEmail?: string;
}

interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  quizAnswers: QuizAnswers;
  profileData: ProfileData | null;
  user: User | null;
  // --- Actions ---
  // Go to the next step
  nextStep: () => void;
  // Go to the previous step
  prevStep: () => void;
  // Set the total number of steps
  setTotalSteps: (count: number) => void;
  // Add/update a quiz answer (from Step 2)
  setQuizAnswer: (questionId: string, answer: ArchetypeId) => void;
  // Set the user's profile data
  setProfileData: (data: Partial<ProfileData>) => void;
  // Reset the flow if "Try Again" is clicked
  resetOnboarding: () => void;
}

// Create the context with a null default value
const OnboardingContext = createContext<OnboardingState | null>(null);

/**
 * The Provider component that will wrap the entire onboarding flow.
 * It holds the state and provides the state + action functions to all children.
 */
export const OnboardingProvider = ({ children, user }: { children: ReactNode; user: User }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [profileData, setProfileDataState] = useState<ProfileData | null>(null);


  const nextStep = () => {
    // Ensure we don't go past the last step
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
  };
  const prevStep = () => {
    // Ensure we don't go below the first step
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleSetQuizAnswer = (questionId: string, answer: ArchetypeId) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const setProfileData = (data: Partial<ProfileData>) => {
    setProfileDataState((prev) => {
      const nextProfile = { ...(prev || {}), ...data } as ProfileData;
      console.log('Profile data set:', nextProfile);
      return nextProfile;
    });
  };

  const resetOnboarding = () => {
    setCurrentStep(0);
    setQuizAnswers({});
    setProfileDataState(null);
  };

  // The value object provided to all consuming components
  const value = {
    currentStep,
    totalSteps,
    quizAnswers,
    profileData,
    user,
    nextStep,
    prevStep,
    setTotalSteps,
    setQuizAnswer: handleSetQuizAnswer,
    setProfileData,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

/**
 * A custom hook to make consuming the context cleaner and safer.
 * This is what your components will use (e.g., `const { nextStep } = useOnboarding();`)
 */
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
