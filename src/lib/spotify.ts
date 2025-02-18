import type { TTimeRange } from '@/types';

import fetchWrapper from './fetchWrapper';

export const getRecentlyPlayed = async ({
  limit,
}: {
  limit: string;
}): Promise<SpotifyApi.PlayHistoryObject[]> => {
  const res = await fetchWrapper(
    `/v1/me/player/recently-played?limit=${limit}`
  );
  const data = res.data;
  return data.items;
};
export const getTopTracks = async ({
  limit,
  timeRange,
}: {
  limit: string;
  timeRange: TTimeRange;
}): Promise<SpotifyApi.TrackObjectFull[]> => {
  const res = await fetchWrapper(
    `/v1/me/top/tracks?limit=${limit}&time_range=${timeRange}`
  );
  const data = res.data;
  return data.items;
};
export const getTopArtists = async ({
  limit,
  timeRange,
}: {
  limit: string;
  timeRange: TTimeRange;
}): Promise<SpotifyApi.ArtistObjectFull[]> => {
  const res = await fetchWrapper(
    `/v1/me/top/artists?limit=${limit}&time_range=${timeRange}`
  );
  const data = res.data;
  return data.items;
};
export const getArtist = async (
  id: string
): Promise<SpotifyApi.SingleArtistResponse> => {
  const res = await fetchWrapper(`/v1/artists/${id}`);
  const data = res.data;
  return data;
};
export const getIsFollowingArtists = async ({
  type,
  id,
}: {
  type: 'artist' | 'user';
  id: string;
}): Promise<SpotifyApi.UserFollowsUsersOrArtistsResponse> => {
  const res = await fetchWrapper(
    `/v1/me/following/contains?type=${type}&ids=${id}`
  );
  const data = res.data;

  return data.at(0);
};
export const followArtist = async (ids: string[]) => {
  await fetchWrapper('/v1/me/following?type=artist', {
    method: 'PUT',
    body: JSON.stringify(ids),
  });
};
export const unfollowArtists = async (ids: string[]) => {
  await fetchWrapper('/v1/me/following?type=artist', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  });
};
export const getMe =
  async (): Promise<SpotifyApi.CurrentUsersProfileResponse> => {
    const res = await fetchWrapper('/v1/me');
    const data = res.data;
    return data;
  };
export const getUserPlaylists = async (): Promise<
  SpotifyApi.ListOfCurrentUsersPlaylistsResponse['items']
> => {
  const res = await fetchWrapper('/v1/me/playlists');
  const data = res.data;
  return data.items;
};
export const getPlaylist = async (
  id: string
): Promise<SpotifyApi.SinglePlaylistResponse> => {
  const res = await fetchWrapper(`/v1/playlists/${id}`);
  const data = res.data;

  return data;
};
export const getTrack = async (
  id: string
): Promise<SpotifyApi.SingleTrackResponse> => {
  const res = await fetchWrapper(`/v1/tracks/${id}`);
  const data = res.data;

  return data;
};
export const getAudioFeaturesForTrack = async (
  id: string
): Promise<SpotifyApi.SingleTrackResponse> => {
  const res = await fetchWrapper(`/v1/audio-features/${id}`);
  const data = res.data;

  return data;
};
