'use server';

import { clearAuthCookie, setAuthCookie } from '@/lib/auth';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit';
import type { User } from '@/types/user';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import type { ActionResult, LoginRequest, LoginResponse } from './types';

/**
 * Server Action: Authenticate user with Strapi.
 *
 * On success: Sets a secure, HttpOnly cookie with the JWT.
 * On failure: Returns an error message.
 *
 * Includes rate limiting to prevent brute force attacks.
 */
export async function login(data: LoginRequest): Promise<ActionResult> {
  const strapiUrl = process.env.STRAPI_API_URL || "http://127.0.0.1:1337";

  // Extract client IP from headers
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIP = headersList.get('x-real-ip');
  const cfConnectingIP = headersList.get('cf-connecting-ip'); // Cloudflare

  // x-forwarded-for can be a comma-separated list; take the first (original client)
  const clientIP =
    forwardedFor?.split(',')[0].trim() ||
    realIP?.trim() ||
    cfConnectingIP?.trim() ||
    'unknown';

  // Check rate limiting by IP
  const ipRateLimit = checkRateLimit(`ip:${clientIP}`);

  if (!ipRateLimit.allowed) {
    const resetAt = ipRateLimit.resetAt || Date.now() + 15 * 60 * 1000;
    return {
      success: false,
      error: `Too many login attempts from your network. Please try again in ${Math.ceil((resetAt - Date.now()) / 60000)} minutes.`,
      rateLimitResetAt: resetAt,
    };
  }

  // Check rate limiting by email/identifier (account protection)
  const emailRateLimit = checkRateLimit(`email:${data.identifier}`);

  if (!emailRateLimit.allowed) {
    const resetAt = emailRateLimit.resetAt || Date.now() + 15 * 60 * 1000;
    return {
      success: false,
      error: `Too many login attempts for this account. Please try again in ${Math.ceil((resetAt - Date.now()) / 60000)} minutes.`,
      rateLimitResetAt: resetAt,
    };
  }

  try {
    const response = await fetch(`${strapiUrl}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: data.identifier,
        password: data.password,
      }),
      cache: "no-store", // Auth requests should never be cached
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.error?.message || "Login failed. Please check your credentials.";
      return {
        success: false,
        error: errorMessage,
        rateLimitRemaining: Math.min(ipRateLimit.remaining, emailRateLimit.remaining),
      };
    }

    const result: LoginResponse = await response.json();

    // Reset rate limits on successful login
    resetRateLimit(`ip:${clientIP}`);
    resetRateLimit(`email:${data.identifier}`);

    // 1. Set the secure cookie
    await setAuthCookie(result.jwt);

    // 2. Fetch user data with role populated
    let userWithRole: User | null = null;
    try {
      const userResponse = await fetch(`${strapiUrl}/api/users/me?populate=role`, {
        headers: {
          Authorization: `Bearer ${result.jwt}`,
        },
        cache: 'no-store',
      });

      if (userResponse.ok) {
        userWithRole = await userResponse.json();
      }
    } catch (error) {
      console.error('Failed to fetch user role after login:', error);
    }

    // 3. Revalidate the root path
    // This tells Next.js to re-run the `app/page.tsx` redirect logic
    // on the next navigation to '/'.
    revalidatePath("/");

    // 4. Return success with user data to the client
    return {
      success: true,
      user: userWithRole || result.user,
    };

  } catch (error) {
    console.error("Login action error:", error);
    return {
      success: false,
      error: "An unknown error occurred.",
      rateLimitRemaining: Math.min(ipRateLimit.remaining, emailRateLimit.remaining),
    };
  }
}

export async function logout(): Promise<ActionResult> {
  await clearAuthCookie();
  return { success: true };
}
