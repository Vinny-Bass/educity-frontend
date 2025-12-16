'use client';

import { FormLayout } from '@/components/FormLayout';
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProfileForm } from '@/features/onboarding/components/ProfileForm';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import React, { useState } from 'react';

interface FormModalProps {
  children: React.ReactNode;
}

const formContent = [
  {
    title: 'Set Up Your Profile',
    description: 'To see your full profile, let’s start by setting up your account.',
  },
  {
    title: 'Guardian Information',
    description: 'Help us keep your account secure by providing guardian information.',
  },
];

export const FormModal: React.FC<FormModalProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const currentContent = formContent[step];

  const handleFormComplete = () => {
    setOpen(false);
    setStep(0); // Reset step for next time
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-[#0E0420]/60" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-6xl translate-x-[-50%] translate-y-[-50%] p-0">
          <FormLayout
            title={currentContent.title}
            description={currentContent.description}
            pagination={{ current: step + 1, total: formContent.length }}
          >
            <ProfileForm
              onStepChange={setStep}
              onComplete={handleFormComplete}
            />
          </FormLayout>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};
