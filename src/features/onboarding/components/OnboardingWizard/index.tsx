import { useOnboarding } from '@/contexts/OnboardingContext';
import React, { Children, useEffect } from 'react';

interface OnboardingWizardProps {
  children: React.ReactElement | React.ReactElement[];
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  children,
}) => {
  const { currentStep, setTotalSteps } = useOnboarding();

  const stepsArray = Children.toArray(children) as React.ReactElement[];
  const totalSteps = stepsArray.length;

  useEffect(() => {
    setTotalSteps(totalSteps);
  }, [totalSteps, setTotalSteps]);

  const CurrentStepComponent = stepsArray[currentStep];

  if (!CurrentStepComponent) {
    return null;
  }

  return (
    <div className="onboarding-wizard">
      <div className="wizard-content">{CurrentStepComponent}</div>
    </div>
  );
};

export default OnboardingWizard;
