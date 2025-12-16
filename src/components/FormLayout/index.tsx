'use client';

import { Pagination } from '@/components/Pagination';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import React from 'react';

interface FormLayoutProps {
  title: string;
  description: string;
  pagination: {
    current: number;
    total: number;
  };
  children: React.ReactNode; // This will be the form itself
}

export const FormLayout: React.FC<FormLayoutProps> = ({
  title,
  description,
  pagination,
  children,
}) => {
  return (
    <div className="grid w-full max-w-4xl grid-cols-1 items-stretch gap-8 md:grid-cols-3">
      {/* Left Column */}
      <div className="flex flex-col justify-start md:col-span-1 text-white">
        <div>
          <DialogTitle asChild>
            <h1 className="font-baloo text-[26px] font-bold">{title}</h1>
          </DialogTitle>
          <DialogDescription asChild>
            <p className="font-baloo-2 text-[20px] font-medium mt-2 text-white">
              {description}
            </p>
          </DialogDescription>
        </div>
      </div>

      {/* Right Column */}
      <div className="relative w-full md:col-span-2">
        {/* The form content will be passed in here */}
        {children}

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
