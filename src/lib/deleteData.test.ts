import { expect, test } from 'bun:test';
import * as schema from '@/db/schema';
import { createClient } from '@libsql/client';
import { eq, or } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { deleteUserData } from './deleteData.server';

test('deletes every row owned by a user without relying on cascades', async () => {
  const client = createClient({ url: 'file::memory:' });
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: 'drizzle' });
  const now = new Date();
  await db.insert(schema.users).values([
    { id: 'a', displayName: 'A', image: null, createdAt: now },
    { id: 'b', displayName: 'B', image: null, createdAt: now },
  ]);
  const track = {
    id: 't',
    name: 'Track',
    image: null,
    artists: [],
    durationMs: 1,
  };
  await db.insert(schema.plays).values([
    { userId: 'a', playedAt: now, trackId: 't', track },
    { userId: 'b', playedAt: now, trackId: 't', track },
  ]);
  await db.insert(schema.topSnapshots).values([
    {
      userId: 'a',
      kind: 'artists',
      range: 'short_term',
      takenAt: now,
      day: '2026-10-25',
      items: [],
    },
    {
      userId: 'b',
      kind: 'artists',
      range: 'short_term',
      takenAt: now,
      day: '2026-10-25',
      items: [],
    },
  ]);
  await db.insert(schema.invites).values([
    { token: 'invite-a', inviterUserId: 'a', createdAt: now, expiresAt: now },
    { token: 'invite-b', inviterUserId: 'b', createdAt: now, expiresAt: now },
  ]);
  await db
    .insert(schema.friendships)
    .values({ userA: 'a', userB: 'b', createdAt: now });

  await deleteUserData(db, 'a');

  expect(await db.select().from(schema.users)).toHaveLength(1);
  expect(
    await db.select().from(schema.plays).where(eq(schema.plays.userId, 'a'))
  ).toHaveLength(0);
  expect(
    await db.select().from(schema.plays).where(eq(schema.plays.userId, 'b'))
  ).toHaveLength(1);
  expect(
    await db
      .select()
      .from(schema.topSnapshots)
      .where(eq(schema.topSnapshots.userId, 'a'))
  ).toHaveLength(0);
  expect(
    await db
      .select()
      .from(schema.invites)
      .where(eq(schema.invites.inviterUserId, 'a'))
  ).toHaveLength(0);
  expect(
    await db
      .select()
      .from(schema.friendships)
      .where(
        or(eq(schema.friendships.userA, 'a'), eq(schema.friendships.userB, 'a'))
      )
  ).toHaveLength(0);
  await client.close();
});
