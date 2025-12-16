import { cookies } from 'next/headers';

const TOKEN_NAME = 'token'; // Matches the cookie name used in auth.ts
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds (matching Strapi JWT expiration)

/**
 * Set the authentication token in an HTTP-only cookie
 */
export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  });
}

/**
 * Get the authentication token from cookies
 */
export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value;
}

/**
 * Remove the authentication token cookie
 */
export async function removeAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

/**
 * Check if user is authenticated by checking for token
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  return !!token;
}

