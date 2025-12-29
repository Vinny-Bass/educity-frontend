import { OnboardingFlow } from '@/features/onboarding/components/OnboardingFlow';
import { getUser } from '@/lib/auth';
import { isTeacher } from '@/lib/roles';
import { redirect } from 'next/navigation';

export default async function StartOnboardingPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  if (isTeacher(user)) {
    redirect('/teacher/onboarding');
  }

  return (
    <OnboardingFlow user={user}/>
  );
}
