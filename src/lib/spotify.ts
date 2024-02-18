import type { TTimeRange } from '@/types';

import fetchWrapper from './fetchWrapper';
// const baseUrl = 'https://api.spotify.com';

export const spotifyApi = () => {
  return {
    getRecentlyPlayed: async ({
      limit,
    }: {
      limit: string;
    }): Promise<SpotifyApi.PlayHistoryObject[]> => {
      const res = await fetchWrapper(
        `/v1/me/player/recently-played?limit=${limit}`,
      );
      const data = res.data;
      return data.items;
    },
    getTopTracks: async ({
      limit,
      timeRange,
    }: {
      limit: string;
      timeRange: TTimeRange;
    }): Promise<SpotifyApi.TrackObjectFull[]> => {
      const res = await fetchWrapper(
        `/v1/me/top/tracks?limit=${limit}&time_range=${timeRange}`,
      );
      const data = res.data;
      return data.items;
    },
    getTopArtists: async ({
      limit,
      timeRange,
    }: {
      limit: string;
      timeRange: TTimeRange;
    }): Promise<SpotifyApi.ArtistObjectFull[]> => {
      const res = await fetchWrapper(
        `/v1/me/top/artists?limit=${limit}&time_range=${timeRange}`,
      );
      const data = res.data;
      return data.items;
    },
    getArtist: async (id: string): Promise<SpotifyApi.SingleArtistResponse> => {
      const res = await fetchWrapper(`/v1/artists/${id}`);
      const data = res.data;
      return data;
    },
    getIsFollowingArtists: async ({
      type,
      id,
    }: {
      type: 'artist' | 'user';
      id: string;
    }): Promise<SpotifyApi.UserFollowsUsersOrArtistsResponse> => {
      const res = await fetchWrapper(
        `/v1/me/following/contains?type=${type}&ids=${id}`,
      );
      const data = res.data;

      return data.at(0);
    },
    followArtist: async (ids: string[]) => {
      await fetchWrapper(`/v1/me/following?type=artist`, {
        method: 'PUT',
        body: JSON.stringify(ids),
      });
    },
    unfollowArtists: async (ids: string[]) => {
      await fetchWrapper(`/v1/me/following?type=artist`, {
        method: 'DELETE',
        body: JSON.stringify(ids),
      });
    },
    getMe: async (): Promise<SpotifyApi.CurrentUsersProfileResponse> => {
      const res = await fetchWrapper(`/v1/me`);
      const data = res.data;
      return data;
    },
    getUserPlaylists: async (): Promise<
      SpotifyApi.ListOfCurrentUsersPlaylistsResponse['items']
    > => {
      const res = await fetchWrapper(`/v1/me/playlists`);
      const data = res.data;
      return data.items;
    },
    getPlaylist: async (
      id: string,
    ): Promise<SpotifyApi.SinglePlaylistResponse> => {
      const res = await fetchWrapper(`/v1/playlists/${id}`);
      const data = res.data;

      return data;
    },
    getTrack: async (id: string): Promise<SpotifyApi.SingleTrackResponse> => {
      const res = await fetchWrapper(`/v1/tracks/${id}`);
      const data = res.data;

      return data;
    },
    getAudioFeaturesForTrack: async (
      id: string,
    ): Promise<SpotifyApi.SingleTrackResponse> => {
      const res = await fetchWrapper(`/v1/audio-features/${id}`);
      const data = res.data;

      return data;
    },
  };
};
