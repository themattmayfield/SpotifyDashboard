/// <reference types="vite/client" />
import { convexTest } from 'convex-test';
import { beforeEach, expect, test } from 'vitest';
import { api } from './_generated/api';
import schema from './schema';

const modules = import.meta.glob('./**/*.ts');
const secret = 'test-secret';
beforeEach(() => {
  process.env.CONVEX_SERVER_SECRET = secret;
});
const user = (id: string) => ({ id, name: id.toUpperCase(), image: null });
const track = {
  id: 'track',
  name: 'Track',
  image: null,
  artists: [{ id: 'artist', name: 'Artist' }],
  durationMs: 1000,
};

test('rejects an invalid server secret', async () => {
  const t = convexTest(schema, modules);
  await expect(
    t.query(api.wrapper.getUser, { secret: 'bad', userId: 'a' })
  ).rejects.toThrow('Unauthorized');
});

test('sync deduplicates plays and friendship lookup requires the pair', async () => {
  const t = convexTest(schema, modules);
  const now = Date.now();
  for (const id of ['a', 'b'])
    await t.mutation(api.wrapper.sync, {
      secret,
      user: user(id),
      now,
      snapshots: [],
      plays: [{ playedAt: now, trackId: track.id, track }],
    });
  await t.mutation(api.wrapper.sync, {
    secret,
    user: user('a'),
    now,
    snapshots: [],
    plays: [{ playedAt: now, trackId: track.id, track }],
  });
  expect(await t.run((ctx) => ctx.db.query('plays').collect())).toHaveLength(2);
  await t.mutation(api.wrapper.createInvite, {
    secret,
    userId: 'a',
    token: 'token',
    now,
    expiresAt: now + 10000,
  });
  await t.mutation(api.wrapper.acceptInvite, {
    secret,
    token: 'token',
    user: user('b'),
  });
  expect(
    await t.query(api.wrapper.friendship, { secret, userA: 'a', userB: 'b' })
  ).not.toBeNull();
  expect(
    await t.query(api.wrapper.friendship, { secret, userA: 'b', userB: 'a' })
  ).toBeNull();
});

test('movement falls back to oldest snapshot and records first top day', async () => {
  const t = convexTest(schema, modules);
  const now = Date.now();
  const artistItem = { id: 'artist', name: 'Artist', image: null };
  await t.mutation(api.wrapper.sync, {
    secret,
    user: user('a'),
    now: now - 2 * 86_400_000,
    snapshots: [
      {
        kind: 'artists',
        range: 'short_term',
        day: '2026-01-01',
        items: [artistItem],
      },
    ],
    plays: [],
  });
  await t.mutation(api.wrapper.sync, {
    secret,
    user: user('a'),
    now,
    snapshots: [
      {
        kind: 'artists',
        range: 'short_term',
        day: '2026-01-03',
        items: [artistItem],
      },
    ],
    plays: [],
  });
  const movement = await t.query(api.wrapper.movementSnapshots, {
    secret,
    userId: 'a',
    kind: 'artists',
    range: 'short_term',
  });
  expect(movement?.previous.day).toBe('2026-01-01');
  const history = await t.query(api.wrapper.artistHistory, {
    secret,
    userId: 'a',
    artistId: 'artist',
  });
  expect(history.firstTopDay).toBe('2026-01-01');
});

test('deletion removes user A data and preserves B', async () => {
  const t = convexTest(schema, modules);
  const now = Date.now();
  for (const id of ['a', 'b'])
    await t.mutation(api.wrapper.sync, {
      secret,
      user: user(id),
      now,
      snapshots: [
        {
          kind: 'artists',
          range: 'short_term',
          day: '2026-01-01',
          items: [{ id: 'artist', name: 'Artist', image: null }],
        },
      ],
      plays: [{ playedAt: now, trackId: track.id, track }],
    });
  await t.mutation(api.wrapper.createInvite, {
    secret,
    userId: 'a',
    token: 'token',
    now,
    expiresAt: now + 10000,
  });
  await t.mutation(api.wrapper.acceptInvite, {
    secret,
    token: 'token',
    user: user('b'),
  });
  await t.mutation(api.wrapper.deleteUser, { secret, userId: 'a' });
  await t.finishAllScheduledFunctions(() => {});
  const remaining = await t.run(async (ctx) => ({
    users: await ctx.db.query('users').collect(),
    plays: await ctx.db.query('plays').collect(),
    snapshots: await ctx.db.query('topSnapshots').collect(),
    artists: await ctx.db.query('playArtists').collect(),
    firstTop: await ctx.db.query('artistFirstTop').collect(),
    invites: await ctx.db.query('invites').collect(),
    friends: await ctx.db.query('friendships').collect(),
  }));
  for (const rows of [
    remaining.users,
    remaining.plays,
    remaining.snapshots,
    remaining.artists,
    remaining.firstTop,
  ])
    expect(rows).toHaveLength(1);
  expect(remaining.invites).toHaveLength(0);
  expect(remaining.friends).toHaveLength(0);
});
