import type { TTimeRange } from '@/types';
import { createServerFn } from '@tanstack/react-start';

type Args = {
  kind: string;
  id?: string;
  limit?: string;
  timeRange?: TTimeRange;
  follow?: boolean;
};
export const spotifyData = createServerFn({ method: 'GET' })
  .validator((data: Args) => data)
  .handler(async ({ data }) => {
    const { spotifyFetch } = await import('./spotify.server');
    switch (data.kind) {
      case 'recent':
        return (
          await spotifyFetch<SpotifyApi.UsersRecentlyPlayedTracksResponse>(
            `/v1/me/player/recently-played?limit=${data.limit}`
          )
        ).items;
      case 'topTracks':
        return (
          await spotifyFetch<SpotifyApi.UsersTopTracksResponse>(
            `/v1/me/top/tracks?limit=${data.limit}&time_range=${data.timeRange}`
          )
        ).items;
      case 'topArtists':
        return (
          await spotifyFetch<SpotifyApi.UsersTopArtistsResponse>(
            `/v1/me/top/artists?limit=${data.limit}&time_range=${data.timeRange}`
          )
        ).items;
      case 'artist':
        return spotifyFetch<SpotifyApi.SingleArtistResponse>(
          `/v1/artists/${data.id}`
        );
      case 'following':
        return (
          await spotifyFetch<boolean[]>(
            `/v1/me/following/contains?type=artist&ids=${data.id}`
          )
        )[0];
      case 'me':
        return spotifyFetch<SpotifyApi.CurrentUsersProfileResponse>('/v1/me');
      case 'playlists':
        return (
          await spotifyFetch<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(
            '/v1/me/playlists'
          )
        ).items;
      case 'playlist':
        return spotifyFetch<SpotifyApi.SinglePlaylistResponse>(
          `/v1/playlists/${data.id}`
        );
      case 'track':
        return spotifyFetch<SpotifyApi.SingleTrackResponse>(
          `/v1/tracks/${data.id}`
        );
      case 'audio':
        try {
          return await spotifyFetch<SpotifyApi.AudioFeaturesResponse>(
            `/v1/audio-features/${data.id}`
          );
        } catch {
          return null;
        }
      default:
        throw new Error('Unknown Spotify query');
    }
  });
export const setFollowing = createServerFn({ method: 'POST' })
  .validator((data: { id: string; follow: boolean }) => data)
  .handler(async ({ data }) => {
    const { spotifyFetch } = await import('./spotify.server');
    await spotifyFetch<void>('/v1/me/following?type=artist', {
      method: data.follow ? 'PUT' : 'DELETE',
      body: JSON.stringify([data.id]),
      headers: { 'content-type': 'application/json' },
    });
  });
