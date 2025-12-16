# Frontend Authentication Guide

This guide explains how to use the authentication system in the Flosendo frontend application.

## Overview

The authentication system is built using:
- **Next.js Server Actions** for secure authentication operations
- **HTTP-only cookies** for storing JWT tokens securely
- **Next.js Middleware** for route protection
- **React Context** for client-side user state management

## Setup

### 1. Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

For production, update this to your production Strapi URL.

### 2. Start the Development Server

```bash
npm run dev
```

## Architecture

### Files Structure

```
src/
├── actions/
│   └── auth.ts              # Server Actions for authentication
├── contexts/
│   └── AuthContext.tsx      # Client-side auth context and provider
├── lib/
│   ├── cookies.ts           # Cookie management utilities
│   └── strapi.ts            # Strapi API client
├── types/
│   └── auth.ts              # TypeScript types for auth
├── middleware.ts            # Route protection middleware
└── app/
    ├── layout.tsx           # Root layout with AuthProvider
    ├── (auth)/
    │   └── login/           # Login page
    └── (main)/              # Protected routes
```

## Usage

### Login

The login functionality is already implemented in the `LoginForm` component. When a user logs in:

1. Credentials are sent to the Strapi backend
2. JWT token is received and stored in an HTTP-only cookie
3. User is redirected to the home page (`/`)

### Accessing User Information

#### Client Components

Use the `useAuth` hook to access user information in client components:

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### Server Components

Use the `getUser` or `requireAuth` server action:

```tsx
import { getUser } from '@/actions/auth';

export default async function MyServerComponent() {
  const user = await getUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Role: {user.role.name}</p>
    </div>
  );
}
```

Or use `requireAuth` to automatically redirect if not authenticated:

```tsx
import { requireAuth } from '@/actions/auth';

export default async function ProtectedPage() {
  const user = await requireAuth(); // Redirects to login if not authenticated

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
    </div>
  );
}
```

### Logout

#### Client Components

Use the `logout` function from the `useAuth` hook:

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function LogoutButton() {
  const { logout } = useAuth();

  return <button onClick={logout}>Logout</button>;
}
```

#### Server Components

Use the `logout` server action:

```tsx
import { logout } from '@/actions/auth';

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit">Logout</button>
    </form>
  );
}
```

### Checking User Role

You can check the user's role to conditionally render content:

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function RoleBasedContent() {
  const { user } = useAuth();

  if (user?.role.name === 'Teacher') {
    return <div>Teacher-specific content</div>;
  }

  if (user?.role.name === 'Student') {
    return <div>Student-specific content</div>;
  }

  return <div>Default content</div>;
}
```

## Route Protection

### Automatic Protection

All routes are automatically protected by default except:
- `/login` - Login page

To add more public routes, update the `middleware.ts` file:

```typescript
const protectedRoutes = ['/'];
const authRoutes = ['/login'];
```

### Manual Protection in Pages

You can also manually protect pages using the `requireAuth` function:

```tsx
import { requireAuth } from '@/actions/auth';

export default async function ProtectedPage() {
  await requireAuth(); // Will redirect to login if not authenticated

  return <div>Protected content</div>;
}
```

## Making Authenticated API Requests

To make authenticated requests to your Strapi backend, you need to get the token from cookies:

### In Server Components or Server Actions

```typescript
import { getAuthToken } from '@/lib/cookies';

async function fetchProtectedData() {
  const token = await getAuthToken();

  const response = await fetch('http://localhost:1337/api/protected-endpoint', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}
```

### In Client Components

For client components, you should create API routes or server actions that handle the authentication:

```typescript
// app/actions/data.ts
'use server';

import { getAuthToken } from '@/lib/cookies';

export async function getProtectedData() {
  const token = await getAuthToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch('http://localhost:1337/api/protected-endpoint', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
}
```

Then use it in your client component:

```tsx
'use client';

import { getProtectedData } from '@/actions/data';
import { useEffect, useState } from 'react';

export default function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getProtectedData().then(setData);
  }, []);

  return <div>{JSON.stringify(data)}</div>;
}
```

## Security Features

### HTTP-Only Cookies

JWT tokens are stored in HTTP-only cookies, which means:
- JavaScript cannot access the token (protection against XSS attacks)
- The cookie is automatically sent with every request to the same domain
- The cookie is secure in production (HTTPS only)

### Token Expiration

JWT tokens expire after 7 days (configured in Strapi). After expiration:
- The middleware will detect the invalid token
- User will be redirected to the login page
- The invalid token will be removed from cookies

### CSRF Protection

The application uses:
- `SameSite=Lax` cookie attribute for CSRF protection
- Server Actions are automatically protected by Next.js CSRF tokens

## Customization

### Changing Token Expiration

To change the token expiration time, update the Strapi backend configuration in `/Eden/backend/config/plugins.ts`:

```typescript
'users-permissions': {
  config: {
    jwt: {
      expiresIn: '30d', // Change to desired expiration time
    },
  },
}
```

Also update the cookie max age in `/src/lib/cookies.ts`:

```typescript
const TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
```

### Adding Protected Routes

To protect additional routes, update `/src/middleware.ts`:

```typescript
const protectedRoutes = [
  '/',
  '/dashboard',
  '/profile',
  '/settings',
];
```

### Adding Public Routes

To make routes public (accessible without authentication), update the middleware to exclude them:

```typescript
const protectedRoutes = ['/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip protection for public routes
  if (pathname.startsWith('/public') || pathname.startsWith('/about')) {
    return NextResponse.next();
  }

  // ... rest of the middleware
}
```

## Troubleshooting

### "Not authenticated" error

1. Check if the Strapi backend is running
2. Verify the `NEXT_PUBLIC_STRAPI_URL` environment variable
3. Check browser cookies to see if the `auth_token` cookie is set
4. Try logging in again

### Redirecting to login on every page load

1. Check if the JWT token is valid in Strapi
2. Verify the cookie is being set correctly (check browser DevTools > Application > Cookies)
3. Check if the token has expired (7 days by default)

### CORS errors

If you see CORS errors when making requests to Strapi:

1. Update Strapi's CORS configuration in `/Eden/backend/config/middlewares.ts`
2. Ensure your frontend URL is allowed in the CORS settings

## Best Practices

1. **Never store sensitive data in localStorage** - Use HTTP-only cookies instead
2. **Always use Server Actions for authentication operations** - Don't expose API calls in client components
3. **Check user roles on the backend** - Don't rely solely on frontend role checks for security
4. **Use `requireAuth` for sensitive pages** - This ensures users are authenticated before accessing protected content
5. **Implement proper error handling** - Always handle authentication errors gracefully

## Future Enhancements

### Automatic Token Refresh

Currently, the token expires after 7 days. To implement automatic token refresh:

1. Strapi would need to support refresh tokens (not available by default)
2. Implement a refresh token endpoint
3. Add logic to automatically refresh the token before expiration

### Remember Me

To implement "Remember Me" functionality:

1. Create a separate cookie for the refresh token with a longer expiration
2. Store the user preference (remember me checkbox)
3. Adjust cookie max age based on the preference

## Additional Resources

- [Strapi Authentication Documentation](https://docs.strapi.io/dev-docs/plugins/users-permissions)
- [Next.js Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)

