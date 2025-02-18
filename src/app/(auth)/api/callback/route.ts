import { requestAccessToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code') || null;
  const state = searchParams.get('state') || null;

  if (state === null || code === null) {
    return new Response('Something went wrong', {
      status: 500,
    });
  }

  await requestAccessToken(code);

  redirect('/');
}
