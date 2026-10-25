import { v } from 'convex/values';
import { internal } from './_generated/api';
import { internalMutation, mutation, query } from './_generated/server';
import { requireSecret } from './lib/auth';

const auth = { secret: v.string() };
const kind = v.union(v.literal('artists'), v.literal('tracks'));
const range = v.union(
  v.literal('short_term'),
  v.literal('medium_term'),
  v.literal('long_term')
);
const item = v.object({
  id: v.string(),
  name: v.string(),
  image: v.union(v.string(), v.null()),
  subtitle: v.optional(v.string()),
  durationMs: v.optional(v.number()),
});
const artist = v.object({ id: v.string(), name: v.string() });
const track = v.object({
  id: v.string(),
  name: v.string(),
  image: v.union(v.string(), v.null()),
  artists: v.array(artist),
  durationMs: v.number(),
});

export const getUser = query({
  args: { ...auth, userId: v.string() },
  handler: async (ctx, args) => {
    await requireSecret(args.secret);
    return ctx.db
      .query('users')
      .withIndex('by_spotify_id', (q) => q.eq('spotifyUserId', args.userId))
      .unique();
  },
});

export const sync = mutation({
  args: {
    ...auth,
    user: v.object({
      id: v.string(),
      name: v.string(),
      image: v.union(v.string(), v.null()),
    }),
    now: v.number(),
    snapshots: v.array(
      v.object({ kind, range, day: v.string(), items: v.array(item) })
    ),
    plays: v.array(
      v.object({ playedAt: v.number(), trackId: v.string(), track })
    ),
  },
  handler: async (ctx, args) => {
    await requireSecret(args.secret);
    const deletion = await ctx.db
      .query('deletionCutoffs')
      .withIndex('by_user', (q) => q.eq('userId', args.user.id))
      .order('desc')
      .first();
    const cutoff = deletion?.cutoff ?? -1;
    let user = await ctx.db
      .query('users')
      .withIndex('by_spotify_id', (q) => q.eq('spotifyUserId', args.user.id))
      .unique();
    if (user)
      await ctx.db.patch(user._id, {
        displayName: args.user.name,
        image: args.user.image,
        lastSnapshotAt: args.snapshots.length ? args.now : user.lastSnapshotAt,
        lastHistorySyncAt: args.plays.length
          ? args.now
          : user.lastHistorySyncAt,
      });
    else {
      const id = await ctx.db.insert('users', {
        spotifyUserId: args.user.id,
        displayName: args.user.name,
        image: args.user.image,
        createdAt: args.now,
        lastSnapshotAt: args.snapshots.length ? args.now : undefined,
        lastHistorySyncAt: args.plays.length ? args.now : undefined,
      });
      user = await ctx.db.get(id);
    }
    for (const snapshot of args.snapshots) {
      const old = (
        await ctx.db
          .query('topSnapshots')
          .withIndex('by_user_kind_range_day', (q) =>
            q
              .eq('userId', args.user.id)
              .eq('kind', snapshot.kind)
              .eq('range', snapshot.range)
              .eq('day', snapshot.day)
          )
          .collect()
      ).find((row) => row._creationTime > cutoff);
      if (old)
        await ctx.db.patch(old._id, {
          items: snapshot.items,
          takenAt: args.now,
        });
      else
        await ctx.db.insert('topSnapshots', {
          userId: args.user.id,
          ...snapshot,
          takenAt: args.now,
        });
      if (snapshot.kind === 'artists')
        for (const artist of snapshot.items) {
          const first = (
            await ctx.db
              .query('artistFirstTop')
              .withIndex('by_user_artist', (q) =>
                q.eq('userId', args.user.id).eq('artistId', artist.id)
              )
              .collect()
          ).find((row) => row._creationTime > cutoff);
          if (!first)
            await ctx.db.insert('artistFirstTop', {
              userId: args.user.id,
              artistId: artist.id,
              day: snapshot.day,
            });
        }
    }
    for (const play of args.plays) {
      const old = (
        await ctx.db
          .query('plays')
          .withIndex('by_user_played', (q) =>
            q.eq('userId', args.user.id).eq('playedAt', play.playedAt)
          )
          .collect()
      ).find((row) => row._creationTime > cutoff);
      if (old) continue;
      await ctx.db.insert('plays', { userId: args.user.id, ...play });
      for (const a of play.track.artists)
        await ctx.db.insert('playArtists', {
          userId: args.user.id,
          artistId: a.id,
          playedAt: play.playedAt,
        });
    }
    return { insertedPlays: args.plays.length };
  },
});

