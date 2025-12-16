import { removeAuthToken } from '@/lib/cookies';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await removeAuthToken();
  const url = new URL('/login', request.url);
  url.searchParams.set('error', 'unauthorized');
  return NextResponse.redirect(url);
}

