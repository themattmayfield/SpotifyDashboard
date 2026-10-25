import { expect, test } from 'bun:test';
import {
  aggregateRecap,
  artistStreaks,
  artistTopTracks,
  biggestClimber,
  compatibilityScore,
  dayGroups,
  monthBounds,
  rankMovements,
  topNewArtist,
} from './insights';

const track = {
  id: 't',
  name: 'Track',
  image: null,
  durationMs: 120000,
  artists: [{ id: 'a', name: 'Artist' }],
};
test('computes movement, streaks and recap', () => {
  expect(
    rankMovements(
      [{ id: 'a', name: 'A', image: null }],
      [
        { id: 'b', name: 'B', image: null },
        { id: 'a', name: 'A', image: null },
      ]
    ).a.previousRank
  ).toBe(2);
  const plays = [0, 1].map((n) => ({
    playedAt: new Date(`2026-10-${25 - n}T12:00:00Z`),
    track,
  }));
  expect(
    artistStreaks(plays, 'UTC', new Date('2026-10-25T18:00:00Z'))[0].days
  ).toBe(2);
  expect(aggregateRecap(plays)).toMatchObject({
    totalPlays: 2,
    minutes: 4,
    distinctArtists: 1,
    playlistTrackIds: ['t'],
  });
});

test('merges an artist’s tracks across ranges using best rank', () => {
  const fullTrack = (id: string, artistId: string) => ({
    id,
    name: id,
    image: null,
    thumb: null,
    durationMs: 1,
    artists: [{ id: artistId, name: artistId }],
    album: {
      name: '',
      url: null,
      releaseDate: null,
      type: null,
      totalTracks: null,
    },
    popularity: null,
    explicit: false,
    trackNumber: null,
    uri: id,
    url: null,
    previewUrl: null,
  });
  const a = fullTrack('a', 'artist');
  const b = fullTrack('b', 'artist');
  const result = artistTopTracks('artist', [
    { range: 'short_term', tracks: [b, a] },
    { range: 'long_term', tracks: [a] },
  ]);
  expect(result.map((entry) => [entry.track.id, entry.bestRank])).toEqual([
    ['b', 1],
    ['a', 1],
  ]);
  expect(result.find((entry) => entry.track.id === 'a')?.ranges).toEqual([
    'short_term',
    'long_term',
  ]);
});

test('recap playlist ids are play-ranked and capped at 50', () => {
  const plays = Array.from({ length: 55 }, (_, index) => ({
    playedAt: new Date(),
    track: { ...track, id: `track-${index}`, name: `Track ${index}` },
  }));
  plays.push({
    playedAt: new Date(),
    track: { ...track, id: 'track-54', name: 'Track 54' },
  });
  const ids = aggregateRecap(plays).playlistTrackIds;
  expect(ids).toHaveLength(50);
  expect(ids[0]).toBe('track-54');
});

test('compatibility is bounded and increases with overlap', () => {
  const item = (id: string) => ({ id, name: id, image: null });
  const lists = (ids: string[]) => ({
    medium_term: { artists: ids.map(item), tracks: ids.map(item) },
  });
  expect(compatibilityScore(lists(['a', 'b']), lists(['a', 'b']))).toBe(100);
  expect(compatibilityScore(lists(['a']), lists(['z']))).toBe(0);
  expect(
    compatibilityScore(lists(['a', 'b']), lists(['a', 'z']))
  ).toBeGreaterThan(compatibilityScore(lists(['a', 'b']), lists(['x', 'z'])));
});

test('groups history using local calendar days', () => {
  const groups = dayGroups(
    [
      { playedAt: '2026-10-25T05:30:00Z' },
      { playedAt: '2026-10-23T07:00:00Z' },
    ],
    'America/Los_Angeles',
    new Date('2026-10-25T20:00:00Z')
  );
  expect(groups.map((group) => group.label)).toEqual([
    'Yesterday',
    'October 23, 2026',
  ]);
});

test('finds new artists and snapshot climbers', () => {
  const oldPlay = {
    playedAt: new Date('2026-09-01T00:00:00Z'),
    track: { ...track, artists: [{ id: 'old', name: 'Old' }] },
  };
  const fresh = { playedAt: new Date('2026-10-10T00:00:00Z'), track };
  expect(
    topNewArtist(
      [fresh],
      [oldPlay, fresh],
      new Date('2026-10-01T00:00:00Z'),
      new Date('2026-11-01T00:00:00Z')
    )?.name
  ).toBe('Artist');
  expect(
    biggestClimber(
      [
        { id: 'a', name: 'A', image: null },
        { id: 'b', name: 'B', image: null },
      ],
      [
        { id: 'b', name: 'B', image: null },
        { id: 'a', name: 'A', image: null },
      ],
      'artist'
    )?.improvement
  ).toBe(1);
});

test('calculates timezone month boundaries across DST', () => {
  const bounds = monthBounds('2026-03', 'America/Los_Angeles');
  expect(bounds.start.toISOString()).toBe('2026-03-01T08:00:00.000Z');
  expect(bounds.end.toISOString()).toBe('2026-04-01T07:00:00.000Z');
});
