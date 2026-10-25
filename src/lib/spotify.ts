import { createServerFn } from '@tanstack/react-start';

import type { TTimeRange } from '@/types';
import { spotifyFetch } from './spotify.server';

const timeRanges = ['long_term', 'medium_term', 'short_term'] as const;
const idPattern = /^[A-Za-z0-9]+$/;

function validateId(id: unknown) {
  if (typeof id !== 'string' || !idPattern.test(id))
    throw new Error('Invalid Spotify ID');
  return id;
}

function validateListInput(data: { limit: unknown; timeRange?: unknown }) {
  const limit = Number(data.limit);
  if (!Number.isInteger(limit) || limit < 1 || limit > 50)
    throw new Error('Invalid limit');
  if (
    data.timeRange !== undefined &&
    !timeRanges.includes(data.timeRange as TTimeRange)
  )
    throw new Error('Invalid time range');
  return {
    limit: String(limit),
    timeRange: data.timeRange as TTimeRange | undefined,
  };
}

export const getMe = createServerFn({ method: 'GET' }).handler(() =>
  spotifyFetch<SpotifyApi.CurrentUsersProfileResponse>('/v1/me')
);

export const getTopArtists = createServerFn({ method: 'GET' })
  .validator((data: { limit: string; timeRange: TTimeRange }) => {
    const valid = validateListInput(data);
    if (!valid.timeRange) throw new Error('Missing time range');
    return { limit: valid.limit, timeRange: valid.timeRange };
  })
  .handler(
    async ({ data }) =>
      (
        await spotifyFetch<SpotifyApi.UsersTopArtistsResponse>(
          `/v1/me/top/artists?limit=${data.limit}&time_range=${data.timeRange}`
        )
      ).items
  );

export const getTopTracks = createServerFn({ method: 'GET' })
  .validator((data: { limit: string; timeRange: TTimeRange }) => {
    const valid = validateListInput(data);
    if (!valid.timeRange) throw new Error('Missing time range');
    return { limit: valid.limit, timeRange: valid.timeRange };
  })
  .handler(
    async ({ data }) =>
      (
        await spotifyFetch<SpotifyApi.UsersTopTracksResponse>(
          `/v1/me/top/tracks?limit=${data.limit}&time_range=${data.timeRange}`
        )
      ).items
  );

export const getRecentlyPlayed = createServerFn({ method: 'GET' })
  .validator(
    (data: { limit: string }) => validateListInput(data) as { limit: string }
  )
  .handler(
    async ({ data }) =>
      (
        await spotifyFetch<SpotifyApi.UsersRecentlyPlayedTracksResponse>(
          `/v1/me/player/recently-played?limit=${data.limit}`
        )
      ).items
  );

export const getArtist = createServerFn({ method: 'GET' })
  .validator(validateId)
  .handler(({ data }) =>
    spotifyFetch<SpotifyApi.SingleArtistResponse>(
      `/v1/artists/${encodeURIComponent(data)}`
    )
  );

export const getIsFollowingArtist = createServerFn({ method: 'GET' })
  .validator(validateId)
  .handler(
    async ({ data }) =>
      (
        await spotifyFetch<boolean[]>(
          `/v1/me/following/contains?type=artist&ids=${encodeURIComponent(data)}`
        )
      )[0]
  );

export const getPlaylists = createServerFn({ method: 'GET' }).handler(
  async () =>
    (
      await spotifyFetch<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(
        '/v1/me/playlists'
      )
    ).items
);

export const getPlaylist = createServerFn({ method: 'GET' })
  .validator(validateId)
  .handler(({ data }) =>
    spotifyFetch<SpotifyApi.SinglePlaylistResponse>(
      `/v1/playlists/${encodeURIComponent(data)}`
    )
  );

export const getTrack = createServerFn({ method: 'GET' })
  .validator(validateId)
  .handler(({ data }) =>
    spotifyFetch<SpotifyApi.SingleTrackResponse>(
      `/v1/tracks/${encodeURIComponent(data)}`
    )
  );

export const getAudioFeatures = createServerFn({ method: 'GET' })
  .validator(validateId)
  .handler(async ({ data }) => {
    try {
      return await spotifyFetch<SpotifyApi.AudioFeaturesResponse>(
        `/v1/audio-features/${encodeURIComponent(data)}`
      );
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized')
        throw error;
      return null;
    }
  });

export const setFollowing = createServerFn({ method: 'POST' })
  .validator((data: { id: string; follow: boolean }) => ({
    id: validateId(data.id),
    follow: Boolean(data.follow),
  }))
  .handler(async ({ data }) => {
    await spotifyFetch<void>('/v1/me/following?type=artist', {
      method: data.follow ? 'PUT' : 'DELETE',
      body: JSON.stringify([data.id]),
      headers: { 'content-type': 'application/json' },
    });
  });
