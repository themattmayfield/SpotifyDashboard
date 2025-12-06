// src/lib/actions.server.ts
import { createServerFn } from '@tanstack/react-start';
import { followArtist, unfollowArtists } from './spotify';

export const followArtistFn = createServerFn({ method: 'POST' })
  .inputValidator((input: { artistId: string }) => input)
  .handler(async ({ data }) => {
    await followArtist([data.artistId]);
    return { success: true };
  });

export const unfollowArtistFn = createServerFn({ method: 'POST' })
  .inputValidator((input: { artistId: string }) => input)
  .handler(async ({ data }) => {
    await unfollowArtists([data.artistId]);
    return { success: true };
  });
