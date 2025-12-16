import { NextRequest, NextResponse } from 'next/server';
import { verifyCsrfToken } from './csrf';

/**
 * Middleware wrapper for API routes that need CSRF protection.
 *
 * Usage in API route:
 *
 * ```ts
 * import { requireCsrf } from '@/lib/csrf-middleware';
 *
 * export async function POST(request: NextRequest) {
 *   const csrfError = await requireCsrf(request);
 *   if (csrfError) return csrfError;
 *
 *   // Your protected logic here
 * }
 * ```
 *
 * NOTE: Next.js Server Actions are automatically protected by Next.js.
 * Only use this for custom API routes.
 */
export async function requireCsrf(
  request: NextRequest
): Promise<NextResponse | null> {
  // Check if it's a mutation request
  const method = request.method;
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return null; // No CSRF needed for GET/HEAD/OPTIONS
  }

  // Get CSRF token from header
  const headerToken = request.headers.get('x-csrf-token');

  // Verify token
  const isValid = await verifyCsrfToken(headerToken);

  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid or missing CSRF token' },
      { status: 403 }
    );
  }

  return null; // CSRF valid, proceed
}

