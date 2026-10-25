import type {
  Artist,
  PlayedTrack,
  Playlist,
  PlaylistDetail,
  Track,
  User,
} from '@/types';

// Spotify trims fields for Development Mode apps (followers, popularity) and
// renamed playlist `tracks` to `items`, so every field is read defensively.

type RawImage = { url: string; width?: number | null };
type RawArtist = SpotifyApi.ArtistObjectFull;
type RawTrack = SpotifyApi.TrackObjectFull;
type RawPlaylistEntry = {
  item?: RawTrack | SpotifyApi.EpisodeObject | null;
  track?: RawTrack | SpotifyApi.EpisodeObject | null;
};
type RawPlaylist = Omit<SpotifyApi.PlaylistObjectSimplified, 'tracks'> & {
  tracks?: { total?: number; items?: RawPlaylistEntry[] };
  items?: { total?: number; items?: RawPlaylistEntry[] };
};

/** Smallest image at least `minWidth` wide; Spotify lists images largest first. */
function pickImage(images: RawImage[] | null | undefined, minWidth?: number) {
  if (!images?.length) return null;
  if (!minWidth) return images[0].url;
  const fitting = images.filter((image) => (image.width ?? 640) >= minWidth);
  return (fitting.at(-1) ?? images[0]).url;
}

export function toArtist(raw: RawArtist): Artist {
  return {
    id: raw.id,
    name: raw.name,
    image: pickImage(raw.images),
    thumb: pickImage(raw.images, 300),
    genres: raw.genres ?? [],
    followers: raw.followers?.total ?? null,
    popularity: raw.popularity ?? null,
    url: raw.external_urls?.spotify ?? null,
  };
}

export function toTrack(raw: RawTrack): Track {
  return {
    id: raw.id,
    name: raw.name,
    durationMs: raw.duration_ms,
    image: pickImage(raw.album?.images),
    thumb: pickImage(raw.album?.images, 160),
    artists: (raw.artists ?? []).map(({ id, name }) => ({ id, name })),
    album: {
      name: raw.album?.name ?? '',
      url: raw.album?.external_urls?.spotify ?? null,
      releaseDate: raw.album?.release_date ?? null,
      type: raw.album?.album_type ?? null,
      totalTracks: raw.album?.total_tracks ?? null,
    },
    popularity: raw.popularity ?? null,
    explicit: raw.explicit ?? false,
    trackNumber: raw.track_number ?? null,
    uri: raw.uri,
    url: raw.external_urls?.spotify ?? null,
  };
}

export function toPlayedTrack(
  raw: SpotifyApi.PlayHistoryObject & { track: RawTrack }
): PlayedTrack {
  return { playedAt: raw.played_at, track: toTrack(raw.track) };
}

export function toPlaylist(raw: RawPlaylist): Playlist {
  return {
    id: raw.id,
    name: raw.name,
    image: pickImage(raw.images, 300),
    owner: raw.owner?.display_name ?? null,
    trackCount: (raw.items ?? raw.tracks)?.total ?? null,
    url: raw.external_urls?.spotify ?? null,
  };
}

function isPlayableTrack(
  item: RawPlaylistEntry['item']
): item is RawTrack & { id: string } {
  return !!item && item.type === 'track' && !!item.id && !item.is_local;
}

export function toPlaylistDetail(raw: RawPlaylist): PlaylistDetail {
  const entries = (raw.items ?? raw.tracks)?.items;
  return {
    ...toPlaylist(raw),
    image: pickImage(raw.images),
    tracks: entries
      ? entries
          .map((entry) => entry.item ?? entry.track)
          .filter(isPlayableTrack)
          .map(toTrack)
      : null,
  };
}

export function toUser(raw: SpotifyApi.CurrentUsersProfileResponse): User {
  return {
    name: raw.display_name ?? raw.id,
    image: pickImage(raw.images, 160),
  };
}
