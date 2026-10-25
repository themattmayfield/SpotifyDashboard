import { redirect } from '@tanstack/react-router';

import { spotifyBaseUrl } from '@/constants';
import { getAccessToken, refreshAccessToken } from './auth.server';

export class SpotifyApiError extends Error {
  constructor(public readonly status: number) {
    super(`Spotify request failed (${status})`);
    this.name = 'SpotifyApiError';
  }
}

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
  if (!response.ok) throw new SpotifyApiError(response.status);
  return response.status === 204
    ? (undefined as T)
    : (response.json() as Promise<T>);
}
