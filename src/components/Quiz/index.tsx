'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ArchetypeQuizQuestion } from '@/features/onboarding/data/archetypes';
import React, { useEffect, useState } from 'react';

interface QuizProps {
  questions: ArchetypeQuizQuestion[];
  onQuestionChange?: (current: number, total: number) => void;
  onFinish?: () => void;
}

export const Quiz: React.FC<QuizProps> = ({
  questions,
  onQuestionChange,
  onFinish,
}) => {
  const {
    nextStep,
    quizAnswers,
    setQuizAnswer,
  } = useOnboarding();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    onQuestionChange?.(currentQuestionIndex + 1, questions.length);
  }, [currentQuestionIndex, questions.length, onQuestionChange]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // If a custom onFinish handler is provided, use it.
      // Otherwise, fall back to the default onboarding logic.
      if (onFinish) {
        onFinish();
      } else {
        nextStep();
      }
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswerSelected = !!quizAnswers[currentQuestion.id];

  return (
    <Card
      className="shadow-lg"
      style={{
        borderRadius: '20px',
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <CardHeader className="rounded-[20px] bg-[#F3ECFF] px-5 py-4">
        <CardTitle className="font-baloo text-[26px] font-normal text-[#0E0420]">
          {currentQuestion.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="mt-4 space-y-3 p-5">
        {currentQuestion.answers.map((answer, index) => (
          <Card
            key={answer.id}
            onClick={() => setQuizAnswer(currentQuestion.id, answer.tag)}
            className="cursor-pointer bg-[#F3F3F3]"
            variant={
              quizAnswers[currentQuestion.id] === answer.tag
                ? 'selectedItem'
                : 'item'
            }
            size="item"
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#DCDBDE]"
              >
                <span className="font-baloo text-lg font-bold text-[#474250]">
                  {String.fromCharCode(65 + index)}
                </span>
              </div>
              <span className="font-baloo-2 text-base font-semibold text-[#474250]">
                {answer.text}
              </span>
            </div>
          </Card>
        ))}

        <div className="mt-6 flex justify-end">
          <Button onClick={handleNext} disabled={!isAnswerSelected}>
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
