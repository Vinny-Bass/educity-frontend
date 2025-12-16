'use client';

import type { StudentSession } from '@/lib/auth';
import { createContext, useContext } from 'react';

type AuthContextValue = StudentSession | null;

const AuthContext = createContext<AuthContextValue>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  session?: StudentSession | null;
}

export function AuthProvider({ children, session = null }: AuthProviderProps) {
  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

