import type { SnapshotItem, StoredTrack } from '@/db/schema';
import type { Artist, TTimeRange, Track } from '@/types';

export function tasteBreakdown(
  artists: Artist[],
  tracks: Track[],
  now = new Date()
) {
  const genreWeights = new Map<string, number>();
  artists.forEach((artist, rank) =>
    artist.genres.forEach((genre) =>
      genreWeights.set(genre, (genreWeights.get(genre) ?? 0) + 1 / (rank + 1))
    )
  );
  const genres = [...genreWeights]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, weight]) => ({ name, weight }));
  const decades = new Map<number, number>();
  const years = tracks
    .map((track) => Number(track.album.releaseDate?.slice(0, 4)))
    .filter(
      (year) =>
        Number.isInteger(year) && year > 1800 && year <= now.getFullYear()
    );
  years.forEach((year) => {
    const decade = Math.floor(year / 10) * 10;
    decades.set(decade, (decades.get(decade) ?? 0) + 1);
  });
  const cutoff = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  const fresh = tracks.filter((track) => {
    const date = track.album.releaseDate
      ? new Date(track.album.releaseDate)
      : null;
    return date && !Number.isNaN(date.valueOf()) && date >= cutoff;
  }).length;
  return {
    genres,
    decades: [...decades]
      .sort((a, b) => a[0] - b[0])
      .map(([decade, count]) => ({ decade, count })),
    freshPercent: tracks.length ? Math.round((fresh / tracks.length) * 100) : 0,
    averageYear: years.length
      ? Math.round(years.reduce((sum, year) => sum + year, 0) / years.length)
      : null,
    uniqueArtists: new Set(
      tracks.flatMap((track) => track.artists.map((artist) => artist.id))
    ).size,
    explicitPercent: tracks.length
      ? Math.round(
          (tracks.filter((track) => track.explicit).length / tracks.length) *
            100
        )
      : 0,
    averageDurationMs: tracks.length
      ? Math.round(
          tracks.reduce((sum, track) => sum + track.durationMs, 0) /
            tracks.length
        )
      : 0,
  };
}

export function artistTopTracks(
  artistId: string,
  lists: { range: TTimeRange; tracks: Track[] }[]
) {
  const found = new Map<
    string,
    { track: Track; bestRank: number; ranges: TTimeRange[] }
  >();
  for (const { range, tracks } of lists)
    tracks.forEach((track, index) => {
      if (!track.artists.some((artist) => artist.id === artistId)) return;
      const prior = found.get(track.id);
      if (prior) {
        prior.bestRank = Math.min(prior.bestRank, index + 1);
        prior.ranges.push(range);
      } else
        found.set(track.id, { track, bestRank: index + 1, ranges: [range] });
    });
  return [...found.values()].sort((a, b) => a.bestRank - b.bestRank);
}

export type RankMovement = { previousRank: number | null };

export type ComparisonLists = Record<
  string,
  { artists: SnapshotItem[]; tracks: SnapshotItem[] }
>;

/** Weighted reciprocal-rank overlap; artists count 60%, tracks 40%, ranges equally. */
export function compatibilityScore(a: ComparisonLists, b: ComparisonLists) {
  const kinds = [
    ['artists', 0.6],
    ['tracks', 0.4],
  ] as const;
  const ranges = new Set([...Object.keys(a), ...Object.keys(b)]);
  if (!ranges.size) return 0;
  let total = 0;
  for (const range of ranges) {
    for (const [kind, weight] of kinds) {
      const left = a[range]?.[kind] ?? [];
      const right = b[range]?.[kind] ?? [];
      const rightRanks = new Map(right.map((x, i) => [x.id, i]));
      const denominator = left.reduce((sum, _x, i) => sum + 1 / (i + 1), 0);
      const overlap = left.reduce((sum, x, i) => {
        const rank = rightRanks.get(x.id);
        return sum + (rank === undefined ? 0 : 2 / (i + rank + 2));
      }, 0);
      total += denominator ? (overlap / denominator) * weight : 0;
    }
  }
  return Math.round((total / ranges.size) * 100);
}
export function rankMovements(
  current: SnapshotItem[],
  previous?: SnapshotItem[]
) {
  const prior = new Map(previous?.map((item, index) => [item.id, index + 1]));
  return Object.fromEntries(
    current.map((item) => [
      item.id,
      { previousRank: previous ? (prior.get(item.id) ?? null) : undefined },
    ])
  );
}

