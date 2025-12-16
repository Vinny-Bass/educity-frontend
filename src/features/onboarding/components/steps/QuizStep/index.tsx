'use client';

import { QuizLayout } from '@/components/QuizLayout';
import { ARCHETYPE_QUIZ_QUESTIONS } from '@/features/onboarding/data/archetypes';
import React from 'react';

export const QuizStep: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E4E4E4] px-4 py-8">
      <QuizLayout
        title="Diagnostic"
        description="Every entrepreneur starts somewhere. Find out your base archetype and explore how you can grow from here."
        questions={ARCHETYPE_QUIZ_QUESTIONS}
      />
    </div>
  );
};
