import { redirect } from '@tanstack/react-router';

import { spotifyBaseUrl } from '@/constants';
import { getAccessToken, refreshAccessToken } from './auth.server';

export class SpotifyApiError extends Error {
  constructor(public readonly status: number) {
    super(`Spotify request failed (${status})`);
    this.name = 'SpotifyApiError';
  }
}

const maxRetryAfterSeconds = 3;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function spotifyFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  let token = (await getAccessToken()) ?? (await refreshAccessToken());
  if (!token) throw redirect({ to: '/login' });
  const request = () =>
    fetch(`${spotifyBaseUrl}${path}`, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${token}` },
    });
  let response = await request();
  if (response.status === 401) {
    token = await refreshAccessToken();
    if (!token) throw redirect({ to: '/login' });
    response = await request();
  }
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get('retry-after') ?? 1);
    if (retryAfter <= maxRetryAfterSeconds) {
      await wait(retryAfter * 1000);
      response = await request();
    }
  }
  if (!response.ok) throw new SpotifyApiError(response.status);
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** Resolves to null when Spotify rejects the request with one of `statuses`. */
export async function spotifyFetchOrNull<T>(
  path: string,
  statuses: number[] = [403, 404]
): Promise<T | null> {
  try {
    return await spotifyFetch<T>(path);
  } catch (error) {
    if (error instanceof SpotifyApiError && statuses.includes(error.status))
      return null;
    throw error;
  }
}
