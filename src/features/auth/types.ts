import type { User } from "@/types/user";

export interface LoginRequest {
  identifier: string; // email or username
  password: string;
}

export interface LoginResponse {
  jwt: string;
  user: User;
}

export interface AuthError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  code: string;
  password: string;
  passwordConfirmation: string;
}

export interface ActionResult {
  success: boolean;
  error?: string;
  rateLimitResetAt?: number;
  rateLimitRemaining?: number;
  user?: User;
}
