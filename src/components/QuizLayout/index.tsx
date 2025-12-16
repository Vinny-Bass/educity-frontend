'use client';

import { Pagination } from '@/components/Pagination';
import { Quiz } from '@/components/Quiz';
import { ArchetypeQuizQuestion } from '@/features/onboarding/data/archetypes';
import React, { useCallback, useState } from 'react';

interface QuizLayoutProps {
  title: string;
  description: string;
  questions: ArchetypeQuizQuestion[];
  onFinish?: () => void;
}

export const QuizLayout: React.FC<QuizLayoutProps> = ({
  title,
  description,
  questions,
  onFinish,
}) => {
  const [pagination, setPagination] = useState({ current: 1, total: 0 });

  const handleQuestionChange = useCallback((current: number, total: number) => {
    setPagination({ current, total });
  }, []);

  return (
    <div className="grid w-full max-w-4xl grid-cols-1 items-stretch gap-8 md:grid-cols-3">
      <div className="flex flex-col justify-start md:col-span-1">
        <div>
          <div className="flex items-center gap-2.5">
            {/* <div className="flex-1 h-1.5 bg-[#F3F3F3] rounded-[6px] overflow-hidden">
              <div
                className="h-full bg-[#9056F5] rounded-[6px] transition-all duration-300"
                style={{ width: `50%` }}
              />
            </div> */}
          </div>
          <h1 className="font-baloo text-[26px] font-bold text-[#0E0420]">
            {title}
          </h1>
          <p className="font-baloo-2 text-[20px] font-medium text-[#474250] mt-2">
            {description}
          </p>
        </div>
      </div>
      <div className="relative w-full md:col-span-2">
        <Quiz
          questions={questions}
          onQuestionChange={handleQuestionChange}
          onFinish={onFinish}
        />
        {pagination.total > 0 && (
          <Pagination
            current={pagination.current}
            total={pagination.total}
            className="absolute bottom-5 right-full mr-4"
          />
        )}
      </div>
    </div>
  );
};
