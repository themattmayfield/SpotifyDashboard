import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

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

export default defineSchema({
  users: defineTable({
    spotifyUserId: v.string(),
    displayName: v.string(),
    image: v.union(v.string(), v.null()),
    createdAt: v.number(),
    lastSnapshotAt: v.optional(v.number()),
    lastHistorySyncAt: v.optional(v.number()),
  }).index('by_spotify_id', ['spotifyUserId']),
  topSnapshots: defineTable({
    userId: v.string(),
    kind: v.union(v.literal('artists'), v.literal('tracks')),
    range: v.union(
      v.literal('short_term'),
      v.literal('medium_term'),
      v.literal('long_term')
    ),
    takenAt: v.number(),
    day: v.string(),
    items: v.array(item),
  })
    .index('by_user_kind_range_day', ['userId', 'kind', 'range', 'day'])
    .index('by_user_kind_range_taken', ['userId', 'kind', 'range', 'takenAt'])
    .index('by_user', ['userId']),
  plays: defineTable({
    userId: v.string(),
    playedAt: v.number(),
    trackId: v.string(),
    track,
  })
    .index('by_user_played', ['userId', 'playedAt'])
    .index('by_user', ['userId']),
  playArtists: defineTable({
    userId: v.string(),
    artistId: v.string(),
    playedAt: v.number(),
  })
    .index('by_user_artist_played', ['userId', 'artistId', 'playedAt'])
    .index('by_user', ['userId']),
  artistFirstTop: defineTable({
    userId: v.string(),
    artistId: v.string(),
    day: v.string(),
  })
    .index('by_user_artist', ['userId', 'artistId'])
    .index('by_user', ['userId']),
  deletionCutoffs: defineTable({
    userId: v.string(),
    cutoff: v.number(),
  }).index('by_user', ['userId']),
  invites: defineTable({
    token: v.string(),
    inviterUserId: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
    revokedAt: v.optional(v.number()),
  })
    .index('by_token', ['token'])
    .index('by_inviter', ['inviterUserId']),
  friendships: defineTable({
    userA: v.string(),
    userB: v.string(),
    createdAt: v.number(),
  })
    .index('by_pair', ['userA', 'userB'])
    .index('by_userA', ['userA'])
    .index('by_userB', ['userB']),
});
