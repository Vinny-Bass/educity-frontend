'use client';

import React from 'react';

interface PaginationProps {
  current: number;
  total: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  className,
}) => {
  return (
    <div
      className={`flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm w-fit ${className}`}
    >
      <span className="font-baloo text-lg font-bold text-[#474250]">
        {current}
      </span>
      <span className="font-baloo text-lg text-[#C6C4CB]">/</span>
      <span className="font-baloo text-lg text-[#C6C4CB]">{total}</span>
    </div>
  );
};
