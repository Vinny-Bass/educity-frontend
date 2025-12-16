'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormError } from '@/components/ui/FormError';
import { Input } from '@/components/ui/input';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { completeOnboarding } from '@/features/onboarding/queries';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Step 1: Define the schemas for each form step
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const guardianSchema = z.object({
  guardianName: z.string().min(1, 'Guardian name is required'),
  guardianEmail: z.string().email('Invalid email address'),
});

// Step 2: Create union schema for type safety
type ProfileFormData = z.infer<typeof profileSchema>;
type GuardianFormData = z.infer<typeof guardianSchema>;

interface ProfileFormProps {
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onStepChange, onComplete }) => {
  const { nextStep, setProfileData, user, profileData, quizAnswers } = useOnboarding();
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) });

  const {
    register: registerGuardian,
    handleSubmit: handleGuardianSubmit,
    formState: { errors: guardianErrors },
  } = useForm<GuardianFormData>({ resolver: zodResolver(guardianSchema) });

  const onProfileSubmit = (data: ProfileFormData) => {
    console.log('Profile Data:', data);
    setProfileData({
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    });
    setFormStep(2);
    onStepChange?.(1); // Notify parent of step change (to step index 1)
  };

  const onGuardianSubmit = async (data: GuardianFormData) => {
    if (!user) {
      console.error('User not available');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Guardian Data:', data);

      // Update profile data with guardian info
      const finalProfileData = {
        ...profileData,
        guardianName: data.guardianName,
        guardianEmail: data.guardianEmail,
      };

      setProfileData({
        guardianName: data.guardianName,
        guardianEmail: data.guardianEmail,
      });

      // Complete onboarding
      await completeOnboarding(user.id, {
        profile: {
          firstName: finalProfileData?.firstName ?? '',
          lastName: finalProfileData?.lastName,
          password: finalProfileData?.password,
          guardianName: data.guardianName,
          guardianEmail: data.guardianEmail,
        },
        quizAnswers: quizAnswers,
      });

      // Close modal and move to next step
      onComplete?.();
      nextStep();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (!user) {
      console.error('User not available');
      return;
    }

    try {
      setIsSubmitting(true);

      // Complete onboarding without guardian info
      await completeOnboarding(user.id, {
        profile: {
          firstName: profileData?.firstName ?? '',
          lastName: profileData?.lastName,
          password: profileData?.password,
        },
        quizAnswers: quizAnswers,
      });

      // Close modal and move to next step
      onComplete?.();
      nextStep();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full overflow-hidden rounded-[20px] bg-white">
      <CardHeader className="p-0">
        <div className="bg-[#F3ECFF] p-6 rounded-br-[20px] rounded-[20px]">
          <CardTitle className="font-baloo text-[26px] font-normal text-[#0E0420]">
            {formStep === 1
              ? 'Ready to tell me who you are?'
              : 'What are your parent’s name and email?'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {formStep === 1 && (
          <form
            onSubmit={handleProfileSubmit(onProfileSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="First name"
                  {...registerProfile('firstName')}
                  className={cn("h-20 p-6 border-2 border-[#F3F3F3] rounded-[20px]")}
                />
                <FormError message={profileErrors.firstName?.message} />
              </div>
              <div>
                <Input
                  placeholder="Last name (optional)"
                  {...registerProfile('lastName')}
                  className={cn("h-20 p-6 border-2 border-[#F3F3F3] rounded-[20px]")}
                />
              </div>
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                {...registerProfile('password')}
                className={cn("h-20 p-6 border-2 border-[#F3F3F3] rounded-[20px]")}
              />
              <FormError message={profileErrors.password?.message} />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirm Password"
                {...registerProfile('confirmPassword')}
                className={cn("h-20 p-6 border-2 border-[#F3F3F3] rounded-[20px]")}
              />
              <FormError message={profileErrors.confirmPassword?.message} />
            </div>
            <Button type="submit" className="w-full h-14">
              Next
            </Button>
          </form>
        )}
        {formStep === 2 && (
          <form
            onSubmit={handleGuardianSubmit(onGuardianSubmit)}
            className="space-y-4"
          >
            <div>
              <Input
                placeholder="Parent/Guardian Name"
                {...registerGuardian('guardianName')}
                className={cn("h-20 p-6 border-2 border-[#F3F3F3] rounded-[20px]")}
              />
              <FormError message={guardianErrors.guardianName?.message} />
            </div>
            <div>
              <Input
                placeholder="Parent/Guardian Email"
                {...registerGuardian('guardianEmail')}
                className={cn("h-20 p-6 border-2 border-[#F3F3F3] rounded-[20px]")}
              />
              <FormError message={guardianErrors.guardianEmail?.message} />
            </div>
            <Button type="submit" className="w-full h-14" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Confirm'}
            </Button>
            <Button
              variant="underline"
              onClick={handleSkip}
              className="w-full"
              disabled={isSubmitting}
            >
              Later
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
