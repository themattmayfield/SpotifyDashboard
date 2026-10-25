import { redirect } from '@tanstack/react-router';
import { getCookie } from '@tanstack/react-start/server';

import { spotifyBaseUrl } from '@/constants';
import { refreshAccessToken } from './auth.server';

export async function spotifyFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  let token = getCookie('access_token') ?? (await refreshAccessToken());
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
  if (!response.ok)
    throw new Error(`Spotify request failed (${response.status})`);
  return response.status === 204
    ? (undefined as T)
    : (response.json() as Promise<T>);
}
