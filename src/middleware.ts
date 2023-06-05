import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // return;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // console.log('token: ', token);
  const { pathname } = req.nextUrl;
  console.log('pathname: ', pathname);

  if (pathname.includes('/api/auth') || token) {
    // console.log('here in 1');

    return NextResponse.next();
  }
  // if (!token && pathname !== '/login') {
  //   return NextResponse.redirect(new URL('/login', req.url));
  // }
}