export function artistStreaks(
  plays: { playedAt: Date; track: StoredTrack }[],
  timeZone: string,
  now = new Date()
) {
  const day = (date: Date) =>
    new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  const today = day(now);
  const yesterday = day(new Date(now.getTime() - 86_400_000));
  const artists = new Map<string, { name: string; days: Set<string> }>();
  for (const play of plays)
    for (const artist of play.track.artists) {
      const entry = artists.get(artist.id) ?? {
        name: artist.name,
        days: new Set<string>(),
      };
      entry.days.add(day(play.playedAt));
      artists.set(artist.id, entry);
    }
  return [...artists.entries()]
    .map(([id, value]) => {
      let cursor = value.days.has(today)
        ? now
        : new Date(now.getTime() - 86_400_000);
      let count = 0;
      while (value.days.has(day(cursor))) {
        count++;
        cursor = new Date(cursor.getTime() - 86_400_000);
      }
      return {
        id,
        name: value.name,
        days: count,
        active: value.days.has(today) || value.days.has(yesterday),
      };
    })
    .filter((x) => x.active && x.days >= 2)
    .sort((a, b) => b.days - a.days);
}

export function aggregateRecap(
  plays: { playedAt: Date; track: StoredTrack }[]
) {
  const tracks = new Map<string, { item: StoredTrack; count: number }>();
  const artists = new Map<
    string,
    { id: string; name: string; count: number }
  >();
  let durationMs = 0;
  for (const { track } of plays) {
    durationMs += track.durationMs;
    const t = tracks.get(track.id) ?? { item: track, count: 0 };
    t.count++;
    tracks.set(track.id, t);
    for (const a of track.artists) {
      const x = artists.get(a.id) ?? { ...a, count: 0 };
      x.count++;
      artists.set(a.id, x);
    }
  }
  const sorted = <T extends { count: number }>(xs: T[]) =>
    xs.sort((a, b) => b.count - a.count);
  const rankedTracks = sorted([...tracks.values()]);
  return {
    totalPlays: plays.length,
    minutes: Math.round(durationMs / 60_000),
    distinctArtists: artists.size,
    topTracks: rankedTracks.slice(0, 5),
    playlistTrackIds: rankedTracks.slice(0, 50).map((entry) => entry.item.id),
    topArtists: sorted([...artists.values()]).slice(0, 5),
  };
}

const dateParts = (date: Date, timeZone: string) =>
  Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number(part.value)])
  ) as Record<string, number>;

function zonedDate(year: number, month: number, day: number, timeZone: string) {
  const desired = Date.UTC(year, month - 1, day);
  let result = desired;
  for (let index = 0; index < 3; index++) {
    const p = dateParts(new Date(result), timeZone);
    result +=
      desired -
      Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  }
  return new Date(result);
}

export function monthBounds(month: string, timeZone: string) {
  const [year, number] = month.split('-').map(Number);
  const nextYear = number === 12 ? year + 1 : year;
  const nextMonth = number === 12 ? 1 : number + 1;
  return {
    start: zonedDate(year, number, 1, timeZone),
    end: zonedDate(nextYear, nextMonth, 1, timeZone),
  };
}

export function localMonth(date: Date, timeZone: string) {
  const parts = dateParts(date, timeZone);
  return `${parts.year}-${String(parts.month).padStart(2, '0')}`;
}

export function dayGroups<T extends { playedAt: string | Date }>(
  items: T[],
  timeZone: string,
  now = new Date()
) {
  const key = (date: Date) =>
    new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  const today = key(now);
  const yesterday = key(new Date(now.getTime() - 86_400_000));
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const day = key(new Date(item.playedAt));
    groups.set(day, [...(groups.get(day) ?? []), item]);
  }
  return [...groups].map(([day, values]) => ({
    day,
    label:
      day === today
        ? 'Today'
        : day === yesterday
          ? 'Yesterday'
          : new Intl.DateTimeFormat('en-US', {
              timeZone,
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date(values[0].playedAt)),
    items: values,
  }));
}

export function topNewArtist(
  monthPlays: { track: StoredTrack }[],
  allPlays: { playedAt: Date; track: StoredTrack }[],
  start: Date,
  end: Date
) {
  const first = new Map<string, Date>();
  const counts = new Map<string, { id: string; name: string; count: number }>();
  for (const play of allPlays)
    for (const artist of play.track.artists)
      if (
        !first.has(artist.id) ||
        play.playedAt < (first.get(artist.id) as Date)
      )
        first.set(artist.id, play.playedAt);
  for (const play of monthPlays)
    for (const artist of play.track.artists) {
      const x = counts.get(artist.id) ?? { ...artist, count: 0 };
      x.count++;
      counts.set(artist.id, x);
    }
  return (
    [...counts.values()]
      .filter((x) => {
        const date = first.get(x.id);
        return date && date >= start && date < end;
      })
      .sort((a, b) => b.count - a.count)[0] ?? null
  );
}

export function biggestClimber(
  first: SnapshotItem[],
  last: SnapshotItem[],
  kind: 'artist' | 'track'
) {
  const oldRanks = new Map(first.map((item, index) => [item.id, index + 1]));
  return (
    last
      .filter((item) => oldRanks.has(item.id))
      .map((item, _index) => ({
        id: item.id,
        name: item.name,
        kind,
        improvement:
          (oldRanks.get(item.id) as number) -
          (last.findIndex((candidate) => candidate.id === item.id) + 1),
      }))
      .filter((x) => x.improvement > 0)
      .sort((a, b) => b.improvement - a.improvement)[0] ?? null
  );
}
