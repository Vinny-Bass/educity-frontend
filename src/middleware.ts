import { validateTokenStructure } from '@/lib/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const TOKEN_NAME = 'token'; // Matches the cookie name used in auth.ts

// Routes that require authentication
const protectedRoutes = ['/', '/teacher', '/student'];

// Routes that should redirect to home if already authenticated
const authRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_NAME)?.value;
  const { pathname } = request.nextUrl;

  // Check if the current path requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route) && pathname !== '/login'
  );

  // Check if the current path is an auth route (login, etc.)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Validate token if it exists (check structure and expiration)
  if (token) {
    const validation = validateTokenStructure(token);

    // Token is invalid or expired - clear it
    if (!validation.valid) {
      const response = NextResponse.next();
      response.cookies.delete(TOKEN_NAME);

      // If accessing protected route, redirect to login
      if (isProtectedRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }

      return response;
    }
  }

  // Check if accessing teacher or student routes
  const isTeacherRoute = pathname.startsWith('/teacher');
  const isStudentRoute = pathname.startsWith('/student');

  // Redirect to login if trying to access protected route without valid token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Ensure teacher routes require valid authentication
  if (isTeacherRoute && (!token || !validateTokenStructure(token).valid)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Ensure student routes require valid authentication
  if (isStudentRoute && (!token || !validateTokenStructure(token).valid)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to appropriate dashboard if trying to access auth routes while authenticated
  if (isAuthRoute && token) {
    const validation = validateTokenStructure(token);
    if (validation.valid) {
      // For teachers, redirect to teacher dashboard
      // For others, redirect to home
      // We can't check role here easily, so redirect to home and let the root page handle teacher redirect
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

