'use client';

import { Button } from '@/components/ui/button';
import React from 'react';

interface OnboardingBottomBarProps {
  steps: string[];
  currentStep: number;
  onNext: () => void;
  canProceed: boolean;
  onStepSelect?: (stepIndex: number) => void;
  isStepSelectable?: (stepIndex: number) => boolean;
}

export const OnboardingBottomBar: React.FC<OnboardingBottomBarProps> = ({
  steps,
  currentStep,
  onNext,
  canProceed,
  onStepSelect,
  isStepSelectable,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-transparent">
      <div className="flex h-[94px] w-full items-center justify-between rounded-t-[20px] bg-white/90 px-6 shadow-[0_0_20px_rgba(14,4,32,0.1)] backdrop-blur-xl md:px-12 lg:px-16">
        <div className="flex items-center">
          {steps.map((step, index) => {
            const isCurrent = index === currentStep;
            const isNotLast = index < steps.length - 1;
            const selectable =
              !!onStepSelect &&
              index !== currentStep &&
              (isStepSelectable ? isStepSelectable(index) : true);

            return (
              <div key={index} className="flex items-center">
                {isCurrent ? (
                  <Button asChild aria-current="page">
                    <div className="pointer-events-none cursor-default">{step}</div>
                  </Button>
                ) : (
                  <button
                    type="button"
                    onClick={() => selectable && onStepSelect?.(index)}
                    disabled={!selectable}
                    aria-label={`Go to ${step}`}
                    className={`h-10 w-10 flex items-center justify-center rounded-[10px] bg-[#DCDBDE] text-[#87838F] font-baloo text-[18px] font-normal transition-colors ${
                      selectable
                        ? 'cursor-pointer hover:bg-[#CFCED3]'
                        : 'cursor-default'
                    }`}
                  >
                    {index + 1}
                  </button>
                )}
                {isNotLast && <div className="mx-2 h-[2px] w-4 bg-[#DCDBDE]" />}
              </div>
            );
          })}
        </div>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          variant={canProceed ? 'primary' : 'locked'}
        >
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </nav>
  );
};
