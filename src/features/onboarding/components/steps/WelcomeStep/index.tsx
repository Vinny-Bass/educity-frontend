'use client';

import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

export const WelcomeStep: React.FC = () => {
  const router = useRouter();
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const triggerConfetti = () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
          particleCount: 100,
          spread: 360,
          origin: { x, y },
          colors: ['#9056F5', '#F3F3F3', '#0E0420'], // Matching theme colors
        });
      }
    };

    // Small delay to ensure layout is stable and image is positioned
    const timer = setTimeout(triggerConfetti, 300);

    return () => clearTimeout(timer);
  }, []);

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
            ref={imageRef}
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
