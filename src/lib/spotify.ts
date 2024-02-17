import type { TTimeRange } from '@/types';
import { cookies } from 'next/headers';

const baseUrl = 'https://api.spotify.com';

export const getRecentlyPlayed = async ({
  limit,
}: {
  limit: string;
}): Promise<SpotifyApi.PlayHistoryObject[]> => {
  const accessToken = cookies().get('access_token');
  const headers = {
    Authorization: `Bearer ${accessToken?.value}`,
    'Content-Type': 'application/json',
  };
  const res = await fetch(
    `${baseUrl}/v1/me/player/recently-played?limit=${limit}`,
    {
      headers,
    },
  );
  const data = await res.json();
  return data.items;
};

export const getTopTracks = async ({
  limit,
  timeRange,
}: {
  limit: string;
  timeRange: TTimeRange;
}): Promise<SpotifyApi.TrackObjectFull[]> => {
  const accessToken = cookies().get('access_token');
  const headers = {
    Authorization: `Bearer ${accessToken?.value}`,
    'Content-Type': 'application/json',
  };
  const res = await fetch(
    `${baseUrl}/v1/me/top/tracks?limit=${limit}&time_range=${timeRange}`,
    {
      headers,
    },
  );
  const data = await res.json();
  return data.items;
};

///////// ARTIST
export const getTopArtists = async ({
  limit,
  timeRange,
}: {
  limit: string;
  timeRange: TTimeRange;
}): Promise<SpotifyApi.ArtistObjectFull[]> => {
  const accessToken = cookies().get('access_token');
  const headers = {
    Authorization: `Bearer ${accessToken?.value}`,
    'Content-Type': 'application/json',
  };
  const res = await fetch(
    `${baseUrl}/v1/me/top/artists?limit=${limit}&time_range=${timeRange}`,
    {
      headers,
    },
  );
  const data = await res.json();
  return data.items;
};
export const getArtist = async (
  id: string,
): Promise<SpotifyApi.SingleArtistResponse> => {
  const accessToken = cookies().get('access_token');
  const headers = {
    Authorization: `Bearer ${accessToken?.value}`,
    'Content-Type': 'application/json',
  };
  const res = await fetch(`${baseUrl}/v1/artists/${id}`, {
    headers,
  });
  const data = await res.json();
  return data;
};

export const getIsFollowingArtists = async ({
  type,
  id,
}: {
  type: 'artist' | 'user';
  id: string;
}): Promise<SpotifyApi.UserFollowsUsersOrArtistsResponse> => {
  const accessToken = cookies().get('access_token');
  const headers = {
    Authorization: `Bearer ${accessToken?.value}`,
    'Content-Type': 'application/json',
  };
  const res = await fetch(
    `${baseUrl}/v1/me/following/contains?type=${type}&ids=${id}`,
    {
      headers,
    },
  );
  const data = await res.json();
  return data.at(0);
};

export const followArtist = async (ids: string[]) => {
  const accessToken = cookies().get('access_token');
  const headers = {
    Authorization: `Bearer ${accessToken?.value}`,
    'Content-Type': 'application/json',
  };
  await fetch(`${baseUrl}/v1/me/following?type=artist`, {
    method: 'PUT',
    body: JSON.stringify(ids),
    headers,
  });
};
export const unfollowArtists = async (ids: string[]) => {
  const accessToken = cookies().get('access_token');
  const headers = {
    Authorization: `Bearer ${accessToken?.value}`,
    'Content-Type': 'application/json',
  };
  await fetch(`${baseUrl}/v1/me/following?type=artist`, {
    method: 'DELETE',
    body: JSON.stringify(ids),
    headers,
  });
};

//////// ME

export const getMe =
  async (): Promise<SpotifyApi.CurrentUsersProfileResponse> => {
    const accessToken = cookies().get('access_token');
    const headers = {
      Authorization: `Bearer ${accessToken?.value}`,
      'Content-Type': 'application/json',
    };
    const res = await fetch(`${baseUrl}/v1/me`, {
      headers,
    });
    const data = await res.json();
    return data;
  };

/// Playlist
export const getUserPlaylists = async (): Promise<
  SpotifyApi.ListOfCurrentUsersPlaylistsResponse['items']
> => {
  const accessToken = cookies().get('access_token');
  const headers = {
    Authorization: `Bearer ${accessToken?.value}`,
    'Content-Type': 'application/json',
  };
  const res = await fetch(`${baseUrl}/v1/me/playlists`, {
    headers,
  });
  const data = await res.json();
  return data.items;
};

export const getPlaylist = async (
  id: string,
): Promise<SpotifyApi.SinglePlaylistResponse> => {
  const accessToken = cookies().get('access_token');
  const headers = {
    Authorization: `Bearer ${accessToken?.value}`,
    'Content-Type': 'application/json',
  };
  const res = await fetch(`${baseUrl}/v1/playlists/${id}`, {
    headers,
  });
  const data = await res.json();

  return data;
};

//// TRACK
export const getTrack = async (
  id: string,
): Promise<SpotifyApi.SingleTrackResponse> => {
  const accessToken = cookies().get('access_token');
  const headers = {
    Authorization: `Bearer ${accessToken?.value}`,
    'Content-Type': 'application/json',
  };
  const res = await fetch(`${baseUrl}/v1/tracks/${id}`, {
    headers,
  });
  const data = await res.json();

  return data;
};
export const getAudioFeaturesForTrack = async (
  id: string,
): Promise<SpotifyApi.SingleTrackResponse> => {
  const accessToken = cookies().get('access_token');
  const headers = {
    Authorization: `Bearer ${accessToken?.value}`,
    'Content-Type': 'application/json',
  };
  const res = await fetch(`${baseUrl}/v1/audio-features/${id}`, {
    headers,
  });
  const data = await res.json();

  return data;
};
