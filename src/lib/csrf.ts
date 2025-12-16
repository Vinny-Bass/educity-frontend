import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * CSRF Token Utilities
 *
 * For state-changing operations (POST, PUT, DELETE, PATCH), we require
 * a CSRF token to prevent Cross-Site Request Forgery attacks.
 *
 * Strategy:
 * 1. Generate CSRF token on first request, store in HttpOnly cookie
 * 2. Client must send same token in X-CSRF-Token header for mutations
 * 3. Server verifies tokens match
 *
 * NOTE: SameSite=lax cookies only protect GET requests from CSRF.
 * For POST/PUT/DELETE, we need explicit CSRF tokens.
 */

/**
 * Generates a secure random CSRF token.
 */
function generateToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Gets or creates a CSRF token for the current session.
 * Stores it in an HttpOnly cookie.
 */
export async function getOrCreateCsrfToken(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CSRF_COOKIE_NAME);

  if (existing?.value) {
    return existing.value;
  }

  // Generate new token
  const token = generateToken();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  return token;
}

/**
 * Verifies a CSRF token from the request header against the cookie.
 */
export async function verifyCsrfToken(
  headerToken: string | null
): Promise<boolean> {
  if (!headerToken) {
    return false;
  }

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;

  if (!cookieToken) {
    return false;
  }

  // Compare tokens using constant-time comparison to prevent timing attacks
  return constantTimeCompare(cookieToken, headerToken);
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Gets the CSRF token from cookies.
 * Note: This requires the cookie to be readable by the server.
 * For client-side use, expose via an API route or set a non-HttpOnly cookie.
 */
export async function getCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE_NAME)?.value || null;
}

/**
 * Sets a CSRF token that client-side JavaScript can read.
 * For API routes that need CSRF protection, set a non-HttpOnly cookie
 * alongside the HttpOnly one, or expose via an API endpoint.
 */
export async function setCsrfTokenForClient(token: string): Promise<void> {
  const cookieStore = await cookies();
  // Set a readable cookie for client-side access
  cookieStore.set(`${CSRF_COOKIE_NAME}_client`, token, {
    httpOnly: false, // Client needs to read this
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

