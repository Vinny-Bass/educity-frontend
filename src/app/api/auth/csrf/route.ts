import { getOrCreateCsrfToken, setCsrfTokenForClient } from '@/lib/csrf';
import { NextResponse } from 'next/server';

/**
 * API route to get CSRF token for client-side use.
 *
 * NOTE: Next.js Server Actions are automatically protected against CSRF
 * by Next.js itself. This endpoint is useful for:
 * - Custom API routes that accept POST/PUT/DELETE
 * - Direct fetch calls to your API routes
 *
 * Usage:
 * - Call GET /api/auth/csrf to get the token
 * - Include it in X-CSRF-Token header for mutations
 */
export async function GET() {
  try {
    const token = await getOrCreateCsrfToken();

    // Also set a client-readable cookie
    await setCsrfTokenForClient(token);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}

