'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

export const WelcomeStep: React.FC = () => {
  const router = useRouter();

  const handleLetsGo = () => {
    router.push('/student/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F3F3F3] p-4 text-center">
      <div className="flex flex-col items-center gap-6 max-w-lg">
        <h1 className="font-baloo text-[32px] font-normal text-[#0E0420]">
          Congrats
        </h1>

        <h2 className="font-baloo text-[28px] font-normal text-[#0E0420]">
          Welcome to educity
        </h2>

        <p className="font-baloo-2 text-lg font-medium text-[#474250]">
          Your account is ready
        </p>

        <p className="font-baloo-2 text-lg font-medium text-[#474250]">
          Time to explore Educity
        </p>

        <div className="my-4">
          <Image
            src="/welcome_cat.svg"
            alt="Welcome Cat"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>

        <Button
          onClick={handleLetsGo}
          className="mt-4 w-full max-w-xs bg-[#9056F5] h-14 text-xl"
        >
          Let&apos;s go
        </Button>
      </div>
    </div>
  );
};
