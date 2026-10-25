import type { User } from '@/types';
import { getRequest } from '@tanstack/react-start/server';
import { toUser } from './normalize';
import { spotifyFetch } from './spotify.server';

const identities = new WeakMap<Request, Promise<User>>();

export function currentUser() {
  const request = getRequest();
  const existing = identities.get(request);
  if (existing) return existing;
  const pending =
    spotifyFetch<SpotifyApi.CurrentUsersProfileResponse>('/v1/me').then(toUser);
  identities.set(request, pending);
  return pending;
}
