import { spotifyTokenUrl } from '@/constants';
import {
  deleteCookie,
  getCookie,
  getRequest,
  setCookie,
} from '@tanstack/react-start/server';
import { generateRandomString } from './generateRandomString';
import { sanitizeReturnTo } from './returnTo';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};
const clientId = () => process.env.SPOTIFY_CLIENT_ID ?? '';
const clientSecret = () => process.env.SPOTIFY_CLIENT_SECRET ?? '';
export const redirectUri = () =>
  process.env.SPOTIFY_REDIRECT_URI ??
  `${process.env.WEB_URL ?? process.env.NEXT_PUBLIC_WEB_URL ?? 'http://127.0.0.1:3002'}/api/callback`;
const scope = [
  'user-read-private',
  'user-read-email',
  'user-read-recently-played',
  'user-top-read',
  'user-follow-read',
  'user-follow-modify',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
].join(' ');
const authHeader = () =>
  `Basic ${Buffer.from(`${clientId()}:${clientSecret()}`).toString('base64')}`;
const refreshes = new WeakMap<Request, Promise<string | null>>();

export function createLoginUrl(returnTo?: unknown) {
  if (!clientId()) throw new Error('Missing SPOTIFY_CLIENT_ID');
  const state = generateRandomString(32);
  setCookie('spotify_oauth_state', state, { ...cookieOptions, maxAge: 600 });
  if (returnTo !== undefined) setReturnTo(returnTo);
  return `https://accounts.spotify.com/authorize?${new URLSearchParams({ response_type: 'code', client_id: clientId(), scope, redirect_uri: redirectUri(), state })}`;
}
export function setReturnTo(value: unknown) {
  setCookie('spotify_return_to', sanitizeReturnTo(value), {
    ...cookieOptions,
    maxAge: 600,
  });
}
export function consumeReturnTo() {
  const value = sanitizeReturnTo(getCookie('spotify_return_to'));
  deleteCookie('spotify_return_to', { path: '/' });
  return value;
}
async function requestRefreshedAccessToken(refresh: string) {
  let response: Response;
  try {
    response = await fetch(spotifyTokenUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: authHeader(),
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh,
        client_id: clientId(),
      }),
    });
  } catch (error) {
    throw new Error('Spotify token refresh failed', { cause: error });
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    if (response.status === 400 && body?.error === 'invalid_grant') {
      clearAuthCookies();
      return null;
    }
    throw new Error(`Spotify token refresh failed (${response.status})`);
  }
  const tokens = (await response.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
  };
  setCookie('access_token', tokens.access_token, {
    ...cookieOptions,
    maxAge: tokens.expires_in,
  });
  setCookie('refresh_token', tokens.refresh_token ?? refresh, {
    ...cookieOptions,
    maxAge: 2_147_483_647,
  });
  return tokens.access_token;
}

export async function refreshAccessToken(refresh = getCookie('refresh_token')) {
  if (!refresh || !clientId() || !clientSecret()) return null;
  const request = getRequest();
  const existing = refreshes.get(request);
  if (existing) return existing;
  const pending = requestRefreshedAccessToken(refresh);
  refreshes.set(request, pending);
  return pending;
}

export function getAccessToken() {
  const refreshed = refreshes.get(getRequest());
  return refreshed ?? Promise.resolve(getCookie('access_token') ?? null);
}
export async function exchangeCode(code: string) {
  const response = await fetch(spotifyTokenUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: authHeader(),
    },
    body: new URLSearchParams({
      code,
      redirect_uri: redirectUri(),
      grant_type: 'authorization_code',
    }),
  });
  if (!response.ok) throw new Error('Spotify token exchange failed');
  const tokens = (await response.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token: string;
  };
  setCookie('access_token', tokens.access_token, {
    ...cookieOptions,
    maxAge: tokens.expires_in,
  });
  setCookie('refresh_token', tokens.refresh_token, {
    ...cookieOptions,
    maxAge: 2_147_483_647,
  });
}
export function validOAuthState(state: string | null) {
  const expected = getCookie('spotify_oauth_state');
  deleteCookie('spotify_oauth_state', { path: '/' });
  return !!state && !!expected && state === expected;
}
export function clearAuthCookies() {
  for (const name of [
    'access_token',
    'refresh_token',
    'spotify_oauth_state',
    'spotify_return_to',
  ])
    deleteCookie(name, { path: '/' });
}
export async function ensureAccessToken() {
  return (await getAccessToken()) ?? refreshAccessToken();
}
