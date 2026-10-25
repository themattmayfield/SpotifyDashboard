import {
  type SnapshotItem,
  type StoredTrack,
  plays,
  topSnapshots,
  users,
} from '@/db/schema';
import { type TTimeRange, timeRanges } from '@/types';
import { createServerFn } from '@tanstack/react-start';
import { and, asc, desc, eq, lt, sql } from 'drizzle-orm';
import { getDb } from './db.server';
import {
  aggregateRecap,
  artistStreaks,
  biggestClimber,
  localMonth,
  monthBounds,
  rankMovements,
  topNewArtist,
} from './insights';
import { toArtist, toPlayedTrack, toTrack, toUser } from './normalize';
import { spotifyFetch } from './spotify.server';

const range = (value: unknown) => {
  if (!timeRanges.includes(value as TTimeRange))
    throw new Error('Invalid range');
  return value as TTimeRange;
};
const identity = async () =>
  toUser(await spotifyFetch<SpotifyApi.CurrentUsersProfileResponse>('/v1/me'));

async function syncListeningCore() {
  const db = getDb();
  if (!db) return { enabled: false };
  try {
    const me = await identity();
    const now = new Date();
    await db
      .insert(users)
      .values({
        id: me.id,
        displayName: me.name,
        image: me.image,
        createdAt: now,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: { displayName: me.name, image: me.image },
      });
    const user = await db.query.users.findFirst({
      where: eq(users.id, me.id),
    });
    const snapshotsDue =
      !user?.lastSnapshotAt ||
      now.getTime() - user.lastSnapshotAt.getTime() > 72_000_000;
    const historyDue =
      !user?.lastHistorySyncAt ||
      now.getTime() - user.lastHistorySyncAt.getTime() > 600_000;
    if (snapshotsDue) {
      const requests = timeRanges.flatMap((r) => [
        spotifyFetch<SpotifyApi.UsersTopArtistsResponse>(
          `/v1/me/top/artists?limit=50&time_range=${r}`
        ).then((x) => ({
          kind: 'artists' as const,
          range: r,
          items: x.items.map(toArtist).map(
            (a): SnapshotItem => ({
              id: a.id,
              name: a.name,
              image: a.thumb,
            })
          ),
        })),
        spotifyFetch<SpotifyApi.UsersTopTracksResponse>(
          `/v1/me/top/tracks?limit=50&time_range=${r}`
        ).then((x) => ({
          kind: 'tracks' as const,
          range: r,
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
      ]);
      for (const snapshot of await Promise.all(requests))
        await db
          .insert(topSnapshots)
          .values({
            userId: me.id,
            ...snapshot,
            takenAt: now,
            day: now.toISOString().slice(0, 10),
          })
          .onConflictDoUpdate({
            target: [
              topSnapshots.userId,
              topSnapshots.kind,
              topSnapshots.range,
              topSnapshots.day,
            ],
            set: { items: snapshot.items, takenAt: now },
          });
      await db
        .update(users)
        .set({ lastSnapshotAt: now })
        .where(eq(users.id, me.id));
    }
    if (historyDue) {
      const response =
        await spotifyFetch<SpotifyApi.UsersRecentlyPlayedTracksResponse>(
          '/v1/me/player/recently-played?limit=50'
        );
      const rows = response.items
        .map(toPlayedTrack)
        .map(({ playedAt, track }) => ({
          userId: me.id,
          playedAt: new Date(playedAt),
          trackId: track.id,
          track: {
            id: track.id,
            name: track.name,
            image: track.thumb,
            artists: track.artists,
            durationMs: track.durationMs,
          } satisfies StoredTrack,
        }));
      if (rows.length)
        await db.insert(plays).values(rows).onConflictDoNothing();
      await db
        .update(users)
        .set({ lastHistorySyncAt: now })
        .where(eq(users.id, me.id));
    }
    return { enabled: true };
  } catch (error) {
    console.error(
      'Listening sync failed',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return { enabled: true };
  }
}
export const syncListening = createServerFn({ method: 'POST' }).handler(
  syncListeningCore
);

export const getMovement = createServerFn({ method: 'GET' })
  .validator((data: { kind: 'artists' | 'tracks'; range: TTimeRange }) => {
    if (!['artists', 'tracks'].includes(data.kind))
      throw new Error('Invalid kind');
    return { kind: data.kind, range: range(data.range) };
  })
  .handler(async ({ data }) => {
    const db = getDb();
    if (!db) return null;
    const me = await identity();
    const rows = await db
      .select()
      .from(topSnapshots)
      .where(
        and(
          eq(topSnapshots.userId, me.id),
          eq(topSnapshots.kind, data.kind),
          eq(topSnapshots.range, data.range)
        )
      )
      .orderBy(desc(topSnapshots.takenAt));
    if (!rows[0]) return null;
    const cutoff = rows[0].takenAt.getTime() - 6 * 86_400_000;
    const previous =
      rows.find((x) => x.takenAt.getTime() <= cutoff) ?? rows.at(-1);
    if (!previous || previous.id === rows[0].id) return null;
    return {
      movements: rankMovements(rows[0].items, previous.items),
      previousItems: previous.items,
      currentItems: rows[0].items,
      comparedTo: previous.day,
    };
  });

export const getStoredPlays = createServerFn({ method: 'GET' })
  .validator((data: { cursor?: number }) => {
    if (
      data.cursor !== undefined &&
      (!Number.isFinite(data.cursor) || data.cursor <= 0)
    )
      throw new Error('Invalid cursor');
    return data;
  })
  .handler(async ({ data }) => {
    const db = getDb();
    if (!db) return { enabled: false, items: [], nextCursor: undefined };
    const me = await identity();
    const rows = await db
      .select()
      .from(plays)
      .where(
        and(
          eq(plays.userId, me.id),
          data.cursor ? lt(plays.playedAt, new Date(data.cursor)) : undefined
        )
      )
      .orderBy(desc(plays.playedAt))
      .limit(51);
    return {
      enabled: true,
      items: rows
        .slice(0, 50)
        .map((x) => ({ playedAt: x.playedAt.toISOString(), track: x.track })),
      nextCursor: rows.length > 50 ? rows[49].playedAt.getTime() : undefined,
    };
  });

const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;
const timezone = (tz: unknown) => {
  if (typeof tz !== 'string') return 'UTC';
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
    return tz;
  } catch {
    return 'UTC';
  }
};
export const getRecap = createServerFn({ method: 'GET' })
  .validator((input: { month: unknown; timeZone?: unknown }) => {
    if (typeof input.month !== 'string' || !monthPattern.test(input.month))
      throw new Error('Invalid month');
    return { month: input.month, timeZone: timezone(input.timeZone) };
  })
  .handler(async ({ data }) => {
    const db = getDb();
    if (!db) return { enabled: false, recap: null, months: [] as string[] };
    const me = await identity();
    const { start, end } = monthBounds(data.month, data.timeZone);
    const rows = await db
      .select()
      .from(plays)
      .where(
        and(
          eq(plays.userId, me.id),
          sql`${plays.playedAt} >= ${start}`,
          sql`${plays.playedAt} < ${end}`
        )
      )
      .orderBy(asc(plays.playedAt));
    const all = await db.select().from(plays).where(eq(plays.userId, me.id));
    const snapshots = await db
      .select()
      .from(topSnapshots)
      .where(
        and(
          eq(topSnapshots.userId, me.id),
          eq(topSnapshots.range, 'short_term'),
          sql`${topSnapshots.takenAt} >= ${start}`,
          sql`${topSnapshots.takenAt} < ${end}`
        )
      )
      .orderBy(asc(topSnapshots.takenAt));
    const climbers = (['artists', 'tracks'] as const)
      .map((kind) => {
        const selected = snapshots.filter((x) => x.kind === kind);
        return selected.length > 1
          ? biggestClimber(
              selected[0].items,
              selected.at(-1)?.items ?? [],
              kind === 'artists' ? 'artist' : 'track'
            )
          : null;
      })
      .filter((x) => x !== null)
      .sort((a, b) => b.improvement - a.improvement);
    const recap = rows.length
      ? {
          ...aggregateRecap(rows),
          topNewArtist: topNewArtist(rows, all, start, end),
          biggestClimber: climbers[0] ?? null,
        }
      : null;
    return {
      enabled: true,
      recap,
      months: [
        ...new Set(all.map((x) => localMonth(x.playedAt, data.timeZone))),
      ].sort(),
    };
  });

export const getStreaks = createServerFn({ method: 'GET' })
  .validator(timezone)
  .handler(async ({ data }) => {
    const db = getDb();
    if (!db) return [];
    const me = await identity();
    const rows = await db
      .select()
      .from(plays)
      .where(eq(plays.userId, me.id))
      .orderBy(desc(plays.playedAt));
    return artistStreaks(rows, data).slice(0, 3);
  });

export const getArtistHistory = createServerFn({ method: 'GET' })
  .validator((id: unknown) => {
    if (typeof id !== 'string' || !/^[A-Za-z0-9]+$/.test(id))
      throw new Error('Invalid Spotify ID');
    return id;
  })
  .handler(async ({ data }) => {
    const db = getDb();
    if (!db) return { enabled: false as const };
    const me = await identity();
    const artistPlays = (
      await db
        .select()
        .from(plays)
        .where(eq(plays.userId, me.id))
        .orderBy(asc(plays.playedAt))
        .limit(10_000)
    ).filter((play) => play.track.artists.some((artist) => artist.id === data));
    const snapshots = await db
      .select({ day: topSnapshots.day, items: topSnapshots.items })
      .from(topSnapshots)
      .where(
        and(eq(topSnapshots.userId, me.id), eq(topSnapshots.kind, 'artists'))
      )
      .orderBy(asc(topSnapshots.takenAt));
    return {
      enabled: true as const,
      totalPlays: artistPlays.length,
      firstPlayed: artistPlays[0]?.playedAt.toISOString() ?? null,
      lastPlayed: artistPlays.at(-1)?.playedAt.toISOString() ?? null,
      topSince:
        snapshots.find((snapshot) =>
          snapshot.items.some((item) => item.id === data)
        )?.day ?? null,
    };
  });

export const deleteWrapperData = createServerFn({ method: 'POST' }).handler(
  async () => {
    const db = getDb();
    if (!db) return;
    const me = await identity();
    await db.delete(users).where(eq(users.id, me.id));
  }
);
