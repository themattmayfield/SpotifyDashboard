import { createServerFn } from '@tanstack/react-start';

import { type TTimeRange, timeRanges } from '@/types';
import type { Playback, PlaybackControlResult } from '@/types';
import {
  toArtist,
  toPlayedTrack,
  toPlaylist,
  toPlaylistDetail,
  toTrack,
  toUser,
} from './normalize';
import {
  SpotifyApiError,
  spotifyFetch,
  spotifyFetchOrNull,
} from './spotify.server';

// Lists are always fetched at Spotify's max page size so the home page
// previews and the "See All" pages share one cache entry per time range.
const pageSize = 50;
const idPattern = /^[A-Za-z0-9]+$/;

function validateId(id: unknown) {
  if (typeof id !== 'string' || !idPattern.test(id))
    throw new Error('Invalid Spotify ID');
  return id;
}

function validateRange(range: unknown) {
  if (!timeRanges.includes(range as TTimeRange))
    throw new Error('Invalid time range');
  return range as TTimeRange;
}

export const getMe = createServerFn({ method: 'GET' }).handler(async () =>
  toUser(await spotifyFetch<SpotifyApi.CurrentUsersProfileResponse>('/v1/me'))
);

export const getTopArtists = createServerFn({ method: 'GET' })
  .validator(validateRange)
  .handler(async ({ data }) => {
    const response = await spotifyFetch<SpotifyApi.UsersTopArtistsResponse>(
      `/v1/me/top/artists?limit=${pageSize}&time_range=${data}`
    );
    return response.items.map(toArtist);
  });

export const getTopTracks = createServerFn({ method: 'GET' })
  .validator(validateRange)
  .handler(async ({ data }) => {
    const response = await spotifyFetch<SpotifyApi.UsersTopTracksResponse>(
      `/v1/me/top/tracks?limit=${pageSize}&time_range=${data}`
    );
    return response.items.map(toTrack);
  });

export const getRecentlyPlayed = createServerFn({ method: 'GET' }).handler(
  async () => {
    const response =
      await spotifyFetch<SpotifyApi.UsersRecentlyPlayedTracksResponse>(
        `/v1/me/player/recently-played?limit=${pageSize}`
      );
    return response.items.map(toPlayedTrack);
  }
);

export const getArtist = createServerFn({ method: 'GET' })
  .validator(validateId)
  .handler(async ({ data }) =>
    toArtist(
      await spotifyFetch<SpotifyApi.SingleArtistResponse>(`/v1/artists/${data}`)
    )
  );

/** Resolves to null when neither the library nor the legacy follow API is available. */
export const getIsFollowingArtist = createServerFn({ method: 'GET' })
  .validator(validateId)
  .handler(async ({ data }) => {
    const uri = encodeURIComponent(`spotify:artist:${data}`);
    const result =
      (await spotifyFetchOrNull<boolean[]>(
        `/v1/me/library/contains?uris=${uri}`
      )) ??
      (await spotifyFetchOrNull<boolean[]>(
        `/v1/me/following/contains?type=artist&ids=${data}`
      ));
    return result?.[0] ?? null;
  });

export const setFollowing = createServerFn({ method: 'POST' })
  .validator((data: { id: string; follow: boolean }) => ({
    id: validateId(data.id),
    follow: Boolean(data.follow),
  }))
  .handler(async ({ data }) => {
    const method = data.follow ? 'PUT' : 'DELETE';
    const uri = encodeURIComponent(`spotify:artist:${data.id}`);
    try {
      await spotifyFetch<void>(`/v1/me/library?uris=${uri}`, { method });
    } catch (error) {
      if (!(error instanceof SpotifyApiError) || error.status >= 500)
        throw error;
      await spotifyFetch<void>(`/v1/me/following?type=artist&ids=${data.id}`, {
        method,
      });
    }
  });

export const getPlaylists = createServerFn({ method: 'GET' }).handler(
  async () => {
    const response =
      await spotifyFetch<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(
        `/v1/me/playlists?limit=${pageSize}`
      );
    return response.items.map(toPlaylist);
  }
);

export const getPlaylist = createServerFn({ method: 'GET' })
  .validator(validateId)
  .handler(async ({ data }) =>
    toPlaylistDetail(
      await spotifyFetch<Parameters<typeof toPlaylistDetail>[0]>(
        `/v1/playlists/${data}`
      )
    )
  );

export const getTrack = createServerFn({ method: 'GET' })
  .validator(validateId)
  .handler(async ({ data }) =>
    toTrack(
      await spotifyFetch<SpotifyApi.SingleTrackResponse>(`/v1/tracks/${data}`)
    )
  );

type RawPlayback = SpotifyApi.CurrentPlaybackResponse & {
  item: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObject | null;
};

export const getCurrentPlayback = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Playback | null> => {
    const response = await spotifyFetch<RawPlayback | undefined>(
      '/v1/me/player'
    );
    if (!response?.item || response.item.type !== 'track') return null;
    return {
      isPlaying: response.is_playing,
      progressMs: response.progress_ms ?? 0,
      track: toTrack(response.item),
    };
  }
);

async function playbackControl(
  path: string,
  method: 'PUT' | 'POST',
  body?: object
): Promise<PlaybackControlResult> {
  try {
    await spotifyFetch<void>(path, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof SpotifyApiError && error.status === 404)
      return { ok: false, reason: 'no-device' };
    if (error instanceof SpotifyApiError && error.status === 403)
      return { ok: false, reason: 'premium-required' };
    throw error;
  }
}

export const setPlayback = createServerFn({ method: 'POST' })
  .validator((playing: unknown) => Boolean(playing))
  .handler(({ data }) =>
    playbackControl(`/v1/me/player/${data ? 'play' : 'pause'}`, 'PUT')
  );

export const skipPlayback = createServerFn({ method: 'POST' })
  .validator((direction: unknown) => {
    if (direction !== 'next' && direction !== 'previous')
      throw new Error('Invalid direction');
    return direction;
  })
  .handler(({ data }) => playbackControl(`/v1/me/player/${data}`, 'POST'));

export const playTrack = createServerFn({ method: 'POST' })
  .validator(validateId)
  .handler(({ data }) =>
    playbackControl('/v1/me/player/play', 'PUT', {
      uris: [`spotify:track:${data}`],
    })
  );
