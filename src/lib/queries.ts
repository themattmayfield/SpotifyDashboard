import { type QueryClient, queryOptions } from '@tanstack/react-query';

import type {
  Artist,
  PlayedTrack,
  PlaylistDetail,
  TTimeRange,
  Track,
} from '@/types';
import {
  getArtist,
  getArtistAlbums,
  getCurrentPlayback,
  getIsFollowingArtist,
  getMe,
  getPlaylist,
  getPlaylists,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks,
  getTrack,
} from './spotify';

export const spotifyQueries = {
  me: () =>
    queryOptions({ queryKey: ['spotify', 'me'], queryFn: () => getMe() }),
  topArtists: (range: TTimeRange) =>
    queryOptions({
      queryKey: ['spotify', 'topArtists', range],
      queryFn: () => getTopArtists({ data: range }),
    }),
  topTracks: (range: TTimeRange) =>
    queryOptions({
      queryKey: ['spotify', 'topTracks', range],
      queryFn: () => getTopTracks({ data: range }),
    }),
  recentlyPlayed: () =>
    queryOptions({
      queryKey: ['spotify', 'recentlyPlayed'],
      queryFn: () => getRecentlyPlayed(),
      staleTime: 30_000,
    }),
  artist: (id: string) =>
    queryOptions({
      queryKey: ['spotify', 'artist', id],
      queryFn: () => getArtist({ data: id }),
    }),
  artistAlbums: (id: string) =>
    queryOptions({
      queryKey: ['spotify', 'artistAlbums', id],
      queryFn: () => getArtistAlbums({ data: id }),
    }),
  following: (id: string) =>
    queryOptions({
      queryKey: ['spotify', 'following', id],
      queryFn: () => getIsFollowingArtist({ data: id }),
      staleTime: 30_000,
    }),
  playlists: () =>
    queryOptions({
      queryKey: ['spotify', 'playlists'],
      queryFn: () => getPlaylists(),
    }),
  playlist: (id: string) =>
    queryOptions({
      queryKey: ['spotify', 'playlist', id],
      queryFn: () => getPlaylist({ data: id }),
    }),
  track: (id: string) =>
    queryOptions({
      queryKey: ['spotify', 'track', id],
      queryFn: () => getTrack({ data: id }),
    }),
  playback: () =>
    queryOptions({
      queryKey: ['spotify', 'playback'],
      queryFn: () => getCurrentPlayback(),
    }),
};

type Source<T> = { key: string; find: (data: never) => T | undefined };

/**
 * Detail pages reuse objects already loaded by list queries so opening an
 * artist or track from a list renders without a second request.
 */
function fromCachedLists<T>(client: QueryClient, sources: Source<T>[]) {
  for (const { key, find } of sources) {
    for (const query of client.getQueryCache().findAll({
      queryKey: ['spotify', key],
    })) {
      const hit =
        query.state.data !== undefined && find(query.state.data as never);
      if (hit)
        return {
          initialData: hit,
          initialDataUpdatedAt: query.state.dataUpdatedAt,
        };
    }
  }
  return {};
}

export function cachedArtist(client: QueryClient, id: string) {
  return fromCachedLists<Artist>(client, [
    {
      key: 'topArtists',
      find: (data: Artist[]) => data.find((a) => a.id === id),
    },
  ]);
}

export function cachedTrack(client: QueryClient, id: string) {
  const byId = (track: Track) => track.id === id;
  return fromCachedLists<Track>(client, [
    { key: 'topTracks', find: (data: Track[]) => data.find(byId) },
    {
      key: 'recentlyPlayed',
      find: (data: PlayedTrack[]) => data.find((p) => byId(p.track))?.track,
    },
    {
      key: 'playlist',
      find: (data: PlaylistDetail) => data.tracks?.find(byId),
    },
  ]);
}
