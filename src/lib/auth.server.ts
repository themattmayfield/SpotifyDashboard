import { spotifyTokenUrl } from '@/constants';
import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server';
import { generateRandomString } from './generateRandomString';

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
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
].join(' ');
const authHeader = () =>
  `Basic ${Buffer.from(`${clientId()}:${clientSecret()}`).toString('base64')}`;

export function createLoginUrl() {
  if (!clientId()) throw new Error('Missing SPOTIFY_CLIENT_ID');
  const state = generateRandomString(32);
  setCookie('spotify_oauth_state', state, { ...cookieOptions, maxAge: 600 });
  return `https://accounts.spotify.com/authorize?${new URLSearchParams({ response_type: 'code', client_id: clientId(), scope, redirect_uri: redirectUri(), state })}`;
}
export async function refreshAccessToken(refresh = getCookie('refresh_token')) {
  if (!refresh || !clientId() || !clientSecret()) return null;
  const response = await fetch(spotifyTokenUrl, {
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
  if (!response.ok) {
    clearAuthCookies();
    return null;
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
  for (const name of ['access_token', 'refresh_token', 'spotify_oauth_state'])
    deleteCookie(name, { path: '/' });
}
export async function ensureAccessToken() {
  const accessToken = getCookie('access_token');
  if (!accessToken) return refreshAccessToken();
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (response.ok) return accessToken;
  if (response.status === 401) return refreshAccessToken();
  return accessToken;
}
