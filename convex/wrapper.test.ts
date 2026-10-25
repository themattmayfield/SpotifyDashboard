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

test('rejects the twenty-first active invite', async () => {
  const t = convexTest(schema, modules);
  const now = Date.now();
  for (let index = 0; index < 20; index++)
    await t.mutation(api.wrapper.createInvite, {
      secret,
      userId: 'a',
      token: `token-${index}`,
      now,
      expiresAt: now + 10_000,
    });
  await expect(
    t.mutation(api.wrapper.createInvite, {
      secret,
      userId: 'a',
      token: 'token-20',
      now,
      expiresAt: now + 10_000,
    })
  ).rejects.toThrow('Too many active invites');
});

test('batched deletion clears old rows and preserves a sync after deletion', async () => {
  const t = convexTest(schema, modules);
  const now = Date.now();
  await t.mutation(api.wrapper.sync, {
    secret,
    user: user('a'),
    now,
    snapshots: [],
    plays: [],
  });
  await t.run(async (ctx) => {
    for (let index = 0; index < 501; index++) {
      const playedAt = now - index;
      await ctx.db.insert('plays', {
        userId: 'a',
        playedAt,
        trackId: track.id,
        track,
      });
      await ctx.db.insert('playArtists', {
        userId: 'a',
        artistId: 'artist',
        playedAt,
      });
      await ctx.db.insert('topSnapshots', {
        userId: 'a',
        kind: 'artists',
        range: 'short_term',
        takenAt: playedAt,
        day: `old-${index}`,
        items: [],
      });
      await ctx.db.insert('artistFirstTop', {
        userId: 'a',
        artistId: `old-${index}`,
        day: 'old',
      });
    }
  });
  await t.mutation(api.wrapper.deleteUser, { secret, userId: 'a' });
  await t.mutation(api.wrapper.sync, {
    secret,
    user: user('a'),
    now: now + 1,
    snapshots: [
      {
        kind: 'artists',
        range: 'short_term',
        day: 'new',
        items: [{ id: 'new', name: 'New', image: null }],
      },
    ],
    plays: [{ playedAt: now + 1, trackId: track.id, track }],
  });
  await t.finishAllScheduledFunctions(() => {});
  const counts = await t.run(async (ctx) =>
    Promise.all([
      ctx.db.query('plays').collect(),
      ctx.db.query('playArtists').collect(),
      ctx.db.query('topSnapshots').collect(),
      ctx.db.query('artistFirstTop').collect(),
      ctx.db.query('deletionCutoffs').collect(),
    ])
  );
  for (const rows of counts.slice(0, 4)) expect(rows).toHaveLength(1);
  expect(counts[4]).toHaveLength(0);
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
