export const timeRanges = ['long_term', 'medium_term', 'short_term'] as const;
export type TTimeRange = (typeof timeRanges)[number];

export type ArtistRef = { id: string; name: string };

export type Artist = {
  id: string;
  name: string;
  image: string | null;
  thumb: string | null;
  genres: string[];
  followers: number | null;
  popularity: number | null;
  url: string | null;
};

export type Track = {
  id: string;
  name: string;
  durationMs: number;
  image: string | null;
  thumb: string | null;
  artists: ArtistRef[];
  album: {
    name: string;
    url: string | null;
    releaseDate: string | null;
    type: string | null;
    totalTracks: number | null;
  };
  popularity: number | null;
  explicit: boolean;
  trackNumber: number | null;
  uri: string;
  url: string | null;
};

export type PlayedTrack = { playedAt: string; track: Track };

export type Playlist = {
  id: string;
  name: string;
  image: string | null;
  owner: string | null;
  trackCount: number | null;
  url: string | null;
};

/** `tracks` is null when Spotify withholds playlist contents. */
export type PlaylistDetail = Playlist & { tracks: Track[] | null };

export type User = { name: string; image: string | null };

export type Playback = {
  isPlaying: boolean;
  progressMs: number;
  track: Track;
};

export type PlaybackControlResult =
  | { ok: true }
  | { ok: false; reason: 'no-device' | 'premium-required' };
