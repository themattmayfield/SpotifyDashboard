// src/lib/auth.ts
import { createServerFn } from '@tanstack/react-start';
import { redirect } from '@tanstack/react-router';
import { spotifyTokenUrl } from '@/constants';
import { generateRandomString } from './generateRandomString';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearSession,
} from './session';

const client_id = process.env.SPOTIFY_CLIENT_ID || '';
const client_secret = process.env.SPOTIFY_CLIENT_SECRET || '';
const APP_URL = process.env.VITE_APP_URL || 'http://localhost:3000';

const redirect_uri = `${APP_URL}/callback`;
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

const authHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
};

// Server function to initiate login - redirects to Spotify OAuth
export const loginFn = createServerFn({ method: 'POST' }).handler(async () => {
  const state = generateRandomString(16);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri,
    state,
  });

  const LOGIN_URL = `https://accounts.spotify.com/authorize?${params.toString()}`;

  throw redirect({ href: LOGIN_URL });
});

// Server function to handle logout
export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  clearSession();
  throw redirect({ to: '/login' });
});

// Function to exchange code for tokens (called from callback route)
export async function exchangeCodeForTokens(code: string) {
  const response = await fetch(spotifyTokenUrl, {
    method: 'POST',
    headers: authHeaders,
    body: new URLSearchParams({
      code,
      redirect_uri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Token exchange failed:', error);
    throw new Error('Failed to exchange code for tokens');
  }

  const tokens = await response.json();

  setTokens({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresIn: tokens.expires_in,
  });

  return tokens;
}

// Function to refresh access token
export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(spotifyTokenUrl, {
    method: 'POST',
    headers: authHeaders,
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id,
    }),
  });

  if (!response.ok) {
    clearSession();
    throw new Error('Failed to refresh token');
  }

  const tokens = await response.json();

  setTokens({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || refreshToken,
    expiresIn: tokens.expires_in,
  });

  return tokens;
}

// Server function to get current session status
export const getSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken && !refreshToken) {
      return { authenticated: false as const };
    }

    // If we have a refresh token but no access token, try to refresh
    if (!accessToken && refreshToken) {
      try {
        await refreshAccessToken();
        return {
          authenticated: true as const,
          accessToken: getAccessToken(),
        };
      } catch {
        return { authenticated: false as const };
      }
    }

    return {
      authenticated: true as const,
      accessToken,
    };
  }
);

// Helper function to get valid access token (with auto-refresh)
export async function getValidAccessToken(): Promise<string | null> {
  let accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken && !refreshToken) {
    return null;
  }

  if (!accessToken && refreshToken) {
    try {
      await refreshAccessToken();
      accessToken = getAccessToken();
    } catch {
      return null;
    }
  }

  return accessToken || null;
}
