'use client';

import Image from 'next/image';
import React from 'react';

interface HelperBubbleProps {
  className?: string;
}

export const HelperBubble: React.FC<HelperBubbleProps> = ({ className }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="inline-flex items-center justify-center gap-2.5 p-3.5 bg-purple-600 rounded-lg">
        <Image
          className="relative w-[54px] h-[46px]"
          alt="Helper avatar"
          src="/image-68.png" // Placeholder - you'll need to add this image
          width={54}
          height={46}
        />
        <div className="relative w-fit font-baloo-2 font-medium text-purple-100 text-lg leading-[21px]">
          I’ll help you understand <br />
          your archetype.
        </div>
      </div>
      {/* This creates the little triangle tail */}
      <div className="absolute bottom-[-7px] right-8 w-3.5 h-3.5 bg-purple-600 rotate-45" />
    </div>
  );
};
