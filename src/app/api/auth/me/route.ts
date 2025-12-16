import { getUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * API route for client components to fetch the current authenticated user.
 * Returns the user object if authenticated, or null if not.
 */
export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
