import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export type SnapshotItem = {
  id: string;
  name: string;
  image: string | null;
  subtitle?: string;
  durationMs?: number;
};
export type StoredTrack = {
  id: string;
  name: string;
  image: string | null;
  artists: { id: string; name: string }[];
  durationMs: number;
};

export const users = sqliteTable('users', {
  id: text('spotify_user_id').primaryKey(),
  displayName: text('display_name').notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  lastSnapshotAt: integer('last_snapshot_at', { mode: 'timestamp_ms' }),
  lastHistorySyncAt: integer('last_history_sync_at', { mode: 'timestamp_ms' }),
});

export const invites = sqliteTable('invites', {
  token: text('token').primaryKey(),
  inviterUserId: text('inviter_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  revokedAt: integer('revoked_at', { mode: 'timestamp_ms' }),
});

export const friendships = sqliteTable(
  'friendships',
  {
    userA: text('user_a')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    userB: text('user_b')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.userA, table.userB] })]
);

export const topSnapshots = sqliteTable(
  'top_snapshots',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    kind: text('kind', { enum: ['artists', 'tracks'] }).notNull(),
    range: text('range', {
      enum: ['short_term', 'medium_term', 'long_term'],
    }).notNull(),
    takenAt: integer('taken_at', { mode: 'timestamp_ms' }).notNull(),
    day: text('day').notNull(),
    items: text('items', { mode: 'json' }).$type<SnapshotItem[]>().notNull(),
  },
  (table) => [
    uniqueIndex('snapshot_user_kind_range_day').on(
      table.userId,
      table.kind,
      table.range,
      table.day
    ),
    index('snapshot_user_kind_range_taken').on(
      table.userId,
      table.kind,
      table.range,
      table.takenAt
    ),
  ]
);

export const plays = sqliteTable(
  'plays',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    playedAt: integer('played_at', { mode: 'timestamp_ms' }).notNull(),
    trackId: text('track_id').notNull(),
    track: text('track', { mode: 'json' }).$type<StoredTrack>().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.playedAt] }),
    index('plays_user_played').on(table.userId, table.playedAt),
  ]
);
