'use client';

import { FormModal } from '@/components/FormModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

export const CongratsStep: React.FC = () => {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F3F3F3] p-4 text-center">
      <Card className="flex flex-col items-center justify-between p-8 rounded-[20px] w-full max-w-lg shadow-lg">
        <div className="flex flex-col items-center">
          <h2 className="font-baloo text-[26px] font-normal text-[#0E0420] mb-6">
            Amazing work
          </h2>

          <Image
            src="/congrats_cat.svg"
            alt="Congrats Cat"
            width={180}
            height={200}
            className="my-6 object-contain"
          />
        </div>

        <div className="flex flex-col items-center">
          <p className="font-baloo-2 text-lg font-medium text-[#474250] max-w-md">
          You just earned <span className="text-[#9056F5]">100 Sendos</span>!
          <br />You really know your money basics.<br />
          Keep up the great learning.
          </p>

          <FormModal>
            <Button className="mt-8 w-full max-w-xs bg-[#9056F5] h-14 text-2xl">
              Next
            </Button>
          </FormModal>
        </div>
      </Card>
    </div>
  );
};
