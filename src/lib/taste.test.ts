import { expect, test } from 'bun:test';
import { tasteBreakdown } from './insights';

const artist = (id: string, genres: string[]) => ({
  id,
  name: id,
  image: null,
  thumb: null,
  genres,
  followers: null,
  popularity: null,
  url: null,
});
const track = (
  id: string,
  year: string,
  artistId: string,
  explicit = false
) => ({
  id,
  name: id,
  durationMs: 180000,
  image: null,
  thumb: null,
  artists: [{ id: artistId, name: artistId }],
  album: {
    name: 'Album',
    url: null,
    releaseDate: year,
    type: 'album',
    totalTracks: 10,
  },
  popularity: null,
  explicit,
  trackNumber: 1,
  uri: `spotify:track:${id}`,
  url: null,
  previewUrl: null,
});

test('computes ranked genres, decades and current taste stats', () => {
  const result = tasteBreakdown(
    [artist('a', ['rock']), artist('b', ['pop', 'rock'])],
    [track('1', '2026-01-01', 'a', true), track('2', '1995', 'b')],
    new Date('2026-10-25')
  );
  expect(result.genres[0].name).toBe('rock');
  expect(result.decades).toEqual([
    { decade: 1990, count: 1 },
    { decade: 2020, count: 1 },
  ]);
  expect(result).toMatchObject({
    freshPercent: 50,
    averageYear: 2011,
    uniqueArtists: 2,
    explicitPercent: 50,
    averageDurationMs: 180000,
  });
});

test('handles missing genres and release dates', () => {
  const result = tasteBreakdown([artist('a', [])], [track('1', '', 'a')]);
  expect(result.genres).toEqual([]);
  expect(result.averageYear).toBeNull();
});
