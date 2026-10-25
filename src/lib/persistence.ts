import {
  type SnapshotItem,
  type StoredTrack,
  type TTimeRange,
  timeRanges,
} from '@/types';
import { createServerFn } from '@tanstack/react-start';
import { api } from '../../convex/_generated/api';
import {
  convexEnabled,
  convexMutation,
  convexQuery,
  degradeConvex,
} from './convex.server';
import { currentUser } from './identity';
import {
  aggregateRecap,
  artistStreaks,
  biggestClimber,
  localMonth,
  monthBounds,
  rankMovements,
} from './insights';
import { toArtist, toPlayedTrack, toTrack } from './normalize';
import { spotifyFetch } from './spotify.server';

const validRange = (value: unknown) => {
  if (!timeRanges.includes(value as TTimeRange))
    throw new Error('Invalid range');
  return value as TTimeRange;
};
const timezone = (tz: unknown) => {
  if (typeof tz !== 'string') return 'UTC';
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
    return tz;
  } catch {
    return 'UTC';
  }
};

async function syncCore() {
  if (!convexEnabled()) return { enabled: false };
  const me = await currentUser();
  const now = Date.now();
  const user = await convexQuery(api.wrapper.getUser, { userId: me.id });
  const snapshotsDue =
    !user?.lastSnapshotAt || now - user.lastSnapshotAt > 72_000_000;
  const historyDue =
    !user?.lastHistorySyncAt || now - user.lastHistorySyncAt > 600_000;
  const snapshots = snapshotsDue
    ? await Promise.all(
        timeRanges.flatMap((range) => [
          spotifyFetch<SpotifyApi.UsersTopArtistsResponse>(
            `/v1/me/top/artists?limit=50&time_range=${range}`
          ).then((x) => ({
            kind: 'artists' as const,
            range,
            day: new Date(now).toISOString().slice(0, 10),
            items: x.items.map(toArtist).map(
              (a): SnapshotItem => ({
                id: a.id,
                name: a.name,
                image: a.thumb,
              })
            ),
          })),
          spotifyFetch<SpotifyApi.UsersTopTracksResponse>(
            `/v1/me/top/tracks?limit=50&time_range=${range}`
          ).then((x) => ({
            kind: 'tracks' as const,
            range,
            day: new Date(now).toISOString().slice(0, 10),
            items: x.items.map(toTrack).map(
              (t): SnapshotItem => ({
                id: t.id,
                name: t.name,
                image: t.thumb,
                subtitle: t.artists.map((a) => a.name).join(', '),
                durationMs: t.durationMs,
              })
            ),
          })),
        ])
      )
    : [];
  const recent = historyDue
    ? await spotifyFetch<SpotifyApi.UsersRecentlyPlayedTracksResponse>(
        '/v1/me/player/recently-played?limit=50'
      )
    : null;
  const plays =
    recent?.items.map(toPlayedTrack).map(({ playedAt, track }) => ({
      playedAt: new Date(playedAt).getTime(),
      trackId: track.id,
      track: {
        id: track.id,
        name: track.name,
        image: track.thumb,
        artists: track.artists,
        durationMs: track.durationMs,
      } satisfies StoredTrack,
    })) ?? [];
  await convexMutation(api.wrapper.sync, { user: me, now, snapshots, plays });
  return { enabled: true };
}
export const syncListening = createServerFn({ method: 'POST' }).handler(
  async () => {
    try {
      return await syncCore();
    } catch (error) {
      console.error(
        'Listening sync failed',
        error instanceof Error ? error.message : 'Unknown error'
      );
      return { enabled: convexEnabled() };
    }
  }
);

export const getMovement = createServerFn({ method: 'GET' })
  .validator((data: { kind: 'artists' | 'tracks'; range: TTimeRange }) => {
    if (!['artists', 'tracks'].includes(data.kind))
      throw new Error('Invalid kind');
    return { kind: data.kind, range: validRange(data.range) };
  })
  .handler(
    degradeConvex(null, async ({ data }) => {
      if (!convexEnabled()) return null;
      const me = await currentUser();
      const snapshots = await convexQuery(api.wrapper.movementSnapshots, {
        userId: me.id,
        kind: data.kind,
        range: data.range,
      });
      if (!snapshots) return null;
      const { newest, previous } = snapshots;
      return {
        movements: rankMovements(newest.items, previous.items),
        previousItems: previous.items,
        currentItems: newest.items,
        comparedTo: previous.day,
      };
    })
  );
