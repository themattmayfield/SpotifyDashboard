import { queryOptions } from '@tanstack/react-query';

import type { TTimeRange } from '@/types';
import {
  getArtist,
  getAudioFeatures,
  getIsFollowingArtist,
  getMe,
  getPlaylist,
  getPlaylists,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks,
  getTrack,
} from './spotify';

const fiveMinutes = 5 * 60_000;

export const spotifyQueries = {
  all: ['spotify'] as const,
  me: () =>
    queryOptions({
      queryKey: ['spotify', 'me'] as const,
      queryFn: () => getMe(),
      staleTime: fiveMinutes,
    }),
  topArtists: (input: { limit: string; timeRange: TTimeRange }) =>
    queryOptions({
      queryKey: ['spotify', 'topArtists', input] as const,
      queryFn: () => getTopArtists({ data: input }),
      staleTime: fiveMinutes,
    }),
  topTracks: (input: { limit: string; timeRange: TTimeRange }) =>
    queryOptions({
      queryKey: ['spotify', 'topTracks', input] as const,
      queryFn: () => getTopTracks({ data: input }),
      staleTime: fiveMinutes,
    }),
  recentlyPlayed: (input: { limit: string }) =>
    queryOptions({
      queryKey: ['spotify', 'recentlyPlayed', input] as const,
      queryFn: () => getRecentlyPlayed({ data: input }),
      staleTime: 30_000,
    }),
  artist: (id: string) =>
    queryOptions({
      queryKey: ['spotify', 'artist', id] as const,
      queryFn: () => getArtist({ data: id }),
      staleTime: fiveMinutes,
    }),
  following: (id: string) =>
    queryOptions({
      queryKey: ['spotify', 'following', id] as const,
      queryFn: () => getIsFollowingArtist({ data: id }),
      staleTime: 30_000,
    }),
  playlists: () =>
    queryOptions({
      queryKey: ['spotify', 'playlists'] as const,
      queryFn: () => getPlaylists(),
      staleTime: fiveMinutes,
    }),
  playlist: (id: string) =>
    queryOptions({
      queryKey: ['spotify', 'playlist', id] as const,
      queryFn: () => getPlaylist({ data: id }),
      staleTime: fiveMinutes,
    }),
  track: (id: string) =>
    queryOptions({
      queryKey: ['spotify', 'track', id] as const,
      queryFn: () => getTrack({ data: id }),
      staleTime: fiveMinutes,
    }),
  audioFeatures: (id: string) =>
    queryOptions({
      queryKey: ['spotify', 'audioFeatures', id] as const,
      queryFn: () => getAudioFeatures({ data: id }),
      staleTime: fiveMinutes,
    }),
};
