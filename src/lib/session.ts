// src/lib/session.ts
import { getCookie, setCookie, deleteCookie } from 'vinxi/http';

export interface SpotifyTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Cookie names
const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

// Get access token from cookies
export function getAccessToken(): string | undefined {
  return getCookie(ACCESS_TOKEN_COOKIE);
}

// Get refresh token from cookies
export function getRefreshToken(): string | undefined {
  return getCookie(REFRESH_TOKEN_COOKIE);
}

// Set tokens in cookies
export function setTokens(tokens: SpotifyTokens) {
  setCookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    maxAge: tokens.expiresIn,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  setCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    maxAge: 2147483647, // Max age for refresh token
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

// Clear session (logout)
export function clearSession() {
  deleteCookie(ACCESS_TOKEN_COOKIE);
  deleteCookie(REFRESH_TOKEN_COOKIE);
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  return !!(accessToken || refreshToken);
}
