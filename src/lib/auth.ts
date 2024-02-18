'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse, type NextRequest } from 'next/server';

import { generateRandomString } from './generateRandomString';

const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

if (typeof client_id !== 'string') {
  throw new Error('No clientID');
}

const redirect_uri = `${process.env.WEB_URL}/api/callback`;
const scope = [
  'user-read-private',
  'user-read-email',
  'user-read-recently-played',
  'user-top-read',
  'user-follow-read',
  'user-follow-modify',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
].join(',');
const tokenUrl = 'https://accounts.spotify.com/api/token';
const headers = {
  'content-type': 'application/x-www-form-urlencoded',
  Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString(
    'base64',
  )}`,
};
export const login = async () => {
  const state = generateRandomString(16);

  const params = {
    response_type: 'code',
    client_id,
    scope,
    redirect_uri,
    state,
  };
  const queryParamString = new URLSearchParams(params);

  const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

  redirect(LOGIN_URL);
};

export const logout = async () => {
  cookies().set('access_token', '', { expires: new Date(0) });
  cookies().set('refresh_token', '', { expires: new Date(0) });
  redirect('/login');
};
export const requestAccessToken = async (code: string) => {
  const queryParamString = new URLSearchParams({
    code,
    redirect_uri,
    grant_type: 'authorization_code',
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers,
    body: queryParamString.toString(),
  });
  const res = await response.json();

  cookies().set('access_token', res.access_token, { maxAge: res.expires_in });
  cookies().set('refresh_token', res.refresh_token);

  return res;
};

export const updateSession = async (request: NextRequest) => {
  const access_token = request.cookies.get('access_token')?.value;
  const refresh_token = request.cookies.get('refresh_token')?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  if (isLoginPage) {
    return;
  }

  if (!access_token && !refresh_token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!access_token && !!refresh_token) {
    // refresh token that has been previously stored
    const queryParamString = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
      client_id,
    });

    const body = await fetch(tokenUrl, {
      method: 'POST',
      headers,
      body: queryParamString.toString(),
    });

    const response = await body.json();

    const res = NextResponse.next();

    res.cookies.set({
      name: 'access_token',
      value: response.access_token,
      maxAge: response.expires_in,
    });
    response.refresh_token &&
      res.cookies.set({ name: 'refresh_token', value: response.refresh_token });

    return res;
  }
  const res = NextResponse.next();
  refresh_token &&
    res.cookies.set({
      name: 'refresh_token',
      value: refresh_token!,
      maxAge: 2147483647,
    });
  return res;
};