export const latestSnapshots = query({
  args: { ...auth, userId: v.string() },
  handler: async (ctx, args) => {
    await requireSecret(args.secret);
    return (
      await Promise.all(
        (['artists', 'tracks'] as const).flatMap((snapshotKind) =>
          (['short_term', 'medium_term', 'long_term'] as const).map(
            (snapshotRange) =>
              ctx.db
                .query('topSnapshots')
                .withIndex('by_user_kind_range_taken', (q) =>
                  q
                    .eq('userId', args.userId)
                    .eq('kind', snapshotKind)
                    .eq('range', snapshotRange)
                )
                .order('desc')
                .first()
          )
        )
      )
    ).filter((row) => row !== null);
  },
});
export const movementSnapshots = query({
  args: { ...auth, userId: v.string(), kind, range },
  handler: async (ctx, args) => {
    await requireSecret(args.secret);
    const base = () =>
      ctx.db
        .query('topSnapshots')
        .withIndex('by_user_kind_range_taken', (q) =>
          q
            .eq('userId', args.userId)
            .eq('kind', args.kind)
            .eq('range', args.range)
        );
    const newest = await base().order('desc').first();
    if (!newest) return null;
    const previous =
      (await ctx.db
        .query('topSnapshots')
        .withIndex('by_user_kind_range_taken', (q) =>
          q
            .eq('userId', args.userId)
            .eq('kind', args.kind)
            .eq('range', args.range)
            .lte('takenAt', newest.takenAt - 6 * 86_400_000)
        )
        .order('desc')
        .first()) ?? (await base().order('asc').first());
    return !previous || previous._id === newest._id
      ? null
      : { newest, previous };
  },
});
export const recapSnapshots = query({
  args: { ...auth, userId: v.string(), start: v.number(), end: v.number() },
  handler: async (ctx, args) => {
    await requireSecret(args.secret);
    return Promise.all(
      (['artists', 'tracks'] as const).map(async (snapshotKind) => {
        const base = () =>
          ctx.db
            .query('topSnapshots')
            .withIndex('by_user_kind_range_taken', (q) =>
              q
                .eq('userId', args.userId)
                .eq('kind', snapshotKind)
                .eq('range', 'short_term')
                .gte('takenAt', args.start)
                .lt('takenAt', args.end)
            );
        return {
          kind: snapshotKind,
          first: await base().order('asc').first(),
          last: await base().order('desc').first(),
        };
      })
    );
  },
});
export const playsPage = query({
  args: {
    ...auth,
    userId: v.string(),
    cursor: v.optional(v.number()),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    await requireSecret(args.secret);
    return ctx.db
      .query('plays')
      .withIndex('by_user_played', (q) => {
        const base = q.eq('userId', args.userId);
        return args.cursor ? base.lt('playedAt', args.cursor) : base;
      })
      .order('desc')
      .take(args.limit);
  },
});
export const playsRange = query({
  args: {
    ...auth,
    userId: v.string(),
    start: v.number(),
    end: v.number(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    await requireSecret(args.secret);
    return ctx.db
      .query('plays')
      .withIndex('by_user_played', (q) =>
        q
          .eq('userId', args.userId)
          .gte('playedAt', args.start)
          .lt('playedAt', args.end)
      )
      .take(args.limit);
  },
});
export const artistFirstSeen = query({
  args: { ...auth, userId: v.string(), artistIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    await requireSecret(args.secret);
    return Object.fromEntries(
      await Promise.all(
        args.artistIds.map(async (id) => [
          id,
          (
            await ctx.db
              .query('playArtists')
              .withIndex('by_user_artist_played', (q) =>
                q.eq('userId', args.userId).eq('artistId', id)
              )
              .order('asc')
              .first()
          )?.playedAt ?? null,
        ])
      )
    );
  },
});
export const artistHistory = query({
  args: { ...auth, userId: v.string(), artistId: v.string() },
  handler: async (ctx, args) => {
    await requireSecret(args.secret);
    const base = () =>
      ctx.db
        .query('playArtists')
        .withIndex('by_user_artist_played', (q) =>
          q.eq('userId', args.userId).eq('artistId', args.artistId)
        );
    const [rows, first, last, firstTop] = await Promise.all([
      base().take(10_001),
      base().order('asc').first(),
      base().order('desc').first(),
      ctx.db
        .query('artistFirstTop')
        .withIndex('by_user_artist', (q) =>
          q.eq('userId', args.userId).eq('artistId', args.artistId)
        )
        .unique(),
    ]);
    return {
      count: Math.min(rows.length, 10_000),
      capped: rows.length > 10_000,
      first: first?.playedAt ?? null,
      last: last?.playedAt ?? null,
      firstTopDay: firstTop?.day ?? null,
    };
  },
});

export const friends = query({
  args: { ...auth, userId: v.string() },
  handler: async (ctx, args) => {
    await requireSecret(args.secret);
    const [a, b] = await Promise.all([
      ctx.db
        .query('friendships')
        .withIndex('by_userA', (q) => q.eq('userA', args.userId))
        .collect(),
      ctx.db
        .query('friendships')
        .withIndex('by_userB', (q) => q.eq('userB', args.userId))
        .collect(),
    ]);
    return [...a, ...b];
  },
});
export const friendship = query({
  args: { ...auth, userA: v.string(), userB: v.string() },
  handler: async (ctx, args) => {
    await requireSecret(args.secret);
    return ctx.db
      .query('friendships')
      .withIndex('by_pair', (q) =>
        q.eq('userA', args.userA).eq('userB', args.userB)
      )
      .unique();
  },
});
export const invite = query({
  args: { ...auth, token: v.string() },
  handler: async (ctx, args) => {
    await requireSecret(args.secret);
    return ctx.db
      .query('invites')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .unique();
  },
});
export const createInvite = mutation({
  args: {
    ...auth,
    userId: v.string(),
    token: v.string(),
    now: v.number(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await requireSecret(args.secret);
    const active = await ctx.db
      .query('invites')
      .withIndex('by_inviter', (q) => q.eq('inviterUserId', args.userId))
      .filter((q) =>
        q.and(
          q.eq(q.field('revokedAt'), undefined),
          q.gt(q.field('expiresAt'), args.now)
        )
      )
      .take(21);
    if (active.length >= 20) throw new Error('Too many active invites');
    await ctx.db.insert('invites', {
      token: args.token,
      inviterUserId: args.userId,
      createdAt: args.now,
      expiresAt: args.expiresAt,
    });
  },
});
export const acceptInvite = mutation({
  args: {
    ...auth,
    token: v.string(),
    user: v.object({
      id: v.string(),
      name: v.string(),
      image: v.union(v.string(), v.null()),
    }),
  },
  handler: async (ctx, args) => {
    await requireSecret(args.secret);
    const invite = await ctx.db
      .query('invites')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .unique();
    if (
      !invite ||
      invite.revokedAt ||
      invite.expiresAt < Date.now() ||
      invite.inviterUserId === args.user.id
    )
      throw new Error('Invalid invite');
    const user = await ctx.db
      .query('users')
      .withIndex('by_spotify_id', (q) => q.eq('spotifyUserId', args.user.id))
      .unique();
    if (!user)
      await ctx.db.insert('users', {
        spotifyUserId: args.user.id,
        displayName: args.user.name,
        image: args.user.image,
        createdAt: Date.now(),
      });
    const [userA, userB] =
      args.user.id < invite.inviterUserId
        ? [args.user.id, invite.inviterUserId]
        : [invite.inviterUserId, args.user.id];
    const old = await ctx.db
      .query('friendships')
      .withIndex('by_pair', (q) => q.eq('userA', userA).eq('userB', userB))
      .unique();
    if (!old)
      await ctx.db.insert('friendships', {
        userA,
        userB,
        createdAt: Date.now(),
      });
    await ctx.db.patch(invite._id, { revokedAt: Date.now() });
    return invite.inviterUserId;
  },
});
export const removeFriend = mutation({
  args: { ...auth, userA: v.string(), userB: v.string() },
  handler: async (ctx, args) => {
    await requireSecret(args.secret);
    const row = await ctx.db
      .query('friendships')
      .withIndex('by_pair', (q) =>
        q.eq('userA', args.userA).eq('userB', args.userB)
      )
      .unique();
    if (row) await ctx.db.delete(row._id);
  },
});

export const deleteUser = mutation({
  args: { ...auth, userId: v.string() },
  handler: async (ctx, args) => {
    await requireSecret(args.secret);
    const newestOwned = await Promise.all([
      ctx.db
        .query('plays')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .order('desc')
        .first(),
      ctx.db
        .query('playArtists')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .order('desc')
        .first(),
      ctx.db
        .query('topSnapshots')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .order('desc')
        .first(),
      ctx.db
        .query('artistFirstTop')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .order('desc')
        .first(),
    ]);
    const cutoff = Math.max(
      0,
      ...newestOwned.map((row) => row?._creationTime ?? 0)
    );
    const existingCutoff = await ctx.db
      .query('deletionCutoffs')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .unique();
    if (existingCutoff) await ctx.db.patch(existingCutoff._id, { cutoff });
    else
      await ctx.db.insert('deletionCutoffs', { userId: args.userId, cutoff });
    const user = await ctx.db
      .query('users')
      .withIndex('by_spotify_id', (q) => q.eq('spotifyUserId', args.userId))
      .unique();
    if (user) await ctx.db.delete(user._id);
    for (const row of await ctx.db
      .query('invites')
      .withIndex('by_inviter', (q) => q.eq('inviterUserId', args.userId))
      .collect())
      await ctx.db.delete(row._id);
    for (const row of [
      ...(await ctx.db
        .query('friendships')
        .withIndex('by_userA', (q) => q.eq('userA', args.userId))
        .collect()),
      ...(await ctx.db
        .query('friendships')
        .withIndex('by_userB', (q) => q.eq('userB', args.userId))
        .collect()),
    ])
      await ctx.db.delete(row._id);
    await ctx.scheduler.runAfter(0, internal.wrapper.deleteBatch, {
      userId: args.userId,
      cutoff,
    });
  },
});
export const deleteBatch = internalMutation({
  args: { userId: v.string(), cutoff: v.number() },
  handler: async (ctx, args) => {
    const groups = [
      await ctx.db
        .query('plays')
        .withIndex('by_user', (q) =>
          q.eq('userId', args.userId).lte('_creationTime', args.cutoff)
        )
        .take(500),
      await ctx.db
        .query('playArtists')
        .withIndex('by_user', (q) =>
          q.eq('userId', args.userId).lte('_creationTime', args.cutoff)
        )
        .take(500),
      await ctx.db
        .query('topSnapshots')
        .withIndex('by_user', (q) =>
          q.eq('userId', args.userId).lte('_creationTime', args.cutoff)
        )
        .take(500),
      await ctx.db
        .query('artistFirstTop')
        .withIndex('by_user', (q) =>
          q.eq('userId', args.userId).lte('_creationTime', args.cutoff)
        )
        .take(500),
    ];
    for (const rows of groups)
      for (const row of rows) await ctx.db.delete(row._id);
    if (groups.some((x) => x.length === 500))
      await ctx.scheduler.runAfter(0, internal.wrapper.deleteBatch, {
        userId: args.userId,
        cutoff: args.cutoff,
      });
    else {
      const deletion = await ctx.db
        .query('deletionCutoffs')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .unique();
      if (deletion?.cutoff === args.cutoff) await ctx.db.delete(deletion._id);
    }
  },
});
