import { OnboardingFlow } from '@/features/onboarding/components/OnboardingFlow';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function StartOnboardingPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <OnboardingFlow user={user}/>
  );
}
