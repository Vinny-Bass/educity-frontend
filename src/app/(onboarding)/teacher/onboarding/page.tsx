import { TeacherOnboardingFlow } from '@/features/onboarding/components/TeacherOnboardingFlow';
import { getUser } from '@/lib/auth';
import { isTeacher } from '@/lib/roles';
import { redirect } from 'next/navigation';

export default async function TeacherOnboardingPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  if (!isTeacher(user)) {
    redirect('/');
  }

  return <TeacherOnboardingFlow user={user} />;
}

