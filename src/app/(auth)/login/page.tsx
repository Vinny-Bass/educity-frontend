import LoginForm from '@/features/auth/components/LoginForm';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white md:bg-[#F3ECFF] flex items-center justify-center md:p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