export const getStoredPlays = createServerFn({ method: 'GET' })
  .validator((data: { cursor?: number }) => {
    if (
      data.cursor !== undefined &&
      (!Number.isFinite(data.cursor) || data.cursor <= 0)
    )
      throw new Error('Invalid cursor');
    return data;
  })
  .handler(
    degradeConvex(
      {
        enabled: false,
        items: [],
        nextCursor: undefined as number | undefined,
      },
      async ({ data }) => {
        if (!convexEnabled())
          return { enabled: false, items: [], nextCursor: undefined };
        const me = await currentUser();
        const rows = await convexQuery(api.wrapper.playsPage, {
          userId: me.id,
          cursor: data.cursor,
          limit: 51,
        });
        return {
          enabled: true,
          items: rows.slice(0, 50).map((x) => ({
            playedAt: new Date(x.playedAt).toISOString(),
            track: x.track,
          })),
          nextCursor: rows.length > 50 ? rows[49].playedAt : undefined,
        };
      }
    )
  );

export const getRecap = createServerFn({ method: 'GET' })
  .validator((input: { month: unknown; timeZone?: unknown }) => {
    if (
      typeof input.month !== 'string' ||
      !/^\d{4}-(0[1-9]|1[0-2])$/.test(input.month)
    )
      throw new Error('Invalid month');
    return { month: input.month, timeZone: timezone(input.timeZone) };
  })
  .handler(
    degradeConvex(
      { enabled: false, recap: null, months: [] as string[] },
      async ({ data }) => {
        if (!convexEnabled())
          return { enabled: false, recap: null, months: [] };
        const me = await currentUser();
        const { start, end } = monthBounds(data.month, data.timeZone);
        const rows = await convexQuery(api.wrapper.playsRange, {
          userId: me.id,
          start: start.getTime(),
          end: end.getTime(),
          limit: 5000,
        });
        const all = await convexQuery(api.wrapper.playsRange, {
          userId: me.id,
          start: 0,
          end: Date.now() + 1,
          limit: 10000,
        });
        const snapshots = await convexQuery(api.wrapper.recapSnapshots, {
          userId: me.id,
          start: start.getTime(),
          end: end.getTime(),
        });
        const climbers = snapshots
          .map(({ kind, first, last }) => {
            return first && last && first._id !== last._id
              ? biggestClimber(
                  first.items,
                  last.items,
                  kind === 'artists' ? 'artist' : 'track'
                )
              : null;
          })
          .filter((x) => x !== null)
          .sort((a, b) => b.improvement - a.improvement);
        const artistIds = [
          ...new Set(rows.flatMap((x) => x.track.artists.map((a) => a.id))),
        ];
        const first = await convexQuery(api.wrapper.artistFirstSeen, {
          userId: me.id,
          artistIds,
        });
        const recap = rows.length
          ? aggregateRecap(
              rows.map((x) => ({
                playedAt: new Date(x.playedAt),
                track: x.track,
              }))
            )
          : null;
        const topNewArtist =
          recap?.topArtists
            .filter((a) => {
              const seen = first[a.id];
              return (
                seen !== null && seen >= start.getTime() && seen < end.getTime()
              );
            })
            .sort((a, b) => b.count - a.count)[0] ?? null;
        return {
          enabled: true,
          recap: recap
            ? {
                ...recap,
                playlistTrackIds: recap.topTracks.map((x) => x.item.id),
                topNewArtist,
                biggestClimber: climbers[0] ?? null,
              }
            : null,
          months: [
            ...new Set(
              all.map((x) => localMonth(new Date(x.playedAt), data.timeZone))
            ),
          ].sort(),
        };
      }
    )
  );
export const getStreaks = createServerFn({ method: 'GET' })
  .validator(timezone)
  .handler(
    degradeConvex([], async ({ data }) => {
      if (!convexEnabled()) return [];
      const me = await currentUser();
      const rows = await convexQuery(api.wrapper.playsRange, {
        userId: me.id,
        start: Date.now() - 60 * 86_400_000,
        end: Date.now() + 1,
        limit: 5000,
      });
      return artistStreaks(
        rows.map((x) => ({ playedAt: new Date(x.playedAt), track: x.track })),
        data
      ).slice(0, 3);
    })
  );
export const getArtistHistory = createServerFn({ method: 'GET' })
  .validator((id: unknown) => {
    if (typeof id !== 'string' || !/^[A-Za-z0-9]+$/.test(id))
      throw new Error('Invalid Spotify ID');
    return id;
  })
  .handler(
    degradeConvex({ enabled: false as const }, async ({ data }) => {
      if (!convexEnabled()) return { enabled: false as const };
      const me = await currentUser();
      const history = await convexQuery(api.wrapper.artistHistory, {
        userId: me.id,
        artistId: data,
      });
      return {
        enabled: true as const,
        totalPlays: history.capped ? '10,000+' : history.count,
        firstPlayed: history.first
          ? new Date(history.first).toISOString()
          : null,
        lastPlayed: history.last ? new Date(history.last).toISOString() : null,
        topSince: history.firstTopDay,
      };
    })
  );
export const deleteWrapperData = createServerFn({ method: 'POST' }).handler(
  async () => {
    if (!convexEnabled()) return;
    const me = await currentUser();
    await convexMutation(api.wrapper.deleteUser, { userId: me.id });
  }
);
