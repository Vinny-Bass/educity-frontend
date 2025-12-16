"use client";

import { Button } from '@/components/ui/button';
import { login } from '@/features/auth/actions';
import { LoginFormInput } from '@/features/auth/components/LoginFormInput';
import { isStudent, isTeacher } from '@/lib/roles';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'unauthorized') {
      setError('You are not authorized to access this application features. Please contact an administrator.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Clear error query parameter if present
    if (searchParams.get('error')) {
      router.replace('/login');
    }

    try {
      const result = await login({ identifier: email, password });

      console.log(result);

      if (result.success) {
        // Redirect based on user role
        if (result.user && isTeacher(result.user)) {
          router.push('/teacher/dashboard');
        } else if (result.user && isStudent(result.user)) {
          router.push('/student/dashboard');
        } else {
          router.push('/');
        }
        router.refresh();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen md:h-auto flex-col items-center justify-center bg-white px-6 overflow-y-auto md:rounded-[1.875rem] md:shadow-[0_5px_20px_0_rgba(14,4,32,0.04)] md:px-12 md:py-16 md:max-w-[600px] md:w-full">
      <div className="mb-6">
        <Image
          src="/cat.svg"
          alt="Flosendo Logo"
          width={80}
          height={80}
          priority
        />
      </div>

      <h1 className="mb-2 text-[1.625rem] font-normal text-brand-purple font-baloo">
        Welcome to Flosendo!
      </h1>

      <h2 className="mb-6 text-lg font-medium text-brand-dark font-baloo-2">
        Log into your account
      </h2>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200">
            {error}
          </div>
        )}

        <LoginFormInput
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <LoginFormInput
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

         <Button
           type="submit"
           disabled={isLoading}
           className="h-auto w-full rounded-[0.625rem] bg-brand-purple py-3 text-[1.375rem] font-normal text-white hover:bg-brand-purple-hover font-baloo disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {isLoading ? 'Logging in...' : 'Log in'}
         </Button>
      </form>
    </div>
  );
}
